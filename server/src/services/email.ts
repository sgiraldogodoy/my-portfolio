import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "../config/env.js";

// Only enable email if all three are configured. AWS credentials themselves are
// resolved by the SDK from the environment or the host's IAM role automatically.
const client =
  env.awsRegion && env.sesFrom && env.sesTo
    ? new SESClient({ region: env.awsRegion })
    : null;

export function emailEnabled(): boolean {
  return client !== null;
}

type ContactInput = { name: string; email: string; message: string };

/**
 * Notify the site owner of a new contact submission via AWS SES. No-ops quietly
 * if SES isn't configured, so the contact endpoint still works without it.
 */
export async function sendContactEmail(msg: ContactInput): Promise<void> {
  if (!client) return;

  const body = `New message from your portfolio contact form:

Name:  ${msg.name}
Email: ${msg.email}

${msg.message}`;

  await client.send(
    new SendEmailCommand({
      Source: env.sesFrom,
      Destination: { ToAddresses: [env.sesTo] },
      // Lets you hit "reply" and respond straight to the visitor.
      ReplyToAddresses: [msg.email],
      Message: {
        Subject: { Data: `Portfolio contact from ${msg.name}` },
        Body: { Text: { Data: body } },
      },
    }),
  );
}
