import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent(
  'content/modals/gru-add-rubric-to-question',
  'Unit | Component | content/modals/ gru add rubric to question',
  {
    integration: false
  }
);

test('selectRubric', function(assert) {
  let component = this.subject({});
  assert.notOk(
    component.get('selectedRubric'),
    'Wrong value of non selected rubric'
  );

  component.send('selectRubric', 'rubric');
  assert.equal(
    component.get('selectedRubric'),
    'rubric',
    'Incorrect selected rubric'
  );
});

test('addTo', function(assert) {
  var done = assert.async();
  let component = this.subject({
    rubricService: {
      associateRubricToQuestion: (rubricId, questionId) => {
        assert.equal(rubricId, 'rubric-id', 'Rubric id should match');
        assert.equal(questionId, 'question-id', 'Question id should match');
        return Ember.RSVP.resolve({});
      }
    },
    questionService: {
      readQuestion: questionId => {
        assert.equal(questionId, 'question-id', 'Question id should match');
        return Ember.RSVP.resolve({});
      }
    },
    model: {
      questionId: 'question-id',
      callback: {
        success: () => {
          assert.ok(true, 'Callback should be call');
          done();
        }
      }
    },
    selectedRubric: Ember.Object.create({ id: 'rubric-id' })
  });

  component.send('addTo');
});
