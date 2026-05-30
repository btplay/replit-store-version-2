import { Resend } from "resend";
import { BrevoClient } from "@getbrevo/brevo";
import { logger } from "./logger";

const resend = new Resend(process.env["RESEND_API_KEY"]);

const brevo = new BrevoClient({ apiKey: process.env["BREVO_API_KEY"] ?? "" });

export interface EnquiryEmailData {
  name: string;
  email: string;
  phone: string;
  eventDate?: string | null;
  eventTime?: string | null;
  venue?: string | null;
  eventType: string;
  packageInterest?: string | null;
  guestCount?: number | null;
  deliveryCharge?: number | null;
  additionalDetails?: string | null;
  bookingReference: string;
}

export async function sendOwnerNotification(data: EnquiryEmailData): Promise<void> {
  const { name, email, phone, eventDate, eventTime, venue, eventType, packageInterest, guestCount, deliveryCharge, additionalDetails, bookingReference } = data;

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1e293b;">
      <div style="background:#B5C2B7;padding:32px 40px;">
        <h1 style="color:white;margin:0;font-size:24px;letter-spacing:2px;">NEW BOOKING ENQUIRY</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">BT Play — ${bookingReference}</p>
      </div>
      <div style="padding:40px;background:#f8fafc;border:1px solid #e2e8f0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;width:40%;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:${email}" style="color:#B5C2B7;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${phone}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Package</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${packageInterest ?? "Not specified"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Event Type</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${eventType}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Event Date</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${eventDate ?? "Not specified"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Event Time</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${eventTime ?? "Not specified"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Venue</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${venue ?? "Not specified"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Guest Count</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${guestCount ?? "Not specified"}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">Delivery Charge</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">${deliveryCharge != null ? `£${deliveryCharge}` : "Free / TBC"}</td></tr>
          ${additionalDetails ? `<tr><td style="padding:10px 0;font-size:12px;color:#64748b;font-weight:bold;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Notes</td><td style="padding:10px 0;">${additionalDetails}</td></tr>` : ""}
        </table>
        <div style="margin-top:32px;padding:16px;background:white;border-left:3px solid #B5C2B7;">
          <p style="margin:0;font-size:13px;color:#64748b;">Booking Reference: <strong>${bookingReference}</strong></p>
        </div>
        <div style="margin-top:24px;">
          <a href="mailto:${email}?subject=Re: Your BT Play Enquiry (${bookingReference})" style="background:#B5C2B7;color:white;padding:12px 24px;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Reply to Customer</a>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "BT Play <onboarding@resend.dev>",
      to: ["btplayco@gmail.com"],
      subject: `New Enquiry — ${name} | ${eventDate ?? "Date TBC"} | ${bookingReference}`,
      html,
    });
    logger.info({ bookingReference }, "Owner notification sent via Resend");
  } catch (err) {
    logger.error({ err, bookingReference }, "Failed to send owner notification via Resend");
  }
}

export async function sendClientConfirmation(data: EnquiryEmailData): Promise<void> {
  const { name, email, eventDate, eventTime, eventType, packageInterest, deliveryCharge, bookingReference } = data;

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1e293b;">
      <div style="background:#B5C2B7;padding:32px 40px;">
        <h1 style="color:white;margin:0;font-size:22px;letter-spacing:2px;">BT PLAY</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Luxury Soft Play Hire · Hertfordshire</p>
      </div>
      <div style="padding:40px;background:white;border:1px solid #e2e8f0;border-top:none;">
        <h2 style="font-size:20px;margin:0 0 16px;color:#1e293b;">Thank you, ${name}!</h2>
        <p style="color:#475569;line-height:1.7;margin:0 0 16px;">We've received your enquiry for a <strong>${packageInterest ?? eventType}</strong> package${eventDate ? ` on <strong>${eventDate}</strong>${eventTime ? ` at <strong>${eventTime}</strong>` : ""}` : ""} and will be in touch within <strong>24–48 hours</strong> to confirm availability and provide your quote.</p>
        ${deliveryCharge != null && deliveryCharge > 0 ? `<p style="color:#475569;line-height:1.7;margin:0 0 16px;">Please note: a delivery charge of <strong>£${deliveryCharge}</strong> will apply to your location, which will be included in your quote.</p>` : ""}
        <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:20px;margin:24px 0;">
          <p style="margin:0;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Your Reference</p>
          <p style="margin:8px 0 0;font-size:20px;color:#B5C2B7;font-family:monospace;letter-spacing:2px;">${bookingReference}</p>
        </div>
        <p style="color:#475569;line-height:1.7;margin:0 0 8px;">If you have any questions in the meantime, email us at <a href="mailto:hello@btplay.co.uk" style="color:#B5C2B7;">hello@btplay.co.uk</a>.</p>
        <p style="color:#475569;line-height:1.7;margin:0;">Warm regards,<br><strong>The BT Play Team</strong></p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />
        <p style="font-size:12px;color:#94a3b8;margin:0;">BT Play · Hertfordshire · hello@btplay.co.uk</p>
      </div>
    </div>
  `;

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      to: [{ email, name }],
      sender: { name: "BT Play", email: "hello@btplay.co.uk" },
      subject: `We've received your enquiry — ${bookingReference}`,
      htmlContent: html,
    });
    logger.info({ bookingReference, email }, "Client confirmation sent via Brevo");
  } catch (err) {
    logger.error({ err, bookingReference }, "Failed to send client confirmation via Brevo");
  }
}
