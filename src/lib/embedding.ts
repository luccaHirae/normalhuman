import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const getEmbeddings = async (text: string) => {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-02",
      input: text.replace(/\n/g, " "),
    });

    const result = (await response.json()) as {
      data: { embedding: number[] }[];
    };

    return result.data[0]?.embedding;
  } catch (error) {
    console.log("Error on embedding api call", error);
    throw error;
  }
};
