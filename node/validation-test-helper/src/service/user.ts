import { mailService } from './mail';

export class User {
  constructor(
    public id: number = 0,
    public mail: string = '',
    public phone: string = '') { }
}

export const users = [
  new User(1, 'john.doe@domail.com', '1234-5678'),
  new User(2, 'marry.smith@domail.com', '1111-1111')
];

export default class UserService {
  getUsers() {
    return users;
  }

  getUser(id: number) {
    return users.find(u => u.id === id);
  }

  createUser(model: any) {
    const id = users.reduce((ac, i) => i.id > ac ? i.id : ac, 0) + 1;

    const user = { id, ...model };

    users.push(user);

    mailService.sendUserCreated();

    return user;
  }

  deleteUser(mail: string) {
    const user = users.find(u => u.mail === mail);
    const index = users.indexOf(user);

    if (index < 0) return false;

    users.splice(index, 1);
  }

  isMailUsed(mail: string) {
    return !users.find(u => u.mail === mail);
  }

  isPhoneUsed(phone: string) {
    return !users.find(u => u.phone === phone);
  }
}

export const userService = new UserService();