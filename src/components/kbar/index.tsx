"use client";

import { useLocalStorage } from "usehooks-ts";
import {
  type Action,
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  Priority,
} from "kbar";
import { type ReactNode } from "react";
import { Results } from "@/components/kbar/results";
import { useThemeSwitch } from "@/components/kbar/use-theme-switch";
import { useAccountSwitch } from "@/components/kbar/use-account-switch";

const KBarComponent = ({ children }: { children: ReactNode }) => {
  useThemeSwitch();
  useAccountSwitch();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="scrollbar-hide fixed inset-0 z-[999] bg-black/40 !p-0 backdrop-blur-sm dark:bg-black/60">
          <KBarAnimator className="relative !mt-64 w-full max-w-[600px] !-translate-y-12 overflow-hidden rounded-lg border bg-white text-foreground shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800">
              <div className="border-x-0 border-b-2 dark:border-gray-700">
                <KBarSearch className="w-full border-none bg-white px-6 py-4 text-lg outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-gray-800" />
              </div>

              <Results />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>

      {children}
    </>
  );
};

export const KBar = ({ children }: { children: ReactNode }) => {
  const [, setTab] = useLocalStorage("normalhuman:tab", "inbox");
  const [, setDone] = useLocalStorage("normalhuman:done", false);

  const actions: Action[] = [
    {
      id: "inboxAction",
      name: "Inbox",
      shortcut: ["g", "i"],
      section: "Navigation",
      subtitle: "View your inbox",
      perform: () => {
        setTab("inbox");
      },
    },
    {
      id: "draftsAction",
      name: "Drafts",
      shortcut: ["g", "d"],
      keywords: "draft",
      priority: Priority.HIGH,
      subtitle: "View your drafts",
      section: "Navigation",
      perform: () => {
        setTab("drafts");
      },
    },
    {
      id: "sentAction",
      name: "Sent",
      shortcut: ["g", "s"],
      keywords: "sent",
      section: "Navigation",
      subtitle: "View your sent emails",
      perform: () => {
        setTab("sent");
      },
    },
    {
      id: "doneAction",
      name: "See done",
      shortcut: ["g", "d"],
      keywords: "done",
      section: "Navigation",
      subtitle: "View your done emails",
      perform: () => {
        setDone(true);
      },
    },
    {
      id: "pendingAction",
      name: "See pending",
      shortcut: ["g", "u"],
      keywords: "pending, undone, not done",
      section: "Navigation",
      subtitle: "View your pending emails",
      perform: () => {
        setDone(false);
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <KBarComponent>{children}</KBarComponent>
    </KBarProvider>
  );
};
