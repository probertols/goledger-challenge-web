import { startTransition, useDeferredValue, useMemo, useState } from 'react';
import CatalogHero from './components/CatalogHero';
import CatalogToolbar from './components/CatalogToolbar';
import { useCatalogData } from './hooks/useCatalogData';
import { useCatalogForm } from './hooks/useCatalogForm';
import { useToast } from './hooks/useToast';
import {
  buildKeyFromRecord,
  createRelatedMaps,
  ENTITY_ORDER,
  getEntityDefinition,
  matchesSearch,
  type AssetType,
  type CatalogRecord
} from '../domain/entities/catalog';
import AppFrame from '../ui/components/AppFrame';
import ConfirmDialog from '../ui/components/ConfirmDialog';
import EntityForm from '../ui/components/EntityForm';
import EntitySidebar from '../ui/components/EntitySidebar';
import EntityTable from '../ui/components/EntityTable';
import ToastStack from '../ui/components/ToastStack';

function App() {
  const entities = useMemo(() => ENTITY_ORDER.map((assetType) => getEntityDefinition(assetType)), []);
  const [activeEntity, setActiveEntity] = useState<AssetType>('tvShows');
  const [searchValue, setSearchValue] = useState('');
  const [recordPendingDelete, setRecordPendingDelete] = useState<CatalogRecord | null>(null);
  const deferredSearch = useDeferredValue(searchValue);

  const { items: toasts, pushToast, dismissToast } = useToast();
  const { recordsByEntity, isLoading, isRefreshing, refresh, saveAsset, deleteAsset, isSaving, isDeleting } =
    useCatalogData();

  const activeDefinition = getEntityDefinition(activeEntity);
  const relatedMaps = useMemo(() => createRelatedMaps(recordsByEntity), [recordsByEntity]);

  const {
    sectionRef,
    formValues,
    fieldErrors,
    mode,
    editingRecord,
    updateField,
    startEditing,
    resetForm,
    submitForm
  } = useCatalogForm({
    activeEntity,
    entity: activeDefinition,
    onInvalidSubmit: () => {
      pushToast({
        type: 'error',
        title: 'Revise os campos obrigatórios',
        message: 'Corrija os campos destacados antes de continuar.'
      });
    },
    onSubmitAsset: async ({ asset, mode: nextMode }) => {
      try {
        await saveAsset({ asset, mode: nextMode });
        pushToast({
          type: 'success',
          title: nextMode === 'create' ? 'Registro criado' : 'Registro atualizado',
          message: `${activeDefinition.singular} salva com sucesso.`
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
        pushToast({
          type: 'error',
          title: `Não foi possível ${nextMode === 'create' ? 'criar' : 'atualizar'} ${activeDefinition.singular.toLowerCase()}`,
          message
        });
        throw error;
      }
    }
  });

  const filteredRecords = useMemo(() => {
    const normalizedQuery = deferredSearch.trim();
    const records = recordsByEntity[activeEntity] ?? [];

    return records.filter((record) => matchesSearch(activeEntity, record, normalizedQuery, relatedMaps));
  }, [activeEntity, deferredSearch, recordsByEntity, relatedMaps]);

  const relationOptions = useMemo(() => {
    return activeDefinition.fields.reduce<Record<string, Array<{ value: string; label: string }>>>(
      (accumulator, field) => {
        const relationAssetType = field.relationAssetType;

        if (!relationAssetType) {
          return accumulator;
        }

        accumulator[field.name] = (recordsByEntity[relationAssetType] ?? []).map((record) => {
          const recordKey = String(record['@key'] ?? '');

          return {
            value: recordKey,
            label: relatedMaps[relationAssetType]?.[recordKey] ?? String(record.title ?? recordKey)
          };
        });

        return accumulator;
      },
      {}
    );
  }, [activeDefinition.fields, recordsByEntity, relatedMaps]);

  const stats = useMemo(
    () =>
      ENTITY_ORDER.map((assetType) => ({
        label: getEntityDefinition(assetType).singular,
        value: String((recordsByEntity[assetType] ?? []).length).padStart(2, '0')
      })),
    [recordsByEntity]
  );

  const totalRecords = ENTITY_ORDER.reduce(
    (total, assetType) => total + (recordsByEntity[assetType] ?? []).length,
    0
  );

  function handleEntitySelect(assetType: AssetType) {
    startTransition(() => {
      setActiveEntity(assetType);
      setSearchValue('');
      setRecordPendingDelete(null);
    });
  }

  function handleDeleteRequest(record: CatalogRecord) {
    setRecordPendingDelete(record);
  }

  async function confirmDelete() {
    if (!recordPendingDelete) {
      return;
    }

    try {
      await deleteAsset(buildKeyFromRecord(activeEntity, recordPendingDelete));
      pushToast({
        type: 'delete',
        title: 'Registro excluído',
        message: `${activeDefinition.singular} removida da visualização.`
      });

      if (editingRecord?.['@key'] === recordPendingDelete['@key']) {
        resetForm();
      }

      setRecordPendingDelete(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
      pushToast({
        type: 'error',
        title: `Não foi possível excluir ${activeDefinition.singular.toLowerCase()}`,
        message
      });
    }
  }

  return (
    <>
      <AppFrame
        sidebar={
          <EntitySidebar
            entities={entities}
            activeEntity={activeEntity}
            onSelect={handleEntitySelect}
            stats={stats}
          />
        }
      >
        <CatalogHero
          activeDefinition={activeDefinition}
          filteredCount={filteredRecords.length}
          totalRecords={totalRecords}
        />

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <section className="space-y-5">
            <CatalogToolbar
              activeDefinition={activeDefinition}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onRefresh={() => void refresh()}
              isRefreshing={isRefreshing}
            />

            <EntityTable
              entity={activeDefinition}
              records={filteredRecords}
              relatedMaps={relatedMaps}
              onEdit={startEditing}
              onDelete={handleDeleteRequest}
              emptyMessage={`Crie a primeira ${activeDefinition.singular.toLowerCase()} ou amplie sua busca.`}
              isLoading={isLoading}
            />
          </section>

          <div className="xl:justify-self-end xl:w-full xl:max-w-[420px]">
            <EntityForm
              ref={sectionRef}
              entity={activeDefinition}
              values={formValues}
              mode={mode}
              onChange={updateField}
              onSubmit={(event) => void submitForm(event)}
              onReset={resetForm}
              relationOptions={relationOptions}
              isSubmitting={isSaving}
              errors={fieldErrors}
            />
          </div>
        </div>
      </AppFrame>

      <ConfirmDialog
        isOpen={Boolean(recordPendingDelete)}
        record={recordPendingDelete}
        entityLabel={activeDefinition.singular}
        onCancel={() => setRecordPendingDelete(null)}
        onConfirm={() => void confirmDelete()}
        isConfirming={isDeleting}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default App;
