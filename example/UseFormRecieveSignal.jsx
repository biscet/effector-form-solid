import { sample } from "effector";
import { createForm, useForm } from "src";

const fullNameForm = createForm({
  fields: {
    firstName: {
      init: "",
    },
    secondName: {
      init: "",
    },
    lastName: {
      init: "",
    },
    age: {
      init: "",
    },
  },
  validateOn: ["submit"],
});

sample({
  clock: fullNameForm.formValidated,
  fn: (e) => {
    console.log("submit fullNameForm", e);
  },
});

export const UseFormRecieveSignal = () => {
  const { submit, values } = useForm(fullNameForm, ["firstName", "secondName"]);

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        name="firstName"
        value={values.firstName.value()}
        onInput={(e) => values.firstName.onChange(e.target.value)}
        onBlur={values.firstName.onBlur}
      />

      <br />

      <input
        type="text"
        name="secondName"
        value={values.secondName.value()}
        onInput={(e) => values.secondName.onChange(e.target.value)}
        onBlur={values.secondName.onBlur}
      />

      <br />

      <button type="submit">Submit</button>
    </form>
  );
};
