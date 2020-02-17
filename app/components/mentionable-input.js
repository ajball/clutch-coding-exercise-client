import { A } from '@ember/array';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';

export default class MentionableInputComponent extends Component {
  @tracked
  alreadyMentioned = A([]);
  @tracked
  enableMentions = true;
  @tracked
  mentionableUsers = A([]);

  get value() {
    return this.args.value;
  }
  get label() {
    return this.args.label || '';
  }
  get specialCharacter() {
    return this.args.specialCharacter || '@';
  }
  get mentionPattern() {
    return this.args.mentionPattern || /\B@[a-z0-9_.]+/gi;
  }
  get showHint() {
    return !!this.args.showHint;
  }

  constructor() {
    super(...arguments);
    assert(
      '<MentionableInput> requires a bound `onChange` action which accepts the current text value as an argument',
      this.args.onChange && typeof this.args.onChange === 'function'
    );
    assert(
      '<MentionableInput> requires a bound `onMentionStarted` action which accepts the current mention as an argument',
      this.args.onMentionStarted && typeof this.args.onMentionStarted === 'function'
    );
    this.alreadyMentioned = A([]).concat(this.args.prePopulatedMentions || []);
  }

  addMentionToText(text, mention, username) {
    const cursorPosition = this.getCursorPosition();
    const startIndexOfMention = cursorPosition - mention.length;
    return replaceAt(
      text,
      startIndexOfMention,
      `@${username} `,
      mention.length + 1 // plus 1 because of extra space added to end of mention
    );
  }

  @action
  mentionUser(userToMention) {
    const updatedTextWithMention = this.addMentionToText(this.value, this.currentMention, userToMention.username);
    if (!this.alreadyMentioned.includes(`@${userToMention.username}`)) {
      this.alreadyMentioned.pushObject(`@${userToMention.username}`);
    }
    this.args.onChange(updatedTextWithMention);

    this.mentionableUsers = [];
    this.textAreaElement.focus();
  }
  @action
  closeMentionsDropdown() {
    this.mentionableUsers = [];
    this.enableMentions = false;
  }
  @action
  onTextChange(newValue) {
    this.enableMentions = true;
    // Only allow one trailing space to prevent nasty styling issues.
    // An unfortunate, but necessary (and fairly reasonable) compromise
    newValue = newValue === ' ' ? '' : newValue.replace(/\s\s+/g, ' ');
    this.args.onChange(newValue);
    this.args.onMentionStarted(this.currentMention);
  }
  //TODO: support arrow down/arrow up/enter in mentions dropdown
  @action
  keyDown(e) {
    if (e.key === 'Escape') {
      this.enableMentions = false;
      this.mentionableUsers = [];
    }
  }
  get currentMention() {
    const mentions = this.getMentions(this.value);
    return this.findCurrentMention(mentions);
  }
  getMentions(text) {
    text = text || '';
    return text.match(this.mentionPattern) || [];
  }
  findCurrentMention(mentions) {
    const cursorPosition = this.getCursorPosition();
    return mentions.find((mention) => {
      const regex = this.getSpecificMentionRegex(mention.substring(1));

      const indicesOfThisMention = [];
      while (regex.exec(this.value)){
        indicesOfThisMention.push(regex.lastIndex);
      }
      return indicesOfThisMention.includes(cursorPosition);
    });
  }
  getSpecificMentionRegex(username) {
    const regex = `@\\b${username}(?!\\S)`;
    return new RegExp(regex, 'g');
  }

  // ===================== DOM helper functions =====================

  // element reference modifier to the textarea paper element wrapper
  // Use textarea getter to get a reference to the actual textarea input element
  textAreaWrapperEl;
  @action
  setTextAreaWrapperElement(element) {
    this.textAreaWrapperEl = element;
  }
  @action
  setMentionsDropdownTopPosition(mentionsDropdownEl) {
    const height = this.getTextAreaHeight();
    const newTop = height.substr(0, height.length - 2); // - 2 to remove 'px'
    mentionsDropdownEl.style.top = (+newTop + 3) + 'px'; // + 2 because the dropdown looks a little better when it's off the textarea slightly
  }
  get textAreaElement() {
    return this.textAreaWrapperEl ? this.textAreaWrapperEl.querySelector('textarea') : {};
  }
  getCursorPosition() {
    return this.textAreaElement.selectionStart;
  }
  getTextAreaHeight() {
    return this.textAreaElement.style.height;
  }
}

function replaceAt(text, index, replacementText, replacedTextLength){
  return text.substr(0, index) + replacementText + text.substr(index + replacedTextLength);
}
