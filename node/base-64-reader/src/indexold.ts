/*
import 'dotenv/config';
import { google } from 'googleapis';
import MailComposer from 'nodemailer/lib/mail-composer';
import streamToString from 'stream-to-string';
import base64url from "base64url";
import fs from 'fs';
import path from 'path';
///const GmailResumableUpload = require('../gmailResumableUpload') as any;

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    clientOptions: {
      subject: process.env.MAIL_NOREPLY,
    },
    scopes: [
      'https://mail.google.com',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.readonly'
    ]
  });

  const authClient = await auth.getClient();
  const gmail = google.gmail({ version: 'v1', auth: authClient });

  const composer = new MailComposer({
    from: `"Fridu" <naoresponda@fridu.com.br>`,
    to: 'naoresponda@fridu.com.br',
    subject: 'Confirme sua conta na Fridu t5',
    attachments: [{
      filename: 'dicas.pdf',
      //path: path.normalize(path.join(__dirname, '../files/report/fluxo-03.pdf')),
      path: path.normalize(path.join(__dirname, '../files/report/capa.pdf')),
      contentDisposition: 'attachment',
      contentType: 'application/pdf'
    }],
    html: fs.readFileSync(path.join(__dirname, '../files/screeningReport.html'))
  });

  const body = composer.compile().createReadStream();
  const str = await streamToString(body);

  //fs.writeFileSync(path.join('D:\\data\\Desktop\\body.txt'), str);

  const str64 = base64url(str);

  const base64EncodedEmail = str64;
  console.log('converted in base64');

  //const b64 = body.pipe(new Base64Encode()) as Base64Encode;
  //const base64EncodedEmail = await streamToString(b64);

  google.options({
    params: {
      uploadType: 'resumable'
    }
  });

  const res = await gmail.users.messages.send(<any>{
    userId: 'me',
    requestBody: {
      raw: base64EncodedEmail
    }
  });

  /*
  <any>{
  userId: 'me',

  resource: {
    raw: base64EncodedEmail
  }
});* /

console.log(res.status);
console.log('mail sended');



  //const data = await gmail.users.messages.list({ userId: 'me' });


/*
const gmail = google.gmail({ version: 'v1', auth: authClient });
const data = await gmail.users.messages.list({ userId: 'me' });
console.log('\n\ndata:\n\n', data.data.messages);
* /
}

main().catch((e) => {
fs.writeFileSync(path.join('D:\\data\\Desktop\\output.txt'), e.toString());
console.log('error');
});
*/