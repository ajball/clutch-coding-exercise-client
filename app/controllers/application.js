import Controller from '@ember/controller';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from "@glimmer/tracking";
import { task, timeout } from 'ember-concurrency';
import { Stock } from 'clutch-coding-exercise-client/app/models/stock';

export default class Application extends Controller {
  @service stockService;
  @service paperToaster;
  stockOptions = [];
  watchedStocks = A([]);
  emptyArray = A([]);
  selectedStock = null;
  @tracked
  isConnected = false;

  @action
  commentChanged(newText) {
    this.set('newCommentText', newText);
  }

  constructor() {
    super(...arguments);
    // const websocket = this.stockService.watch();
    // websocket.on('message', (event) => {
    //   const updatedStock = JSON.parse(event.data);
    //   const foundStock = this.watchedStocks.find(stock => stock.symbol === updatedStock.symbol);
    //   if (foundStock) {
    //     foundStock.price = updatedStock.price;
    //   } else {
    //     this.watchedStocks.pushObject(new Stock({
    //       symbol: updatedStock.symbol,
    //       name: null,
    //       price: updatedStock.price
    //     }));
    //   }
    // });
    //
    // websocket.on('open', () => this.isConnected = true);
    // websocket.on('close', () => {
    //   this.isConnected = false;
    //   this.set('watchedStocks', A([]));
    // });
  }

  @task(function * (currentMention) {
    yield timeout(150);
    this.set('userMentions', currentMention ? yield findAllUsers() : []);
  }).restartable() searchUsersToMention;

  @task(function * (searchTerm) {
    yield timeout(300);
    if (searchTerm && searchTerm.trim()) {
      return this.stockService.searchStocks(searchTerm.trim()).then((stockOptions => {
        this.set('stockOptions', stockOptions);
      }));
    }
  }).restartable() searchForStocks;

  @action
  async onStockSelected(selected) {
    this.set('selectedStock', selected);
    if (selected && selected.symbol) {
      const exists = this.watchedStocks.find(ws => ws.symbol === selected.symbol);
      if (!exists) {
        const { symbol, name } = selected;
        await this.stockService.addStockToWatcher(symbol).catch(() => {});
        this.watchedStocks.pushObject(new Stock({ symbol, name, price: null }));
        this._showToast(`Added ${symbol} to the stock watcher`, 'success-toast');
      }
    }
  }

  @action
  async removeStock(stock) {
    await this.stockService.removeStockFromWatcher(stock.symbol);
    this.watchedStocks.removeObject(stock);
    this._showToast(`Removed ${stock.symbol} from the stock watcher`, 'danger-toast');
  }

  _showToast(message, toastClass) {
    const activeToast = this.paperToaster.get('activeToast');
    if (activeToast) {
      this.paperToaster.cancelToast(activeToast);
    }
    this.paperToaster.show(message, {
      toastClass: toastClass,
      position: 'top right'
    });
  }
}

import { User } from 'clutch-coding-exercise-client/app/models/user';
import RSVP from 'rsvp';

function findAllUsers() {
  return new RSVP.Promise( (resolve) => {
    resolve([
      new User({ name: 'Andrew Ball', username: 'ajball' }),
      new User({ name: 'Shauna Robertson', username: 'slauna' }),
      new User({ name: 'Will Henry', username: 'will' }),
      new User({ name: 'Janine Henry', username: 'janine' })
    ])
  });
}
