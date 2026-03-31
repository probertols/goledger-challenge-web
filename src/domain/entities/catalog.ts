export type AssetType = 'tvShows' | 'seasons' | 'episodes' | 'watchlist';

export type FieldType = 'text' | 'textarea' | 'number' | 'relation' | 'multi-relation' | 'datetime-local';

export type RelationReference = {
  '@assetType': AssetType;
  '@key': string;
};

export type CatalogRecord = {
  '@assetType'?: AssetType;
  '@key'?: string;
  [key: string]: unknown;
};

export type FormValue = string | string[];
export type FormValues = Record<string, FormValue>;
export type RelatedMaps = Record<AssetType, Record<string, string>>;
export type RecordsByEntity = Record<AssetType, CatalogRecord[]>;

export type EntityField = {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  key?: boolean;
  relationAssetType?: AssetType;
  min?: number;
  max?: number;
  step?: number;
  minLength?: number;
};

export type EntityDefinition = {
  assetType: AssetType;
  title: string;
  singular: string;
  description: string;
  accent: string;
  fields: EntityField[];
};

export const ENTITY_ORDER: AssetType[] = ['tvShows', 'seasons', 'episodes', 'watchlist'];

export const ENTITY_DEFINITIONS: Record<AssetType, EntityDefinition> = {
  tvShows: {
    assetType: 'tvShows',
    title: 'Séries',
    singular: 'Série',
    description: 'Séries principais que servem de base para o restante do catálogo.',
    accent: 'var(--color-mint)',
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true, key: true, minLength: 3 },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true, minLength: 10 },
      { name: 'recommendedAge', label: 'Idade recomendada', type: 'number', required: true, min: 0 }
    ]
  },
  seasons: {
    assetType: 'seasons',
    title: 'Temporadas',
    singular: 'Temporada',
    description: 'Lançamentos estruturados conectados a uma série.',
    accent: 'var(--color-plum)',
    fields: [
      { name: 'number', label: 'Número', type: 'number', required: true, key: true, min: 1 },
      {
        name: 'tvShow',
        label: 'Série',
        type: 'relation',
        required: true,
        key: true,
        relationAssetType: 'tvShows'
      },
      { name: 'year', label: 'Ano de lançamento', type: 'number', required: true, min: 1900 }
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
      { name: 'episodeNumber', label: 'Número do episódio', type: 'number', required: true, key: true, min: 1 },
      { name: 'title', label: 'Título', type: 'text', required: true, minLength: 3 },
      { name: 'releaseDate', label: 'Data de lançamento', type: 'datetime-local', required: true },
      { name: 'description', label: 'Descrição', type: 'textarea', required: true, minLength: 10 },
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
      { name: 'title', label: 'Título', type: 'text', required: true, key: true, minLength: 3 },
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

export const EMPTY_RECORDS_BY_ENTITY: RecordsByEntity = {
  tvShows: [],
  seasons: [],
  episodes: [],
  watchlist: []
};

export function getEntityDefinition(assetType: AssetType): EntityDefinition {
  return ENTITY_DEFINITIONS[assetType];
}

export function getEmptyFormValues(assetType: AssetType): FormValues {
  const entity = getEntityDefinition(assetType);

  return entity.fields.reduce<FormValues>((accumulator, field) => {
    accumulator[field.name] = field.type === 'multi-relation' ? [] : '';
    return accumulator;
  }, {});
}

export function normalizeRecordToForm(assetType: AssetType, record: CatalogRecord): FormValues {
  const entity = getEntityDefinition(assetType);

  return entity.fields.reduce<FormValues>((accumulator, field) => {
    const value = record[field.name];

    if (field.type === 'relation') {
      accumulator[field.name] = isRelationReference(value) ? value['@key'] : '';
      return accumulator;
    }

    if (field.type === 'multi-relation') {
      accumulator[field.name] = Array.isArray(value)
        ? value.filter(isRelationReference).map((item) => item['@key'])
        : [];
      return accumulator;
    }

    if (field.type === 'datetime-local') {
      accumulator[field.name] = typeof value === 'string' ? value.slice(0, 16) : '';
      return accumulator;
    }

    accumulator[field.name] = typeof value === 'string' || typeof value === 'number' ? String(value) : '';
    return accumulator;
  }, {});
}

export function buildRelationReference(assetType: AssetType, key: string): RelationReference | null {
  if (!key) {
    return null;
  }

  return {
    '@assetType': assetType,
    '@key': key
  };
}

export function buildAssetFromForm(assetType: AssetType, values: FormValues): CatalogRecord {
  const entity = getEntityDefinition(assetType);
  const asset: CatalogRecord = { '@assetType': assetType };

  entity.fields.forEach((field) => {
    const rawValue = values[field.name];

    if (field.type === 'relation') {
      asset[field.name] = buildRelationReference(field.relationAssetType as AssetType, String(rawValue ?? ''));
      return;
    }

    if (field.type === 'multi-relation') {
      asset[field.name] = Array.isArray(rawValue)
        ? rawValue
            .map((value) => value.trim())
            .filter(Boolean)
            .map((value) => buildRelationReference(field.relationAssetType as AssetType, value))
            .filter(Boolean)
        : [];
      return;
    }

    if (field.type === 'number') {
      const normalizedValue = String(rawValue ?? '').trim();

      if (!normalizedValue) {
        return;
      }

      asset[field.name] = Number(normalizedValue);
      return;
    }

    if (field.type === 'datetime-local') {
      const normalizedValue = String(rawValue ?? '').trim();
      asset[field.name] = normalizedValue ? new Date(normalizedValue).toISOString() : '';
      return;
    }

    asset[field.name] = String(rawValue ?? '').trim();
  });

  return asset;
}

export function mergeKeyFieldsFromRecord(
  assetType: AssetType,
  asset: CatalogRecord,
  record: CatalogRecord | null
): CatalogRecord {
  const entity = getEntityDefinition(assetType);
  const nextAsset = { ...asset };

  entity.fields
    .filter((field) => field.key)
    .forEach((field) => {
      nextAsset[field.name] = record?.[field.name] ?? asset[field.name];
    });

  return nextAsset;
}

export function buildKeyFromRecord(assetType: AssetType, source: CatalogRecord): CatalogRecord {
  const entity = getEntityDefinition(assetType);
  const key: CatalogRecord = { '@assetType': assetType };

  entity.fields
    .filter((field) => field.key)
    .forEach((field) => {
      const rawValue = source[field.name];

      if (field.type === 'relation') {
        const relationKey =
          typeof rawValue === 'string'
            ? rawValue
            : isRelationReference(rawValue)
              ? rawValue['@key']
              : '';

        key[field.name] = relationKey
          ? buildRelationReference(field.relationAssetType as AssetType, relationKey)
          : null;
        return;
      }

      key[field.name] = rawValue;
    });

  return key;
}

export function formatRecordValue(field: EntityField, value: unknown, relatedMaps: RelatedMaps): string {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (field.type === 'relation') {
    if (!isRelationReference(value) || !field.relationAssetType) {
      return '—';
    }

    return relatedMaps[field.relationAssetType]?.[value['@key']] ?? value['@key'] ?? '—';
  }

  if (field.type === 'multi-relation') {
    if (!Array.isArray(value) || value.length === 0 || !field.relationAssetType) {
      return '—';
    }

    return value
      .filter(isRelationReference)
      .map((item) => relatedMaps[field.relationAssetType as AssetType]?.[item['@key']] ?? item['@key'])
      .join(', ');
  }

  if (field.type === 'datetime-local' && typeof value === 'string') {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  }

  return String(value);
}

export function getRecordLabel(
  assetType: AssetType,
  record: CatalogRecord,
  relatedMaps: Partial<RelatedMaps> = {}
): string {
  switch (assetType) {
    case 'tvShows':
      return String(record.title ?? record['@key'] ?? '');
    case 'seasons': {
      const tvShow = record.tvShow;
      const tvShowKey = isRelationReference(tvShow) ? tvShow['@key'] : '';
      const tvShowLabel = relatedMaps.tvShows?.[tvShowKey] ?? 'Série desconhecida';
      return `Temporada ${String(record.number ?? '')} · ${tvShowLabel}`;
    }
    case 'episodes': {
      const season = record.season;
      const seasonKey = isRelationReference(season) ? season['@key'] : '';
      const seasonLabel = relatedMaps.seasons?.[seasonKey] ?? 'Temporada desconhecida';
      return `Ep ${String(record.episodeNumber ?? '')} · ${String(record.title ?? '')} · ${seasonLabel}`;
    }
    case 'watchlist':
      return String(record.title ?? record['@key'] ?? '');
    default:
      return String(record.title ?? record['@key'] ?? '');
  }
}

export function createRelatedMaps(recordsByEntity: RecordsByEntity): RelatedMaps {
  const initialMaps: RelatedMaps = {
    tvShows: {},
    seasons: {},
    episodes: {},
    watchlist: {}
  };

  return ENTITY_ORDER.reduce<RelatedMaps>((accumulator, assetType) => {
    accumulator[assetType] = (recordsByEntity[assetType] ?? []).reduce<Record<string, string>>((map, record) => {
      const recordKey = String(record['@key'] ?? '');

      if (recordKey) {
        map[recordKey] = getRecordLabel(assetType, record, accumulator);
      }

      return map;
    }, {});

    return accumulator;
  }, initialMaps);
}

export function matchesSearch(
  assetType: AssetType,
  record: CatalogRecord,
  query: string,
  relatedMaps: RelatedMaps
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const entity = getEntityDefinition(assetType);
  const haystack = entity.fields
    .map((field) => formatRecordValue(field, record[field.name], relatedMaps))
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function isRelationReference(value: unknown): value is RelationReference {
  return Boolean(
    value &&
      typeof value === 'object' &&
      '@key' in value &&
      '@assetType' in value &&
      typeof (value as RelationReference)['@key'] === 'string'
  );
}
