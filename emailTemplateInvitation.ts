
export const EMAIL_TEMPLATE_INVITATION = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; }
    .content { width: 100%; max-width: 600px; margin: 0 auto; }
    .main { background-color: #ffffff; padding: 0; border: 1px solid #e5e7eb; }
    .header-banner { background-color: #1f2937; color: #ffffff; padding: 20px; text-align: center; }
    .header-banner-text { font-size: 18px; font-weight: bold; letter-spacing: 2px; }
    .body-padding { padding: 35px; }
    h1 { font-size: 30px; font-weight: bold; color: #111827; margin: 0 0 20px; line-height: 1.2; }
    .info-bar { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center; }
    .info-item { display: inline-block; text-align: center; width: 32%; }
    .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .info-value { font-size: 16px; font-weight: bold; color: #111827; }
    .learn-title { font-size: 18px; font-weight: bold; color: #111827; margin: 30px 0 15px; }
    .checklist li { margin-bottom: 10px; font-size: 16px; color: #374151; list-style-type: none; padding-left: 0;}
    .checklist-icon { color: {{primaryColor}}; font-weight: bold; margin-right: 10px; }
    .cta-button a { display: block; background-color: #2563eb; color: #ffffff; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; text-align: center; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f3f4f6; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="content" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="{{logoUrl}}" alt="Logo" width="150">
            </td>
          </tr>
          <tr>
            <td class="main" style="background-color: #ffffff; border: 1px solid #e5e7eb;">
              <div class="header-banner" style="background-color: {{primaryColor}}; color: #ffffff; padding: 20px; text-align: center;">
                <span class="header-banner-text" style="font-size: 18px; font-weight: bold; letter-spacing: 2px;">{{event_type}}</span>
              </div>
              <div class="body-padding" style="padding: 35px;">
                <h1 style="font-size: 30px; font-weight: bold; color: #111827; margin: 0 0 20px; line-height: 1.2;">{{event_title}}</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">{{event_subtitle}}</p>
                
                <table class="info-bar" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                  <tr>
                    <td class="info-item" style="display: inline-block; text-align: center; width: 32%;">
                      <p class="info-label" style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin:0 0 5px;">Date</p>
                      <p class="info-value" style="font-size: 16px; font-weight: bold; color: #111827; margin:0;">{{event_date}}</p>
                    </td>
                    <td class="info-item" style="display: inline-block; text-align: center; width: 32%;">
                      <p class="info-label" style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin:0 0 5px;">Heure</p>
                      <p class="info-value" style="font-size: 16px; font-weight: bold; color: #111827; margin:0;">{{event_time}}</p>
                    </td>
                    <td class="info-item" style="display: inline-block; text-align: center; width: 32%;">
                      <p class="info-label" style="font-size: 12px; color: #6b7280; text-transform: uppercase; margin:0 0 5px;">Durée</p>
                      <p class="info-value" style="font-size: 16px; font-weight: bold; color: #111827; margin:0;">{{event_duration}}</p>
                    </td>
                  </tr>
                </table>

                <h3 class="learn-title" style="font-size: 18px; font-weight: bold; color: #111827; margin: 30px 0 15px;">Vous apprendrez à :</h3>
                <ul class="checklist" style="padding-left: 0; list-style-type: none;">
                  <li style="margin-bottom: 10px; font-size: 16px; color: #374151; list-style-type: none; padding-left: 0;"><span class="checklist-icon" style="color: {{primaryColor}}; font-weight: bold; margin-right: 10px;">✓</span> {{benefit_1}}</li>
                  <li style="margin-bottom: 10px; font-size: 16px; color: #374151; list-style-type: none; padding-left: 0;"><span class="checklist-icon" style="color: {{primaryColor}}; font-weight: bold; margin-right: 10px;">✓</span> {{benefit_2}}</li>
                  <li style="margin-bottom: 10px; font-size: 16px; color: #374151; list-style-type: none; padding-left: 0;"><span class="checklist-icon" style="color: {{primaryColor}}; font-weight: bold; margin-right: 10px;">✓</span> {{benefit_3}}</li>
                </ul>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top: 30px;">
                  <tr>
                    <td class="cta-button">
                      <a href="{{cta_link}}" style="display: block; background-color: {{primaryColor}}; color: #ffffff; padding: 16px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px; text-align: center;">{{cta_text}}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding: 30px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f3f4f6;">
              <p>Cet email a été envoyé à {{email}}.</p>
              <p><a href="[[UNSUB_LINK_FR]]" style="color: #9ca3af;">Se désabonner</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
