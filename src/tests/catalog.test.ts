import { describe, expect, it } from 'vitest';
import {
  buildAssetFromForm,
  buildKeyFromRecord,
  getEmptyFormValues,
  normalizeRecordToForm
} from '../domain/entities/catalog';

describe('catalog helpers', () => {
  it('cria estado inicial vazio para formularios', () => {
    expect(getEmptyFormValues('watchlist')).toEqual({
      title: '',
      description: '',
      tvShows: []
    });
  });

  it('normaliza registros com relacoes para o formulario', () => {
    const formValues = normalizeRecordToForm('watchlist', {
      title: 'Favoritas',
      description: 'Minha lista favorita',
      tvShows: [
        { '@assetType': 'tvShows', '@key': 'tvShows:1' },
        { '@assetType': 'tvShows', '@key': 'tvShows:2' }
      ]
    });

    expect(formValues).toEqual({
      title: 'Favoritas',
      description: 'Minha lista favorita',
      tvShows: ['tvShows:1', 'tvShows:2']
    });
  });

  it('monta payload de asset a partir do formulario com trim', () => {
    expect(
      buildAssetFromForm('watchlist', {
        title: ' Favoritas ',
        description: ' Minha lista favorita ',
        tvShows: ['tvShows:1']
      })
    ).toEqual({
      '@assetType': 'watchlist',
      title: 'Favoritas',
      description: 'Minha lista favorita',
      tvShows: [{ '@assetType': 'tvShows', '@key': 'tvShows:1' }]
    });
  });

  it('monta a chave primaria corretamente para exclusao', () => {
    expect(
      buildKeyFromRecord('seasons', {
        number: 1,
        tvShow: { '@assetType': 'tvShows', '@key': 'tvShows:1' }
      })
    ).toEqual({
      '@assetType': 'seasons',
      number: 1,
      tvShow: { '@assetType': 'tvShows', '@key': 'tvShows:1' }
    });
  });
});
