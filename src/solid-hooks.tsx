import { useUnit } from "effector-solid";

const isEmpty = (obj: any): Boolean =>
  [Object, Array].includes((obj || {}).constructor) &&
  Object.entries(obj || {}).length === 0;

/**
 * @group Hooks
 */
export const useFormSignals = (currentForm: any, signals: any) => {
  const labelsForSignals = Object.keys(currentForm.fields);
  let fields = {};

  if (isEmpty(signals)) {
    labelsForSignals.forEach((label) => {
      fields = {
        ...fields,
        [label]: useUnit(currentForm.fields[label]),
      };
    });
  } else {
    signals.forEach((label: any) => {
      fields = {
        ...fields,
        [label]: useUnit(currentForm.fields[label]),
      };
    });
  }

  return fields;
};

export const useForm = (currentForm: any, signals: any) => {
  const form: any = useUnit(currentForm);
  const fields = useFormSignals(currentForm, signals);

  const submitHandler = (e: any) => {
    e.preventDefault();
    form.submit();
  };

  return {
    ...form,
    submit: submitHandler,
    fields,
  };
};

export const useFormField = (currentForm: any, fieldName: any) => {
  const field = useUnit(currentForm.fields[fieldName]);

  const onChangeField = (e: any) => field.onChange(e.target.value);

  return {
    ...field,
    onChangeField
  };
};