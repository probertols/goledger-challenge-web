import type { Meta, StoryObj } from '@storybook/react';
import ToastStack from '../ui/components/ToastStack';

const meta = {
  title: 'Feedback/ToastStack',
  component: ToastStack,
  args: {
    items: [
      {
        id: 'success-toast',
        type: 'success',
        title: 'Registro criado',
        message: 'A série foi salva com sucesso.'
      },
      {
        id: 'error-toast',
        type: 'error',
        title: 'Erro ao carregar',
        message: 'Não foi possível sincronizar os dados agora.'
      }
    ],
    onDismiss: () => {}
  }
} satisfies Meta<typeof ToastStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
