import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import T from 'gooru-web/tests/helpers/assert';
import Ember from 'ember';
import wait from 'ember-test-helpers/wait';

moduleForComponent(
  '/class/analytics/performance/teacher/gru-metrics-table',
  'Integration | Component | /class/analytics/performance/teacher/gru-metrics-table',
  {
    integration: true,
    beforeEach: function() {
      this.container.lookup('service:i18n').set('locale', 'en');
    }
  }
);

test('Metrics Table Layout', function(assert) {
  assert.expect(11);

  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Unit A1'
    })
  ]);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 10,
        completionDone: 13,
        completionTotal: 50,
        timeSpent: 3600
      })
    }),
    Ember.Object.create({
      user: 'Jennifer Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 10,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600
        }),
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 10,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600
        })
      ])
    }),
    Ember.Object.create({
      user: 'Jeffrey Bermudez',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 50,
          completionDone: 11,
          completionTotal: 40,
          timeSpent: 2600
        }),
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 50,
          completionDone: 11,
          completionTotal: 40,
          timeSpent: 2600
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('selectedOptions', dataPickerOptionsMock);
  this.set('headerType', 'unit');

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers performanceDataMatrix=performanceDataMatrix dataPickerOptions=selectedOptions headerType=headerType}}`
  );

  const $component = this.$(); //component dom element
  const $metricsTable = $component.find('.gru-metrics-table');

  T.exists(assert, $metricsTable, 'Missing teacher metrics table');

  const $tableWrapper = $metricsTable.find('.metrics-table-wrapper');
  T.exists(assert, $tableWrapper, 'Missing table wrapper');

  const $table = $metricsTable.find('.table');
  T.exists(assert, $table, 'Missing table');

  const $thead = $table.find('thead');
  T.exists(assert, $thead, 'Missing thead of the table');

  const $tbody = $table.find('tbody');
  T.exists(assert, $tbody, 'Missing tbody of the table');

  const $subheader = $thead.find('.gru-metrics-sub-header');
  T.exists(assert, $subheader, 'Missing sub-header component');

  const $performanceInformation = $metricsTable.find(
    '.gru-metrics-performance-information'
  );
  T.exists(
    assert,
    $performanceInformation,
    'Missing performance information component'
  );

  assert.equal(
    $thead.find('tr:first-child th').length,
    2,
    'The thead should have only 2 headers'
  );
  assert.equal(
    T.text($thead.find('tr:first-child th:eq(1) .prefix')),
    'U1',
    'Wrong prefix header'
  );
  assert.equal(
    $tbody.find('th.user-info').length,
    2,
    'The tbody should have only 2 user headers'
  );

  //no-content text shouln't be visible because the table has data
  const $noContentText = $metricsTable.find('.no-content');
  T.notExists(
    assert,
    $noContentText,
    'The no-content text should not be visible'
  );
});

test('Sort by student name', function(assert) {
  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Unit A1'
    })
  ]);

  const metrics = Ember.A([
    Ember.Object.create({
      value: 'student',
      sorted: false,
      isAsc: false,
      visible: true,
      index: -1
    })
  ]);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 44,
        completionDone: 15,
        completionTotal: 50,
        timeSpent: '20m 45s'
      })
    }),
    Ember.Object.create({
      user: 'Jeffrey Bermudez',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 19,
          completionDone: 12,
          completionTotal: 20,
          timeSpent: '1h 41m',
          studyTime: 6062473.5
        })
      ])
    }),
    Ember.Object.create({
      user: 'Benjamin Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 100,
          completionDone: 2,
          completionTotal: 15,
          timeSpent: '1m 45s',
          studyTime: 105003
        })
      ])
    }),
    Ember.Object.create({
      user: 'Ana Castro',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 0,
          completionDone: 0,
          completionTotal: 0,
          timeSpent: '',
          studyTime: 0
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('metrics', metrics);
  this.set('headerType', 'unit');

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers performanceDataMatrix=performanceDataMatrix metrics=metrics headerType=headerType}}`
  );

  const $component = this.$(); //component dom element
  const $metricsTable = $component.find('.gru-metrics-table');
  const $thead = $metricsTable.find('thead');
  const $subHeader = $thead.find('.gru-metrics-sub-header:eq(0)'); //students column
  const $tbody = $metricsTable.find('tbody');

  $subHeader.find('a.student').click(); //descending student sort, because is sort ascending by default

  return wait().then(function() {
    assert.equal(
      T.text($tbody.find('tr:first-child th.header span')),
      'Jeffrey Bermudez',
      'First user should be Jeffrey Bermudez'
    );
    $subHeader.find('a.student').click(); //ascending student sort

    return wait().then(function() {
      assert.equal(
        T.text($tbody.find('tr:first-child th.header span')),
        'Ana Castro',
        'First user should be Ana Castro'
      );
    });
  });
});

test('Sort by score Metric', function(assert) {
  assert.expect(2);
  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Unit A1'
    })
  ]);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 44,
        completionDone: 15,
        completionTotal: 50,
        timeSpent: '20m 45s'
      })
    }),
    Ember.Object.create({
      user: 'Jeffrey Bermudez',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 19,
          completionDone: 12,
          completionTotal: 20,
          timeSpent: '1h 41m',
          studyTime: 6062473.5
        })
      ])
    }),
    Ember.Object.create({
      user: 'Jennifer Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 100,
          completionDone: 2,
          completionTotal: 15,
          timeSpent: '1m 45s',
          studyTime: 105003
        })
      ])
    }),
    Ember.Object.create({
      user: 'Ana Castro',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 0,
          completionDone: 0,
          completionTotal: 0,
          timeSpent: '',
          studyTime: 0
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('selectedOptions', dataPickerOptionsMock);
  this.set('headerType', 'unit');

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers performanceDataMatrix=performanceDataMatrix dataPickerOptions=selectedOptions headerType=headerType}}`
  );

  const $component = this.$(); //component dom element
  const $metricsTable = $component.find('.gru-metrics-table');
  const $thead = $metricsTable.find('thead');
  const $subHeader = $thead.find('.gru-metrics-sub-header:eq(1)'); //average column
  const $tbody = $metricsTable.find('tbody');

  $subHeader.find('a.score').click(); //select score ascending sort

  return wait().then(function() {
    assert.equal(
      T.text($tbody.find('tr:first-child th.header span')),
      'Ana Castro',
      'First user should be Ana Castro'
    );
    $subHeader.find('a.score').click(); //select score descending sort

    return wait().then(function() {
      assert.equal(
        T.text($tbody.find('tr:first-child th.header span')),
        'Jennifer Ajoy',
        'First user should be Jennifer Ajoy'
      );
    });
  });
});

test('Sort by Completion Metric', function(assert) {
  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Unit A1'
    })
  ]);

  const dataPickerOptionsMock = Ember.A(['score', 'completion']);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 44,
        completionDone: 15,
        completionTotal: 50,
        timeSpent: '20m 45s'
      })
    }),
    Ember.Object.create({
      user: 'Jeffrey Bermudez',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 19,
          completionDone: 12,
          completionTotal: 20,
          timeSpent: '1h 41m',
          studyTime: 6062473.5
        })
      ])
    }),
    Ember.Object.create({
      user: 'Jennifer Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 100,
          completionDone: 2,
          completionTotal: 15,
          timeSpent: '1m 45s',
          studyTime: 105003
        })
      ])
    }),
    Ember.Object.create({
      user: 'Ana Castro',
      performanceData: Ember.A([
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 0,
          completionDone: 0,
          completionTotal: 0,
          timeSpent: '',
          studyTime: 0
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('selectedOptions', dataPickerOptionsMock);
  this.set('headerType', 'unit');

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers performanceDataMatrix=performanceDataMatrix dataPickerOptions=selectedOptions headerType=headerType}}`
  );

  const $component = this.$(); //component dom element
  const $metricsTable = $component.find('.gru-metrics-table');
  const $thead = $metricsTable.find('thead');
  const $subHeader = $thead.find('.gru-metrics-sub-header:eq(1)'); //average column
  const $tbody = $metricsTable.find('tbody');

  $subHeader.find('a.completion').click(); //select completion ascending sort

  return wait().then(function() {
    assert.equal(
      T.text($tbody.find('tr:first-child th.header span')),
      'Ana Castro',
      'First user should be Ana Castro'
    );
    $subHeader.find('a.completion').click(); //select completion descending sort

    return wait().then(function() {
      assert.equal(
        T.text($tbody.find('tr:first-child th.header span')),
        'Jeffrey Bermudez',
        'First user should be Jennifer Ajoy'
      );
    });
  });
});
test('Metrics Table Header Collection', function(assert) {
  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Collection C1',
      collectionType: 'collection'
    })
  ]);

  const dataPickerOptionsMock = Ember.A(['completion']);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 10,
        completionDone: 13,
        completionTotal: 50,
        timeSpent: 3600
      })
    }),
    Ember.Object.create({
      user: 'Jennifer Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 10,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600
        }),
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 10,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('selectedOptions', dataPickerOptionsMock);
  this.set('headerType', 'collection');

  this.on('externalAction', function() {
    assert.ok(false, 'This should not be called');
  });

  this.render(
    hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers performanceDataMatrix=performanceDataMatrix dataPickerOptions=selectedOptions headerType=headerType onNavigation='externalAction'}}`
  );

  const $component = this.$(); //component dom element
  const $metricsTable = $component.find('.gru-metrics-table');

  T.exists(assert, $metricsTable, 'Missing teacher metrics table');

  const $collectionHeader = $metricsTable.find('.table .headers .header:eq(1)');
  $collectionHeader.click();
});

test('Metrics Table actions', function(assert) {
  assert.expect(4);

  const headersMock = Ember.A([
    Ember.Object.create({
      id: '82168746-a4af-48aa-9975-01f6434cd806',
      title: 'Assessment A1'
    })
  ]);

  const dataPickerOptionsMock = Ember.A(['completion', 'score']);

  const classPerformanceDataMock = Ember.A([
    Ember.Object.create({
      performanceData: Ember.Object.create({
        score: 10,
        completionDone: 13,
        completionTotal: 50,
        timeSpent: 3600
      })
    }),
    Ember.Object.create({
      user: 'Jennifer Ajoy',
      performanceData: Ember.A([
        Ember.Object.create({
          score: 11,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600
        }),
        Ember.Object.create({
          id: '82168746-a4af-48aa-9975-01f6434cd806',
          score: 12,
          completionDone: 13,
          completionTotal: 50,
          timeSpent: 3600,
          hasStarted: true
        })
      ])
    })
  ]);

  this.set('headers', headersMock);
  this.set('performanceDataMatrix', classPerformanceDataMock);
  this.set('selectedOptions', dataPickerOptionsMock);
  this.set('headerType', 'collection');

  this.on('navigationAction', function() {
    assert.ok(true, 'This should be called');
  });

  this.on('clickReport', function(performance, userPerformance) {
    assert.equal(performance.get('score'), 12, 'Wrong score');
    assert.ok(userPerformance, 'Missing userPerformance');
  });

  this
    .render(hbs`{{class/analytics/performance/teacher/gru-metrics-table headers=headers
      performanceDataMatrix=performanceDataMatrix dataPickerOptions=selectedOptions
      onClickReport='clickReport'
      headerType=headerType onNavigation='navigationAction'}}`);

  const $component = this.$();
  const $metricsTable = $component.find('.gru-metrics-table');

  T.exists(assert, $metricsTable, 'Missing teacher metrics table');

  const $collectionHeader = $metricsTable.find('.table .headers .header:eq(1)');
  $collectionHeader.click();
  return wait().then(function() {
    const $report = $metricsTable.find(
      'tbody  .gru-metrics-performance-information:eq(1) .report span'
    );
    $report.click();
  });
});
