import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from '../ui/components/ConfirmDialog';

const meta = {
  title: 'Feedback/ConfirmDialog',
  component: ConfirmDialog,
  args: {
    isOpen: true,
    entityLabel: 'Série',
    record: {
      '@key': 'tvShows:dark',
      title: 'Dark'
    },
    onCancel: () => {},
    onConfirm: () => {},
    isConfirming: false
  }
} satisfies Meta<typeof ConfirmDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Confirming: Story = {
  args: {
    isConfirming: true
  }
};
