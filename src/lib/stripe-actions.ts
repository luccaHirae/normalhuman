"use server";

import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { db } from "@/server/db";

export const createCheckoutSession = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
    client_reference_id: userId,
  });

  if (!session.url) {
    throw new Error("No session URL");
  }

  redirect(session.url);
};

export const getSubscriptionStatus = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const subscription = await db.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (!subscription) return false;

  return subscription.currentPeriodEnd > new Date();
};

export const createBillingPortalSession = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const subscription = await db.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (!subscription?.customerId) {
    throw new Error("No customer ID");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.customerId,
    return_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
  });

  redirect(session.url);
};
