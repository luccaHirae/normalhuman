import { type NextRequest, NextResponse } from "next/server";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { auth } from "@clerk/nextjs/server";
import { OramaClient } from "@/lib/orama";
import { type Point } from "framer-motion";

interface JSON {
  accountId: string;
  messages: ChatCompletionRequestMessage[];
}

interface SearchResult {
  hits: Array<{
    document: Record<
      string,
      | string
      | number
      | boolean
      | number[]
      | Point
      | string[]
      | boolean[]
      | (string | number)[]
      | Record<string, unknown>
    >;
  }>;
}

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  }),
);

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 },
      );
    }

    const { accountId, messages } = req.json() as unknown as JSON;

    const orama = new OramaClient(accountId);

    await orama.initialize();

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage?.content) {
      return NextResponse.json({
        message: "No message content",
        status: 400,
      });
    }

    const context = (await orama.vectorSearch({
      term: lastMessage?.content,
    })) as unknown as SearchResult;

    const prompt: ChatCompletionRequestMessage = {
      role: "system",
      content: `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.
            THE TIME NOW IS ${new Date().toLocaleString()}
      
      START CONTEXT BLOCK
      ${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
      END OF CONTEXT BLOCK
      
      When responding, please keep in mind:
      - Be helpful, clever, and articulate.
      - Rely on the provided email context to inform your responses.
      - If the context does not contain enough information to answer a question, politely say you don't have enough information.
      - Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
      - Do not invent or speculate about anything that is not directly supported by the email context.
      - Keep your responses concise and relevant to the user's questions or the email being composed.`,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message) => message.role === "user"),
      ],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        console.log("Stream started");
      },
      onCompletion: async (completion) => {
        console.log("Stream completed", completion);
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat completion", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
