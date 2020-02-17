import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class MentionOptionsComponent extends Component {
  constructor() {
    super(...arguments);
  }

  // ===================== DOM helper functions =====================

  @action
  setMentionsDropdownTopPosition(mentionsDropdownEl) {
    const height = this.getTextAreaHeight();
    const newTop = height.substr(0, height.length - 2); // - 2 to remove 'px'
    mentionsDropdownEl.style.top = (+newTop + 2) + 'px'; // + 2 because the dropdown looks a little better when it's off the textarea slightly
  }
  getTextAreaHeight() {
    return this.args.textAreaElement.style.height;
  }
}
