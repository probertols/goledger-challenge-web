import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CatalogRecord, RecordsByEntity } from '../../domain/entities/catalog';
import { EMPTY_RECORDS_BY_ENTITY } from '../../domain/entities/catalog';
import { deleteAsset, saveAsset, searchAllAssets } from '../../infrastructure/api/catalogApi';

type SaveAssetInput = {
  asset: CatalogRecord;
  mode: 'create' | 'update';
};

export function useCatalogData() {
  const queryClient = useQueryClient();

  const catalogQuery = useQuery<RecordsByEntity>({
    queryKey: ['catalog-records'],
    queryFn: searchAllAssets,
    staleTime: 60_000,
    refetchOnWindowFocus: false
  });

  const saveMutation = useMutation({
    mutationFn: ({ asset, mode }: SaveAssetInput) => saveAsset(asset, mode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['catalog-records'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (key: CatalogRecord) => deleteAsset(key),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['catalog-records'] });
    }
  });

  return {
    recordsByEntity: catalogQuery.data ?? EMPTY_RECORDS_BY_ENTITY,
    isLoading: catalogQuery.isLoading,
    isRefreshing: catalogQuery.isFetching,
    refresh: () => catalogQuery.refetch(),
    saveAsset: saveMutation.mutateAsync,
    deleteAsset: deleteMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
