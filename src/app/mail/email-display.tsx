"use client";

import Avatar from "react-avatar";
import { Letter } from "react-letter";
import { useThreads } from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/react";
import { formatDistanceToNow } from "date-fns";

interface Props {
  email: RouterOutputs["account"]["getThreads"][0]["emails"][0];
}

export const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();

  const isCurrentUser = account?.emailAddress === email.from.address;

  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-all hover:translate-x-2",
        {
          "border-l-4 border-l-gray-900": isCurrentUser,
        },
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-between gap-2">
          {!isCurrentUser && (
            <Avatar
              name={email.from.name ?? email.from.address}
              email={email.from.address}
              size="35"
              textSizeRatio={2}
              round
            />
          )}

          <span className="font-medium">
            {isCurrentUser ? "Me" : email.from.address}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(email.sentAt ?? new Date(), {
            addSuffix: true,
          })}
        </p>
      </div>

      <div className="h-4"></div>

      <Letter
        html={email.body ?? ""}
        className="rounded-md bg-white text-black"
      />
    </div>
  );
};
