import { Account } from "@/lib/account";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

interface RequestBody {
  accountId: string;
  userId: string;
}

export const POST = async (req: NextRequest) => {
  const { accountId, userId } = (await req.json()) as RequestBody;

  if (!accountId || !userId) {
    return NextResponse.json({
      message: "Missing required fields",
      status: 400,
    });
  }

  const dbAccount = await db.account.findUnique({
    where: {
      id: accountId,
      userId,
    },
  });

  if (!dbAccount) {
    return NextResponse.json({
      message: "Account not found",
      status: 404,
    });
  }

  const account = new Account(dbAccount.accessToken);

  const res = await account.performInitialSync();

  if (!res) {
    return NextResponse.json({
      message: "Failed to perform initial sync",
      status: 500,
    });
  }

  const { emails, deltaToken } = res;

  await db.account.update({
    where: {
      id: accountId,
    },
    data: {
      nextDeltaToken: deltaToken,
    },
  });

  console.log("Sync completed", deltaToken);

  await syncEmailsToDatabase(emails, accountId);

  return NextResponse.json({
    success: true,
    message: "Initial sync completed",
    emails,
  });
};
