/**
 * Рассылка по листу ожидания — Театр LIBERTAD
 *
 * Установка (один раз):
 * 1. Откройте Google-таблицу с заявками (лист ожидания).
 * 2. Расширения → Apps Script → вставьте этот файл (можно вместе с google-apps-script.gs).
 * 3. В Gmail аккаунта, от имени которого запускается скрипт:
 *    Настройки → «Все настройки» → «Аккаунты и импорт» → «Отправлять письма от имени»
 *    → добавьте yes@libertad-theater.ru через SMTP хостинга Sweb.
 * 4. Сохраните скрипт, обновите таблицу — появится меню «LIBERTAD».
 *
 * Использование:
 * - LIBERTAD → Тестовое письмо (себе) — проверка текста и доставляемости.
 * - LIBERTAD → Отправить рассылку — всем, у кого ещё нет статуса «отправлено».
 */

const WAITLIST_MAILER = {
  fromEmail: 'yes@libertad-theater.ru',
  fromName: 'Театр LIBERTAD',
  replyTo: 'yes@libertad-theater.ru',

  // Отредактируйте перед рассылкой:
  subject: 'Билеты на «Каменное сердце» — открылась продажа',

  // Плейсхолдеры: {{name}} — имя из таблицы, {{ticketUrl}} — ссылка ниже
  ticketUrl: 'https://libertad-theater.ru/stone-heart.html',

  htmlBody: [
    '<div style="font-family: Georgia, serif; color: #1a1a1a; max-width: 560px; line-height: 1.6;">',
    '<p style="font-size: 18px;">Здравствуйте{{nameGreeting}}!</p>',
    '<p>Вы записывались в <strong>лист ожидания</strong> на спектакль «Каменное сердце» театра LIBERTAD.</p>',
    '<p>Рады сообщить: <strong>билеты снова в продаже</strong>. Лучшие места разбирают заранее — рекомендуем не откладывать.</p>',
    '<p style="margin: 28px 0;">',
    '<a href="{{ticketUrl}}" style="display: inline-block; background: #fbbf24; color: #0b0b0b; text-decoration: none; padding: 14px 28px; font-weight: 600; letter-spacing: 0.05em;">Купить билет</a>',
    '</p>',
    '<p style="font-size: 14px; color: #666;">С уважением,<br>Театр LIBERTAD<br>',
    '<a href="mailto:yes@libertad-theater.ru">yes@libertad-theater.ru</a><br>',
    '<a href="https://libertad-theater.ru">libertad-theater.ru</a></p>',
    '<p style="font-size: 12px; color: #999; margin-top: 32px; border-top: 1px solid #eee; padding-top: 16px;">',
    'Вы получили это письмо, потому что оставили контакты в листе ожидания на сайте libertad-theater.ru.',
    '</p>',
    '</div>'
  ].join(''),

  // Пауза между письмами (мс), чтобы не упереться в лимиты Gmail
  delayMs: 2500,

  // Колонки листа (1-based): A=дата, B=имя, C=email
  colDate: 1,
  colName: 2,
  colEmail: 3,
  colStatus: 10,  // J — «Статус рассылки»
  colSentAt: 11   // K — «Дата отправки»
};

const WAITLIST_STATUS_SENT = 'отправлено';
const WAITLIST_STATUS_ERROR = 'ошибка';

/** Вызывается из onOpen() в google-apps-script.gs (или добавьте onOpen сами, если скрипт отдельный). */
function installWaitlistMenu() {
  SpreadsheetApp.getUi()
    .createMenu('LIBERTAD')
    .addItem('Тестовое письмо (себе)', 'waitlistSendTestEmail')
    .addSeparator()
    .addItem('Отправить рассылку', 'waitlistSendCampaign')
    .addItem('Сбросить статусы рассылки', 'waitlistResetStatuses')
    .addToUi();
}

function waitlistSendTestEmail() {
  const ui = SpreadsheetApp.getUi();
  const ownerEmail = Session.getActiveUser().getEmail();
  if (!ownerEmail) {
    ui.alert('Не удалось определить ваш email. Запустите скрипт из таблицы под своим аккаунтом Google.');
    return;
  }

  try {
    waitlistSendOne_(ownerEmail, 'Тест (ваше имя)', true);
    ui.alert('Тестовое письмо отправлено на ' + ownerEmail + '.\nПроверьте входящие и папку «Спам».');
  } catch (err) {
    ui.alert('Ошибка тестовой отправки:\n' + err.message);
  }
}

function waitlistSendCampaign() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  waitlistEnsureStatusColumns_(sheet);

  const rows = waitlistGetPendingRows_(sheet);
  if (!rows.length) {
    ui.alert('Нет адресов для рассылки.\nВсе строки уже помечены как «отправлено» или email пустой.');
    return;
  }

  const confirm = ui.alert(
    'Рассылка листа ожидания',
    'Будет отправлено писем: ' + rows.length + '\n\nТема: ' + WAITLIST_MAILER.subject + '\nОт: ' + WAITLIST_MAILER.fromEmail + '\n\nПродолжить?',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  let sent = 0;
  let failed = 0;
  const errors = [];

  rows.forEach(function (row, index) {
    try {
      waitlistSendOne_(row.email, row.name, false);
      sheet.getRange(row.sheetRow, WAITLIST_MAILER.colStatus).setValue(WAITLIST_STATUS_SENT);
      sheet.getRange(row.sheetRow, WAITLIST_MAILER.colSentAt).setValue(new Date());
      sent++;
    } catch (err) {
      sheet.getRange(row.sheetRow, WAITLIST_MAILER.colStatus).setValue(WAITLIST_STATUS_ERROR);
      failed++;
      errors.push(row.email + ': ' + err.message);
    }

    if (index < rows.length - 1 && WAITLIST_MAILER.delayMs > 0) {
      Utilities.sleep(WAITLIST_MAILER.delayMs);
    }
  });

  let message = 'Готово.\nОтправлено: ' + sent;
  if (failed) message += '\nОшибок: ' + failed + '\n\n' + errors.slice(0, 5).join('\n');
  ui.alert(message);
}

function waitlistResetStatuses() {
  const ui = SpreadsheetApp.getUi();
  const confirm = ui.alert(
    'Сброс статусов',
    'Сбросить колонки «Статус рассылки» и «Дата отправки» для всех строк?\nПовторная рассылка уйдёт всем заново.',
    ui.ButtonSet.YES_NO
  );
  if (confirm !== ui.Button.YES) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  waitlistEnsureStatusColumns_(sheet);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    ui.alert('В таблице нет данных.');
    return;
  }

  sheet.getRange(2, WAITLIST_MAILER.colStatus, lastRow - 1, 2).clearContent();
  ui.alert('Статусы сброшены.');
}

function waitlistEnsureStatusColumns_(sheet) {
  const statusHeader = sheet.getRange(1, WAITLIST_MAILER.colStatus).getValue();
  const sentAtHeader = sheet.getRange(1, WAITLIST_MAILER.colSentAt).getValue();
  if (!statusHeader) sheet.getRange(1, WAITLIST_MAILER.colStatus).setValue('Статус рассылки');
  if (!sentAtHeader) sheet.getRange(1, WAITLIST_MAILER.colSentAt).setValue('Дата отправки');
}

function waitlistGetPendingRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const width = Math.max(WAITLIST_MAILER.colSentAt, sheet.getLastColumn());
  const values = sheet.getRange(2, 1, lastRow - 1, width).getValues();
  const seen = {};
  const rows = [];

  values.forEach(function (row, index) {
    const email = String(row[WAITLIST_MAILER.colEmail - 1] || '').trim().toLowerCase();
    const name = String(row[WAITLIST_MAILER.colName - 1] || '').trim();
    const status = String(row[WAITLIST_MAILER.colStatus - 1] || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    if (status === WAITLIST_STATUS_SENT) return;
    if (seen[email]) return;

    seen[email] = true;
    rows.push({ sheetRow: index + 2, email: email, name: name });
  });

  return rows;
}

function waitlistSendOne_(email, name, isTest) {
  const greeting = name && !isTest ? ', ' + name : '';
  const html = WAITLIST_MAILER.htmlBody
    .replace(/\{\{nameGreeting\}\}/g, greeting)
    .replace(/\{\{ticketUrl\}\}/g, WAITLIST_MAILER.ticketUrl);

  const subject = isTest ? '[ТЕСТ] ' + WAITLIST_MAILER.subject : WAITLIST_MAILER.subject;

  const plain = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  GmailApp.sendEmail(email, subject, plain, {
    htmlBody: html,
    name: WAITLIST_MAILER.fromName,
    from: WAITLIST_MAILER.fromEmail,
    replyTo: WAITLIST_MAILER.replyTo,
    noReply: false
  });
}
