import { Resend } from "resend";

let cached: Resend | null = null;

function client() {
  if (cached) return cached;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  cached = new Resend(key);
  return cached;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const r = client();
  const from = process.env.EMAIL_FROM ?? "no-reply@vinit.dev";
  if (!r) {
    console.warn("[email] RESEND_API_KEY missing — skipped sending to", opts.to);
    return { skipped: true } as const;
  }
  const result = await r.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return result;
}

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
