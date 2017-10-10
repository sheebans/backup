import Ember from 'ember';
import ProtocolMixin from 'gooru-web/mixins/content/protocol';

export default Ember.Component.extend(ProtocolMixin, {
  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['content', 'rubric', 'gru-preview-url'],

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {Number} the calculated resource content height
   */
  calculatedResourceContentHeight: null,

  /**
   * @property {string} bind the height css style for the component
   */
  resourceHeight: Ember.computed('calculatedResourceContentHeight', function() {
    var height = this.get('calculatedResourceContentHeight');
    const heightString = height > 0 ? `${height}px` : '100%';
    return Ember.String.htmlSafe(`height: ${heightString}`);
  }),

  /**
   * @property {string} Resource URL
   */
  url: Ember.computed.alias('resource.url')
});
