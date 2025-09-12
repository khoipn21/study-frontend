import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { useMemo, useState, useEffect, createContext, useContext } from 'react';
import { FieldGroupApi, FormApi, functionalUpdate, FieldApi } from '@tanstack/form-core';
import { useStore } from '@tanstack/react-store';
import { I as Input, B as Button } from './ssr.mjs';
import { T as Textarea } from './textarea-BwlHZp3V.mjs';
import { S as Select$1, a as SelectTrigger, b as SelectValue, c as SelectContent, e as SelectGroup, f as SelectLabel, d as SelectItem } from './select-BQyaqGxc.mjs';
import { L as Label } from './label-DJNj9mF1.mjs';

const useIsomorphicLayoutEffect = useEffect;
function useField(opts) {
  const [fieldApi] = useState(() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name
    });
    const extendedApi = api;
    extendedApi.Field = Field;
    return extendedApi;
  });
  useIsomorphicLayoutEffect(fieldApi.mount, [fieldApi]);
  useIsomorphicLayoutEffect(() => {
    fieldApi.update(opts);
  });
  useStore(
    fieldApi.store,
    opts.mode === "array" ? (state) => {
      var _a;
      return [
        state.meta,
        Object.keys((_a = state.value) != null ? _a : []).length
      ];
    } : void 0
  );
  return fieldApi;
}
const Field = (({
  children,
  ...fieldOptions
}) => {
  const fieldApi = useField(fieldOptions);
  const jsxToDisplay = useMemo(
    () => functionalUpdate(children, fieldApi),
    /**
     * The reason this exists is to fix an issue with the React Compiler.
     * Namely, functionalUpdate is memoized where it checks for `fieldApi`, which is a static type.
     * This means that when `state.value` changes, it does not trigger a re-render. The useMemo explicitly fixes this problem
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, fieldApi, fieldApi.state.value, fieldApi.state.meta]
  );
  return /* @__PURE__ */ jsx(Fragment, { children: jsxToDisplay });
});
function LocalSubscribe$1({
  form,
  selector,
  children
}) {
  const data = useStore(form.store, selector);
  return functionalUpdate(children, data);
}
function useForm(opts) {
  const [formApi] = useState(() => {
    const api = new FormApi(opts);
    const extendedApi = api;
    extendedApi.Field = function APIField(props) {
      return /* @__PURE__ */ jsx(Field, { ...props, form: api });
    };
    extendedApi.Subscribe = function Subscribe(props) {
      return /* @__PURE__ */ jsx(
        LocalSubscribe$1,
        {
          form: api,
          selector: props.selector,
          children: props.children
        }
      );
    };
    return extendedApi;
  });
  useIsomorphicLayoutEffect(formApi.mount, []);
  useIsomorphicLayoutEffect(() => {
    formApi.update(opts);
  });
  return formApi;
}
function LocalSubscribe({
  lens,
  selector,
  children
}) {
  const data = useStore(lens.store, selector);
  return functionalUpdate(children, data);
}
function useFieldGroup(opts) {
  const [formLensApi] = useState(() => {
    const api = new FieldGroupApi(opts);
    const form = opts.form instanceof FieldGroupApi ? opts.form.form : opts.form;
    const extendedApi = api;
    extendedApi.AppForm = function AppForm(appFormProps) {
      return /* @__PURE__ */ jsx(form.AppForm, { ...appFormProps });
    };
    extendedApi.AppField = function AppField({ name, ...appFieldProps }) {
      return /* @__PURE__ */ jsx(
        form.AppField,
        {
          name: formLensApi.getFormFieldName(name),
          ...appFieldProps
        }
      );
    };
    extendedApi.Field = function Field2({ name, ...fieldProps }) {
      return /* @__PURE__ */ jsx(
        form.Field,
        {
          name: formLensApi.getFormFieldName(name),
          ...fieldProps
        }
      );
    };
    extendedApi.Subscribe = function Subscribe(props) {
      return /* @__PURE__ */ jsx(
        LocalSubscribe,
        {
          lens: formLensApi,
          selector: props.selector,
          children: props.children
        }
      );
    };
    return Object.assign(extendedApi, {
      ...opts.formComponents
    });
  });
  useIsomorphicLayoutEffect(formLensApi.mount, [formLensApi]);
  return formLensApi;
}
const fieldContext$1 = createContext(null);
const formContext$1 = createContext(null);
function createFormHookContexts() {
  function useFieldContext2() {
    const field = useContext(fieldContext$1);
    if (!field) {
      throw new Error(
        "`fieldContext` only works when within a `fieldComponent` passed to `createFormHook`"
      );
    }
    return field;
  }
  function useFormContext2() {
    const form = useContext(formContext$1);
    if (!form) {
      throw new Error(
        "`formContext` only works when within a `formComponent` passed to `createFormHook`"
      );
    }
    return form;
  }
  return { fieldContext: fieldContext$1, useFieldContext: useFieldContext2, useFormContext: useFormContext2, formContext: formContext$1 };
}
function createFormHook({
  fieldComponents,
  fieldContext: fieldContext2,
  formContext: formContext2,
  formComponents
}) {
  function useAppForm2(props) {
    const form = useForm(props);
    const AppForm = useMemo(() => {
      const AppForm2 = (({ children }) => {
        return /* @__PURE__ */ jsx(formContext2.Provider, { value: form, children });
      });
      return AppForm2;
    }, [form]);
    const AppField = useMemo(() => {
      const AppField2 = (({ children, ...props2 }) => {
        return /* @__PURE__ */ jsx(form.Field, { ...props2, children: (field) => (
          // eslint-disable-next-line @eslint-react/no-context-provider
          /* @__PURE__ */ jsx(fieldContext2.Provider, { value: field, children: children(Object.assign(field, fieldComponents)) })
        ) });
      });
      return AppField2;
    }, [form]);
    const extendedForm = useMemo(() => {
      return Object.assign(form, {
        AppField,
        AppForm,
        ...formComponents
      });
    }, [form, AppField, AppForm]);
    return extendedForm;
  }
  function withForm({
    render,
    props
  }) {
    return (innerProps) => render({ ...props, ...innerProps });
  }
  function withFieldGroup({
    render,
    props,
    defaultValues
  }) {
    return function Render(innerProps) {
      const fieldGroupProps = useMemo(() => {
        return {
          form: innerProps.form,
          fields: innerProps.fields,
          defaultValues,
          formComponents
        };
      }, [innerProps.form, innerProps.fields]);
      const fieldGroupApi = useFieldGroup(fieldGroupProps);
      return render({ ...props, ...innerProps, group: fieldGroupApi });
    };
  }
  return {
    useAppForm: useAppForm2,
    withForm,
    withFieldGroup
  };
}
const { fieldContext, useFieldContext, formContext, useFormContext } = createFormHookContexts();
function SubscribeButton({ label }) {
  const form = useFormContext();
  return /* @__PURE__ */ jsx(form.Subscribe, { selector: (state) => state.isSubmitting, children: (isSubmitting) => /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: label }) });
}
function ErrorMessages({
  errors
}) {
  return /* @__PURE__ */ jsx(Fragment, { children: errors.map((error) => /* @__PURE__ */ jsx(
    "div",
    {
      className: "text-red-500 mt-1 font-bold",
      children: typeof error === "string" ? error : error.message
    },
    typeof error === "string" ? error : error.message
  )) });
}
function TextField({
  label,
  placeholder
}) {
  const field = useFieldContext();
  const errors = useStore(field.store, (state) => state.meta.errors);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: label, className: "mb-2 text-xl font-bold", children: label }),
    /* @__PURE__ */ jsx(
      Input,
      {
        value: field.state.value,
        placeholder,
        onBlur: field.handleBlur,
        onChange: (e) => field.handleChange(e.target.value)
      }
    ),
    field.state.meta.isTouched && /* @__PURE__ */ jsx(ErrorMessages, { errors })
  ] });
}
function TextArea({
  label,
  rows = 3
}) {
  const field = useFieldContext();
  const errors = useStore(field.store, (state) => state.meta.errors);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: label, className: "mb-2 text-xl font-bold", children: label }),
    /* @__PURE__ */ jsx(
      Textarea,
      {
        id: label,
        value: field.state.value,
        onBlur: field.handleBlur,
        rows,
        onChange: (e) => field.handleChange(e.target.value)
      }
    ),
    field.state.meta.isTouched && /* @__PURE__ */ jsx(ErrorMessages, { errors })
  ] });
}
function Select({
  label,
  values,
  placeholder
}) {
  const field = useFieldContext();
  const errors = useStore(field.store, (state) => state.meta.errors);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs(
      Select$1,
      {
        name: field.name,
        value: field.state.value,
        onValueChange: (value) => field.handleChange(value),
        children: [
          /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full", children: /* @__PURE__ */ jsx(SelectValue, { placeholder }) }),
          /* @__PURE__ */ jsx(SelectContent, { children: /* @__PURE__ */ jsxs(SelectGroup, { children: [
            /* @__PURE__ */ jsx(SelectLabel, { children: label }),
            values.map((value) => /* @__PURE__ */ jsx(SelectItem, { value: value.value, children: value.label }, value.value))
          ] }) })
        ]
      }
    ),
    field.state.meta.isTouched && /* @__PURE__ */ jsx(ErrorMessages, { errors })
  ] });
}
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
    TextArea
  },
  formComponents: {
    SubscribeButton
  },
  fieldContext,
  formContext
});

export { useAppForm as u };
//# sourceMappingURL=demo.form-JG5l18qT.mjs.map
