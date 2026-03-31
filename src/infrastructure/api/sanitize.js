import DOMPurify from 'dompurify';

export function sanitizeText(value) {
  return DOMPurify.sanitize(String(value), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
}

export function sanitizeAssetInput(input) {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeAssetInput(item));
  }

  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [key, sanitizeAssetInput(value)])
    );
  }

  if (typeof input === 'string') {
    return sanitizeText(input);
  }

  return input;
}
