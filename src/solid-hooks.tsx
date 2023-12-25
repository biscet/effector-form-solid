import { useUnit } from "effector-solid";
import {
  ValidationError,
  AnyFormValues,
  Form
} from "./types"

type ErrorTextMap = {
  [key: string]: string
}

type AddErrorPayload = { rule: string; errorText?: string }

type ConnectedField<Value> = {
  name?: string
  value?: Value
  errors?: ValidationError<Value>[]
  firstError?: ValidationError<Value> | null
  hasError?: () => boolean
  onChange?: (v: Value) => Value
  onBlur?: (v: void) => void
  errorText?: (map?: ErrorTextMap) => string
  addError?: (p: AddErrorPayload) => AddErrorPayload
  validate?: (v: void) => void
  isValid?: boolean
  isDirty?: boolean
  isTouched?: boolean
  touched?: boolean
  reset?: (v: void) => void
  set?: (v: Value) => Value
  resetErrors?: (v: void) => void
  onChangeField?: (e: any) => void
}


const isEmpty = (obj: any): Boolean =>
  [Object, Array].includes((obj || {}).constructor) &&
  Object.entries(obj || {}).length === 0;

/**
 * @group Hooks
 */
export function useFormSignals<F extends AnyFormValues>(currentForm: Form<F>, signals:  Array<string>) {
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

export function useForm<F extends AnyFormValues>(currentForm: Form<F>, signals: Array<string>) {
  const form = useUnit(currentForm);
  const fields = useFormSignals(currentForm, signals);

  const submitHandler = (e: any): void  => {
    e.preventDefault();
    form.submit();
  };

  return {
    ...form,
    submit: submitHandler,
    fields,
  };
};

export function useFormField<F extends AnyFormValues>(currentForm: Form<F>, fieldName: string) {
  const field = useUnit(currentForm.fields[fieldName]);

  const onChangeField = (e: any): void => {
    field.onChange(e.target.value)
  };

  return {
    ...field,
    onChangeField
  } as ConnectedField<any> ;
};