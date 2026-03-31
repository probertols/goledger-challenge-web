// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { sanitizeAssetInput, sanitizeText } from '../infrastructure/api/sanitize.js';

describe('sanitize', () => {
  it('remove tags perigosas de textos', () => {
    expect(sanitizeText('<img src=x onerror=alert(1)>Dark')).toBe('Dark');
  });

  it('sanitiza objetos aninhados antes do envio', () => {
    expect(
      sanitizeAssetInput({
        title: '<script>alert(1)</script>Dark',
        description: '<b>Descricao</b>',
        nested: {
          note: '<img src=x onerror=alert(2)>teste'
        }
      })
    ).toEqual({
      title: 'Dark',
      description: 'Descricao',
      nested: {
        note: 'teste'
      }
    });
  });
});
