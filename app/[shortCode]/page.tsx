import prisma from "@/lib/db";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = params; // removed await

  const url = await prisma.url.update({
    where: { shortCode },
    data: { visits: { increment: 1 } },
  }).catch(() => null);

  if (!url) {
    notFound();
  }

  redirect(url.originalUrl);
};

export default RedirectPage;
