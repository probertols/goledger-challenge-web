import { z } from 'zod';
import type { EntityDefinition, EntityField, FormValues } from '../domain/entities/catalog';

type FieldErrors = Record<string, string>;

const REQUIRED_MESSAGE = 'Este campo é obrigatório.';

function createFieldSchema(field: EntityField) {
  switch (field.type) {
    case 'relation':
      return field.required
        ? z.string().trim().min(1, 'Selecione uma opção.')
        : z.string().trim();
    case 'multi-relation':
      return field.required
        ? z.array(z.string()).min(1, 'Selecione ao menos uma opção.')
        : z.array(z.string());
    case 'text': {
      let schema = z.string().trim();
      const minLength = field.minLength;

      if (field.required) {
        schema = schema.min(1, REQUIRED_MESSAGE);
      }

      if (minLength) {
        schema = schema.refine(
          (value) => !value || value.length >= minLength,
          `Digite pelo menos ${minLength} caracteres.`
        );
      }

      return schema;
    }
    case 'textarea': {
      let schema = z.string().trim();
      const minLength = field.minLength;

      if (field.required) {
        schema = schema.min(1, REQUIRED_MESSAGE);
      }

      if (minLength) {
        schema = schema.refine(
          (value) => !value || value.length >= minLength,
          `Digite pelo menos ${minLength} caracteres.`
        );
      }

      return schema;
    }
    case 'number': {
      let schema = z.string().trim();

      if (field.required) {
        schema = schema.min(1, REQUIRED_MESSAGE);
      }

      schema = schema.refine((value) => !value || !Number.isNaN(Number(value)), 'Informe um número válido.');

      if (field.min !== undefined) {
        schema = schema.refine(
          (value) => !value || Number(value) >= field.min!,
          `Informe um valor maior ou igual a ${field.min}.`
        );
      }

      if (field.max !== undefined) {
        schema = schema.refine(
          (value) => !value || Number(value) <= field.max!,
          `Informe um valor menor ou igual a ${field.max}.`
        );
      }

      return schema;
    }
    case 'datetime-local':
      return field.required ? z.string().trim().min(1, REQUIRED_MESSAGE) : z.string().trim();
    default:
      return z.string();
  }
}

export function createEntitySchema(entity: EntityDefinition) {
  const shape = entity.fields.reduce<Record<string, ReturnType<typeof createFieldSchema>>>((accumulator, field) => {
    accumulator[field.name] = createFieldSchema(field);
    return accumulator;
  }, {});

  return z.object(shape);
}

export function validateForm(entity: EntityDefinition, values: FormValues): FieldErrors {
  const result = createEntitySchema(entity).safeParse(values);

  if (result.success) {
    return {};
  }

  return Object.entries(result.error.flatten().fieldErrors).reduce<FieldErrors>((accumulator, [field, messages]) => {
    if (messages && messages.length > 0) {
      accumulator[field] = messages[0];
    }

    return accumulator;
  }, {});
}
