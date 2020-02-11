import Service from '@ember/service';
import ajax from 'ember-fetch/ajax';
import { assign } from '@ember/polyfills';

export default class HttpClient extends Service {
  get(options) {
    return this.rsvpAjax(this.buildOpts(options, 'get'));
  }
  delete(options) {
    return this.rsvpAjax(this.buildOpts(options, 'delete'));
  }
  post(options) {
    return this.rsvpAjax(this.buildOpts(options, 'post'));
  }
  put(options) {
    return this.rsvpAjax(this.buildOpts(options, 'put'));
  }
  rsvpAjax(options) {
    return ajax(options.url, options);
  }
  buildOpts(options, method) {
    if (!options) {
      options = {};
    }
    return assign({}, options, {
      method: method,
      body: JSON.stringify(options.body)
    });
  }
}
