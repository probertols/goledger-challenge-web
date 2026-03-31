import type { EntityDefinition } from '../../domain/entities/catalog';

type CatalogHeroProps = {
  activeDefinition: EntityDefinition;
  filteredCount: number;
  totalRecords: number;
};

function CatalogHero({ activeDefinition, filteredCount, totalRecords }: CatalogHeroProps) {
  const activeHighlightStyles = {
    borderColor: `color-mix(in srgb, ${activeDefinition.accent} 35%, transparent)`,
    backgroundColor: `color-mix(in srgb, ${activeDefinition.accent} 16%, transparent)`
  };

  return (
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
            Interface construída com React, TypeScript, React Query, Zod e componentes documentados
            no Storybook.
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper)]/60">
              Registros filtrados
            </p>
            <p className="mt-1 font-display text-lg leading-none text-white">{filteredCount}</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-[var(--color-rose)]/20 bg-[var(--color-rose)]/12 px-3 py-3 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-paper)]/60">
              Total do catálogo
            </p>
            <p className="mt-1 font-display text-lg leading-none text-white">{totalRecords}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CatalogHero;
