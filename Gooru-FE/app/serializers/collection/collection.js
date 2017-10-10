import DS from 'ember-data';
import ResourceSerializer from '../resource/resource';

export default DS.JSONAPISerializer.extend({
  normalizeSingleResponse: function(store, primaryModelClass, payload) {
    var serializer = this;
    var collectionModel = {
      data: serializer.normalizeCollectionData(payload),
      included: []
    };
    this.normalizeResources(
      payload.collectionItems,
      collectionModel.data.relationships.resources.data,
      collectionModel
    );
    return collectionModel;
  },

  normalizeQueryRecordResponse: function(store, primaryModelClass, payload) {
    var serializer = this;
    var collectionModel = { data: [] };

    payload.forEach(function(collection) {
      this.push(serializer.normalizeCollectionData(collection));
    }, collectionModel.data);
    return collectionModel;
  },

  normalizeCollectionData: function(payload) {
    return {
      type: 'collection/collection',
      id: payload.gooruOid,
      attributes: {
        collectionType: payload.collectionType,
        title: payload.title,
        description: payload.description ? payload.description : '',
        imageUrl: payload.thumbnails ? payload.thumbnails.url : '',
        resourceCount: payload.summary ? payload.summary.resourceCount : 0,
        questionCount: payload.summary ? payload.summary.questionCount : 0,
        visibility: payload.visibility ? payload.visibility : false
      },
      relationships: {
        resources: { data: [] }
      }
    };
  },
  normalizeResources: function(
    collectionItems,
    resourceRelationships,
    collectionModel
  ) {
    const resourceSerializer = ResourceSerializer.create();
    for (var i = 0; i < collectionItems.length; i++) {
      var collectionItem = collectionItems[i];
      var resource = resourceSerializer.normalizeResource(collectionItem);
      collectionModel.included.push(resource);

      var resourceRelationship = {
        type: resource.type,
        id: resource.id
      };
      resourceRelationships.push(resourceRelationship);

      if (collectionItem.resourceFormat.value === 'question') {
        resourceSerializer.normalizeQuestionAnswers(
          collectionItem.answers,
          resource,
          collectionModel
        );
      }
    }
  }
});
