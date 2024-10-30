"use client";

import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/app/mail/action";
import { useThreads } from "@/hooks/use-threads";
import { turndown } from "@/lib/turndown";

interface Props {
  isComposing: boolean;
  onGenerate: (token: string) => void;
}

export const AIComposeButton = ({ isComposing, onGenerate }: Props) => {
  const { threadId, threads, account } = useThreads();
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");

  const thread = threads?.find((thread) => thread.id === threadId);

  const aiGenerate = async () => {
    let context = "";

    if (!isComposing) {
      for (const email of thread?.emails ?? []) {
        const content = `
          Subject: ${email.subject}
          From: ${email.from.name}
          Sent: ${new Date(email.sentAt).toLocaleString()}
          Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}
        `;

        context += content;
      }
    }

    context += `
      My name is ${account?.name} and my email is ${account?.emailAddress}.
    `;

    const { output } = await generateEmail(context, prompt);

    for await (const token of readStreamableValue(output)) {
      if (token && typeof token === "string") {
        onGenerate(token);
      }
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClick = async () => {
    setIsOpen(false);
    setPrompt("");
    await aiGenerate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button onClick={handleOpen} size="icon" variant="outline">
          <Bot className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Smart Compose</DialogTitle>
          <DialogDescription>
            AI will help you compose an email based on the content you provide.
          </DialogDescription>

          <div className="h-2"></div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt."
          />

          <div className="h-2"></div>

          <Button onClick={handleClick}>Generate</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
