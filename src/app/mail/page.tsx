// IMPORTANT: May need to dynamically import the Mail component to avoid SSR issues.
import { Mail } from "@/app/mail/mail";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function MailDashboard() {
  return (
    <>
      <div className="absolute bottom-4 left-4">
        <ThemeToggle />
      </div>

      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </>
  );
}
