import Ember from 'ember';
import {
  addProtocolIfNecessary,
  checkIfIsGoogleDoc,
  checkDomains
} from 'gooru-web/utils/utils';
import ConfigurationMixin from 'gooru-web/mixins/configuration';

export default Ember.Component.extend(ConfigurationMixin, {
  // -------------------------------------------------------------------------
  // Dependencies
  session: Ember.inject.service('session'),

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-pdf-resource'],

  // -------------------------------------------------------------------------
  // Actions

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @property {Resource} the resource
   */
  resource: null,

  pdfURL: Ember.computed('resource.assetUrl', function() {
    const configuration = this.get('configurationService.configuration');
    const cdnUrl = this.get('session.cdnUrls.content');
    const resourceUrl = this.get('resource.assetUrl');
    const assetUrl = addProtocolIfNecessary(
      resourceUrl,
      checkDomains(resourceUrl, cdnUrl)
    );

    if (
      configuration.get('player.resources.pdf.googleDriveEnable') &&
      !checkIfIsGoogleDoc(assetUrl)
    ) {
      return `${configuration.get('player.resources.pdf.googleDriveUrl') +
        assetUrl}&embedded=true`;
    } else {
      return assetUrl;
    }
  }),

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
  })

  // -------------------------------------------------------------------------
  // Observers

  // -------------------------------------------------------------------------
  // Methods
});
