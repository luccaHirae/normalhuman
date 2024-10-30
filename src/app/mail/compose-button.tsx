import { useState } from "react";
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
import { type Value } from "@/types";

export const ComposeButton = () => {
  const [toValues, setToValues] = useState<Value[]>([]);
  const [ccValues, setCcValues] = useState<Value[]>([]);
  const [subject, setSubject] = useState("");

  const handleSend = async (value: string) => {
    console.log(value);
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
          isSending={false}
          defaultToolbarExpanded
        />
      </DrawerContent>
    </Drawer>
  );
};
