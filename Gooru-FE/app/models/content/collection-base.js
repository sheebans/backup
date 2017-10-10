import Ember from 'ember';
import Resource from 'gooru-web/models/content/resource';
import Question from 'gooru-web/models/content/question';
import PlayerCollection from 'gooru-web/models/collection/collection';
import { TAXONOMY_CATEGORIES } from 'gooru-web/config/config';

/**
 * Object with all of the properties in a collection
 * These properties are also part of assessments
 *
 * @typedef {Object} CollectionBase
 * @see Collection
 * @see Assessment
 */
export default (function() {
  return {
    /**
     * @property {string}
     */
    id: null,

    /**
     * @property {string} pathId only used for suggestions
     */
    pathId: null,

    /**
     * @property {string} indicates the sub-type if it has one
     */
    collectionSubType: null,

    /**
     * @property {string} format - assessment/collection
     */
    format: null,

    /**
     * @property {String} category - Category the course belongs to
     */
    category: Ember.computed('subject', function() {
      var category = TAXONOMY_CATEGORIES[0].value; // Default to K12 category
      if (this.get('subject')) {
        let keys = this.get('subject').split('.');
        if (keys.length > 1) {
          for (var i = TAXONOMY_CATEGORIES.length - 1; i >= 0; i--) {
            // The second part of the subjectId represents the category
            if (keys[1] === TAXONOMY_CATEGORIES[i].apiCode) {
              category = TAXONOMY_CATEGORIES[i].value;
              break;
            }
          }
        }
      }
      return category;
    }),

    /**
     * @property {Ember.Array} children - List of collections/assessments
     */
    children: Ember.A(),

    /**
     * @property {Ember.Array} children - List of collections/assessments
     */
    computedResourceCount: Ember.computed('children.[]', function() {
      return this.get('children').filter(function(item) {
        return item instanceof Resource;
      }).length;
    }),

    /**
     * @property {Ember.Array} children - List of collections/assessments
     */
    computedQuestionCount: Ember.computed('children.[]', function() {
      return this.get('children').filter(function(item) {
        return item instanceof Question;
      }).length;
    }),

    /**
     * @property {String} subject
     */
    subject: null,

    /**
     * @property {String} learningObjectives
     */
    learningObjectives: null,

    /**
     * @property {String} title
     */
    title: null,

    /**
     * @property {string} published|unpublished|requested
     */
    publishStatus: null,

    /**
     * @property {Boolean} isPublished
     */
    isPublished: Ember.computed.equal('publishStatus', 'published'),

    /**
     * @property {Boolean} isVisibleOnProfile
     */
    isVisibleOnProfile: false,

    /**
     * @property {Number[]} Array with the audience ids
     */
    audience: [],

    /**
     * @property {Number[]} Array with the depthOfknowledge ids
     */
    depthOfknowledge: [],

    /**
     * @property {TaxonomyTagData[]} standards - The collection standards information
     */
    standards: [],

    /**
     * @property {Number[]} Array with the centurySkills ids
     */
    centurySkills: [],

    /**
     * @property {number} resourceCount - The number of resources in the collection
     */
    resourceCount: 0,

    /**
     * @property {number} questionCount - The number of questions in the collection
     */
    questionCount: 0,

    /**
     * @property {number} remixCount - The number of remixes made in the collection
     */
    remixCount: 0,

    /**
     * @property {string} thumbnailUrl - The thumbnail url
     */
    thumbnailUrl: null,

    /**
     * @property {string} course - The name of the course which this collection belongs to
     */
    course: null,

    /**
     * @property {number} courseId
     */
    courseId: null,

    /**
     * @property {number} unitId
     */
    unitId: null,

    /**
     * @property {number} lessonId
     */
    lessonId: null,

    /**
     * @property {Content/User} owner - The resource owner information
     */
    owner: null,

    /**
     * @property {Content/User} owner - The resource creator information
     */
    creator: null,

    /**
     * When the owner and the creator are the same
     * @property {boolean}
     */
    sameOwnerAndCreator: Ember.computed('owner.id', 'creator.id', function() {
      return (
        !this.get('creator.id') ||
        this.get('owner.id') === this.get('creator.id')
      );
    }),

    /**
     * @property {string} assessment|collection
     */
    collectionType: null,

    /**
     * @property {boolean}
     */
    isCollection: Ember.computed.equal('collectionType', 'collection'),

    /**
     * @property {boolean}
     */
    isAssessment: Ember.computed.not('isCollection'),

    /**
     * @property {Ember.Array} resources - An children alias property
     */
    resources: Ember.computed.alias('children'),

    /**
     * Return a copy of the collection
     *
     * @function
     * @return {Collection|Assessment}
     */
    copy: function() {
      var properties = [];
      var enumerableKeys = Object.keys(this);

      for (let i = 0; i < enumerableKeys.length; i++) {
        let key = enumerableKeys[i];
        let value = Ember.typeOf(this.get(key));
        if (value === 'string' || value === 'number' || value === 'boolean') {
          properties.push(key);
        }
      }

      // Copy the course data
      properties = this.getProperties(properties);

      var audience = this.get('audience');
      var depthOfknowledge = this.get('depthOfknowledge');
      var standards = this.get('standards');
      var centurySkills = this.get('centurySkills');

      // Copy array values
      properties.audience = audience.slice(0);
      properties.depthOfknowledge = depthOfknowledge.slice(0);
      properties.standards = standards.slice(0);
      properties.centurySkills = centurySkills.slice(0);

      properties.children = this.get('children');

      return this.get('constructor').create(
        Ember.getOwner(this).ownerInjection(),
        properties
      );
    },

    /**
     * Copy a list of property values from another model to override the current ones
     *
     * @function
     * @param {Collection|Assessment} model
     * @param {String[]} propertyList
     * @return {null}
     */
    merge: function(model, propertyList = []) {
      var properties = model.getProperties(propertyList);
      this.setProperties(properties);
    },

    toPlayerCollection: function() {
      const model = this;
      return PlayerCollection.create({
        id: model.get('id'),
        collectionType: model.get('collectionType'),
        title: model.get('title'),
        remixes: model.get('remixCount'),
        views: null, //TODO missing
        imageUrl: model.get('thumbnailUrl'),
        url: null, //TODO missing
        author: model.get('owner.displayName'),
        authorId: model.get('owner.id'),
        remixedBy: Ember.A(), //TODO missing
        course: model.get('course'),
        courseId: model.get('courseId'),
        avatarUrl: model.get('owner.avatarUrl'), //TODO missing
        profilePageUrl: null, //TODO missing
        description: model.get('description'),
        resourceCount: model.get('resourceCount'),
        questionCount: model.get('questionCount'),
        hasTeam: null, //TODO missing
        visibility: null, //TODO missing
        libraries: Ember.A(), //TODO missing
        resources: model.get('children').map(function(child) {
          return child.toPlayerResource();
        }),
        standards: model.get('standards')
      });
    },

    /**
     * Sets the subject of the course
     *
     * @function
     * @param {TaxonomyRoot} taxonomySubject
     */
    setTaxonomySubject: function(taxonomySubject) {
      if (!(this.get('isDestroyed') || this.get('isDestroying'))) {
        this.set('subject', taxonomySubject ? taxonomySubject.get('id') : null);
      }
    }
  };
})();
