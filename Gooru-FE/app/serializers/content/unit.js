import Ember from 'ember';
import Lesson from 'gooru-web/models/content/lesson';
import Unit from 'gooru-web/models/content/unit';
import TaxonomySerializer from 'gooru-web/serializers/taxonomy/taxonomy';
import { TAXONOMY_LEVELS } from 'gooru-web/config/config';

/**
 * Serializer to support the Unit CRUD operations
 *
 * @typedef {Object} UnitSerializer
 */
export default Ember.Object.extend({
  /**
   * @property {TaxonomySerializer} taxonomySerializer
   */
  taxonomySerializer: null,

  init: function() {
    this._super(...arguments);
    this.set(
      'taxonomySerializer',
      TaxonomySerializer.create(Ember.getOwner(this).ownerInjection())
    );
  },

  /**
   * Serialize a Content/Unit object into a JSON representation required by the Create Unit endpoint
   *
   * @param unitModel - The unit model to be serialized
   * @returns {Object} JSON Object representation of the unit model
   */
  serializeCreateUnit: function(unitModel) {
    return this.serializeUpdateUnit(unitModel);
  },

  /**
   * Serialize a Content/Unit object into a JSON representation required by the Update Unit endpoint
   *
   * @param unitModel - The unit model to be serialized
   * @returns {Object} JSON Object representation of the unit model
   */
  serializeUpdateUnit: function(unitModel) {
    const serializer = this;
    return {
      title: unitModel.get('title'),
      big_ideas: unitModel.get('bigIdeas'),
      essential_questions: unitModel.get('essentialQuestions'),
      taxonomy: serializer
        .get('taxonomySerializer')
        .serializeTaxonomy(unitModel.get('taxonomy'))
    };
  },

  /**
   * Normalize a unit response
   * @param unitData - The endpoint response in JSON format
   * @returns {Content/Unit} unit model
   */
  normalizeUnit: function(payload) {
    var serializer = this;
    return Unit.create(Ember.getOwner(this).ownerInjection(), {
      children: (function() {
        var lessons = [];
        if (payload.lesson_summary) {
          lessons = payload.lesson_summary.map(function(lessonData) {
            return Lesson.create(Ember.getOwner(serializer).ownerInjection(), {
              assessmentCount: lessonData.assessment_count
                ? lessonData.assessment_count
                : 0,
              collectionCount: lessonData.collection_count
                ? lessonData.collection_count
                : 0,
              id: lessonData.lesson_id,
              sequence: lessonData.sequence_id,
              title: lessonData.title
            });
          });
        }
        return lessons;
      })(),
      bigIdeas: payload.big_ideas,
      essentialQuestions: payload.essential_questions,
      id: payload.unit_id,
      lessonCount:
        payload.lesson_summary && Ember.isArray(payload.lesson_summary)
          ? payload.lesson_summary.length
          : payload.lesson_count ? payload.lesson_count : 0,
      sequence: payload.sequence_id,
      title: payload.title,
      taxonomy: serializer
        .get('taxonomySerializer')
        .normalizeTaxonomyObject(payload.taxonomy, TAXONOMY_LEVELS.DOMAIN)
    });
  },

  normalizeUnits: function(payload) {
    const serializer = this;
    if (Ember.isArray(payload)) {
      return payload.map(function(unit) {
        return serializer.normalizeUnit(unit);
      });
    } else {
      return [];
    }
  },

  /**
   * Serialize reorder unit
   * @param {string[]} lessonIds
   */
  serializeReorderUnit: function(lessonIds) {
    const values = lessonIds.map(function(id, index) {
      return { id: id, sequence_id: index + 1 };
    });

    return {
      order: values
    };
  }
});
