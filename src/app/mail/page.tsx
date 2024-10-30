// IMPORTANT: May need to dynamically import the Mail component to avoid SSR issues.
import { UserButton } from "@clerk/nextjs";
import { Mail } from "@/app/mail/mail";
import { ThemeToggle } from "@/components/theme-toggle";
import { ComposeButton } from "@/app/mail/compose-button";

export default async function MailDashboard() {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <div className="gap2 flex items-center">
          <UserButton />
          <ThemeToggle />
          <ComposeButton />
        </div>
      </div>

      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
}
