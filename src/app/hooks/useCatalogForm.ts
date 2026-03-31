import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  buildAssetFromForm,
  getEmptyFormValues,
  mergeKeyFieldsFromRecord,
  normalizeRecordToForm,
  type AssetType,
  type CatalogRecord,
  type EntityDefinition,
  type FormValue,
  type FormValues
} from '../../domain/entities/catalog';
import { validateForm } from '../formSchema';

type SubmitContext = {
  asset: CatalogRecord;
  editingRecord: CatalogRecord | null;
  mode: 'create' | 'update';
};

type UseCatalogFormProps = {
  activeEntity: AssetType;
  entity: EntityDefinition;
  onSubmitAsset: (context: SubmitContext) => Promise<void>;
  onInvalidSubmit: () => void;
};

export function useCatalogForm({
  activeEntity,
  entity,
  onSubmitAsset,
  onInvalidSubmit
}: UseCatalogFormProps) {
  const [formValues, setFormValues] = useState<FormValues>(() => getEmptyFormValues(activeEntity));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [editingRecord, setEditingRecord] = useState<CatalogRecord | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const emptyValues = useMemo(() => getEmptyFormValues(activeEntity), [activeEntity]);

  function resetForm() {
    setMode('create');
    setEditingRecord(null);
    setFormValues(emptyValues);
    setFieldErrors({});
  }

  useEffect(() => {
    resetForm();
  }, [emptyValues]);

  function updateField(name: string, value: FormValue) {
    setFormValues((current) => {
      const nextValues = { ...current, [name]: value };

      if (Object.keys(fieldErrors).length > 0) {
        setFieldErrors(validateForm(entity, nextValues));
      }

      return nextValues;
    });
  }

  function startEditing(record: CatalogRecord) {
    setEditingRecord(record);
    setMode('update');
    setFormValues(normalizeRecordToForm(activeEntity, record));
    setFieldErrors({});
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(entity, formValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      onInvalidSubmit();
      return;
    }

    const formAsset = buildAssetFromForm(activeEntity, formValues);
    const asset =
      mode === 'update' ? mergeKeyFieldsFromRecord(activeEntity, formAsset, editingRecord) : formAsset;

    await onSubmitAsset({
      asset,
      editingRecord,
      mode
    });

    resetForm();
  }

  return {
    sectionRef,
    formValues,
    fieldErrors,
    mode,
    editingRecord,
    updateField,
    startEditing,
    resetForm,
    submitForm
  };
}
