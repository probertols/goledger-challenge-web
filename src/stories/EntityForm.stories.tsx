import type { FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import EntityForm from '../ui/components/EntityForm';
import { getEntityDefinition, getEmptyFormValues } from '../domain/entities/catalog';

const entity = getEntityDefinition('tvShows');

const meta = {
  title: 'Catálogo/EntityForm',
  component: EntityForm,
  args: {
    entity,
    values: getEmptyFormValues('tvShows'),
    mode: 'create',
    relationOptions: {},
    isSubmitting: false,
    errors: {},
    onChange: () => {},
    onSubmit: (event: FormEvent<HTMLFormElement>) => event.preventDefault(),
    onReset: () => {}
  }
} satisfies Meta<typeof EntityForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Creation: Story = {};

export const Update: Story = {
  args: {
    mode: 'update',
    values: {
      title: 'Dark',
      description: 'Um mistério envolvente com linhas do tempo entrelaçadas.',
      recommendedAge: '16'
    }
  }
};
