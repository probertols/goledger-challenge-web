import type { CatalogRecord } from '../../domain/entities/catalog';

type ConfirmDialogProps = {
  isOpen: boolean;
  record: CatalogRecord | null;
  entityLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
};

function ConfirmDialog({
  isOpen,
  record,
  entityLabel,
  onCancel,
  onConfirm,
  isConfirming = false
}: ConfirmDialogProps) {
  if (!isOpen || !record) {
    return null;
  }

  const recordLabel = String(record.title ?? record['@key'] ?? '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-[28px] border border-[var(--color-paper)]/12 bg-[var(--color-panel)] p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/50">Confirmação</p>
        <h2 id="confirm-dialog-title" className="mt-3 font-display text-3xl text-white">
          Excluir {entityLabel.toLowerCase()}?
        </h2>
        <p className="mt-3 text-sm text-[var(--color-paper)]/75">
          Essa ação remove <span className="font-semibold text-white">{recordLabel}</span> da visualização atual.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="cursor-pointer rounded-full border border-[var(--color-paper)]/12 px-5 py-3 text-sm font-semibold text-white/85 transition hover:bg-[var(--color-steel)]/22 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="cursor-pointer rounded-full border border-[var(--color-rose)]/35 bg-[var(--color-rose)]/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-rose)]/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isConfirming ? 'Excluindo...' : 'Confirmar exclusão'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
