import type { ToastItem } from '../../app/hooks/useToast';

const TOAST_CONFIG = {
  success: {
    icon: 'Sucesso',
    border: 'border-[var(--color-mint)]/40',
    background: 'bg-[rgba(64,249,155,0.14)]'
  },
  delete: {
    icon: 'Exclusão',
    border: 'border-[var(--color-rose)]/45',
    background: 'bg-[rgba(232,93,117,0.16)]'
  },
  error: {
    icon: 'Erro',
    border: 'border-[var(--color-rose)]/45',
    background: 'bg-[rgba(232,93,117,0.16)]'
  }
} as const;

type ToastStackProps = {
  items: ToastItem[];
  onDismiss: (id: string) => void;
};

function ToastStack({ items, onDismiss }: ToastStackProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="pointer-events-auto overflow-hidden rounded-2xl shadow-xl backdrop-blur-xl">
          <div
            className={`rounded-2xl border px-4 py-3 ${TOAST_CONFIG[item.type]?.border ?? TOAST_CONFIG.success.border} ${
              TOAST_CONFIG[item.type]?.background ?? TOAST_CONFIG.success.background
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/55">
                  {TOAST_CONFIG[item.type]?.icon ?? 'Aviso'}
                </p>
                <p className="mt-1 font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-white/75">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => onDismiss(item.id)}
                className="cursor-pointer text-sm text-white/65 transition hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
          <div
            className={`h-1 w-full ${
              item.type === 'error' || item.type === 'delete'
                ? 'bg-[var(--color-rose)]/55'
                : 'bg-[var(--color-mint)]/55'
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default ToastStack;
