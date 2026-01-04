
export const EMAIL_TEMPLATE_SOCIAL_PROOF = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    table { border-collapse: collapse; }
    .content { width: 100%; max-width: 600px; margin: 0 auto; }
    .main { background-color: #f8f9fa; padding: 0; }
    .body-padding { padding: 40px; }
    h1 { font-size: 26px; font-weight: bold; color: #212529; margin: 0 0 25px; line-height: 1.3; }
    p { font-size: 16px; line-height: 1.6; color: #495057; margin: 0 0 20px; }
    .quote-box { background-color: #ffffff; padding: 30px; border-left: 5px solid #007bff; border-radius: 8px; margin-bottom: 30px; border: 1px solid #dee2e6; }
    .quote-text { font-size: 18px; font-style: italic; color: #343a40; margin-bottom: 20px; }
    .quote-author { font-weight: bold; color: #212529; }
    .results-section { padding-top: 20px; }
    .result-box { text-align: center; padding: 0 10px; }
    .result-value { font-size: 36px; font-weight: bold; color: {{primaryColor}}; }
    .result-label { font-size: 14px; color: #6c757d; }
    .cta-button a { display: inline-block; background-color: #007bff; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; }
    .footer { padding: 30px; text-align: center; font-size: 12px; color: #adb5bd; background-color: #f8f9fa; }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
    <tr>
      <td align="center">
        <table class="content" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px 0;">
              <img src="{{logoUrl}}" alt="Logo" width="150">
            </td>
          </tr>
          <tr>
            <td class="main" style="background-color: #f8f9fa;">
              <div class="body-padding" style="padding: 40px;">
                <h1 style="font-size: 26px; font-weight: bold; color: #212529; margin: 0 0 25px; line-height: 1.3;">{{main_title}}</h1>
                <div class="quote-box" style="background-color: #ffffff; padding: 30px; border-left: 5px solid {{primaryColor}}; border-radius: 8px; margin-bottom: 30px; border: 1px solid #dee2e6;">
                  <p class="quote-text" style="font-size: 18px; font-style: italic; color: #343a40; margin-bottom: 20px;">"{{customer_quote}}"</p>
                  <p class="quote-author" style="font-weight: bold; color: #212529; margin:0;"><strong>{{customer_name}}</strong>, {{customer_role}}</p>
                </div>
                
                <table class="results-section" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top: 10px; padding-bottom: 20px;">
                  <tr>
                    <td class="result-box" width="33.33%" style="text-align: center; padding: 0 10px;">
                      <p class="result-value" style="font-size: 36px; font-weight: bold; color: {{primaryColor}}; margin:0;">{{kpi_1_value}}</p>
                      <p class="result-label" style="font-size: 14px; color: #6c757d; margin:0;">{{kpi_1_label}}</p>
                    </td>
                    <td class="result-box" width="33.33%" style="text-align: center; padding: 0 10px;">
                      <p class="result-value" style="font-size: 36px; font-weight: bold; color: {{primaryColor}}; margin:0;">{{kpi_2_value}}</p>
                      <p class="result-label" style="font-size: 14px; color: #6c757d; margin:0;">{{kpi_2_label}}</p>
                    </td>
                    <td class="result-box" width="33.33%" style="text-align: center; padding: 0 10px;">
                      <p class="result-value" style="font-size: 36px; font-weight: bold; color: {{primaryColor}}; margin:0;">{{kpi_3_value}}</p>
                      <p class="result-label" style="font-size: 14px; color: #6c757d; margin:0;">{{kpi_3_label}}</p>
                    </td>
                  </tr>
                </table>
                
                <p style="font-size: 16px; line-height: 1.6; color: #495057; margin: 20px 0;">{{summary_paragraph}}</p>

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
            <td class="footer" style="padding: 30px; text-align: center; font-size: 12px; color: #adb5bd; background-color: #f8f9fa;">
              <p>Cet email a été envoyé à {{email}}.</p>
              <p><a href="[[UNSUB_LINK_FR]]" style="color: #adb5bd;">Se désabonner</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
