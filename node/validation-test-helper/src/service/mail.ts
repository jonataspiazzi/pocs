export default class MailService {
  sendUserCreated() {
    console.log('Mail UserCreated sended');
  }
}

export const mailService = new MailService();