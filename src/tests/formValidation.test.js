import { describe, expect, it } from 'vitest';
import { validateField, validateForm } from '../app/formValidation.js';

describe('formValidation', () => {
  it('valida campos de texto obrigatorios com minimo de 3 caracteres', () => {
    const field = { name: 'title', type: 'text', required: true };

    expect(validateField(field, '')).toBe('Este campo é obrigatório.');
    expect(validateField(field, 'ab')).toBe('Digite pelo menos 3 caracteres.');
    expect(validateField(field, 'Dark')).toBe('');
  });

  it('valida descricao obrigatoria com minimo de 10 caracteres', () => {
    const field = { name: 'description', type: 'textarea', required: true };

    expect(validateField(field, 'curta')).toBe('Digite pelo menos 10 caracteres.');
    expect(validateField(field, 'Descricao valida')).toBe('');
  });

  it('valida selects obrigatorios', () => {
    const relationField = { name: 'tvShow', type: 'relation', required: true };

    expect(validateField(relationField, '')).toBe('Selecione uma opção.');
    expect(validateField(relationField, 'tvShows:1')).toBe('');
  });

  it('valida formulario completo e retorna erros por campo', () => {
    const fields = [
      { name: 'title', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: true },
      { name: 'tvShow', type: 'relation', required: true }
    ];

    expect(
      validateForm(fields, {
        title: 'AB',
        description: 'curta',
        tvShow: ''
      })
    ).toEqual({
      title: 'Digite pelo menos 3 caracteres.',
      description: 'Digite pelo menos 10 caracteres.',
      tvShow: 'Selecione uma opção.'
    });
  });
});
