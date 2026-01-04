
export const EMAIL_TEMPLATE_VISIONARY = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; }
    .content { width: 100%; max-width: 600px; margin: 0 auto; }
    .main { background-color: #ffffff; padding: 40px; }
    h1 { font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 0 0 20px; }
    h2 { font-size: 22px; font-weight: bold; color: #333333; margin: 30px 0 15px; }
    p { font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px; }
    .quote { border-left: 4px solid #cccccc; padding-left: 20px; font-style: italic; color: #777777; margin: 30px 0; }
    .cta a { color: #007bff; text-decoration: none; font-weight: bold; }
    .signature { margin-top: 40px; }
    .signature img { border-radius: 50%; width: 60px; height: 60px; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #999999; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f7;">
    <tr>
      <td align="center">
        <table class="content" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="{{logoUrl}}" alt="Logo" width="150">
            </td>
          </tr>
          <tr>
            <td class="main" style="background-color: #ffffff; padding: 40px;">
              <h1 style="font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 0 0 20px;">{{main_title}}</h1>
              <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px;">{{intro_paragraph}}</p>
              
              <h2 style="font-size: 22px; font-weight: bold; color: #333333; margin: 30px 0 15px;">{{subtitle_1}}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px;">{{paragraph_1}}</p>
              
              <div class="quote" style="border-left: 4px solid #cccccc; padding-left: 20px; font-style: italic; color: #777777; margin: 30px 0;">
                <p style="font-size: 16px; line-height: 1.6; color: #777777; margin: 0;">"{{key_quote}}"</p>
              </div>

              <h2 style="font-size: 22px; font-weight: bold; color: #333333; margin: 30px 0 15px;">{{subtitle_2}}</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0 0 20px;">{{paragraph_2}}</p>

              <p class="cta" style="font-size: 16px; line-height: 1.6; color: #555555; margin: 30px 0 20px;">
                <a href="{{cta_link}}" style="color: {{primaryColor}}; text-decoration: none; font-weight: bold;">{{cta_text}}</a>
              </p>

              <table class="signature" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                <tr>
                  <td>
                     <p style="font-size: 16px; line-height: 1.6; color: #555555; margin: 0;">Cordialement,</p>
                     <p style="font-size: 16px; line-height: 1.6; color: #1a1a1a; margin: 5px 0 0; font-weight: bold;">{{author_name}}</p>
                     <p style="font-size: 14px; line-height: 1.6; color: #777777; margin: 0;">{{author_role}}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="footer" style="padding: 30px; text-align: center; font-size: 12px; color: #999999;">
              <p>Cet email a été envoyé à {{email}}.</p>
              <p><a href="[[UNSUB_LINK_FR]]" style="color: #999999;">Se désabonner</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
