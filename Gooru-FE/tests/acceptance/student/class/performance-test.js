import { test } from 'qunit';
import moduleForAcceptance from 'gooru-web/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'gooru-web/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | student/class/performance', {
  beforeEach: function() {
    authenticateSession(this.application, {
      isAnonymous: false,
      token: 'class-course-map-token',
      user: {
        gooruUId: 'id-for-pochita'
      }
    });
  }
});

test('My report', function(assert) {
  visit(
    '/student/class/class-for-pochita-as-student/performance?collectionType=collection'
  );
  andThen(function() {
    assert.equal(
      currentURL(),
      '/student/class/class-for-pochita-as-student/performance?collectionType=collection&lessonId=637e7599-96de-4459-83cb-c72bd47ae4b0&unitId=first-unit-id'
    );
    let $collectionColumn = find(
      '.gru-performance-table thead tr th.collection'
    );
    assert.ok(
      $collectionColumn.text().includes('Collection'),
      'Incorrect column name, should say collection'
    );
    let $assessmentFilter = find('#assessment-content-type');
    click($assessmentFilter);
    andThen(function() {
      let $assessmentColumn = find(
        '.gru-performance-table thead tr th.assessment'
      );
      assert.ok(
        $assessmentColumn.text().includes('Assessment'),
        'Incorrect column name, should say assessment'
      );
    });
  });
});
