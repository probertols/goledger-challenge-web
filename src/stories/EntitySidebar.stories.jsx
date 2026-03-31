import EntitySidebar from '../ui/components/EntitySidebar.jsx';
import { ENTITY_ORDER, getEntityDefinition } from '../domain/entities/catalog.js';

export default {
  title: 'Catálogo/Barra Lateral',
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
};

export const Padrao = {};
