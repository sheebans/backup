import Ember from 'ember';
import QuizzesContext from 'quizzes-addon/models/context/context';

/**
 * Convenience mixin for accesing the quizzes context service
 *
 * @typedef {Object} ConfigurationMixin
 */
export default Ember.Mixin.create({
  /**
   * @property {Ember.Service} Service to create/get quizzes contexts
   */
  quizzesContextService: Ember.inject.service('quizzes/context'),

  /**
   * Create or get a quizzes context
   * @param {object} params All route params
   * @param {Collection} collection
   * @param {boolean} hasContext if class id and context mapping should be added
   */
  createContext: function(params, collection, hasContext) {
    let context = QuizzesContext.create({
      collectionId: collection.get('id'),
      title: collection.get('title'),
      isCollection: collection.get('isCollection')
    });
    if (hasContext) {
      context.setProperties({
        classId: params.classId,
        contextMapping: {
          courseId: collection.get('courseId') || params.courseId,
          unitId: collection.get('unitId') || params.unitId,
          lessonId: collection.get('lessonId') || params.lessonId,
          eventSource: params.source
        }
      });
    }
    return this.get('quizzesContextService').createContext(context);
  }
});
