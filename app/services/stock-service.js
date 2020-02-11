import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { StockResult } from 'clutch-coding-exercise-client/app/models/stock-result';

export default class StockService extends Service {
  @service httpClient;
  @service websockets;
  stockWatcherRef = null;

  searchStocks(searchTerm) {
    const url = `/stocks?search=${searchTerm}`;
    return this.httpClient.get({ url }).then( stocks => {
      return stocks.map(s => new StockResult(s.symbol, s.name));
    });
  }
  watch() {
    // TODO: avoid hard-coding localhost and port. make it based on ENV configuration param
    const socket = this.websockets.socketFor('ws://localhost:9000/watch');

    this.set('stockWatcherRef', socket);
    return socket;
  }
  addStockToWatcher(symbol) {
    const url = `/stocks`;
    const body = { symbol };
    return this.httpClient.post({ url, body });
  }
  removeStockFromWatcher(symbol) {
    const url = `/stocks/${symbol}`;
    return this.httpClient.delete({ url });
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.websockets.closeSocketFor('ws://localhost:9000/watch');
  }
}
