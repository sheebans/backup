import Ember from 'ember';

export default Ember.Component.extend({
  // -------------------------------------------------------------------------
  // Dependencies

  // -------------------------------------------------------------------------
  // Attributes

  classNames: ['gru-metrics-sub-header'],

  // -------------------------------------------------------------------------
  // Actions
  actions: {
    sort: function(metric) {
      this.sortByMetric(metric);
      this.sendAction('onSortChange', metric);
    }
  },
  // -------------------------------------------------------------------------
  // Events

  didInsertElement() {
    this._super(...arguments);

    Ember.run.scheduleOnce('afterRender', this, function() {
      this.resetSortByMetrics();
    });
  },

  // -------------------------------------------------------------------------
  // Properties

  /**
   * @property {String|Function} onSortChange - event handler for when the selected sort is changed
   */
  onSortChange: null,
  /**
   * Default list of  metrics to be displayed by the component
   * @sorted {Boolean}
   * @isAsc {Boolean}
   * @visible {Boolean}
   * @constant {Array}
   */
  metrics: Ember.A([
    Ember.Object.create({
      value: 'score',
      sorted: false,
      isAsc: false,
      visible: false,
      index: 0
    }),
    Ember.Object.create({
      value: 'completion',
      sorted: false,
      isAsc: false,
      visible: false,
      index: 2
    }),
    Ember.Object.create({
      value: 'time-spent',
      sorted: false,
      isAsc: false,
      visible: false,
      index: 3
    })
  ]),

  /**
   * List of selected options from the data picker.
   * @property {Array}
   */
  dataPickerOptions: Ember.A(['score']),

  /**
   * Indicate if show Report column
   * @property {Boolean}
   */
  showReport: false,

  /**
   * List of  visible metrics to be displayed
   * @property {Array}
   */
  visibleMetrics: Ember.computed('dataPickerOptions.[]', function() {
    var dataPickerOptions = this.get('dataPickerOptions');

    var metrics = this.get('metrics');

    metrics.forEach(function(metric) {
      if (metric.get('value') !== 'student') {
        metric.set('visible', false);
      }
    });

    dataPickerOptions.forEach(function(option) {
      var metric = metrics.findBy('value', option);
      if (metric) {
        metric.set('visible', true);
      } else {
        Ember.Logger.warn(
          `Option in data picker: ${option} does not appear to be a valid metric`
        );
      }
    });

    return this.get('metrics');
  }),

  // -------------------------------------------------------------------------
  // Methods

  /**
   * Sort by specific metric
   * @metric {Ember Object}
   *
   */
  sortByMetric(metric) {
    var component = this;
    var metrics = component.get('metrics');
    metrics.forEach(function(option) {
      if (option.get('value') === metric.get('value')) {
        metric.set('sorted', true);
        component.changeTypeSort(metric);
      } else {
        option.set('isAsc', null);
        option.set('sorted', false);
      }
    });
  },

  /**
   * Change the type of sort
   * @metric {Ember Object}
   *
   */
  changeTypeSort(metric) {
    metric.set('isAsc', !metric.get('isAsc'));
  },

  resetSortByMetrics() {
    var component = this;
    var metrics = component.get('metrics');
    metrics.forEach(function(option) {
      option.set('isAsc', null);
      option.set('sorted', false);
    });
  }
});
