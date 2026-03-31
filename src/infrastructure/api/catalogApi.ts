import {
  EMPTY_RECORDS_BY_ENTITY,
  ENTITY_ORDER,
  type CatalogRecord,
  type RecordsByEntity
} from '../../domain/entities/catalog';
import { apiRequest } from './httpClient';

type SearchResponse = {
  result?: CatalogRecord[];
};

export async function searchAssets(assetType: CatalogRecord['@assetType']) {
  const data = await apiRequest<SearchResponse>('/query/search', {
    body: {
      query: {
        selector: {
          '@assetType': assetType
        },
        limit: 200
      }
    }
  });

  return data?.result ?? [];
}

export async function searchAllAssets(): Promise<RecordsByEntity> {
  const entries = await Promise.all(
    ENTITY_ORDER.map(async (assetType) => [assetType, await searchAssets(assetType)] as const)
  );

  return entries.reduce<RecordsByEntity>((accumulator, [assetType, records]) => {
    accumulator[assetType] = records;
    return accumulator;
  }, structuredClone(EMPTY_RECORDS_BY_ENTITY));
}

export async function createAsset(asset: CatalogRecord) {
  return apiRequest('/invoke/createAsset', {
    body: {
      asset: [asset]
    }
  });
}

export async function updateAsset(update: CatalogRecord) {
  return apiRequest('/invoke/updateAsset', {
    method: 'PUT',
    body: {
      update
    }
  });
}

export async function saveAsset(asset: CatalogRecord, mode: 'create' | 'update') {
  return mode === 'create' ? createAsset(asset) : updateAsset(asset);
}

export async function deleteAsset(key: CatalogRecord) {
  return apiRequest('/invoke/deleteAsset', {
    method: 'DELETE',
    body: {
      key
    }
  });
}
