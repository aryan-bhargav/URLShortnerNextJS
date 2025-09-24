import prisma from "@/lib/db";
import { redirect, notFound } from "next/navigation";

interface RedirectPageProps {
  params: { shortCode: string };
}

const RedirectPage = async ({ params }: RedirectPageProps) => {
  const { shortCode } = params;


  const cachedUrl = await redis?.get(shortCode);
  if(cachedUrl){
    redis?.incr(`visits:${shortCode}`).catch(console.error)
    redirect(cachedUrl);
  }

  const url = await prisma.url.update({
    where: { shortCode },
    data: { visits: { increment: 1 } },
  }).catch(() => null);

  if (!url) {
    notFound();
  }

  await redis?.set(shortCode,url.originalUrl,"EX", 60 * 60 * 1)

  redirect(url.originalUrl);
};

export default RedirectPage;
