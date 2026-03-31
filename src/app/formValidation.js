export function validateField(field, value) {
  if (!field) {
    return '';
  }

  if (!field.required) {
    return '';
  }

  if (field.type === 'relation') {
    return value ? '' : 'Selecione uma opção.';
  }

  if (field.type === 'multi-relation') {
    return Array.isArray(value) && value.length > 0 ? '' : 'Selecione ao menos uma opção.';
  }

  if (field.type === 'text') {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'Este campo é obrigatório.';
    }

    if (text.length < 3) {
      return 'Digite pelo menos 3 caracteres.';
    }

    return '';
  }

  if (field.type === 'textarea') {
    const text = String(value ?? '').trim();

    if (!text) {
      return 'Este campo é obrigatório.';
    }

    if (text.length < 10) {
      return 'Digite pelo menos 10 caracteres.';
    }

    return '';
  }

  if (field.type === 'number' || field.type === 'datetime-local') {
    return value === '' || value === null || value === undefined ? 'Este campo é obrigatório.' : '';
  }

  return '';
}

export function validateForm(fields, values) {
  return fields.reduce((accumulator, field) => {
    const error = validateField(field, values[field.name]);

    if (error) {
      accumulator[field.name] = error;
    }

    return accumulator;
  }, {});
}
