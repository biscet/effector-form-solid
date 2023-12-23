# Адаптированная библиотека effector-forms от 42-px для использования совместно с SolidJS.

- [Установка](#setup)
- [Использование effector-forms](#effector-forms)
- [Hook useForm для SolidJS](#useForm)

<a name="setup"><h2>Установка</h2></a>

`yarn add effector-form-solid` or `npm install effector-form-solid`

<a name="effector-forms"><h2>Использование effector-forms</h2></a>

```js
import { sample } from "effector";
import { createForm } from "src/lib/effector-forms";

export const loginForm = createForm({
  fields: {
    email: {
      init: "",
      rules: [
        {
          name: "email",
          validator: (value) => /\S+@\S+\.\S+/.test(value),
        },
      ],
    },
    password: {
      init: "",
      rules: [
        {
          name: "required",
          validator: Boolean,
        },
      ],
    },
  },
  validateOn: ["submit"],
});

sample({
  clock: loginForm.formValidated,
  fn: (e) => {
    console.log(e);
  },
});
```

[Подробное описание можно найти в оригинальном репозитории 42-px](https://github.com/42-px/effector-forms)

<a name="useForm"><h2>Hook useForm для SolidJS</h2></a>

```js
import { useForm } from "src/lib/effector-forms";
import { loginForm } from "...";

export const Login = () => {
  const { signalValues, sumbit } = useForm(loginForm, ["email", "password"]);

  return (
    <form onSubmit={sumbit}>
      <input
        type="text"
        value={signalValues.email.value()}
        onInput={(e) => signalValues.email.onChange(e.target.value)}
      />

      <input
        type="password"
        value={signalValues.password.value()}
        onInput={(e) => signalValues.password.onChange(e.target.value)}
      />

      <button type="submit">submit</button>
    </form>
  );
};
```
