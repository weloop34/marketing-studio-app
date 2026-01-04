
export const EMAIL_TEMPLATE_PRODUCT_FOCUS = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; }
    .content { width: 100%; max-width: 600px; margin: 0 auto; }
    .main { background-color: #ffffff; padding: 0; border-radius: 12px; overflow: hidden; }
    .hero img { display: block; width: 100%; height: auto; }
    .body-padding { padding: 30px 40px 40px; }
    h1 { font-size: 28px; font-weight: bold; color: #111827; margin: 0 0 15px; }
    p { font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 25px; }
    .benefit { margin-bottom: 20px; }
    .benefit-text { padding-left: 10px; font-size: 16px; color: #111827; font-weight: 500;}
    .benefit-icon { font-size: 18px; font-weight: bold; line-height: 1; }
    .cta-button a { display: inline-block; background-color: {{primaryColor}}; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="content" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="{{logoUrl}}" alt="Logo" width="150">
            </td>
          </tr>
          <tr>
            <td class="main" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
              <div class="hero">
                <img src="{{hero_image_url}}" alt="Product visual" style="display: block; width: 100%; height: auto;">
              </div>
              <div class="body-padding" style="padding: 30px 40px 40px;">
                <h1 style="font-size: 28px; font-weight: bold; color: #111827; margin: 0 0 15px;">{{main_title}}</h1>
                <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 0 0 25px;">{{body_paragraph}}</p>
                
                <table class="benefit" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                  <tr><td style="padding-bottom: 15px; vertical-align: middle;">
                    <span class="benefit-icon" style="color: {{primaryColor}}; font-weight: bold; font-size: 20px;">✓</span>
                    <span class="benefit-text" style="padding-left: 10px; font-size: 16px; color: #111827; font-weight: 500; vertical-align: middle;">{{benefit_1}}</span>
                  </td></tr>
                  <tr><td style="padding-bottom: 15px; vertical-align: middle;">
                    <span class="benefit-icon" style="color: {{primaryColor}}; font-weight: bold; font-size: 20px;">✓</span>
                    <span class="benefit-text" style="padding-left: 10px; font-size: 16px; color: #111827; font-weight: 500; vertical-align: middle;">{{benefit_2}}</span>
                  </td></tr>
                  <tr><td style="vertical-align: middle;">
                    <span class="benefit-icon" style="color: {{primaryColor}}; font-weight: bold; font-size: 20px;">✓</span>
                    <span class="benefit-text" style="padding-left: 10px; font-size: 16px; color: #111827; font-weight: 500; vertical-align: middle;">{{benefit_3}}</span>
                  </td></tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top: 15px;">
                  <tr>
                    <td class="cta-button" align="left">
                      <a href="{{cta_link}}" style="display: inline-block; background-color: {{primaryColor}}; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">{{cta_text}}</a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding: 30px; text-align: center; font-size: 12px; color: #9ca3af;">
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
