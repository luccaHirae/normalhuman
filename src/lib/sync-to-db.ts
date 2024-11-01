import { db } from "@/server/db";
import { OramaClient } from "@/lib/orama";
import {
  type EmailAttachment,
  type EmailAddress,
  type EmailMessage,
} from "@/types";

async function upsertEmailAddress(address: EmailAddress, accountId: string) {
  try {
    const existingAddress = await db.emailAddress.findUnique({
      where: {
        accountId_address: {
          accountId,
          address: address.address,
        },
      },
    });

    if (existingAddress) {
      return await db.emailAddress.findUnique({
        where: {
          id: existingAddress.id,
        },
      });
    } else {
      return await db.emailAddress.create({
        data: {
          address: address.address,
          name: address.name,
          raw: address.raw,
          accountId,
        },
      });
    }
  } catch (error) {
    console.error("Failed to upsert email address", error);

    return null;
  }
}

async function upsertAttachment(emailId: string, attachment: EmailAttachment) {
  try {
    await db.emailAttachment.upsert({
      where: {
        id: attachment.id,
      },
      update: {
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
      create: {
        id: attachment.id,
        emailId,
        name: attachment.name,
        mimeType: attachment.mimeType,
        size: attachment.size,
        inline: attachment.inline,
        contentId: attachment.contentId,
        content: attachment.content,
        contentLocation: attachment.contentLocation,
      },
    });
  } catch (error) {
    console.error("Failed to upsert attachment", error);
  }
}

async function upsertEmail(
  email: EmailMessage,
  accountId: string,
  index: number,
) {
  console.log("Upserting email", index, email.id);

  try {
    let emailLabelType: "inbox" | "sent" | "draft" = "inbox";

    const sysLabels = email.sysLabels;

    if (sysLabels.includes("inbox") || sysLabels.includes("important")) {
      emailLabelType = "inbox";
    } else if (sysLabels.includes("sent")) {
      emailLabelType = "sent";
    } else if (sysLabels.includes("draft")) {
      emailLabelType = "draft";
    }

    const addressesToUpsert = new Map() as Map<string, EmailAddress>;

    for (const address of [
      email.from,
      ...email.to,
      ...email.cc,
      ...email.bcc,
      ...email.replyTo,
    ]) {
      addressesToUpsert.set(address.address, address);
    }

    const upsertedAddresses: Awaited<ReturnType<typeof upsertEmailAddress>>[] =
      [];

    for (const address of addressesToUpsert.values()) {
      const upsertedAddress = await upsertEmailAddress(address, accountId);

      upsertedAddresses.push(upsertedAddress);
    }

    const addressMap = new Map(
      upsertedAddresses
        .filter(Boolean)
        .map((address) => [address!.address, address]),
    );

    const fromAddress = addressMap.get(email.from.address);

    if (!fromAddress) {
      console.log(
        `Failed to upsert from address for email ${email.bodySnippet}`,
      );
      return;
    }

    const toAddresses = email.to
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const ccAddresses = email.cc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const bccAddresses = email.bcc
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);
    const replyToAddresses = email.replyTo
      .map((addr) => addressMap.get(addr.address))
      .filter(Boolean);

    const thread = await db.thread.upsert({
      where: {
        id: email.threadId,
      },
      update: {
        subject: email.subject,
        accountId,
        lastMessageDate: new Date(email.sentAt),
        done: false,
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((addr) => addr!.id),
            ...ccAddresses.map((addr) => addr!.id),
            ...bccAddresses.map((addr) => addr!.id),
            ...replyToAddresses.map((addr) => addr!.id),
          ]),
        ],
      },
      create: {
        id: email.threadId,
        accountId,
        subject: email.subject,
        done: false,
        draftStatus: emailLabelType === "draft",
        inboxStatus: emailLabelType === "inbox",
        sentStatus: emailLabelType === "sent",
        lastMessageDate: new Date(email.sentAt),
        participantIds: [
          ...new Set([
            fromAddress.id,
            ...toAddresses.map((addr) => addr!.id),
            ...ccAddresses.map((addr) => addr!.id),
            ...bccAddresses.map((addr) => addr!.id),
          ]),
        ],
      },
    });

    await db.email.upsert({
      where: {
        id: email.id,
      },
      update: {
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: {
          set: toAddresses.map((addr) => ({ id: addr!.id })),
        },
        cc: {
          set: ccAddresses.map((addr) => ({ id: addr!.id })),
        },
        bcc: {
          set: bccAddresses.map((addr) => ({ id: addr!.id })),
        },
        replyTo: {
          set: replyToAddresses.map((addr) => ({ id: addr!.id })),
        },
        hasAttachments: email.hasAttachments,
        internetHeaders: email.internetHeaders as never,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties,
        folderId: email.folderId,
        omitted: email.omitted,
        emailLabel: emailLabelType,
      },
      create: {
        id: email.id,
        emailLabel: emailLabelType,
        threadId: thread.id,
        createdTime: new Date(email.createdTime),
        lastModifiedTime: new Date(),
        sentAt: new Date(email.sentAt),
        receivedAt: new Date(email.receivedAt),
        internetMessageId: email.internetMessageId,
        subject: email.subject,
        sysLabels: email.sysLabels,
        internetHeaders: email.internetHeaders as never,
        keywords: email.keywords,
        sysClassifications: email.sysClassifications,
        sensitivity: email.sensitivity,
        meetingMessageMethod: email.meetingMessageMethod,
        fromId: fromAddress.id,
        to: {
          connect: toAddresses.map((addr) => ({ id: addr!.id })),
        },
        cc: {
          connect: ccAddresses.map((addr) => ({ id: addr!.id })),
        },
        bcc: {
          connect: bccAddresses.map((addr) => ({ id: addr!.id })),
        },
        replyTo: {
          connect: replyToAddresses.map((addr) => ({ id: addr!.id })),
        },
        hasAttachments: email.hasAttachments,
        body: email.body,
        bodySnippet: email.bodySnippet,
        inReplyTo: email.inReplyTo,
        references: email.references,
        threadIndex: email.threadIndex,
        nativeProperties: email.nativeProperties,
        folderId: email.folderId,
        omitted: email.omitted,
      },
    });

    const threadEmails = await db.email.findMany({
      where: {
        threadId: email.threadId,
      },
      orderBy: {
        receivedAt: "asc",
      },
    });

    let threadFolderType = "sent";

    for (const threadEmail of threadEmails) {
      if (threadEmail.emailLabel === "inbox") {
        threadFolderType = "inbox";
        break;
      } else if (threadEmail.emailLabel === "draft") {
        threadFolderType = "draft";
      }
    }

    await db.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        draftStatus: threadFolderType === "draft",
        inboxStatus: threadFolderType === "inbox",
        sentStatus: threadFolderType === "sent",
      },
    });

    for (const attachment of email.attachments) {
      await upsertAttachment(email.id, attachment);
    }
  } catch (error) {
    console.error("Failed to upsert email", error);
  }
}

export async function syncEmailsToDatabase(
  emails: EmailMessage[],
  accountId: string,
) {
  console.log("Attempting to sync emails to database, count:", emails.length);

  const orama = new OramaClient(accountId);

  await orama.initialize();

  try {
    for (let i = 0; i < emails.length; i++) {
      await orama.insert({
        subject: emails[i]!.subject,
        body: emails[i]!.body,
        from: emails[i]!.from.address,
        to: emails[i]!.to.map((to) => to.address),
        sentAt: emails[i]!.sentAt,
        threadId: emails[i]!.threadId,
      } as never);

      await upsertEmail(emails[i]!, accountId, i);
    }
  } catch (error) {
    console.error("Failed to sync emails to database", error);
  }
}
