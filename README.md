# Адаптированная библиотека effector-forms от 42-px для использования совместно с SolidJS.

## Установка

`yarn add effector-form-solid` or `npm install effector-form-solid`

- [Документация](https://biscet.github.io/effector-form-solid-docs/)
- [Подробное описание можно найти в оригинальном репозитории 42-px](https://github.com/42-px/effector-forms)

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
  const { submit, fields } = useForm(loginForm);

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        name="email"
        value={fields.email.value()}
        onInput={(e) => fields.email.onChange(e.target.value)}
        onBlur={fields.email.onBlur}
      />
      <p>{fields.email.errorText()}</p>

      <input
        type="password"
        name="password"
        value={fields.password.value()}
        onInput={(e) => fields.password.onChange(e.target.value)}
        onBlur={fields.password.onBlur}
      />
      <p>{fields.password.errorText()}</p>

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
  const fields = useFormSignals(fullNameForm);

  console.log("useFormSignals", fields);

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
        value={fields.firstName.value()}
        onInput={(e) => fields.firstName.onChange(e.target.value)}
        onBlur={fields.firstName.onBlur}
      />

      <br />

      <input
        type="text"
        name="secondName"
        value={fields.secondName.value()}
        onInput={(e) => fields.secondName.onChange(e.target.value)}
        onBlur={fields.secondName.onBlur}
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

const fields = useFormSignals(fullNameForm, ["firstName", "secondName"]);
const { fields } = useForm(fullNameForm, ["firstName", "secondName"]);

// fields => { firstName: {...}, secondName: {...} }
```

## Hook useFormField для SolidJS

```js
import { useFormField, createForm } from "effector-form-solid";

const nameForm = createForm({
  fields: {
    firstName: {
      init: "",
    },
    secondName: {
      init: "",
    },
  },
  validateOn: ["submit"],
});

export const Login = () => {
  const { onChangeField: onChangeFirstName, value: firstNameValue } =
    useFormField(nameForm, "firstName");

  const { onChangeField: onChangeSecondName, value: secondNameValue } =
    useFormField(nameForm, "secondName");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        nameForm.submit();
      }}
    >
      <input
        type="text"
        name="firstName"
        value={firstNameValue()}
        onInput={onChangeFirstName}
      />

      <br />

      <input
        type="text"
        name="secondName"
        value={secondNameValue()}
        onInput={onChangeSecondName}
      />

      <br />

      <button type="submit">Submit</button>
    </form>
  );
};
```
