import prisma from "@/lib/db";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = await params;

  const url = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (!url) {
    notFound();
  }
  
  await prisma.url.update({
    where: { id: url.id },
    data: { visits: { increment: 1 } },
  });

  redirect(url.originalUrl);
};

export default RedirectPage;
