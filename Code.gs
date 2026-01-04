
/**
 * @OnlyCurrentDoc
 *
 * The above comment directs App Script to limit the scope of authorization
 * to only the current document.
 */

/**
 * Handles HTTP GET requests to the web app.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; 
    const data = sheet.getDataRange().getValues();
    const sheetId = ss.getId();
    
    const payload = {
      sheetId: sheetId,
      data: data
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(payload))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doGet:', error);
    const errorPayload = {
      status: 'error',
      message: 'An error occurred while fetching data.',
      details: error.message
    };
    return ContentService
      .createTextOutput(JSON.stringify(errorPayload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles HTTP POST requests to the web app.
 */
function doPost(e) {
  try {
    var params;

    // Handle both urlencoded form data (from PersonaGenerator) and JSON text payloads (from other tools)
    if (e.parameter && e.parameter.action) {
        params = e.parameter;
    } 
    else if (e.postData && e.postData.contents) {
        params = JSON.parse(e.postData.contents);
        // Handle potential double-stringification for the JSON payload method
        if (typeof params === 'string') {
            params = JSON.parse(params);
        }
    } else {
        throw new Error("Données POST non reconnues ou mal formatées.");
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    
    if (params.action === 'updateStatus' && params.rowIndex && params.status) {
      const statusColumn = 11;
      sheet.getRange(params.rowIndex, statusColumn).setValue(params.status);
      
      const successPayload = {
        status: 'success',
        message: 'Statut mis à jour avec succès pour la ligne ' + params.rowIndex
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(successPayload))
        .setMimeType(ContentService.MimeType.JSON);

    } else if (params.action === 'addRow' && params.rowData) {
      // Ajoute une nouvelle ligne à la fin du tableau
      sheet.appendRow(params.rowData);
      
      const successPayload = {
        status: 'success',
        message: 'Nouvelle mission ajoutée avec succès !'
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(successPayload))
        .setMimeType(ContentService.MimeType.JSON);

    } else if (params.action === 'fetchImageAsBase64' && params.url) {
      const imageUrl = params.url;
      const imageBlob = UrlFetchApp.fetch(imageUrl).getBlob();
      const contentType = imageBlob.getContentType();
      const base64Data = Utilities.base64Encode(imageBlob.getBytes());
      const dataUrl = "data:" + contentType + ";base64," + base64Data;
      
      const payload = {
        status: 'success',
        dataUrl: dataUrl
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(payload))
        .setMimeType(ContentService.MimeType.JSON);

    } else if (params.action === 'scrapeWebsite' && params.url) {
      const url = params.url;
      const options = {
        'muteHttpExceptions': true,
        'headers': {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      };
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      
      if (responseCode < 200 || responseCode >= 300) {
         throw new Error("Le site a retourné une erreur (code " + responseCode + "). Impossible de récupérer son contenu.");
      }

      const htmlContent = response.getContentText();
      
      let textContent = htmlContent
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/\s\s+/g, ' ')
        .trim();
        
      try {
        textContent = XmlService.parse('<d>' + textContent + '</d>').getRootElement().getText();
      } catch (xmlError) {
        console.warn("XML parsing for entity decoding failed. Continuing with raw text. Error: " + xmlError.message);
      }

      const payload = {
        status: 'success',
        text: textContent
      };
      
      return ContentService
        .createTextOutput(JSON.stringify(payload))
        .setMimeType(ContentService.MimeType.JSON);

    } else {
      throw new Error("Paramètres invalides pour la requête POST.");
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    const errorPayload = {
      status: 'error',
      message: error.message || 'Une erreur est survenue sur le serveur.',
      details: error.message
    };
    return ContentService
      .createTextOutput(JSON.stringify(errorPayload))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
