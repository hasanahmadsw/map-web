export const validation = {
    "required": "This field is required",
    "invalid": "Please enter a valid value",
    "email": {
      "invalid": "Please enter a valid email address"
    },
    "password": {
      "minLength": "Password must be at least {{min}} characters",
      "maxLength": "Password must not exceed {{max}} characters",
      "regex": "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
      "mismatch": "Passwords do not match",
      "confirmRequired": "Confirm password is required"
    },
    "string": {
      "tooShort": "This field cannot be empty",
      "minLength": "This field must contain at least {{min}} characters",
      "maxLength": "This field must not exceed {{max}} characters",
      "englishOnly": "This field must be in English",
      "arabicOnly": "This field must be in Arabic",
      "slugRegex": "Slug must be lowercase with hyphens"
    },
    "number": {
      "range": "The value must be between {{min}} and {{max}}",
      "min": "The value must be greater than {{min}}",
      "max": "The value must be less than {{max}}"
    },
    "file": {
      "tooLarge": "File size is too large. Maximum size allowed is {{max}}",
      "tooSmall": "File size is too small. Minimum size allowed is {{min}}",
      "invalidType": "Invalid file type. Allowed formats: {{formats}}",
      "tooMany": "Too many files selected. Maximum allowed: {{max}}",
      "uploadFailed": "Upload failed"
    },
    "image": {
      "size": "File size must be less than {{max}}",
      "type": "Invalid file type. Only {{formats}} are allowed"
    },
    "custom": {
      "userRequired": "Please select or create a user",
      "atLeastOne": "Please select at least one",
      "addAtLeastOne": "Please add at least one {{entity}}"
    }
  }


  export type TValidation = typeof validation;


  interface Options {
    [key: string]: string | number | boolean | undefined;
    femaleArabicField?: boolean;
  }
  
  export function fmt(message: string | undefined, options: Options = {}): string {
    if (!message) return '';
    let result = message;
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
      }
    });
    return result;
  }
  
