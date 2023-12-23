import { combine, sample } from 'effector';
import { eachValid } from './validation';
import { createField, bindValidation, bindChangeEvent } from './field';
import { createFormUnit } from './create-form-unit';

function createFormValuesStore(fields) {
  const shape = {};

  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue;

    shape[fieldName] = fields[fieldName].$value;
  }

  return combine(shape);
}

export function createForm(config) {
  const {
    filter: $filter, domain, fields: fieldsConfigs, validateOn, units
  } = config;
  const fields = {};
  const dirtyFlagsArr = [];
  const touchedFlagsArr = [];

  for (const fieldName in fieldsConfigs) {
    if (!fieldsConfigs.hasOwnProperty(fieldName)) continue;

    const fieldConfig = fieldsConfigs[fieldName];
    const field = createField(fieldName, fieldConfig, domain);

    fields[fieldName] = field;
    dirtyFlagsArr.push(field.$isDirty);
    touchedFlagsArr.push(field.$touched);
  }
  const $form = createFormValuesStore(fields);
  const $eachValid = eachValid(fields);
  const $isFormValid = $filter
    ? combine($eachValid, $filter, (valid, filter) => valid && filter)
    : $eachValid;

  const $isDirty = combine(dirtyFlagsArr).map((dirtyFlags) => dirtyFlags.some(Boolean));
  const $touched = combine(touchedFlagsArr).map((touchedFlags) => touchedFlags.some(Boolean));
  const $meta = combine({
    isValid: $eachValid,
    isDirty: $isDirty,
    touched: $touched
  });

  const validate = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.validate
  });
  const submitForm = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.submit
  });

  const formValidated = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.formValidated
  });

  const setInitialForm = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.setInitialForm
  });

  const setForm = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.setForm
  });

  const addErrors = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.addErrors
  });

  const resetForm = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.reset
  });

  const resetValues = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.resetValues
  });

  const resetErrors = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.resetErrors
  });

  const resetTouched = createFormUnit.event({
    domain,
    existing: units === null || units === void 0 ? void 0 : units.resetTouched
  });

  const submitWithFormData = sample({
    source: $form,
    clock: submitForm
  });

  const validateWithFormData = sample({
    source: $form,
    clock: validate
  });

  for (const fieldName in fields) {
    if (!fields.hasOwnProperty(fieldName)) continue;

    const fieldConfig = fieldsConfigs[fieldName];
    const field = fields[fieldName];

    bindChangeEvent({
      form: {
        setForm,
        setInitialForm,
        resetForm,
        resetTouched,
        resetValues
      },
      field
    });

    bindValidation({
      form: {
        $values: $form,
        submit: submitForm,
        reset: resetForm,
        addErrors,
        resetValues,
        resetErrors,
        validate,
        validateOn
      },
      fieldConfig,
      field
    }, { sid: fieldName });
  }

  sample({
    source: submitWithFormData,
    filter: $isFormValid,
    // TODO: fix
    target: formValidated
  });

  sample({
    source: validateWithFormData,
    filter: $isFormValid,
    target: formValidated
  });

  const unitShape = {
    isValid: $eachValid,
    isDirty: $isDirty,
    touched: $touched,
    submit: submitForm,
    reset: resetForm,
    addErrors: addErrors,
    validate,
    setForm,
    setInitialForm,
    resetTouched,
    resetValues,
    resetErrors,
    formValidated
  };

  return {
    fields,
    $values: $form,
    $eachValid,
    $isValid: $eachValid,
    $isDirty: $isDirty,
    $touched: $touched,
    $meta,
    submit: submitForm,
    validate,
    resetTouched,
    addErrors,
    reset: resetForm,
    resetValues,
    resetErrors,
    setForm,
    setInitialForm,
    set: setForm,
    formValidated,
    '@@unitShape': () => unitShape
  };
}
