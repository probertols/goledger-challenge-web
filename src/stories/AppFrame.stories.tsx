import type { Meta, StoryObj } from '@storybook/react';
import AppFrame from '../ui/components/AppFrame';

const meta = {
  title: 'Layout/AppFrame',
  component: AppFrame,
  args: {
    sidebar: (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
        Sidebar de exemplo
      </div>
    ),
    children: (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white">
        Conteúdo principal
      </div>
    )
  }
} satisfies Meta<typeof AppFrame>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
