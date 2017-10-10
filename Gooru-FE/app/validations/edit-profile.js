import { validator, buildValidations } from 'ember-cp-validations';

export default buildValidations({
  firstName: {
    validators: [
      validator('format', {
        regex: /^[a-z0-9-.']+$/i,
        message: '{{description}}',
        descriptionKey: 'common.errors.special-characters'
      })
    ]
  },
  lastName: {
    validators: [
      validator('format', {
        regex: /^[a-z0-9-.']+$/i,
        message: '{{description}}',
        descriptionKey: 'common.errors.special-characters'
      })
    ]
  },
  username: {
    validators: [
      validator('presence', {
        presence: true,
        message: '{{description}}',
        descriptionKey: 'common.errors.add-username'
      }),
      validator('length', {
        min: 4,
        max: 16,
        message: '{{description}}',
        descriptionKey: 'common.errors.username-length'
      }),
      validator('format', {
        regex: /^[a-z0-9]+$/i,
        message: '{{description}}',
        descriptionKey: 'common.errors.special-characters'
      }),
      validator('reserved-words')
    ]
  },
  studentId: [
    validator('format', {
      allowBlank: true,
      regex: /^\w+$/,
      message: '{{description}}',
      descriptionKey: 'common.errors.special-characters'
    })
  ]
});
