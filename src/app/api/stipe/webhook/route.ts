import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

export const POST = async (req: NextRequest) => {
  const body = await req.text();

  const signature = headers().get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json({ message: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Webhook event construction failed" },
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  console.log("Received stripe event", event.type, session.id);

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price.product"],
      },
    );

    if (!session.client_reference_id) {
      return NextResponse.json(
        { message: "No client reference ID" },
        { status: 400 },
      );
    }

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      return NextResponse.json({ message: "No plan" }, { status: 400 });
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      return NextResponse.json({ message: "No product ID" }, { status: 400 });
    }

    await db.subscription.create({
      data: {
        userId: session.client_reference_id,
        priceId: plan.id,
        customerId:
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        subscriptionId: subscription.id,
      },
    });

    return NextResponse.json(
      { message: "Checkout session completed" },
      { status: 200 },
    );
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ["items.data.price.product"],
      },
    );

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      return NextResponse.json({ message: "No plan" }, { status: 400 });
    }

    const productId = (plan.product as Stripe.Product).id;

    if (!productId) {
      return NextResponse.json({ message: "No product ID" }, { status: 400 });
    }

    await db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        priceId: plan.id,
      },
    });

    return NextResponse.json(
      { message: "Invoice payment succeeded" },
      { status: 200 },
    );
  }

  if (event.type === "customer.subscription.updated") {
    const subscription = await stripe.subscriptions.retrieve(session.id);

    const existingSubscription = await db.subscription.findUnique({
      where: {
        subscriptionId: subscription.id,
      },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { message: "No existing subscription" },
        { status: 400 },
      );
    }

    await db.subscription.update({
      where: {
        subscriptionId: subscription.id,
      },
      data: {
        updatedAt: new Date(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return NextResponse.json(
      { message: "Customer subscription updated" },
      { status: 200 },
    );
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
};
