import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  serialize: function(snapshot) {
    return snapshot.record.toJSON();
  },

  normalizeSingleResponse: function(store, primaryModelClass, payload) {
    var sessionModel = {
      data: {
        id: payload.gooruUId,
        type: 'session',
        attributes: {
          gooruUId: payload.gooruUId,
          token: payload.token,
          username: payload.user.username,
          firstName: payload.user.firstName,
          lastName: payload.user.lastName,
          displayName: payload.user.displayName
        }
      }
    };
    store.push(sessionModel);

    return sessionModel;
  }
});
