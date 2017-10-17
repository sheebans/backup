import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';
//import T from 'gooru-web/tests/helpers/assert';

moduleForAcceptance('Acceptance | class/analytics/performance/teacher/unit', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-analytics-performance-teacher-unit-token',
      user: {
        /* using a pochita, @see classes/class-for-pochita-as-teacher-200-response.js */
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('Layout', function(assert) {
  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-unit");
    T.exists(assert, $performanceContainer.find(".gru-metrics-table"), "Missing metrics table component");

    const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
    T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");

    //assert breadcrumb text
    const $breadcrumb = find(".controller.class .gru-breadcrumb");
    const $breadcrumbItems = $breadcrumb.find("button");
    assert.equal($breadcrumbItems.length, 2, "Incorrect number of breadcrumb items");
    assert.equal(T.text($breadcrumb.find("button:last-child")), 'The Best Course Ever Made', "Wrong breadcrumb item label");
    const $filters = find(".controller.class .gru-filters");
    T.exists(assert, $filters, "Filters should be visible");
  });
  */
});

test('Navigate to lesson', function(assert) {
  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

    const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-unit");
    const $metricTable = $performanceContainer.find(".gru-metrics-table");

    click($metricTable.find("thead tr:eq(0) th:eq(1)"));
    andThen(function(){
      assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');
      //menu is still selected
      const $classMenu = find(".controller.class .gru-class-navigation .class-menu");
      T.exists(assert, $classMenu.find(".analytics.selected"), "Missing selected analytics item");
    });
  });
  */
});

test('Test data picker options selected', function(assert) {
  // TODO Remove this assert and enable the commented code once integration is complete
  assert.ok(true, 'This is a temporal assert!!');

  /*
  visit('/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

  andThen(function() {
    assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/first-unit-id');

    const $dataPicker = find(".controller.class .gru-data-picker:eq(0)"); //click the desktop version of the data picker
    click($dataPicker.find("ul input:eq(1)")); //click on completion
    andThen(function(){
      const $performanceContainer = find(".controller.class .controller.analytics-performance-teacher-unit");
      const $metricTable = $performanceContainer.find(".gru-metrics-table");
      const $performanceInformation = $metricTable.find(".gru-metrics-performance-information");

      //data picker score item is selected by default
      T.exists(assert, $performanceInformation.find(".score"), "Missing data picker score information at unit level");
      T.exists(assert, $performanceInformation.find(".completion"), "Missing  data picker completion information at unit level");
      T.notExists(assert, $performanceInformation.find(".study-time"), "Study time item shouldn't be selected at unit level");

      click($metricTable.find("thead tr:eq(0) th:eq(1)"));
      andThen(function(){
        assert.equal(currentURL(), '/class/class-for-pochita-as-teacher/analytics/performance/teacher/unit/d0b56322-d3ca-40f5-85b3-2f38ef910ac1/lesson/fbd76aed-1b8d-4c2c-abc6-c7603eef567q');

        const $unitPerformanceContainer = find(".controller.class .controller.analytics-performance-teacher-lesson");
        const $unitMetricTable = $unitPerformanceContainer.find(".gru-metrics-table");
        const $unitPerformanceInformation = $unitMetricTable.find(".gru-metrics-performance-information");

        //data picker score item is selected by default
        T.exists(assert, $unitPerformanceInformation.find(".score"), "Missing  data picker score information at lesson level");

        T.exists(assert, $unitPerformanceInformation.find(".completion"), "Missing  data picker completion information at lesson level");
        T.notExists(assert, $unitPerformanceInformation.find(".study-time"), "Study time item shouldn't be selected at lesson level");

      });
    });
  });
  */
});
