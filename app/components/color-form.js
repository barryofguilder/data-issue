import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  store: service(),

  colors: null,
  storeColors: null,

  didInsertElement() {
    this._super(...arguments);

    this.loadColors.perform();
  },

  loadColors: task(function*() {
    let colors = yield this.store.loadAll('color');
    this.set('colors', colors.sortBy('name'));

    let storeColors = this.store.peekAll('color');
    this.set('storeColors', storeColors);
  }),

  saveColor: task(function*(e) {
    e.preventDefault();

    let newColor = this.store.createRecord('color', {
      name: this.colorName
    });

    yield newColor.save();

    this.colors.pushObject(newColor);

    this.set('colorName', null);
  })
});
