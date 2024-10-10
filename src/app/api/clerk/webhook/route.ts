import { db } from "@/server/db";

interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string;
  last_name: string;
  image_url: string;
}

export const POST = async (req: Request) => {
  const { data } = (await req.json()) as { data: ClerkUser };

  await db.user.create({
    data: {
      id: data.id,
      emailAddress: data.email_addresses[0]?.email_address ?? "",
      firstName: data.first_name,
      lastName: data.last_name,
      imageUri: data.image_url,
    },
  });

  console.log("User created:", data.id);

  return new Response("Success", { status: 200 });
};
