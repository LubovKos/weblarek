import { IBuyer, BuyerValidationErrors} from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  private payment: IBuyer['payment'] = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }
    if (data.email !== undefined) {
      this.email = data.email;
    }
    if (data.phone !== undefined) {
      this.phone = data.phone;
    }
    if (data.address !== undefined) {
      this.address = data.address;
    }
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events.emit('buyer:changed');
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    if (!this.email) {
      errors.email = 'Укажите email';
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }
    return errors;
  }
}