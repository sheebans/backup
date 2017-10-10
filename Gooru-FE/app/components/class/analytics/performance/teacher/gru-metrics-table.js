import Ember from 'ember';
import { alphabeticalStringSort, numberSort } from 'gooru-web/utils/utils';

/**
 * Teacher Metrics Table
 *
 * Component responsible for showing the Metrics Table in the teacher page.
 *
 * @module
 * @augments ember/Component
 */
export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-metrics-table'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    sortChange: function(metric) {
      var metricsIndex = metric.get('index');
      var sortCriteria = this.get('sortCriteria');
      var newSortCriteria = {
        metricsIndex: metricsIndex
      };

      this.set('sortByMetric', metric.get('value'));

      if (sortCriteria.metricsIndex === metricsIndex) {
        // Reverse the sort order if the same column has been selected
        newSortCriteria.order = sortCriteria.order * -1;
        this.set('sortCriteria', newSortCriteria);
      } else {
        newSortCriteria.order = this.get('defaultSortOrder');
        this.set('sortCriteria', newSortCriteria);
      }
    },

    /**
       * navigate to units/lessons
       */
    navigate: function(headerId) {
      this.sendAction('onNavigation', headerId);
    },

    /**
       * When the user clicks at the report
       */
    clickReport: function(performance, userPerformance) {
      if (this.get('onClickReport')) {
        this.sendAction('onClickReport', performance, userPerformance);
      }
    }
  },
  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', this, function() {
      this.set('sortCriteria', this.initSortCriteria());
    });
  },

  didRender() {
    this._super(...arguments);
    this.$('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
  },

  // -------------------------------------------------------------------------
  // Properties
  /**
   * @prop { Object } sortCriteria - Object with information on how the data should be sorted
   * - metricsIndex: {number} - Index of metrics option
   * - order: {number} - Ascending or descending order
   */
  sortCriteria: null,

  /**
   * The header titles
   * @property {Headers[]}
   */

  headers: null,

  /**
   * The headerType titles
   * @property {String}
   */
  headerType: null,

  /**
   * The performanceDataMatrix
   * @property {performanceDataMatrix[]}
   */

  performanceDataMatrix: null,

  /**
   * The average headers of the Data Matrix
   * @property {averageHeaders[]}
   */
  averageHeaders: Ember.computed('performanceDataMatrix.length', function() {
    const averageHeaders = this.get('performanceDataMatrix').objectAt(0);
    return averageHeaders;
  }),

  /**
   * The user performanceData
   * @property {performanceData[]}
   */
  performanceData: Ember.computed(
    'performanceDataMatrix.length',
    'sortCriteria',
    function() {
      const performanceData = this.get('performanceDataMatrix').slice(1);
      const sortCriteria = this.get('sortCriteria');

      if (sortCriteria) {
        let metricsIndex = sortCriteria.metricsIndex;
        let sortedData = performanceData;

        //alphabeticalStringSort
        if (metricsIndex === -1) {
          sortedData.sort(function(a, b) {
            return alphabeticalStringSort(a.user, b.user) * sortCriteria.order;
          });
        } else if (metricsIndex >= 0) {
          let sortByMetric = this.get('sortByMetric');
          sortedData.sort(function(a, b) {
            if (sortByMetric === 'score') {
              return (
                numberSort(
                  a.performanceData[0].score,
                  b.performanceData[0].score
                ) * sortCriteria.order
              );
            } else if (sortByMetric === 'completion') {
              return (
                numberSort(
                  a.performanceData[0].completionDone,
                  b.performanceData[0].completionDone
                ) * sortCriteria.order
              );
            } else {
              return (
                numberSort(
                  a.performanceData[0].studyTime,
                  b.performanceData[0].studyTime
                ) * sortCriteria.order
              );
            }
          });
        }
        return sortedData;
      } else {
        return performanceData;
      }
    }
  ),

  /**
   * List of  metrics to be displayed by the sub-header component for the average
   * @sorted {Boolean}
   * @isAsc {Boolean}
   * @constant {Array}
   */
  averageMetrics: Ember.A([
    Ember.Object.create({
      value: 'student',
      sorted: false,
      isAsc: false,
      visible: true,
      index: -1
    })
  ]),

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  dataPickerOptions: Ember.A(['score']),

  /**
   * Indicate if the table is on collection level
   * @property {Boolean}
   */
  isCollection: Ember.computed.equal('headerType', 'collection'),

  /*
   * @prop { Number } defaultSortOrder - Default sort order for values in columns (1 = ascending; -1 = descending)
   */
  defaultSortOrder: 1,

  /**
   * metric sent by the sort function
   */
  sortByMetric: null,

  /**
   * Action name when the user clicks at any score box
   * @property {string}
   */
  onClickReport: null,

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Initialize the table's sort criteria
   * @return {Object}
   */
  initSortCriteria: function() {
    return {
      metricsIndex: -1,
      order: this.get('defaultSortOrder')
    };
  }
});
