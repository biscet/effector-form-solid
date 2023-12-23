import { useUnit } from 'effector-solid';

const isEmpty = (obj) => [Object, Array].includes((obj || {}).constructor)
    && Object.entries((obj || {})).length === 0;

export const useForm = (currentForm, labelsForSignals) => {
  const form = useUnit(currentForm);
  const values = useUnit(currentForm.$values);
  let signalValues = {};

  if (!isEmpty(labelsForSignals)) {
    labelsForSignals.forEach((label) => {
      signalValues = { ...signalValues, [label]: useUnit(currentForm.fields[label]) };
    });
  }

  const submitHandler = (e) => {
    e.preventDefault();
    form.submit();
  };

  return ({
    ...form,
    fields: currentForm.fields,
    sumbit: submitHandler,
    values,
    signalValues
  });
};
