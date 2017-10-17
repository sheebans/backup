import { moduleFor, test } from 'ember-qunit';
import Course from 'gooru-web/models/content/course';
import { formatDate, createFileNameToDownload } from 'gooru-web/utils/utils';
import Ember from 'ember';

moduleFor(
  'controller:student/performance',
  'Unit | Controller | student/performance',
  {
    integration: true
  }
);

test('prepareReportValues', function(assert) {
  let controller = this.subject();
  controller.set('course', Course.create({ title: 'Title Course' }));
  controller.set(
    'collectionPerformanceSummaryItems',
    Ember.A([
      Ember.Object.create({
        attempts: 1,
        collectionId: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        id: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        score: 0,
        status: 'complete',
        timeSpent: 552927
      })
    ])
  );
  controller.set(
    'collections',
    Ember.A([
      Ember.Object.create({
        format: 'assessment',
        id: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        title: 'Assessment Test'
      })
    ])
  );
  const date = formatDate(new Date(), 'MM-DD-YY');
  var fileNameString = createFileNameToDownload(
    `${controller.get('course.title')}`
  );
  let expectedFileName = `${fileNameString}_${date}`;

  let reportValues = controller.prepareReportValues();

  assert.equal(reportValues[0], expectedFileName, 'Incorrect file name');
  assert.equal(reportValues[1].fields.length, 4, 'Incorrect headers');
  assert.equal(reportValues[1].data.length, 2, 'Incorrect data');
});

test('download', function(assert) {
  let controller = this.subject();
  controller.set('course', Course.create({ title: 'Title Course' }));
  controller.set(
    'collectionPerformanceSummaryItems',
    Ember.A([
      Ember.Object.create({
        attempts: 1,
        collectionId: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        id: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        score: 0,
        status: 'complete',
        timeSpent: 552927
      })
    ])
  );
  controller.set(
    'collections',
    Ember.A([
      Ember.Object.create({
        format: 'assessment',
        id: 'ec2a9b12-93b1-4daf-9c35-3ee86547aada',
        title: 'Assessment Test'
      })
    ])
  );

  controller.set('downloadFile', function(fileName, data) {
    assert.ok(fileName, 'Should have file name');
    assert.equal(data.fields.length, 4, 'Should have 4 headers');
    assert.equal(data.data.length, 2, 'Should have 2 rows');
  });
  controller.send('download');
});
