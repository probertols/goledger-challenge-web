import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  buildAssetFromForm,
  buildKeyFromRecord,
  createRelatedMaps,
  ENTITY_ORDER,
  getEmptyFormValues,
  getEntityDefinition,
  matchesSearch,
  mergeKeyFieldsFromRecord,
  normalizeRecordToForm
} from '../domain/entities/catalog.js';
import { createAsset, deleteAsset, searchAssets, updateAsset } from '../infrastructure/api/catalogApi.js';
import { sanitizeAssetInput, sanitizeText } from '../infrastructure/api/sanitize.js';
import { validateField, validateForm } from './formValidation.js';
import AppFrame from '../ui/components/AppFrame.jsx';
import EntityForm from '../ui/components/EntityForm.jsx';
import EntitySidebar from '../ui/components/EntitySidebar.jsx';
import EntityTable from '../ui/components/EntityTable.jsx';
import ToastStack from '../ui/components/ToastStack.jsx';

function App() {
  const entities = useMemo(() => ENTITY_ORDER.map((assetType) => getEntityDefinition(assetType)), []);
  const [activeEntity, setActiveEntity] = useState('tvShows');
  const [recordsByEntity, setRecordsByEntity] = useState({});
  const [formValues, setFormValues] = useState(getEmptyFormValues('tvShows'));
  const [mode, setMode] = useState('create');
  const [editingRecord, setEditingRecord] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const deferredSearch = useDeferredValue(searchValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});

  const activeDefinition = getEntityDefinition(activeEntity);
  const relatedMaps = useMemo(() => createRelatedMaps(recordsByEntity), [recordsByEntity]);

  useEffect(() => {
    void loadAllEntities();
  }, []);

  useEffect(() => {
    setFormValues(getEmptyFormValues(activeEntity));
    setMode('create');
    setEditingRecord(null);
    setFieldErrors({});
  }, [activeEntity]);

  useEffect(() => {
    if (toasts.length === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToasts((current) => current.slice(1));
    }, 3600);

    return () => window.clearTimeout(timeoutId);
  }, [toasts]);

  async function loadAllEntities() {
    setIsLoading(true);

    try {
      const entries = await Promise.all(
        ENTITY_ORDER.map(async (assetType) => [assetType, await searchAssets(assetType)])
      );

      setRecordsByEntity(Object.fromEntries(entries));
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'Não foi possível carregar os dados',
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }

  function pushToast(toast) {
    setToasts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        ...toast
      }
    ]);
  }

  function dismissToast(id) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function handleEntitySelect(assetType) {
    startTransition(() => {
      setActiveEntity(assetType);
      setSearchValue('');
    });
  }

  function handleFieldChange(name, value) {
    setFormValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const error = validateField(activeDefinition.fields.find((field) => field.name === name), value);

      if (!error) {
        const { [name]: _removed, ...rest } = current;
        return rest;
      }

      return { ...current, [name]: error };
    });
  }

  function handleEdit(record) {
    setEditingRecord(record);
    setMode('update');
    setFormValues(normalizeRecordToForm(activeEntity, record));
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleReset() {
    setMode('create');
    setEditingRecord(null);
    setFormValues(getEmptyFormValues(activeEntity));
    setFieldErrors({});
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(activeDefinition.fields, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      pushToast({
        type: 'error',
        title: 'Revise os campos obrigatórios',
        message: 'Corrija os campos destacados antes de continuar.'
      });
      return;
    }

    setIsSaving(true);

    try {
      const formAsset = buildAssetFromForm(activeEntity, formValues);
      const asset =
        mode === 'update'
          ? sanitizeAssetInput(mergeKeyFieldsFromRecord(activeEntity, formAsset, editingRecord))
          : sanitizeAssetInput(formAsset);

      if (mode === 'create') {
        await createAsset(asset);
      } else {
        await updateAsset(asset);
      }

      await loadAllEntities();
      pushToast({
        type: 'success',
        title: mode === 'create' ? 'Registro criado' : 'Registro atualizado',
        message: `${activeDefinition.singular} salva com sucesso.`
      });
      handleReset();
    } catch (error) {
      pushToast({
        type: 'error',
        title: `Não foi possível ${mode === 'create' ? 'criar' : 'atualizar'} ${activeDefinition.singular.toLowerCase()}`,
        message: error.message
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(record) {
    const confirmed = window.confirm(
      `Deseja excluir ${activeDefinition.singular.toLowerCase()} "${record.title ?? record['@key']}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAsset(buildKeyFromRecord(activeEntity, record));
      await loadAllEntities();
      pushToast({
        type: 'delete',
        title: 'Registro excluído',
        message: `${activeDefinition.singular} removida da visualização.`
      });

      if (editingRecord?.['@key'] === record['@key']) {
        handleReset();
      }
    } catch (error) {
      pushToast({
        type: 'error',
        title: `Não foi possível excluir ${activeDefinition.singular.toLowerCase()}`,
        message: error.message
      });
    }
  }

  const filteredRecords = useMemo(() => {
    const safeQuery = sanitizeText(deferredSearch || '');
    const records = recordsByEntity[activeEntity] ?? [];

    return records.filter((record) => matchesSearch(activeEntity, record, safeQuery, relatedMaps));
  }, [activeEntity, deferredSearch, recordsByEntity, relatedMaps]);

  const relationOptions = useMemo(() => {
    return activeDefinition.fields.reduce((accumulator, field) => {
      if (!field.relationAssetType) {
        return accumulator;
      }

      accumulator[field.name] = (recordsByEntity[field.relationAssetType] ?? []).map((record) => ({
        value: record['@key'],
        label: relatedMaps[field.relationAssetType]?.[record['@key']] ?? record.title ?? record['@key']
      }));

      return accumulator;
    }, {});
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

  const activeHighlightStyles = {
    borderColor: `color-mix(in srgb, ${activeDefinition.accent} 35%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${activeDefinition.accent} 16%, transparent)`
  };

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
        <section className="rounded-[28px] border border-[var(--color-paper)]/15 bg-[var(--color-panel)] p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl">
          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-mint)]">
                Catálogo de entretenimento
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-5xl leading-none text-white md:text-6xl">
                Crie, pesquise e organize um arquivos do universo televisivo.
              </h2>
              <p className="mt-4 max-w-2xl text-base text-[var(--color-paper)]/78">
                Interface construída com React, Tailwind, componentes documentados no Storybook, entradas
                sanitizadas e fluxos CRUD integrados diretamente com a API da GoLedger.
              </p>
            </div>

            <div className="grid self-start gap-3 sm:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              <div
                style={activeHighlightStyles}
                className="flex flex-col items-center justify-center rounded-[18px] border px-3 py-3 text-center"
              >
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper)]/60">Área ativa</p>
                <p className="mt-1 font-display text-lg leading-none text-white">{activeDefinition.title}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--color-plum)]/20 bg-[var(--color-plum)]/12 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper)]/60">Registros filtrados</p>
                <p className="mt-1 font-display text-lg leading-none text-white">{filteredRecords.length}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--color-rose)]/20 bg-[var(--color-rose)]/12 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper)]/60">Total do catálogo</p>
                <p className="mt-1 font-display text-lg leading-none text-white">{totalRecords}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <section className="space-y-5">
            <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-paper)]/12 bg-[var(--color-panel)] p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/50">Busca e navegação</p>
                <h3 className="mt-2 font-display text-3xl text-white">{activeDefinition.title}</h3>
              </div>

              <div className="flex w-full max-w-xl gap-3">
                <input
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder={`Buscar ${activeDefinition.title.toLowerCase()}...`}
                  className="w-full rounded-full border border-[var(--color-paper)]/10 bg-[var(--color-steel)]/16 px-5 py-3 text-sm text-white outline-none transition placeholder:text-[var(--color-paper)]/35 focus:border-[var(--color-mint)]"
                />
                <button
                  type="button"
                  onClick={() => void loadAllEntities()}
                  className="cursor-pointer rounded-full border border-[var(--color-paper)]/12 bg-[var(--color-steel)]/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-steel)]/28"
                >
                  Atualizar
                </button>
              </div>
            </div>

            <EntityTable
              entity={activeDefinition}
              records={filteredRecords}
              relatedMaps={relatedMaps}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage={`Crie a primeira ${activeDefinition.singular.toLowerCase()} ou amplie sua busca.`}
              isLoading={isLoading}
            />
          </section>

          <div className="xl:justify-self-end xl:w-full xl:max-w-[420px]">
            <EntityForm
              entity={activeDefinition}
              values={formValues}
              mode={mode}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              relationOptions={relationOptions}
              isSubmitting={isSaving}
              errors={fieldErrors}
            />
          </div>
        </div>
      </AppFrame>

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </>
  );
}

export default App;
