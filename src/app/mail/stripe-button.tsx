"use client";

import { useEffect, useState } from "react";
import {
  createBillingPortalSession,
  createCheckoutSession,
  getSubscriptionStatus,
} from "@/lib/stripe-actions";
import { Button } from "@/components/ui/button";

export const StripeButton = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    void (async () => {
      setIsSubscribed(await getSubscriptionStatus());
    })();
  }, []);

  const handleClick = async () => {
    if (isSubscribed) {
      await createBillingPortalSession();
    } else {
      await createCheckoutSession();
    }
  };

  return (
    <Button variant="outline" size="lg" onClick={handleClick}>
      {isSubscribed ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
