import { formatRecordValue, getRecordLabel } from '../../domain/entities/catalog.js';

function EntityTable({ entity, records, relatedMaps, onEdit, onDelete, emptyMessage, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-[24px] border border-[var(--color-paper)]/10 bg-[var(--color-steel)]/15 p-6 text-sm text-[var(--color-paper)]/70">
        Carregando {entity.title.toLowerCase()}...
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-[var(--color-paper)]/15 bg-[var(--color-steel)]/10 p-8 text-center">
        <p className="font-display text-2xl text-white">Ainda não há nada por aqui</p>
        <p className="mt-2 text-sm text-[var(--color-paper)]/62">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <article
          key={record['@key']}
          className="rounded-[24px] border border-[var(--color-paper)]/10 bg-[linear-gradient(180deg,rgba(245,251,239,0.05),rgba(97,112,125,0.08))] p-5 shadow-lg shadow-black/10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl text-white">
                  {getRecordLabel(entity.assetType, record, relatedMaps)}
                </h3>
                <span className="rounded-full border border-[var(--color-paper)]/10 bg-[var(--color-steel)]/18 px-3 py-1 text-xs uppercase tracking-[0.25em] text-[var(--color-paper)]/55">
                  {entity.singular}
                </span>
              </div>

              <dl className="mt-4 grid gap-3 md:grid-cols-2">
                {entity.fields.map((field) => (
                  <div key={field.name} className="rounded-2xl border border-[var(--color-paper)]/8 bg-[var(--color-paper)]/4 p-3">
                    <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-paper)]/48">{field.label}</dt>
                    <dd className="mt-1 text-sm text-[var(--color-paper)]/84">
                      {formatRecordValue(field, record[field.name], relatedMaps)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(record)}
                className="cursor-pointer rounded-full border border-[var(--color-plum)]/35 bg-[var(--color-plum)]/14 px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-plum)]/22"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(record)}
                className="cursor-pointer rounded-full border border-[var(--color-rose)]/40 bg-[var(--color-rose)]/10 px-4 py-2 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-rose)]/20"
              >
                Excluir
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default EntityTable;
