import { Controller, useForm } from "react-hook-form";
import Button from "./Button";
import { Children, cloneElement, isValidElement } from "react";
import ReactDatePicker from "react-datepicker";

function Form({
  children,
  onSubmit,
  submitButtonText,
  isLoading,
  submitButtonLoadingText,
  initialValues,
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { register, errors, control });
    }
  });
  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
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
  type = "text",
  register,
  errors,
  errorList,
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

function DateInput({ labelText, fieldName, validation, errors, control }) {
  return (
    <div className="flex flex-col">
      <label className="block font-medium text-gray-600">{labelText}</label>
      <Controller
        name={fieldName}
        control={control}
        rules={validation}
        render={({ field }) => (
          <ReactDatePicker
            className="mt-1 w-full rounded border p-2"
            selected={field.value}
            onChange={(date) => field.onChange(date)}
            dateFormat="yyyy/MM/dd"
            maxDate={new Date()}
          />
        )}
      />
      {errors[fieldName] && (
        <p className="mt-1 text-red-600">{errors[fieldName].message}</p>
      )}
    </div>
  );
}

Form.DateInput = DateInput;
Form.Input = Input;

export default Form;
