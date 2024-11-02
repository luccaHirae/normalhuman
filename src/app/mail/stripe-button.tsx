import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/stripe-actions";

export const StripeButton = () => {
  const isSubscribed = false;

  const handleClick = async () => {
    await createCheckoutSession();
  };

  return (
    <Button variant="outline" size="lg" onClick={handleClick}>
      {isSubscribed ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
