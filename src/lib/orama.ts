import { type AnyOrama, create, insert, search } from "@orama/orama";
import { restore, persist } from "@orama/plugin-data-persistence";
import { db } from "@/server/db";

export class OramaClient {
  private orama: AnyOrama | undefined;
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  async saveIndex() {
    const index = await persist(this.orama!, "json");

    await db.account.update({
      where: {
        id: this.accountId,
      },
      data: {
        oramaIndex: index,
      },
    });
  }

  async initialize() {
    const account = await db.account.findUnique({
      where: {
        id: this.accountId,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (account.oramaIndex) {
      this.orama = await restore("json", account.oramaIndex as string);
    } else {
      this.orama = create({
        schema: {
          subject: "string",
          body: "string",
          rawBody: "string",
          from: "string",
          to: "string[]",
          sentAt: "string",
          threadId: "string",
        },
      });

      await this.saveIndex();
    }
  }

  async search({ term }: { term: string }) {
    return await search(this.orama!, {
      term,
    });
  }

  async insert(document: never) {
    await insert(this.orama!, document);
    await this.saveIndex();
  }
}
