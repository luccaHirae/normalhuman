"use client";

import { format } from "date-fns";
import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from "lucide-react";
import { useThreads } from "@/hooks/use-threads";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmailDisplay } from "@/app/mail/email-display";
import { ReplyBox } from "@/app/mail/reply-box";

export const ThreadDisplay = () => {
  const { threadId, threads } = useThreads();

  const thread = threads?.find((t) => t.id === threadId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="gap2 flex items-center">
          <Button variant="ghost" size="icon" disabled={!thread}>
            <Archive className="size-4" />
          </Button>

          <Button variant="ghost" size="icon" disabled={!thread}>
            <ArchiveX className="size-4" />
          </Button>

          <Button variant="ghost" size="icon" disabled={!thread}>
            <Trash2 className="size-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="ml-2" />

        <Button variant="ghost" size="icon" disabled={!thread} className="ml-2">
          <Clock className="size-4" />
        </Button>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                disabled={!thread}
                className="ml-2"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as unread</DropdownMenuItem>
              <DropdownMenuItem>Star thread</DropdownMenuItem>
              <DropdownMenuItem>Add label</DropdownMenuItem>
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      {thread ? (
        <div className="flex flex-1 flex-col overflow-scroll">
          <div className="flex items-center p-4">
            <div className="flex items-center gap-4 text-sm">
              <Avatar>
                <AvatarImage alt="avatar" />
                <AvatarFallback>
                  {thread.emails[0]?.from.name
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="grid gap-1">
                <div className="font-semibold">
                  {thread.emails[0]?.from.name}

                  <div className="line-clamp-1 text-xs">
                    {thread.emails[0]?.subject}
                  </div>

                  <div className="line-clamp-1 text-xs">
                    <span className="font-medium">Reply-to:</span>
                    {thread.emails[0]?.from.address}
                  </div>
                </div>
              </div>
            </div>

            {thread.emails[0]?.sentAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(thread.emails[0].sentAt), "PPpp")}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex max-h-[calc(100vh-500px)] flex-col overflow-scroll">
            <div className="flex flex-col gap-4 p-6">
              {thread.emails.map((email) => (
                <EmailDisplay key={email.id} email={email} />
              ))}
            </div>
          </div>

          <div className="flex-1"></div>

          <Separator className="mt-auto" />

          <ReplyBox />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
};
