import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: "URL Shortener <noreply@yourdomain.com>",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Click below to verify your email:</p>
      <a href="${link}">Verify Email</a>
    `,
  });
}
