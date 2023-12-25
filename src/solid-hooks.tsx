import { useUnit } from "effector-solid";
import { AnyFormValues, Form } from "./index";

const isEmpty = (obj: any): Boolean =>
  [Object, Array].includes((obj || {}).constructor) &&
  Object.entries(obj || {}).length === 0;

/**
 * @group Hooks
 */
export function useFormSignals<
  F extends AnyFormValues,
  S extends Array<string>
>(currentForm: Form<F>, signals: S): any {
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
    signals.forEach((label: string) => {
      fields = {
        ...fields,
        [label]: useUnit(currentForm.fields[label]),
      };
    });
  }

  return fields;
}

export function useForm<F extends AnyFormValues, S extends Array<string>>(
  currentForm: Form<F>,
  signals: S
): any {
  const form = useUnit(currentForm);
  const fields = useFormSignals(currentForm, signals);

  const submitHandler = (e: any): void => {
    e.preventDefault();
    form.submit();
  };

  return {
    ...form,
    submit: submitHandler,
    fields,
  };
}

export function useFormField<F extends AnyFormValues, N extends string>(
  currentForm: Form<F>,
  fieldName: N
): any {
  const field = useUnit(currentForm.fields[fieldName]);

  const onChangeField = (e: any): void => {
    field.onChange(e.target.value);
  };

  return {
    ...field,
    onChangeField,
  };
}
