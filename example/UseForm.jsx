import { sample } from "effector";
import { createForm, useForm } from "src";

const loginForm = createForm({
  fields: {
    email: {
      init: "",
      rules: [
        {
          name: "email",
          validator: (value) => ({
            isValid: /\S+@\S+\.\S+/.test(value),
            errorText: "Incorrect email",
          }),
        },
      ],
      validateOn: ["blur"],
    },
    password: {
      init: "",
      rules: [
        {
          name: "required",
          validator: (value) => ({
            isValid: value.length > 0,
            errorText: "This field is required",
          }),
        },
      ],
      validateOn: ["blur"],
    },
  },
  validateOn: ["submit"],
});

sample({
  clock: loginForm.formValidated,
  fn: (e) => {
    console.log("submit loginForm", e);
  },
});

export const UseForm = () => {
  const { submit, values } = useForm(loginForm);

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        name="email"
        value={values.email.value()}
        onInput={(e) => values.email.onChange(e.target.value)}
        onBlur={values.email.onBlur}
      />
      <p>{values.email.errorText()}</p>

      <input
        type="password"
        name="password"
        value={values.password.value()}
        onInput={(e) => values.password.onChange(e.target.value)}
        onBlur={values.password.onBlur}
      />
      <p>{values.password.errorText()}</p>

      <button type="submit">Submit</button>
    </form>
  );
};
