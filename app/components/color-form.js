import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { sort } from '@ember/object/computed';

export default Component.extend({
  store: service(),

  colors: null,
  colorSort: Object.freeze(['name']),
  sortedColors: sort('colors', 'colorSort'),
  storeColors: null,

  didInsertElement() {
    this._super(...arguments);

    this.loadColors.perform();
  },

  loadColors: task(function*() {
    let colors = yield this.store.loadAll('color');
    this.set('colors', colors);

    let storeColors = this.store.peekAll('color');
    this.set('storeColors', storeColors);
  }),

  saveColor: task(function*(e) {
    e.preventDefault();

    let newColor = this.store.createRecord('color', {
      name: this.colorName
    });

    yield newColor.save();

    // Now that I'm not pushing the color to the array, the UI doesn't update.
    //this.colors.pushObject(newColor);

    this.set('colorName', null);
  })
});
