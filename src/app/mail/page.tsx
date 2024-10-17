// IMPORTANT: May need to dynamically import the Mail component to avoid SSR issues.
import { Mail } from "@/app/mail/mail";

export default async function MailDashboard() {
  return (
    <Mail
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
