import { Mail } from "./mail";

export default async function MailDashboard() {
  return (
    <Mail
      defaultLayout={[20, 32, 48]}
      defaultCollapsed={false}
      navCollapsedSize={4}
    />
  );
}
