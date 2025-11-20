export function findEmptyFields(
  value: unknown,
  currentPath = ''
): string[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [currentPath];
    }

    const allErrors = value.flatMap((item) =>
      findEmptyFields(item, currentPath)
    );

    return Array.from(new Set(allErrors));
  }

  if (isNonNullObject(value)) {
    return Object.entries(value).flatMap(([key, val]) => {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      return findEmptyFields(val, newPath);
    });
  }

  if (isEmptyPrimitive(value)) {
    return [currentPath];
  }

  return [];
}

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isEmptyPrimitive(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}