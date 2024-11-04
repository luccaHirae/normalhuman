"use client";

import { useLocalStorage } from "usehooks-ts";
import { Plus } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getAurinkoAuthUrl } from "@/lib/aurinko";

interface Props {
  isCollapsed: boolean;
}

export const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data, isLoading } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage(
    "normalhuman:accountId",
    "",
  );
  const { toast } = useToast();

  const handleAddAccount = async () => {
    try {
      const authUrl = await getAurinkoAuthUrl("Google");
      window.location.href = authUrl;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(
          "You have reached the maximum number of accounts",
        )
      ) {
        toast({
          title: "Maximum accounts reached",
          description: error.message,
        });
      } else {
        toast({
          title: "Failed to add account",
          description: "An unknown error occurred, please try again later.",
        });
      }
    }
  };

  if (isLoading || !data) return null;

  return (
    <Select defaultValue={accountId} onValueChange={setAccountId}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn({ hidden: !isCollapsed })}>
            {data.find((account) => account.id === accountId)?.emailAddress[0]}
          </span>

          <span className={cn({ hidden: isCollapsed, "ml-2": true })}>
            {data.find((account) => account.id === accountId)?.emailAddress}
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {data.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.emailAddress}
          </SelectItem>
        ))}

        <div
          onClick={handleAddAccount}
          className="relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-50 focus:bg-accent"
        >
          <Plus className="mr-1 size-4" />
          Add account
        </div>
      </SelectContent>
    </Select>
  );
};
