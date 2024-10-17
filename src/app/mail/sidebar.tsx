"use client";

import { File, InboxIcon, Send } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "@/app/mail/nav";
import { type SidebarLink } from "@/types";
import { api } from "@/trpc/react";

interface Props {
  isCollapsed: boolean;
}

const getLinkVariant = (title: string, tab: string) => {
  return tab === title ? "default" : "ghost";
};

export const Sidebar = ({ isCollapsed }: Props) => {
  const [tab] = useLocalStorage("normalhuman:tab", "inbox");
  const [accountId] = useLocalStorage("normalhuman:accountId", "");

  const { data: inboxThreads } = api.account.getNumberOfThreads.useQuery({
    accountId,
    tab: "inbox",
  });
  const { data: draftThreads } = api.account.getNumberOfThreads.useQuery({
    accountId,
    tab: "draft",
  });
  const { data: sentThreads } = api.account.getNumberOfThreads.useQuery({
    accountId,
    tab: "sent",
  });

  const links: SidebarLink[] = [
    {
      title: "Inbox",
      label: inboxThreads?.toString() ?? "0",
      icon: InboxIcon,
      variant: getLinkVariant("inbox", tab),
    },
    {
      title: "Draft",
      label: draftThreads?.toString() ?? "0",
      icon: File,
      variant: getLinkVariant("draft", tab),
    },
    {
      title: "Sent",
      label: sentThreads?.toString() ?? "0",
      icon: Send,
      variant: getLinkVariant("sent", tab),
    },
  ];

  return <Nav isCollapsed={isCollapsed} links={links} />;
};
