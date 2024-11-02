import Image from "next/image";
import { FREE_CREDITS_PER_DAY } from "@/constants";
import { StripeButton } from "@/app/mail/stripe-button";

export const PremiumBanner = () => {
  const isSubscribed = false;
  const remainingCredits = 5;

  if (!isSubscribed) {
    return (
      <div className="relative flex flex-col gap-4 overflow-hidden rounded-lg border bg-gray-900 p-4 md:flex-row">
        <Image
          src="/bot.webp"
          alt="Bot"
          className="h-[180px] w-auto md:absolute md:-bottom-6 md:-right-10"
          width={180}
          height={180}
        />

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Basic Plan</h1>

            <p className="text-sm text-gray-400 md:max-w-full">
              {remainingCredits} / {FREE_CREDITS_PER_DAY} messages remaining
            </p>
          </div>

          <div className="h-4"></div>

          <p className="md:max-w-[calc(100% - 150px)] text-sm text-gray-400">
            Upgrade to pro to ask as many questions as you want!
          </p>

          <div className="h-4"></div>

          <StripeButton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>PremiumBanner</h1>
    </div>
  );
};
