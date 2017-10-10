import Ember from 'ember';
import { formatDate as formatDateTo } from 'gooru-web/utils/utils';

/**
 * Give format to a date value
 */
export function formatDate(value /*, hash*/) {
  const date = value[0];
  const format = value.length > 1 ? value[1] : undefined;
  return formatDateTo(date, format);
}

export default Ember.Helper.helper(formatDate);
