import { combine } from 'effector';

export function createCombineValidator(rulesOrResolver) {
  return (value, form, rulesSources) => {
    const errors = [];
    const rules = typeof rulesOrResolver === 'function'
      ? rulesOrResolver(value, form)
      : rulesOrResolver;

    for (const [i, rule] of rules.entries()) {
      const source = rulesSources ? rulesSources[i] : null;
      const result = rule.validator(value, form, source);

      if (typeof result === 'boolean' && !result) {
        errors.push({
          rule: rule.name,
          errorText: rule.errorText,
          value
        });
      }

      if (typeof result === 'object' && !result.isValid) {
        errors.push({
          rule: rule.name,
          errorText: result.errorText,
          value
        });
      }
    }

    return errors;
  };
}

export function eachValid(fields) {
  const firstErrors = [];

  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue;

    const { $firstError } = fields[fieldName];

    firstErrors.push($firstError);
  }

  const $firstErrors = combine(firstErrors);

  return $firstErrors.map((errors) => errors.every(error => error === null));
}
