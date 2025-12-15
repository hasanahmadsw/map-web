export function capitalizeFirstLetter(text: string | undefined): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getChangedValues<T extends Record<string, any>>(
  original: T,
  updated: Partial<T>,
): Partial<T> {
  const changedValues: Partial<T> = {};

  (Object.keys(updated) as Array<keyof T>).forEach(key => {
    if (updated[key] === undefined && original[key] !== undefined) {
      changedValues[key] = updated[key];
    } else if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
      changedValues[key] = updated[key];
    }
  });

  return changedValues;
}
export function sanitizeDto<T extends Record<string, any>>(dto: T): Partial<T> {
  const sanitized: Partial<T> = {};

  (Object.keys(dto) as Array<keyof T>).forEach(key => {
    const value = dto[key];

    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return;
    }

    if (Array.isArray(value) && value.length === 0) {
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const sanitizedNested = sanitizeDto(value);
      if (Object.keys(sanitizedNested).length > 0) {
        sanitized[key] = sanitizedNested as T[keyof T];
      }
      return;
    }

    sanitized[key] = value;
  });

  return sanitized;
}
