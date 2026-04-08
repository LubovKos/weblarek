import { IBuyer, BuyerValidationErrors} from '../../types';

export class Buyer {
  private payment: IBuyer['payment'] = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

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
  }

  getData(): IBuyer {
    return {
      payment: this.payment as IBuyer['payment'],
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