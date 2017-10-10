import Ember from 'ember';
import ModalMixin from '../mixins/modal';

export default Ember.Component.extend(ModalMixin, {
  /**
   * @property {object} Collection item
   */
  collection: null,

  /**
   * @property {number} quantityTooltips
   */
  quantityTooltips: null,

  /**
   * @property {string} tooltipStandards
   */
  tooltipStandards: '',

  /**
   * Selected all standards for each item
   * @property {array}
   */
  standards: null,

  /**
   * Selected collection results fillStandardsTooltipSection
   * @property {array}
   */
  fillStandardsTooltipSection: function() {
    var standards = this.get('standards');
    var itemsStandards = Ember.A();
    var tooltipsStand = '';
    var count = 0;
    var itemName = '';

    if (standards) {
      standards.forEach(function(item, index) {
        if (index < 2) {
          itemsStandards.addObject(item);
        } else {
          itemName = `<p>${item.get('code')}</p>`;
          count += 1;
          tooltipsStand = tooltipsStand + itemName;
        }
      });

      this.set('tooltipStandards', tooltipsStand);
      if (count > 0) {
        this.set('quantityTooltips', count);
      }
    }

    return itemsStandards;
  }.property()
});
