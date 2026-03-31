import type { Meta, StoryObj } from '@storybook/react';
import EntitySidebar from '../ui/components/EntitySidebar';
import { ENTITY_ORDER, getEntityDefinition } from '../domain/entities/catalog';

const meta = {
  title: 'Catálogo/EntitySidebar',
  component: EntitySidebar,
  args: {
    entities: ENTITY_ORDER.map((assetType) => getEntityDefinition(assetType)),
    activeEntity: 'tvShows',
    onSelect: () => {},
    stats: [
      { label: 'Série', value: '08' },
      { label: 'Temporada', value: '14' },
      { label: 'Episódio', value: '36' },
      { label: 'Watchlist', value: '03' }
    ]
  }
} satisfies Meta<typeof EntitySidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
