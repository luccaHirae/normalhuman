"use client";

import { useChat } from "ai/react";
import { Send, SparklesIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useThreads } from "@/hooks/use-threads";
import { useToast } from "@/hooks/use-toast";
import { PremiumBanner } from "@/app/mail/premium-banner";

interface Props {
  isCollapsed: boolean;
}

export const AskAi = ({ isCollapsed }: Props) => {
  const { toast } = useToast();
  const { accountId } = useThreads();
  const utils = api.useUtils();
  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      accountId,
    },
    onError: (error) => {
      toast({
        title: "Exceeded daily limit",
        description: error.message,
      });
      console.error(error);
    },
    onFinish: () => {
      utils.account.getChatbotInteraction.refetch().catch(console.error);
    },
    initialMessages: [],
  });

  if (isCollapsed) return null;

  return (
    <div className="mb-14 p-4">
      <PremiumBanner />

      <div className="h-4"></div>

      <motion.div className="flex flex-1 flex-col items-end rounded-lg bg-gray-100 p-4 pb-4 shadow-inner dark:bg-gray-900">
        <div
          className="flex max-h-[50vh] w-full flex-col gap-2 overflow-y-scroll"
          id="message-container"
        >
          <AnimatePresence mode="wait">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout="position"
                layoutId={`container-[${messages.length - 1}]`}
                transition={{
                  type: "ease-out",
                  duration: 0.2,
                }}
                className={cn(
                  "z-10 mt-2 max-w-[250px] break-words rounded-2xl bg-gray-200 dark:bg-gray-800",
                  {
                    "self-end text-gray-900 dark:text-gray-100":
                      message.role === "user",
                    "self-start bg-blue-500 text-white":
                      message.role === "assistant",
                  },
                )}
              >
                <div className="px-3 py-2 text-[15px] leading-[15px]">
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {messages.length > 0 && <div className="h-4"></div>}

        <div className="w-full">
          {messages.length === 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-4">
                <SparklesIcon className="size-6 text-gray-600" />

                <div>
                  <p className="text-gray-900 dark:text-gray-100">
                    Ask AI anything about your emails
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get answers to your questions about your emails
                  </p>
                </div>
              </div>

              <div className="h-2"></div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  onClick={() =>
                    handleInputChange({
                      // @ts-expect-error ts expects the entire event object which is not needed here
                      target: {
                        value: "What can I ask?",
                      },
                    })
                  }
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  What can I ask?
                </span>

                <span
                  onClick={() =>
                    handleInputChange({
                      // @ts-expect-error ts expects the entire event object which is not needed here
                      target: {
                        value: "When is my next flight?",
                      },
                    })
                  }
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  When is my next flight?
                </span>

                <span
                  onClick={() =>
                    handleInputChange({
                      // @ts-expect-error ts expects the entire event object which is not needed here
                      target: {
                        value: "When is my next meeting?",
                      },
                    })
                  }
                  className="rounded-md bg-gray-800 px-2 py-1 text-xs text-gray-200"
                >
                  When is my next meeting?
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex w-full">
            <input
              value={input}
              onChange={handleInputChange}
              type="text"
              placeholder="Ask AI anything about your emails"
              className="relative h-9 flex-grow rounded-full border border-gray-200 bg-white px-3 py-1 text-[15px] outline-none placeholder:text-[13px]"
            />
            <motion.div
              key={messages.length}
              layout="position"
              layoutId={`container=[${messages.length}]`}
              transition={{
                type: "ease-out",
                duration: 0.2,
              }}
              initial={{
                opacity: 0.8,
                zIndex: -1,
              }}
              animate={{
                opacity: 1,
                zIndex: -1,
              }}
              exit={{
                opacity: 1,
                zIndex: 1,
              }}
              className="pointer-events-none absolute z-10 flex h-9 w-[250px] items-center overflow-hidden break-words rounded-full bg-gray-200 [word-break:break-word] dark:bg-gray-800"
            >
              <div className="px-3 py-2 text-[15px] leading-[15px] text-gray-900 dark:text-gray-100">
                {input}
              </div>
            </motion.div>

            <button
              type="submit"
              className="ml-2 flex size-9 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
            >
              <Send className="size-4 text-gray-500 dark:text-gray-300" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
