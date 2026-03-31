import EntityForm from '../ui/components/EntityForm.jsx';
import { getEntityDefinition, getEmptyFormValues } from '../domain/entities/catalog.js';

const entity = getEntityDefinition('tvShows');

export default {
  title: 'Catálogo/Formulário de Entidade',
  component: EntityForm,
  args: {
    entity,
    values: getEmptyFormValues('tvShows'),
    mode: 'create',
    relationOptions: {},
    isSubmitting: false,
    onChange: () => {},
    onSubmit: (event) => event.preventDefault(),
    onReset: () => {}
  }
};

export const Criacao = {};

export const Atualizacao = {
  args: {
    mode: 'update',
    values: {
      title: 'Dark',
      description: 'Um mistério envolvente com linhas do tempo entrelaçadas.',
      recommendedAge: 16
    }
  }
};
