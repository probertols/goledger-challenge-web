import type { ReactNode } from 'react';

type AppFrameProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

function AppFrame({ sidebar, children }: AppFrameProps) {
  return (
    <div className="min-h-screen bg-transparent text-[var(--color-paper)]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6 lg:py-6">
        <aside className="lg:sticky lg:top-6 lg:w-[320px] lg:flex-none lg:self-start">{sidebar}</aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default AppFrame;
