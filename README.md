# Адаптированная библиотека effector-forms от 42-px для использования совместно с SolidJS.

## Установка

`yarn add effector-form-solid` or `npm install effector-form-solid`

[Подробное описание можно найти в оригинальном репозитории 42-px](https://github.com/42-px/effector-forms)

## Hook useForm для SolidJS

```js
import { useForm, createForm } from "effector-form-solid";

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

export const Login = () => {
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
```

## Hook useFormSignals для SolidJS

```js
import { useFormSignals, createForm } from "effector-form-solid";

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

export const Login = () => {
  const values = useFormSignals(fullNameForm);

  console.log("useFormSignals", values);

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
```

## Получение определенных сигналов в хуках

```js
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

const values = useFormSignals(fullNameForm, ["firstName", "secondName"]);
const { values } = useForm(fullNameForm, ["firstName", "secondName"]);

// values => { firstName: {...}, secondName: {...} }
```
