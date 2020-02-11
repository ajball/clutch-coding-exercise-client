import { tracked } from '@glimmer/tracking';

export class Stock {
  symbol = null;
  name = null;
  @tracked price = null;

  numberFormatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  constructor({ symbol, name, price }) {
    this.symbol = symbol;
    this.name = name;
    this.price = price;
  }

  get displayPrice() {
    const price = this.price;
    return price ? `$${this.numberFormatter.format(this.price)}` : 'Price not available';
  }
}
