import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendResetPasswordEmailParams {
  email: string;
  token: string;
}

export async function sendResetPasswordEmail({ email, token }: SendResetPasswordEmailParams) {
  const resetUrl = `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/auth/v2/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Traqqy <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background-color:#ffffff;border-radius:8px;border:1px solid #e4e4e7;padding:32px;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="font-size:20px;font-weight:600;color:#18181b;margin:0;">Traqqy</h1>
            </div>
            <h2 style="font-size:16px;font-weight:600;color:#18181b;margin:0 0 8px;">Reset your password</h2>
            <p style="font-size:14px;color:#71717a;margin:0 0 24px;line-height:1.5;">
              Click the button below to reset your password. This link will expire in 1 hour.
            </p>
            <div style="text-align:center;margin-bottom:24px;">
              <a href="${resetUrl}" style="display:inline-block;background-color:#18181b;color:#ffffff;font-size:14px;font-weight:500;padding:10px 24px;border-radius:6px;text-decoration:none;">
                Reset Password
              </a>
            </div>
            <p style="font-size:12px;color:#a1a1aa;margin:0;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
  });
}
