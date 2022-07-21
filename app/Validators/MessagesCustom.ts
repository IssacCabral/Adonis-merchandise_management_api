export default class MessagesCustom {
    public messages = {
      //Pattern message for Types
      'string': '{{ field }} field is invalid string',
      'boolean': '{{ field }} field is invalid boolean',
      'number': '{{ field }} field is invalid number',
      'date': '{{ field }} field is invalid date',
      'enum': 'the value must be one of {{ options.choices }}',
      'enumSet': 'the value must be one of {{ options.choices }}',
      'file': '{{ field }} field is invalid file',
      'file.size': 'The file size must be under {{ options.size }}',
      'file.extname': 'The file must have one of {{ options.extnames }} extension names',
  
      'array': '{{ field }} field is invalid array',
      'object': '{{ field }} field is invalid object',
  
      //Pattern message for rules
      'required': '{{ field }} field is required',
      'requiredIfExists': '{{ options.otherField }} requires {{ field }}',
      'requiredIfExistsAll': '{{ options.otherFields }} requires {{ field }}',
      'requiredWhen': '{{ field }} is required when {{ otherField }}{{ operator }}{{ values }}',
  
      'alpha': '{{ field }} field only accepts letters',
      'confirmed': '{{ field }} field must be the same as the confirmation field',
      'email': '{{ field }} field should be a valid email',
      'exists': '{{ field }} not found in us database',
      'unique': '{{ field }} already exists',
      'maxLength': '{{ field }} field must be up to {{ options.maxLength }}',
      'minLength': '{{ field }} field must be at least {{ options.minLength }}',
      'regex': '{{ field }} field with invalid format',
    }
  }