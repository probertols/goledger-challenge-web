import type { EntityDefinition } from '../../domain/entities/catalog';

type CatalogToolbarProps = {
  activeDefinition: EntityDefinition;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
};

function CatalogToolbar({
  activeDefinition,
  searchValue,
  onSearchChange,
  onRefresh,
  isRefreshing
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-paper)]/12 bg-[var(--color-panel)] p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-paper)]/50">Busca e navegação</p>
        <h3 className="mt-2 font-display text-3xl text-white">{activeDefinition.title}</h3>
      </div>

      <div className="flex w-full max-w-xl gap-3">
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Buscar ${activeDefinition.title.toLowerCase()}...`}
          className="w-full rounded-full border border-[var(--color-paper)]/10 bg-[var(--color-steel)]/16 px-5 py-3 text-sm text-white outline-none transition placeholder:text-[var(--color-paper)]/35 focus:border-[var(--color-mint)]"
        />
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="cursor-pointer rounded-full border border-[var(--color-paper)]/12 bg-[var(--color-steel)]/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-steel)]/28 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRefreshing ? 'Atualizando...' : 'Atualizar'}
        </button>
      </div>
    </div>
  );
}

export default CatalogToolbar;
