"use client";

import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "@/trpc/react";
import { EmailEditor } from "@/app/mail/email-editor";
import { useThreads } from "@/hooks/use-threads";
import { useToast } from "@/hooks/use-toast";
import { type Value } from "@/types";

interface Props {
  replyDetails: RouterOutputs["account"]["getReplyDetails"];
  threadId?: string | null;
  accountId: string;
}

const Component = ({ replyDetails, threadId, accountId }: Props) => {
  const sendEmail = api.account.sendEmail.useMutation();
  const { toast } = useToast();

  const [subject, setSubject] = useState(
    replyDetails.subject.startsWith("Re:")
      ? replyDetails.subject
      : `Re: ${replyDetails.subject}`,
  );
  const [toValues, setToValues] = useState<Value[]>(
    replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
  );
  const [ccValues, setCcValues] = useState<Value[]>(
    replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
  );

  const handleSubmit = async (value: string) => {
    if (!replyDetails) return;

    sendEmail.mutate(
      {
        accountId,
        threadId: threadId ?? undefined,
        body: value,
        subject,
        from: replyDetails.from,
        to: replyDetails.to.map((to) => ({
          address: to.address,
          name: to.name ?? "",
        })),
        cc: ccValues.map((cc) => ({ address: cc.value, name: cc.label })),
        replyTo: replyDetails.from,
        inReplyTo: replyDetails.id,
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

  useEffect(() => {
    if (!threadId) return;

    if (!replyDetails.subject.startsWith("Re:")) {
      setSubject(`Re: ${replyDetails.subject}`);
    } else {
      setSubject(replyDetails.subject);
    }

    setToValues(
      replyDetails.to.map((to) => ({ label: to.address, value: to.address })),
    );
    setCcValues(
      replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address })),
    );
  }, [replyDetails, threadId]);

  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      toValues={toValues}
      setToValues={setToValues}
      ccValues={ccValues}
      setCcValues={setCcValues}
      to={replyDetails.to.map((to) => to.address)}
      handleSend={handleSubmit}
      isSending={sendEmail.isPending}
    />
  );
};

export const ReplyBox = () => {
  const { accountId, threadId } = useThreads();
  const { data: replyDetails } = api.account.getReplyDetails.useQuery({
    accountId,
    threadId: threadId ?? "",
  });

  if (!replyDetails) return null;

  return (
    <Component
      replyDetails={replyDetails}
      threadId={threadId}
      accountId={accountId}
    />
  );
};
