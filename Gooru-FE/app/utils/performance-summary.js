import Ember from 'ember';
import ActivityPerformanceSummary from 'gooru-web/models/performance/activity-performance-summary';
import CollectionPerformanceSummary from 'gooru-web/models/performance/collection-performance-summary';
import { average, sumAll } from 'gooru-web/utils/math';

/**
 * Aggregates all users collection activity summary items
 * @param {CollectionPerformanceSummary[]} collectionPerformanceSummaryItems
 * @returns {CollectionPerformanceSummary}
 */
export function aggregateCollectionPerformanceSummaryItems(
  collectionPerformanceSummaryItems
) {
  const timeSpentValues = collectionPerformanceSummaryItems
    .map(function(item) {
      var timeSpent = item.get('timeSpent');
      return timeSpent;
    })
    .filter(function(timeSpent) {
      return timeSpent !== undefined; // throw away any instances which are not undefined
    });

  const scoreValues = collectionPerformanceSummaryItems
    .map(function(item) {
      var score = item.get('score');
      return score;
    })
    .filter(function(score) {
      return score !== undefined; // throw away any instances which are not undefined
    });

  const attempts = collectionPerformanceSummaryItems
    .map(function(item) {
      var attempts = item.get('attempts');
      return attempts;
    })
    .filter(function(attempts) {
      return attempts !== undefined; // throw away any instances which are not undefined
    });

  const collectionId = collectionPerformanceSummaryItems[0].get('collectionId');
  return CollectionPerformanceSummary.create({
    collectionId: collectionId,
    timeSpent: timeSpentValues.length > 0 ? sumAll(timeSpentValues) : null,
    score: scoreValues.length > 0 ? average(scoreValues) : null,
    attempts: attempts.length > 0 ? sumAll(attempts) : null
  });
}

/**
 * Aggregates all users class activity summary items
 * @param {Ember.A|ActivityPerformanceSummary[]} activityPerformanceSummaryItems
 * @returns {ActivityPerformanceSummary[]}
 */
export function aggregateClassActivityPerformanceSummaryItems(
  activityPerformanceSummaryItems
) {
  const aggregatedClassActivities = Ember.A([]);
  const dates = activityPerformanceSummaryItems
    .map(a => a.get('date').getTime())
    .uniq();
  dates.forEach(function(date) {
    //gets all user activities within the same date
    const activitiesPerDate = activityPerformanceSummaryItems.filter(
      a => a.get('date').getTime() === date
    );
    const dateCollectionPerformanceSummaryItems = activitiesPerDate.mapBy(
      'collectionPerformanceSummary'
    );

    const collectionIds = dateCollectionPerformanceSummaryItems
      .mapBy('collectionId')
      .uniq();
    collectionIds.forEach(function(collectionId) {
      //gets all user performance items for the same collection
      const collectionPerformanceSummaryItems = dateCollectionPerformanceSummaryItems.filterBy(
        'collectionId',
        collectionId
      );
      const aggregatedActivity = ActivityPerformanceSummary.create({
        date: new Date(date),
        collectionPerformanceSummary: aggregateCollectionPerformanceSummaryItems(
          collectionPerformanceSummaryItems
        )
      });
      aggregatedClassActivities.pushObject(aggregatedActivity);
    });
  });
  return aggregatedClassActivities;
}
