var SPREADSHEET_ID = '1Jeo3qbt8DwZuTAEBTsZ3AICI75LAal_wnLI04G1oKyU';
var SUPPORT_SHEET_ID = '1LgFTKkiD36NgUYNytTro1IDlCjuxwWn2_OJG83ixQto';
var WAITLIST_HEADERS = ['Дата/время', 'Имя', 'Email', 'Телефон', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

function onOpen() {
  if (typeof installWaitlistMenu === 'function') {
    installWaitlistMenu();
  }
}

function parseRequestData(e) {
  var data = {};

  if (e && e.parameter) {
    Object.keys(e.parameter).forEach(function (key) {
      data[key] = e.parameter[key];
    });
  }

  if (e && e.postData && e.postData.contents) {
    try {
      var json = JSON.parse(e.postData.contents);
      if (json && typeof json === 'object') {
        Object.keys(json).forEach(function (key) {
          data[key] = json[key];
        });
      }
    } catch (error) {
      // ignore invalid JSON body
    }
  }

  return data;
}

function isWaitlistRequest(data) {
  if (!data) {
    return false;
  }

  var route = String(data.route || '').trim().toLowerCase();
  var action = String(data.action || '').trim().toLowerCase();
  var project = String(data.project || '').trim().toLowerCase();
  var sheetName = String(data.sheetName || data.sheet || '').trim();
  var type = String(data.type || '').trim().toLowerCase();

  if (route === 'waitlist') return true;
  if (type === 'waitlist') return true;
  if (action.indexOf('waitlist') === 0) return true;
  if (project === 'rusalochka' || project === 'stone-heart') return true;
  if (sheetName === 'Русалочка' || sheetName === 'Sheet1') return true;
  return false;
}

function getWaitlistSheet(data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var action = String(data.action || '').trim().toLowerCase();
  var explicitName = String(data.sheetName || data.sheet || '').trim();
  var project = String(data.project || '').trim().toLowerCase();
  var sheet;

  if (action === 'waitlist_rusalochka' || project === 'rusalochka' || explicitName === 'Русалочка') {
    sheet = ss.getSheetByName('Русалочка');
    if (!sheet) {
      throw new Error('Вкладка "Русалочка" не найдена');
    }
    return sheet;
  }

  sheet = ss.getSheetByName('Sheet1');
  return sheet || ss.getSheets()[0];
}

function handleWaitlistPost(data) {
  var sheet = getWaitlistSheet(data);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(WAITLIST_HEADERS);
  }

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.email || '',
    data.phone || '',
    data.utm_source || '',
    data.utm_medium || '',
    data.utm_campaign || '',
    data.utm_content || '',
    data.utm_term || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    sheet: sheet.getName(),
    message: 'Данные успешно сохранены'
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleSupportersPost(data) {
  data = data || {};

  if (isWaitlistRequest(data)) {
    return handleWaitlistPost(data);
  }

  var timestamp = new Date();

  if (data.action === 'partnerForm') {
    var partnerSheetName = 'Сообщения от спонсоров из формы';
    var ss = SpreadsheetApp.openById(SUPPORT_SHEET_ID);
    var partnerSheet = ss.getSheetByName(partnerSheetName) || ss.insertSheet(partnerSheetName);
    if (partnerSheet.getLastRow() === 0) {
      partnerSheet.appendRow(['Date/Time', 'Name', 'Company', 'Email', 'Phone', 'Message']);
    }
    partnerSheet.appendRow([
      timestamp,
      data.name || '',
      data.company || '',
      data.email || '',
      data.phone || '',
      data.message || ''
    ]);
    var subject = 'Партнёрство: ' + (data.name || 'без имени');
    var body = 'Имя: ' + (data.name || '') + '\nКомпания: ' + (data.company || '') + '\nEmail: ' + (data.email || '') + '\nТелефон: ' + (data.phone || '') + '\nКомментарий: ' + (data.message || '');
    MailApp.sendEmail('yes@libertad-theater.ru', subject, body);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Saved' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = SpreadsheetApp.openById(SUPPORT_SHEET_ID).getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date/Time', 'Name', 'Email', 'Phone', 'Amount']);
  }

  sheet.appendRow([
    timestamp,
    data.name || '',
    data.email || '',
    data.phone || '',
    data.amount || ''
  ]);

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Saved'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getSupporters() {
  try {
    var sheet = SpreadsheetApp.openById(SUPPORT_SHEET_ID).getSheets()[0];
    var values = sheet.getDataRange().getValues();
    var supporters = values.slice(1)
      .filter(function (row) { return row[1]; })
      .map(function (row, index) {
        return {
          date: row[0],
          name: row[1],
          email: row[2] || '',
          phone: row[3] || '',
          amount: row[4] || '',
          amountNumber: parseFloat(row[4]) || 0,
          order: index
        };
      });

    var totalAmount = parseFloat(sheet.getRange('F1').getValue()) || 0;

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      supporters: supporters,
      totalAmount: totalAmount
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = parseRequestData(e);

    if (isWaitlistRequest(data)) {
      return handleWaitlistPost(data);
    }

    return handleSupportersPost(data);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'supporters') {
    return getSupporters();
  }

  if (e && e.parameter && e.parameter.test === '1') {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetNames = ss.getSheets().map(function (sheet) {
      return sheet.getName();
    });

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      version: 4,
      marker: 'LIBERTAD waitlist routing',
      sheets: sheetNames
    })).setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    version: 4,
    marker: 'LIBERTAD waitlist routing',
    message: 'Используйте POST для отправки заявок.'
  })).setMimeType(ContentService.MimeType.JSON);
}

function testWaitlistStoneHeart() {
  return doPost({
    parameter: { route: 'waitlist' },
    postData: {
      contents: JSON.stringify({
        name: 'Тест Каменное сердце',
        email: 'test@example.com',
        phone: '79990000000',
        action: 'waitlist_stone_heart',
        project: 'stone-heart',
        sheetName: 'Sheet1',
        type: 'waitlist'
      })
    }
  });
}

function testWaitlistRusalochka() {
  return doPost({
    parameter: { route: 'waitlist' },
    postData: {
      contents: JSON.stringify({
        name: 'Тест Русалочка',
        email: 'test@example.com',
        phone: '79990000000',
        action: 'waitlist_rusalochka',
        project: 'rusalochka',
        sheetName: 'Русалочка',
        type: 'waitlist'
      })
    }
  });
}
