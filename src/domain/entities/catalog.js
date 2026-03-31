export const ENTITY_ORDER = ['tvShows', 'seasons', 'episodes', 'watchlist'];

export const ENTITY_DEFINITIONS = {
  tvShows: {
    assetType: 'tvShows',
    title: 'Séries',
    singular: 'Série',
    description: 'Séries principais que servem de base para o restante do catálogo.',
    accent: 'var(--color-mint)',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, key: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      { name: 'recommendedAge', label: 'Idade recomendada', type: 'number', required: true }
    ]
  },
  seasons: {
    assetType: 'seasons',
    title: 'Temporadas',
    singular: 'Temporada',
    description: 'Lançamentos estruturados conectados a uma série.',
    accent: 'var(--color-plum)',
    fields: [
      { name: 'number', label: 'Número', type: 'number', required: true, key: true },
      {
        name: 'tvShow',
        label: 'Série',
        type: 'relation',
        required: true,
        key: true,
        relationAssetType: 'tvShows'
      },
      { name: 'year', label: 'Ano de lançamento', type: 'number', required: true }
    ]
  },
  episodes: {
    assetType: 'episodes',
    title: 'Episódios',
    singular: 'Episódio',
    description: 'Detalhes de lançamento, descrição e avaliação de cada episódio.',
    accent: 'var(--color-rose)',
    fields: [
      {
        name: 'season',
        label: 'Temporada',
        type: 'relation',
        required: true,
        key: true,
        relationAssetType: 'seasons'
      },
      { name: 'episodeNumber', label: 'Número do episódio', type: 'number', required: true, key: true },
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'releaseDate', label: 'Data de lançamento', type: 'datetime-local', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true },
      { name: 'rating', label: 'Avaliação', type: 'number', required: false, min: 0, max: 10, step: 0.1 }
    ]
  },
  watchlist: {
    assetType: 'watchlist',
    title: 'Watchlists',
    singular: 'Watchlist',
    description: 'Listas curadas de séries para acompanhar, rever ou recomendar.',
    accent: 'var(--color-steel)',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, key: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: false },
      {
        name: 'tvShows',
        label: 'Séries',
        type: 'multi-relation',
        required: false,
        relationAssetType: 'tvShows'
      }
    ]
  }
};

export function getEntityDefinition(assetType) {
  return ENTITY_DEFINITIONS[assetType];
}

export function getEmptyFormValues(assetType) {
  const entity = getEntityDefinition(assetType);

  return entity.fields.reduce((accumulator, field) => {
    accumulator[field.name] = field.type === 'multi-relation' ? [] : '';
    return accumulator;
  }, {});
}

export function normalizeRecordToForm(assetType, record) {
  const entity = getEntityDefinition(assetType);

  return entity.fields.reduce((accumulator, field) => {
    const value = record[field.name];

    if (field.type === 'relation') {
      accumulator[field.name] = value?.['@key'] ?? '';
      return accumulator;
    }

    if (field.type === 'multi-relation') {
      accumulator[field.name] = Array.isArray(value) ? value.map((item) => item['@key']) : [];
      return accumulator;
    }

    if (field.type === 'datetime-local') {
      accumulator[field.name] = value ? value.slice(0, 16) : '';
      return accumulator;
    }

    accumulator[field.name] = value ?? '';
    return accumulator;
  }, {});
}

export function buildRelationReference(assetType, key) {
  if (!key) {
    return null;
  }

  return {
    '@assetType': assetType,
    '@key': key
  };
}

export function buildAssetFromForm(assetType, values) {
  const entity = getEntityDefinition(assetType);
  const asset = { '@assetType': assetType };

  entity.fields.forEach((field) => {
    const rawValue = values[field.name];

    if (field.type === 'relation') {
      asset[field.name] = buildRelationReference(field.relationAssetType, rawValue);
      return;
    }

    if (field.type === 'multi-relation') {
      asset[field.name] = Array.isArray(rawValue)
        ? rawValue.filter(Boolean).map((value) => buildRelationReference(field.relationAssetType, value))
        : [];
      return;
    }

    if (field.type === 'number') {
      if (rawValue === '' || rawValue === null || rawValue === undefined) {
        if (field.required) {
          asset[field.name] = 0;
        }
        return;
      }

      asset[field.name] = Number(rawValue);
      return;
    }

    if (field.type === 'datetime-local') {
      asset[field.name] = rawValue ? new Date(rawValue).toISOString() : '';
      return;
    }

    asset[field.name] = rawValue;
  });

  return asset;
}

export function mergeKeyFieldsFromRecord(assetType, asset, record) {
  const entity = getEntityDefinition(assetType);
  const nextAsset = { ...asset };

  entity.fields
    .filter((field) => field.key)
    .forEach((field) => {
      nextAsset[field.name] = record?.[field.name] ?? asset[field.name];
    });

  return nextAsset;
}

export function buildKeyFromRecord(assetType, source) {
  const entity = getEntityDefinition(assetType);
  const key = { '@assetType': assetType };

  entity.fields
    .filter((field) => field.key)
    .forEach((field) => {
      const rawValue = source[field.name];

      if (field.type === 'relation') {
        const relationKey = typeof rawValue === 'string' ? rawValue : rawValue?.['@key'];
        key[field.name] = buildRelationReference(field.relationAssetType, relationKey);
        return;
      }

      key[field.name] = rawValue;
    });

  return key;
}

export function formatRecordValue(field, value, relatedMaps) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (field.type === 'relation') {
    return relatedMaps[field.relationAssetType]?.[value['@key']] ?? value['@key'] ?? '—';
  }

  if (field.type === 'multi-relation') {
    if (!Array.isArray(value) || value.length === 0) {
      return '—';
    }

    return value
      .map((item) => relatedMaps[field.relationAssetType]?.[item['@key']] ?? item['@key'])
      .join(', ');
  }

  if (field.type === 'datetime-local') {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  return String(value);
}

export function getRecordLabel(assetType, record, relatedMaps = {}) {
  if (!record) {
    return '';
  }

  switch (assetType) {
    case 'tvShows':
      return record.title;
    case 'seasons': {
      const tvShowLabel = relatedMaps.tvShows?.[record.tvShow?.['@key']] ?? 'Série desconhecida';
      return `Temporada ${record.number} · ${tvShowLabel}`;
    }
    case 'episodes': {
      const seasonLabel = relatedMaps.seasons?.[record.season?.['@key']] ?? 'Temporada desconhecida';
      return `Ep ${record.episodeNumber} · ${record.title} · ${seasonLabel}`;
    }
    case 'watchlist':
      return record.title;
    default:
      return record.title ?? record['@key'];
  }
}

export function createRelatedMaps(recordsByEntity) {
  return ENTITY_ORDER.reduce((accumulator, assetType) => {
    accumulator[assetType] = (recordsByEntity[assetType] ?? []).reduce((map, record) => {
      map[record['@key']] = getRecordLabel(assetType, record, accumulator);
      return map;
    }, {});

    return accumulator;
  }, {});
}

export function matchesSearch(assetType, record, query, relatedMaps) {
  if (!query) {
    return true;
  }

  const entity = getEntityDefinition(assetType);
  const haystack = entity.fields
    .map((field) => formatRecordValue(field, record[field.name], relatedMaps))
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}
