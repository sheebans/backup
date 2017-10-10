import Ember from 'ember';
import PrivateRouteMixin from 'gooru-web/mixins/private-route-mixin';

export default Ember.Route.extend(PrivateRouteMixin, {
  queryParams: {
    editing: {},
    editingContent: {
      refreshModel: true
    }
  },

  // -------------------------------------------------------------------------
  // Dependencies
  /**
   * @property {Session} current session
   */
  session: Ember.inject.service('session'),

  assessmentService: Ember.inject.service('api-sdk/assessment'),

  courseService: Ember.inject.service('api-sdk/course'),

  /**
   * @requires service:api-sdk/question
   */
  questionService: Ember.inject.service('api-sdk/question'),

  /**
   * @requires service:century-skill/century-skill
   */
  centurySkillService: Ember.inject.service('century-skill'),

  // -------------------------------------------------------------------------
  // Events

  // -------------------------------------------------------------------------
  // Methods

  model: function(params) {
    const route = this;
    return route
      .get('assessmentService')
      .readAssessment(params.assessmentId)
      .then(function(assessment) {
        const courseId = assessment.get('courseId');
        const isEditing = params.editing;
        const editingContent = params.editingContent
          ? params.editingContent
          : null;
        var course = null;

        if (courseId) {
          course = route.get('courseService').fetchById(courseId);
        }

        let questionPromiseList = assessment
          .get('children')
          .map(question =>
            route.get('questionService').readQuestion(question.get('id'))
          );

        return Ember.RSVP.hash({
          questions: Ember.RSVP.all(questionPromiseList),
          assessment: assessment,
          course: course,
          isEditing: !!isEditing,
          editingContent: editingContent
        });
      });
  },

  setupController(controller, model) {
    const route = this;
    // Since assessment is a collection with only questions, we'll reuse the same components
    // for collections (for example, see: /app/components/content/assessments/gru-assessment-edit.js)
    // and that is why the property 'collection' is being reused here, too.
    model.assessment.set('children', model.questions);
    controller.set('collection', model.assessment);
    controller.set('course', model.course);
    controller.set('isEditing', model.isEditing);
    controller.set('editingContent', model.editingContent);
    controller.set('isAssessment', true);

    route
      .get('centurySkillService')
      .findCenturySkills()
      .then(function(centurySkillsArray) {
        controller.set('centurySkills', centurySkillsArray.toArray());
      });

    if (model.isEditing || model.editingContent) {
      controller.set('tempCollection', model.assessment.copy());
    }
  }
});
