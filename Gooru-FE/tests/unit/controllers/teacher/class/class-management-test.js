import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor(
  'controller:teacher/class/class-management',
  'Unit | Controller | teacher/class/class-management',
  {
    integration: true
  }
);

test('Delete Student', function(assert) {
  let component = this.subject({
    classService: {
      removeStudentFromClass: (classId, studentId) => {
        assert.equal(classId, 'class-id', 'Class id should match');
        assert.equal(studentId, 'student-id', 'Student id should match');
        return true;
      }
    },
    class: Ember.Object.create({
      id: 'class-id'
    })
  });

  let deleteFunction = function() {
    return true;
  };

  var expectedModel = Ember.Object.create({
    content: Ember.Object.create({ id: 'student-id' }),
    deleteMethod: () => deleteFunction,
    callback: {
      success: function() {
        return true;
      }
    }
  });

  let done = assert.async();
  component.set('actions.showModal', function(componentName, model) {
    assert.ok(model.deleteMethod(), 'Should have a delete function');
    assert.deepEqual(
      model.content,
      expectedModel.content,
      'Model content  should match'
    );
    assert.equal(
      componentName,
      'content.modals.gru-remove-student',
      'Component name should match'
    );
    done();
  });
  component.send('removeStudent', Ember.Object.create({ id: 'student-id' }));
});

test('Sort Students By First Name', function(assert) {
  let component = this.subject({
    class: Ember.Object.create({
      id: 'class-id',
      members: Ember.A([
        Ember.Object.create({
          firstName: 'Matt',
          lastName: 'Smith'
        }),
        Ember.Object.create({
          firstName: 'Anthony',
          lastName: 'Williams'
        }),
        Ember.Object.create({
          firstName: 'Cristin',
          lastName: 'Edwards'
        })
      ])
    })
  });

  //Sorting desc
  component.send('sortStudents', 'firstName');
  assert.equal(component.get('sortBy'), 'firstName', 'Incorrect Sort criteria');
  assert.equal(component.get('reverseSort'), true, 'Reverse should be false');
  assert.equal(
    component.get('sortedMembers')[0].get('firstName'),
    'Matt',
    'Incorrect first member'
  );
  assert.equal(
    component.get('sortedMembers')[2].get('firstName'),
    'Anthony',
    'Incorrect last member'
  );

  //Sorting asc
  component.send('sortStudents', 'firstName');
  assert.equal(component.get('sortBy'), 'firstName', 'Incorrect Sort criteria');
  assert.equal(component.get('reverseSort'), false, 'Reverse should be true');
  assert.equal(
    component.get('sortedMembers')[0].get('firstName'),
    'Anthony',
    'Incorrect first member'
  );
  assert.equal(
    component.get('sortedMembers')[2].get('firstName'),
    'Matt',
    'Incorrect last member'
  );
});

test('Sort Students By Last Name', function(assert) {
  let component = this.subject({
    class: Ember.Object.create({
      id: 'class-id',
      members: Ember.A([
        Ember.Object.create({
          firstName: 'Matt',
          lastName: 'Smith'
        }),
        Ember.Object.create({
          firstName: 'Anthony',
          lastName: 'Williams'
        }),
        Ember.Object.create({
          firstName: 'Cristin',
          lastName: 'Edwards'
        })
      ])
    })
  });

  //Sorting asc
  component.send('sortStudents', 'lastName');
  assert.equal(component.get('sortBy'), 'lastName', 'Incorrect Sort criteria');
  assert.equal(component.get('reverseSort'), false, 'Reverse should be false');
  assert.equal(
    component.get('sortedMembers')[0].get('lastName'),
    'Edwards',
    'Incorrect first member'
  );
  assert.equal(
    component.get('sortedMembers')[2].get('lastName'),
    'Williams',
    'Incorrect last member'
  );

  //Sorting desc
  component.send('sortStudents', 'lastName');
  assert.equal(component.get('sortBy'), 'lastName', 'Incorrect Sort criteria');
  assert.equal(component.get('reverseSort'), true, 'Reverse should be true');
  assert.equal(
    component.get('sortedMembers')[0].get('lastName'),
    'Williams',
    'Incorrect first member'
  );
  assert.equal(
    component.get('sortedMembers')[2].get('lastName'),
    'Edwards',
    'Incorrect last member'
  );
});
