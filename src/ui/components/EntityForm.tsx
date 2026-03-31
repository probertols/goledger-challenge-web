import { forwardRef, type FormEvent } from 'react';
import type { EntityDefinition, EntityField, FormValue } from '../../domain/entities/catalog';

type RelationOption = {
  value: string;
  label: string;
};

type EntityFormProps = {
  entity: EntityDefinition;
  values: Record<string, FormValue>;
  mode: 'create' | 'update';
  onChange: (name: string, value: FormValue) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
  relationOptions: Record<string, RelationOption[]>;
  isSubmitting: boolean;
  errors: Record<string, string>;
};

type FieldProps = {
  field: EntityField;
  value: FormValue;
  onChange: (name: string, value: FormValue) => void;
  relationOptions: RelationOption[];
  disabled: boolean;
  hasError: boolean;
};

function Field({ field, value, onChange, relationOptions, disabled, hasError }: FieldProps) {
  const sharedClassName = `w-full rounded-2xl border px-4 py-3 text-sm outline-none transition placeholder:text-white/25 ${
    disabled
      ? 'cursor-not-allowed border-[var(--color-paper)]/8 bg-[var(--color-paper)]/[0.05] text-[var(--color-paper)]/45'
      : hasError
        ? 'border-[var(--color-rose)]/70 bg-[var(--color-steel)]/16 text-white focus:border-[var(--color-rose)]'
        : 'border-[var(--color-paper)]/10 bg-[var(--color-steel)]/16 text-white focus:border-[var(--color-mint)]'
  }`;

  if (field.type === 'textarea') {
    return (
      <textarea
        id={field.name}
        name={field.name}
        rows={5}
        required={field.required}
        value={String(value ?? '')}
        disabled={disabled}
        onChange={(event) => onChange(field.name, event.target.value)}
        className={`${sharedClassName} resize-y`}
      />
    );
  }

  if (field.type === 'relation') {
    return (
      <select
        id={field.name}
        name={field.name}
        required={field.required}
        value={String(value ?? '')}
        disabled={disabled}
        onChange={(event) => onChange(field.name, event.target.value)}
        className={sharedClassName}
      >
        <option value="">Selecione uma opção</option>
        {relationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'multi-relation') {
    return (
      <select
        id={field.name}
        name={field.name}
        multiple
        value={Array.isArray(value) ? value : []}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            field.name,
            Array.from(event.target.selectedOptions, (option) => option.value)
          )
        }
        className={`${sharedClassName} min-h-36`}
      >
        {relationOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={field.name}
      name={field.name}
      type={field.type}
      required={field.required}
      value={String(value ?? '')}
      disabled={disabled}
      min={field.min}
      max={field.max}
      step={field.step}
      onChange={(event) => onChange(field.name, event.target.value)}
      className={sharedClassName}
    />
  );
}

const EntityForm = forwardRef<HTMLElement, EntityFormProps>(function EntityForm(
  { entity, values, mode, onChange, onSubmit, onReset, relationOptions, isSubmitting, errors },
  ref
) {
  return (
    <section
      ref={ref}
      className="rounded-[24px] border border-[var(--color-paper)]/12 bg-[linear-gradient(180deg,rgba(24,33,37,0.9),rgba(157,105,163,0.16))] p-5 shadow-[var(--shadow-panel)] backdrop-blur-xl"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/50">
            {mode === 'create' ? 'Fluxo de criação' : 'Fluxo de atualização'}
          </p>
          <h2 className="mt-2 font-display text-2xl text-white">
            {mode === 'create' ? `Nova ${entity.singular}` : `Editar ${entity.singular}`}
          </h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-full border border-[var(--color-paper)]/12 bg-[var(--color-steel)]/18 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-[var(--color-steel)]/28"
        >
          Limpar
        </button>
      </div>

      <form noValidate className="mt-5 space-y-4" onSubmit={onSubmit}>
        {entity.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-2 block text-sm font-semibold text-white">
              {field.label}
              {field.required ? <span className="ml-1 text-[var(--color-mint)]">*</span> : null}
            </label>
            <Field
              field={field}
              value={values[field.name]}
              onChange={onChange}
              relationOptions={relationOptions[field.name] ?? []}
              disabled={mode === 'update' && Boolean(field.key)}
              hasError={Boolean(errors[field.name])}
            />
            {errors[field.name] ? (
              <p className="mt-2 text-xs text-[var(--color-rose)]">{errors[field.name]}</p>
            ) : null}
            {field.type === 'multi-relation' ? (
              <p className="mt-2 text-xs text-[var(--color-paper)]/48">
                Use Ctrl/Cmd para selecionar várias séries.
              </p>
            ) : null}
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-full bg-[linear-gradient(90deg,var(--color-mint),#7cf2bf)] px-5 py-3 font-display text-base font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Salvando...' : mode === 'create' ? `Criar ${entity.singular}` : `Atualizar ${entity.singular}`}
        </button>
      </form>
    </section>
  );
});

export default EntityForm;
