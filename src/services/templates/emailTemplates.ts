/**
 * Responsive HTML Email Templates for ProCheck / Azeno
 */

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

/**
 * Generates a responsive Romanian confirmation email for the client
 */
export function getClientAutoReplyTemplate(data: ContactFormData): string {
  const currentDate = new Date().toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmare Mesaj - ProCheck</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); padding: 36px 32px; text-align: center; }
    .content { padding: 36px 32px; }
    .card-message { background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 18px 20px; border-radius: 8px; margin: 24px 0; }
    .badge { display: inline-block; padding: 6px 14px; background-color: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; border-radius: 9999px; border: 1px solid #a7f3d0; }
    .btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc;">
  <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Brand Header -->
    <div class="header" style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); padding: 32px 24px; text-align: center;">
      <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
        Pro<span style="color: #818cf8;">Check</span>
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; color: #cbd5e1; font-weight: 400;">Platformă de Verificare & Sincronizare AWB</p>
    </div>

    <!-- Email Content Body in Romanian -->
    <div class="content" style="padding: 32px 28px; line-height: 1.6;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span class="badge" style="display: inline-block; padding: 5px 12px; background-color: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; border-radius: 9999px; border: 1px solid #a7f3d0;">
          ✓ Mesaj recepționat cu succes
        </span>
      </div>

      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 14px 0;">
        Bună ziua, ${data.name}!
      </h2>

      <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155;">
        Îți mulțumim că ai contactat echipa <strong>ProCheck</strong>! Am înregistrat cu succes solicitarea ta trimisă pe <strong>${currentDate}</strong>.
      </p>

      <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155;">
        Un reprezentant tehnic sau comercial din echipa noastră va analiza mesajul tău și va reveni cu un răspuns detaliat în cel mai scurt timp (de regulă în mai puțin de <strong>2 ore</strong> în timpul programului de lucru).
      </p>

      <!-- Message Recap Box -->
      <div class="card-message" style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 16px 18px; border-radius: 8px; margin: 22px 0;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.5px;">
          Rezumatul mesajului transmis:
        </p>
        <p style="margin: 0; font-size: 13px; color: #1e293b; font-style: italic; white-space: pre-line;">
          "${data.message}"
        </p>
      </div>

      <!-- Quick Action / Support Links -->
      <div style="background-color: #f1f5f9; padding: 18px; border-radius: 12px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: #334155;">
          Ai nevoie de asistență urgentă sau de ghidul de configurare a scanerului?
        </p>
        <a href="https://procheck.azeno.dev/help" class="btn" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 8px;">
          Deschide Centrul de Ajutor
        </a>
      </div>

      <p style="margin: 20px 0 0 0; font-size: 14px; color: #334155;">
        Cu stimă,<br>
        <strong>Echipa ProCheck / Azeno</strong>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer" style="background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
      <p style="margin: 0 0 4px 0;"><strong>Azeno Software Solutions</strong> &bull; Suport: <a href="mailto:contact@azeno.ro" style="color: #6366f1; text-decoration: none;">contact@azeno.ro</a></p>
      <p style="margin: 0;">Acest email este o confirmare automată a solicitării tale transmise prin procheck.azeno.dev.</p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

/**
 * Generates an internal notification email to contact@azeno.ro
 */
export function getAdminNotificationTemplate(data: ContactFormData): string {
  const currentDate = new Date().toLocaleDateString('ro-RO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mesaj Nou Formular Contact - ProCheck</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <div style="background: #0f172a; padding: 24px 28px; border-bottom: 3px solid #6366f1;">
      <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-weight: 800;">
        🔔 Solicitare nouă formular de contact &ndash; ProCheck
      </h2>
      <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">Data primirii: ${currentDate}</p>
    </div>

    <div style="padding: 28px; line-height: 1.6;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: 700; color: #64748b; width: 140px;">Nume client:</td>
          <td style="padding: 8px 0; font-weight: 700; color: #0f172a;">${data.name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Email:</td>
          <td style="padding: 8px 0; color: #4f46e5; font-weight: 600;">
            <a href="mailto:${data.email}" style="color: #4f46e5; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ${data.phone ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Telefon:</td>
          <td style="padding: 8px 0; color: #0f172a;">
            <a href="tel:${data.phone}" style="color: #0f172a; text-decoration: none;">${data.phone}</a>
          </td>
        </tr>` : ''}
        ${data.company ? `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Companie:</td>
          <td style="padding: 8px 0; color: #0f172a;">${data.company}</td>
        </tr>` : ''}
      </table>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; padding: 18px; border-radius: 8px; margin: 18px 0;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">
          Mesajul transmis de client:
        </p>
        <p style="margin: 0; font-size: 14px; color: #0f172a; white-space: pre-line; line-height: 1.5;">
          ${data.message}
        </p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${data.email}?subject=Re:%20Solicitare%20ProCheck%20AWB" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 8px;">
          ✉️ Răspunde direct clientului (${data.email})
        </a>
      </div>
    </div>

    <div style="background-color: #f8fafc; padding: 16px 28px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
      Notificare internă expediată către echipa Azeno Contact (contact@azeno.ro).
    </div>

  </div>
</body>
</html>
  `.trim();
}
