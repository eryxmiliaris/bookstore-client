import { Children, cloneElement, isValidElement, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import Button from "./Button";

function Form({
  children,
  onSubmit,
  submitButtonText,
  isLoading,
  submitButtonLoadingText,
  initialValues,
  formKey,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({ defaultValues: initialValues, key: formKey });

  useEffect(() => {
    reset();
    reset(initialValues);
  }, [reset, initialValues, formKey]);

  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        register,
        errors,
        control,
        initialValues,
        getValues,
      });
    }
  });
  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      {childrenWithProps}
      <Button className="mt-2" disabled={isLoading}>
        {isLoading ? submitButtonLoadingText : submitButtonText}
      </Button>
    </form>
  );
}

function Input({
  labelText,
  fieldName,
  validation,
  errorList,
  type = "text",
  placeholder,
  register,
  errors,
}) {
  return (
    <div>
      <label htmlFor={fieldName} className="block font-medium text-gray-600">
        {labelText}
      </label>
      <input
        type={type}
        id={fieldName}
        name={fieldName}
        placeholder={placeholder}
        {...register(fieldName, validation)}
        className="mt-1 w-full rounded border p-2"
      />
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
      {errorList && errorList[fieldName] && (
        <>
          {errorList[fieldName].split(",").map((e) => (
            <p key={e} className="mt-1 text-red-600">
              {e}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

function ConfirmPasswordInput({ errors, register, getValues }) {
  return (
    <div className="mb-4">
      <label
        htmlFor="confirm_password"
        className="block font-medium text-gray-600"
      >
        Confirm password
      </label>
      <input
        type="password"
        id="confirm_password"
        name="confirm_password"
        {...register("confirm_password", {
          required: "This field is required",
          validate: (value) => {
            const { password } = getValues();
            return password === value || "Passwords should match!";
          },
        })}
        className="mt-1 w-full rounded border p-2"
      />
      {errors.confirm_password && (
        <p className="mt-1 text-red-600">{errors.confirm_password.message}</p>
      )}
    </div>
  );
}

function DateInput({
  labelText,
  fieldName,
  validation,
  errors,
  control,
  maxDate,
}) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={validation}
        render={({ field }) => {
          return (
            <ReactDatePicker
              className="mt-1 w-full rounded border p-2"
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat="yyyy/MM/dd"
              maxDate={maxDate}
            />
          );
        }}
      />
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

function TextAreaInput({
  labelText,
  fieldName,
  validation,
  errors,
  control,
  cols = 50,
  rows = 4,
}) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={validation}
        render={({ field }) => (
          <textarea className="p-2" {...field} rows={rows} cols={cols} />
        )}
      />
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

function SelectInput({
  labelText,
  fieldName,
  validation,
  options,
  errors,
  control,
}) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={validation}
        render={({ field }) => <Select {...field} options={options} />}
      />
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

function CheckboxInput({ labelText, fieldName, validation, errors, control }) {
  return (
    <div>
      <label className="block font-medium text-gray-600">{labelText}</label>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <input
            className="mr-2"
            type="checkbox"
            onChange={(e) => {
              const isChecked = e.target.checked;
              field.onChange(isChecked);
            }}
            checked={field.value}
          />
        )}
      />
      {labelText}
    </div>
  );
}

function CheckboxGroupInput({
  labelText,
  fieldName,
  validation,
  options,
  errors,
  control,
  initialValues,
}) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      {options.map((el) => (
        <label key={el.value}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue={
              initialValues && initialValues[fieldName]
                ? initialValues[fieldName]
                : []
            }
            rules={validation} // Validation rules passed to the Controller
            render={({ field }) => (
              <div>
                <input
                  className="mr-2"
                  type="checkbox"
                  value={el.value}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const updatedCheckboxes = isChecked
                      ? [...field.value, Number(e.target.value)]
                      : field.value.filter(
                          (value) => value !== Number(e.target.value),
                        );

                    field.onChange(updatedCheckboxes);
                  }}
                  checked={field.value.includes(el.value)}
                />
                {el.label}
              </div>
            )}
          />
        </label>
      ))}
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

function RadioButtonGroupInput({
  labelText,
  fieldName,
  validation,
  options,
  errors,
  control,
}) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      {options.map((el) => (
        <label key={el.value}>
          <Controller
            name={fieldName}
            control={control}
            defaultValue=""
            rules={validation} // Validation rules passed to the Controller
            render={({ field }) => (
              <>
                <input
                  className="mr-2"
                  type="radio"
                  value={el.value}
                  {...field}
                  checked={field.value === el.value}
                  onChange={() => field.onChange(el.value)}
                />
                {el.label}
              </>
            )}
          />
        </label>
      ))}
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

Form.DateInput = DateInput;
Form.TextAreaInput = TextAreaInput;
Form.SelectInput = SelectInput;
Form.CheckboxInput = CheckboxInput;
Form.CheckboxGroupInput = CheckboxGroupInput;
Form.RadioButtonGroupInput = RadioButtonGroupInput;
Form.Input = Input;
Form.ConfirmPasswordInput = ConfirmPasswordInput;

export default Form;
