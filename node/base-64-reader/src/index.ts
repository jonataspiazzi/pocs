import 'dotenv/config';
import { google } from 'googleapis';
import MailComposer from 'nodemailer/lib/mail-composer';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { createBase64BlockReader } from './base64BlockReader';
import { streamToBase64Blocks } from './streamToBase64Blocks';

async function mailComposer(name?: string) {
  const composer = new MailComposer({
    from: `"Fridu" <naoresponda@fridu.com.br>`,
    to: 'naoresponda@fridu.com.br',
    subject: `Teste e-mail automatico ${name}`,
    attachments: [{
      //filename: 'dicas.pdf',
      filename: 'micro-logo.bmp',
      path: path.normalize(path.join(__dirname, '../files/micro-logo.bmp')),
      //path: path.normalize(path.join(__dirname, '../files/report/fluxo-03.pdf')),
      //path: path.normalize(path.join(__dirname, '../files/report/capa.pdf')),
      //path: path.normalize(path.join(__dirname, '../files/result.pdf')),
      contentDisposition: 'attachment',
      //contentType: 'application/pdf'
      contentType: 'image/bmp'
    }],
    html: fs.createReadStream(path.join(__dirname, '../files/mail.html'))
  });

  //console.log('\nhtml\n\n', fs.readFileSync(path.join(__dirname, '../files/screeningReport.html')), '\n\n');

  const stream = composer.compile().createReadStream();
  return await streamToBase64Blocks(stream);
  //stream.pipe(process.stdout);

  //return await createBase64BlockReader(stream, 512 * 1024);
}

async function main1() {
  const mailStream = await mailComposer();

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
  const resToken = await authClient.getAccessToken();
  //const info = await authClient.getTokenInfo(resToken.token);
  //console.log('token info: ', new Date(info.expiry_date), info);

  const options = {
    headers: {
      'Authorization': `Bearer ${resToken.token}`,
      'Content-Length': 0,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': 'message/rfc822',
      'X-Upload-Content-Length': mailStream.length
    },
    method: 'POST'
  };

  const url = 'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=resumable';

  const req = https.request(url, options, res => {
    console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', data => {
      console.log('\ndata:\n');
      process.stdout.write(data);
    });
  });

  req.on('error', e => {
    console.error('res error', e);
  });

  req.end();
}

async function main2() {
  const mailRaw = await mailComposer();

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

  const raw = Buffer.from(mailRaw).toString('base64').replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const authClient = await auth.getClient();
  const gmail = google.gmail({ version: 'v1', auth: authClient });

  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw }
  });

  console.log('res.status = ', res.status);
}

async function main() {
  const mailStream = await mailComposer('tentativa 24');

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
  const resToken = await authClient.getAccessToken();
  //const info = await authClient.getTokenInfo(resToken.token);
  //console.log('token info: ', new Date(info.expiry_date), info);

  const options = {
    headers: {
      'Authorization': `Bearer ${resToken.token}`,
      'Content-Type': 'message/rfc822',
      'Content-Length': mailStream.length
    },
    method: 'POST',
  };

  const url = 'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=multipart';

  const req = https.request(url, options, res => {
    console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    res.on('data', data => {
      console.log('\ndata:\n');
      process.stdout.write(data);
    });

    res.on('end', () => {
      console.log('res.end');
    });
  });

  req.on('error', e => {
    console.error('res error', e);
  });

  console.log('just before write');
  req.write(mailStream);
  console.log('write is ended');
  req.end();
  console.log('request has ended');
}

main().catch((e) => {
  fs.writeFileSync(path.join('D:\\data\\Desktop\\output.txt'), e.toString());

  const estr = e.toString();

  console.log('error', estr.length < 300 ? estr : '');
});