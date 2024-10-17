import { useLocalStorage } from "usehooks-ts";
import { atom, useAtom } from "jotai";
import { api } from "@/trpc/react";

export const threadIdAtom = atom<string | null>(null);

export const useThreads = () => {
  const [accountId] = useLocalStorage("normalhuman:accountId", "");
  const [tab] = useLocalStorage("normalhuman:tab", "inbox");
  const [done] = useLocalStorage("normalhuman:done", false);

  const [threadId, setThreadId] = useAtom(threadIdAtom);

  const { data: accounts } = api.account.getAccounts.useQuery();
  const {
    data: threads,
    isFetching,
    refetch,
  } = api.account.getThreads.useQuery(
    {
      accountId,
      tab,
      done,
    },
    {
      enabled: !!accountId && !!tab,
      placeholderData: (data) => data,
      refetchInterval: 5000,
    },
  );

  return {
    threads,
    isFetching,
    refetch,
    accountId,
    account: accounts?.find((account) => account.id === accountId),
    threadId,
    setThreadId,
  };
};
