import { computed } from '@ember/object';

export class StockResult {
  symbol = null;
  name = null;

  constructor(symbol, name) {
    this.symbol = symbol;
    this.name = name;
  }

  @computed('symbol', 'name')
  get displayName() {
    return `(${this.symbol}) ${this.name}`;
  }
}
