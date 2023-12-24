import { sample } from "effector";
import { createForm, useFormSignals } from "src";

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
    console.log("submit fullNameForm signals", e);
  },
});

export const UseFormSignalsRecieveSignal = () => {
  const values = useFormSignals(fullNameForm, ["firstName", "secondName"]);

  console.log("useFormSignalsRecieveSignal", values);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fullNameForm.submit();
      }}
    >
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
