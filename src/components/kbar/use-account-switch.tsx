import { api } from "@/trpc/react";
import { useRegisterActions } from "kbar";
import { useLocalStorage } from "usehooks-ts";

export const useAccountSwitch = () => {
  const { data: accounts } = api.account.getAccounts.useQuery();

  const mainAction = [
    {
      id: "accountsAction",
      name: "Switch Account",
      shortcut: ["e", "s"],
      section: "Accounts",
    },
  ];

  const [, setAccountId] = useLocalStorage("normalhuman:accountId", "");

  useRegisterActions(
    mainAction.concat(
      accounts?.map((account) => {
        return {
          id: account.id,
          name: account.name,
          parent: "accountsAction",
          perform: () => {
            setAccountId(account.id);
          },
          keywords: [account.name, account.emailAddress].filter(Boolean),
          shortcut: [],
          section: "Accounts",
          subtitle: account.emailAddress,
          priority: 1000,
        };
      }) ?? [],
    ),
    [accounts],
  );
};
