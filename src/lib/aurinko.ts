"use server";

import axios from "axios";
import { auth } from "@clerk/nextjs/server";

interface TokenResponse {
  accountId: number;
  accessToken: string;
  userId: string;
  userSession: string;
}

interface AccountDetails {
  email: string;
  name: string;
}

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365",
) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID!,
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const res = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID!,
          password: process.env.AURINKO_CLIENT_SECRET!,
        },
      },
    );

    return res.data as TokenResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    }

    console.error(error);
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const res = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.data as AccountDetails;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
    } else {
      console.error("Unexpected error while fetching account details:", error);
    }

    throw error;
  }
};
