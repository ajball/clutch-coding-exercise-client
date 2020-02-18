import Component from '@glimmer/component';
import { htmlSafe } from '@ember/string';
import { action } from '@ember/object';
import { addEventListener, debounceTask, runDisposables } from "ember-lifeline";

export default class StyledInputTextComponent extends Component {
  replacementTextEl; // reference modifier to replacement text element

  constructor() {
    super(...arguments);
    addEventListener(this, window, 'resize',
      () => debounceTask(this, 'setReplacementTextWidth', 200)
    );
  }

  willDestroy() {
    runDisposables(this);
  }

  get commentSegments() {
    const commentText = this.args.commentText;
    if (!commentText) {
      return [];
    }
    const mentionRegex = this.args.mentionPattern;
    const mentions = commentText.match(mentionRegex) || [];
    const plainText = commentText.split(mentionRegex);
    return plainText.flatMap( (plain, i) => {
      const segments = [ plain ];
      if (mentions[i]) {
        const mention = mentions[i];
        const className = this.isIncompleteMention(mention) ? 'incomplete' : '';
        const mentionHtml = this.generateMentionSafeHtml(mention, className);
        segments.push(mentionHtml);
      }
      return segments;
    });
  }
  // don't want to highlight mentions that aren't actually mentions
  isIncompleteMention(mention) {
    const existingMentions = this.args.existingMentions;
    return !!existingMentions && !existingMentions.includes(mention);
  }
  generateMentionSafeHtml(mention, className) {
    return htmlSafe(`<a class="mention ${className}" href="/u/${mention.substring(1)}" data-test-mention>${mention}</a>`);
  }

  // ===================== DOM helper functions =====================

  @action
  setStyledInputTextReference(element) {
    this.replacementTextEl = element;
  }
  setReplacementTextWidth() {
    if (this.replacementTextEl) {
      const widthFloat = parseFloat(this.textAreaWidth);
      this.replacementTextEl.style.width = `${widthFloat - 4}px`; // -4 to account for textarea horizontal padding
    }
  }
  get textAreaWidth() {
    return window.getComputedStyle(this.args.textAreaElement).width;
  }
}
