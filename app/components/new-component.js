import Component from '@glimmer/component';
import { tracked } from "@glimmer/tracking";
import { action } from '@ember/object';

export default class BazNewComponentComponent extends Component {
  @tracked first;
  @tracked last;

  get fullName() {
    return `${this.first} ${this.last}`;
  }

  constructor() {
    super(...arguments);
    this.first = 'Andrew';
    this.last = 'Ball';
  }

  @action
  handleClick() {
    this.first = this.first === 'Bob' ? 'Andrew' : 'Bob';
  }
}
