export function findEmptyFields(
  value: unknown,
  currentPath = ''
): string[] {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [currentPath];
    }

    return value.flatMap((item, index) =>
      findEmptyFields(item, `${currentPath}[${index}]`)
    );
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
