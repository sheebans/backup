import Ember from 'ember';
import { courseSectionsPrefix } from 'gooru-web/utils/utils';

/**
 * Show the Unit, Lesson, Assessment and Collection label correctly,
 * this is showing the letter and number prior the name.
 *
 * @example
 *
 * <span>{{course-sections-prefix title="My Unit" type="unit" index=1 complete=false}}</span>
 * @see /app/templates/components
 *
 * @param title {String}
 * @param index {Number}
 * @param type {String} "unit","lesson","collection" and "assessment"
 * @returns {String}
 */
export default Ember.Helper.extend({
  i18n: Ember.inject.service('i18n'),

  compute(params, { index, type, longName }) {
    let i18n = this.get('i18n');
    return courseSectionsPrefix(index, type, i18n, longName);
  }
});
