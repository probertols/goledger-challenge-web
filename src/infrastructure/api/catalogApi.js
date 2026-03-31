import { apiRequest } from './httpClient.js';

export async function searchAssets(assetType) {
  const data = await apiRequest('/query/search', {
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

export async function createAsset(asset) {
  return apiRequest('/invoke/createAsset', {
    body: {
      asset: [asset]
    }
  });
}

export async function updateAsset(update) {
  return apiRequest('/invoke/updateAsset', {
    method: 'PUT',
    body: {
      update
    }
  });
}

export async function deleteAsset(key) {
  return apiRequest('/invoke/deleteAsset', {
    method: 'DELETE',
    body: {
      key
    }
  });
}
