function EntitySidebar({ entities, activeEntity, onSelect, stats }) {
  return (
    <div className="flex flex-col rounded-[28px] border border-[var(--color-paper)]/12 bg-[linear-gradient(180deg,rgba(24,33,37,0.92),rgba(97,112,125,0.35))] p-5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      <div className="border-b border-[var(--color-paper)]/10 pb-5">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-[var(--color-mint)]">
          Painel de catálogo
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">
          Central de controle das séries
        </h1>
        <p className="mt-3 text-sm text-[var(--color-paper)]/72">
          Um espaço visual para navegar por séries, temporadas, episódios e watchlists na blockchain.
        </p>
      </div>

      <div className="mt-5 space-y-2">
        {entities.map((entity) => {
          const isActive = entity.assetType === activeEntity;

          return (
            <button
              key={entity.assetType}
              type="button"
              onClick={() => onSelect(entity.assetType)}
              className={`cursor-pointer w-full rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? 'border-[var(--color-paper)]/12 bg-[linear-gradient(135deg,rgba(64,249,155,0.14),rgba(157,105,163,0.16))] shadow-lg'
                  : 'border-transparent bg-white/[0.03] hover:border-[var(--color-paper)]/10 hover:bg-white/[0.06]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-medium text-white">{entity.title}</p>
                  <p className="mt-1 text-sm text-white/60">{entity.description}</p>
                </div>
                <span
                  className="mt-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: entity.accent }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[var(--color-paper)]/10 bg-[linear-gradient(180deg,rgba(232,93,117,0.08),rgba(97,112,125,0.12))] p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-paper)]/50">{stat.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EntitySidebar;
