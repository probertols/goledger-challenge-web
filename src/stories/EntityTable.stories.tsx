import type { Meta, StoryObj } from '@storybook/react';
import EntityTable from '../ui/components/EntityTable';
import {
  createRelatedMaps,
  EMPTY_RECORDS_BY_ENTITY,
  getEntityDefinition,
  type RecordsByEntity
} from '../domain/entities/catalog';

const recordsByEntity: RecordsByEntity = {
  ...EMPTY_RECORDS_BY_ENTITY,
  tvShows: [
    {
      '@key': 'tvShows:dark',
      title: 'Dark',
      description: 'Mistério, viagem no tempo e famílias interligadas.',
      recommendedAge: 16
    }
  ]
};

const meta = {
  title: 'Catálogo/EntityTable',
  component: EntityTable,
  args: {
    entity: getEntityDefinition('tvShows'),
    records: recordsByEntity.tvShows,
    relatedMaps: createRelatedMaps(recordsByEntity),
    onEdit: () => {},
    onDelete: () => {},
    emptyMessage: 'Crie o primeiro registro.',
    isLoading: false
  }
} satisfies Meta<typeof EntityTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Populated: Story = {};

export const Empty: Story = {
  args: {
    records: []
  }
};

export const Loading: Story = {
  args: {
    isLoading: true
  }
};
