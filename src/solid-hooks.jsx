import { useUnit } from "effector-solid";

const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  Object.entries(obj || {}).length === 0;

export const useFormSignals = (currentForm, signals) => {
  const labelsForSignals = Object.keys(currentForm.fields);
  let values = {};

  if (isEmpty(signals)) {
    labelsForSignals.forEach((label) => {
      values = {
        ...values,
        [label]: useUnit(currentForm.fields[label]),
      };
    });
  } else {
    signals.forEach((label) => {
      values = {
        ...values,
        [label]: useUnit(currentForm.fields[label]),
      };
    });
  }

  return values;
};

export const useForm = (currentForm, signals) => {
  const form = useUnit(currentForm);
  const values = useFormSignals(currentForm, signals);

  const submitHandler = (e) => {
    e.preventDefault();
    form.submit();
  };

  return {
    ...form,
    submit: submitHandler,
    values,
  };
};
