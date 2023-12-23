import {
  createStore, combine, sample, merge
} from 'effector';
import { createCombineValidator } from './validation';
import { createFormUnit } from './create-form-unit';

export function createField(fieldName, fieldConfig, domain) {
  var _a; var _b; var _c; var _d; var _e; var _f; var _g; var _h; var _j; var _k; var _l; var
    _m;

  const initValue = typeof fieldConfig.init === 'function'
    ? fieldConfig.init()
    : fieldConfig.init;

  const $value = createFormUnit.store({
    domain,
    existing: (_a = fieldConfig.units) === null || _a === void 0 ? void 0 : _a.$value,
    init: initValue
  }, {
    sid: `${fieldName}-$value`
  });

  const $errors = createFormUnit.store({
    domain,
    existing: (_b = fieldConfig.units) === null || _b === void 0 ? void 0 : _b.$errors,
    init: []
  }, {
    sid: `${fieldName}-$errors`
  });

  const $firstError = $errors.map((errors) => errors[0] ? errors[0] : null);
  const $initValue = createFormUnit.store({
    domain,
    existing: (_c = fieldConfig.units) === null || _c === void 0 ? void 0 : _c.$initValue,
    init: initValue
  }, {
    sid: `${fieldName}-$initValue`
  });

  const $touched = createFormUnit.store({
    domain,
    existing: (_d = fieldConfig.units) === null || _d === void 0 ? void 0 : _d.$isTouched,
    init: false
  }, {
    sid: `${fieldName}-$touched`
  });

  const $isDirty = combine($value, $initValue, (value, initValue) => value !== initValue);
  const onChange = createFormUnit.event({
    domain,
    existing: (_e = fieldConfig.units) === null || _e === void 0 ? void 0 : _e.onChange
  });

  const onBlur = createFormUnit.event({
    domain,
    existing: (_f = fieldConfig.units) === null || _f === void 0 ? void 0 : _f.onBlur
  });

  const changed = createFormUnit.event({
    domain,
    existing: (_g = fieldConfig.units) === null || _g === void 0 ? void 0 : _g.changed
  });

  const addError = createFormUnit.event({
    domain,
    existing: (_h = fieldConfig.units) === null || _h === void 0 ? void 0 : _h.addError
  });

  const validate = createFormUnit.event({
    domain,
    existing: (_j = fieldConfig.units) === null || _j === void 0 ? void 0 : _j.validate
  });

  const resetErrors = createFormUnit.event({
    domain,
    existing: (_k = fieldConfig.units) === null || _k === void 0 ? void 0 : _k.resetErrors
  });

  const resetValue = createFormUnit.event({
    domain,
    existing: (_l = fieldConfig.units) === null || _l === void 0 ? void 0 : _l.resetValue
  });

  const reset = createFormUnit.event({
    domain,
    existing: (_m = fieldConfig.units) === null || _m === void 0 ? void 0 : _m.reset
  });

  const $isValid = $firstError.map((firstError) => firstError === null);
  const $errorText = $firstError.map((firstError) => (firstError === null || firstError === void 0 ? void 0 : firstError.errorText) || '');
  const $field = combine({
    value: $value,
    errors: $errors,
    firstError: $firstError,
    isValid: $isValid,
    isDirty: $isDirty,
    isTouched: $touched
  });

  const unitShape = {
    value: $value,
    initValue: $initValue,
    isValid: $isValid,
    isDirty: $isDirty,
    touched: $touched,
    errors: $errors,
    firstError: $firstError,
    errorText: $errorText,
    onChange,
    onBlur,
    addError,
    validate,
    reset,
    resetErrors,
    resetValue
  };

  return {
    changed,
    name: fieldName,
    $initValue,
    $value,
    $errors,
    $firstError,
    $errorText,
    $isValid,
    $isDirty,
    $isTouched: $touched,
    $touched,
    $field: $field,
    onChange,
    onBlur,
    addError,
    validate,
    set: onChange,
    reset,
    resetErrors,
    resetValue,
    filter: fieldConfig.filter,
    '@@unitShape': () => unitShape
  };
}

export function bindValidation(params) {
  const { form, field, fieldConfig } = params;
  const rules = fieldConfig.rules || [];
  const formValidationEvents = form.validateOn || ['submit'];
  const fieldValidationEvents = fieldConfig.validateOn || [];
  const {
    $value, $errors, onBlur, changed, addError, validate, resetErrors, resetValue, reset
  } = field;
  const rulesSources = typeof rules === 'function'
    ? createStore([], { sid: `${field.name}-$rulesSources` })
    : combine(rules.map(({ source }, i) => {
      const sid = `${field.name}-$rulesSources-${i}`;
      return source || createStore(null, { sid });
    }));

  const validator = createCombineValidator(rules);
  const eventsNames = new Set([...formValidationEvents, ...fieldValidationEvents]);
  const validationEvents = [];

  if (eventsNames.has('submit')) {
    const validationTrigger = sample({
      source: combine({
        fieldValue: $value,
        form: form.$values,
        rulesSources
      }),
      clock: form.submit
    });

    validationEvents.push(validationTrigger);
  }

  if (eventsNames.has('blur')) {
    validationEvents.push(sample({
      source: combine({
        fieldValue: $value,
        form: form.$values,
        rulesSources
      }),
      clock: onBlur
    }));
  }

  if (eventsNames.has('change')) {
    validationEvents.push(sample({
      source: combine({
        fieldValue: $value,
        form: form.$values,
        rulesSources
      }),
      clock: merge([changed, resetValue, form.resetValues])
    }));
  }

  validationEvents.push(sample({
    source: combine({
      fieldValue: $value,
      form: form.$values,
      rulesSources
    }),
    clock: validate
  }));

  validationEvents.push(sample({
    source: combine({
      fieldValue: $value,
      form: form.$values,
      rulesSources
    }),
    clock: form.validate
  }));

  const addErrorWithValue = sample({
    source: $value,
    clock: addError,
    fn: (value, { rule, errorText }) => ({
      rule,
      value,
      errorText
    })
  });

  const addErrorsWithValue = sample({
    source: $value,
    clock: form.addErrors,
    fn: (value, errors) => ({
      value,
      newErrors: errors
    })
  });

  $errors
    .on(validationEvents, (_, { form, fieldValue, rulesSources }) => validator(fieldValue, form, rulesSources))
    .on(addErrorWithValue, (errors, newError) => [newError, ...errors])
    .on(addErrorsWithValue, (currErrors, { value, newErrors }) => {
      const matchedErrors = [];

      for (const newError of newErrors) {
        if (newError.field !== field.name) continue;

        matchedErrors.push({
          value,
          rule: newError.rule,
          errorText: newError.errorText
        });
      }

      return [...matchedErrors, ...currErrors];
    }).reset(resetErrors, form.reset, reset, form.resetErrors);

  if (!eventsNames.has('change')) {
    $errors.reset(changed);
  }
}

export function bindChangeEvent({ field, form }) {
  const {
    $value, $initValue, $touched, onChange, changed, name, reset, resetValue, filter
  } = field;
  const {
    setForm, setInitialForm, resetForm, resetTouched, resetValues
  } = form;
  const resetValueWithInit = sample({
    source: $initValue,
    clock: merge([
      reset,
      resetValue,
      resetValues,
      resetForm
    ])
  });

  $touched
    .on(changed, () => true)
    .reset(reset, resetForm, resetTouched);

  if (filter) {
    sample({
      source: onChange,
      filter: filter,
      target: changed
    });
  } else {
    sample({
      source: onChange,
      filter: (() => true),
      target: changed
    });
  }

  $initValue
    .on(setInitialForm, (curr, updateSet) => updateSet.hasOwnProperty(name)
      ? updateSet[name]
      : curr);

  $value
    .on(changed, (_, value) => value)
    .on([setForm, setInitialForm], (curr, updateSet) => updateSet.hasOwnProperty(name)
      ? updateSet[name]
      : curr)
    .on(resetValueWithInit, (_, initValue) => initValue);
}
