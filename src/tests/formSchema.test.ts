import { describe, expect, it } from 'vitest';
import { validateForm } from '../app/formSchema';
import { getEntityDefinition } from '../domain/entities/catalog';

describe('formSchema', () => {
  it('valida campos obrigatorios e tamanhos minimos com zod', () => {
    const entity = getEntityDefinition('tvShows');

    expect(
      validateForm(entity, {
        title: 'ab',
        description: 'curta',
        recommendedAge: ''
      })
    ).toEqual({
      title: 'Digite pelo menos 3 caracteres.',
      description: 'Digite pelo menos 10 caracteres.',
      recommendedAge: 'Este campo é obrigatório.'
    });
  });

  it('aceita formulario valido', () => {
    const entity = getEntityDefinition('episodes');

    expect(
      validateForm(entity, {
        season: 'seasons:1',
        episodeNumber: '1',
        title: 'Pilot',
        releaseDate: '2025-01-01T20:00',
        description: 'Descricao valida para o episodio.',
        rating: '9.5'
      })
    ).toEqual({});
  });
});
