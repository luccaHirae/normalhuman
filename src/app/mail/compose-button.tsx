import { useState } from "react";
import { api } from "@/trpc/react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EmailEditor } from "@/app/mail/email-editor";
import { useThreads } from "@/hooks/use-threads";
import { useToast } from "@/hooks/use-toast";
import { type Value } from "@/types";

export const ComposeButton = () => {
  const sendEmail = api.account.sendEmail.useMutation();
  const { account } = useThreads();
  const { toast } = useToast();

  const [toValues, setToValues] = useState<Value[]>([]);
  const [ccValues, setCcValues] = useState<Value[]>([]);
  const [subject, setSubject] = useState("");

  const handleSend = async (value: string) => {
    if (!account) return;

    sendEmail.mutate(
      {
        accountId: account.id,
        threadId: undefined,
        body: value,
        from: {
          name: account.name ?? "Me",
          address: account.emailAddress ?? "me@example.com",
        },
        to: toValues.map((to) => ({ name: to.value, address: to.value })),
        cc: ccValues.map((cc) => ({ name: cc.value, address: cc.value })),
        replyTo: {
          name: account.name ?? "Me",
          address: account.emailAddress ?? "me@example.com",
        },
        subject: subject,
        inReplyTo: undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "Email sent",
          });
        },
        onError: (error) => {
          console.error("Error sending email:", error);
          toast({
            title: "Error sending email",
          });
        },
      },
    );
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button>
          <Pencil className="mr-1 size-4" />
          Compose
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Compose Email</DrawerTitle>
        </DrawerHeader>

        <EmailEditor
          to={toValues.map((v) => v.value)}
          toValues={toValues}
          setToValues={setToValues}
          ccValues={ccValues}
          setCcValues={setCcValues}
          subject={subject}
          setSubject={setSubject}
          handleSend={handleSend}
          isSending={sendEmail.isPending}
          defaultToolbarExpanded
        />
      </DrawerContent>
    </Drawer>
  );
};
