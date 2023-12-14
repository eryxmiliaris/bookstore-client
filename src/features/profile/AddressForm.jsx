import Form from "../../components/Form";

function AddressForm({
  onSubmit,
  isLoading,
  submitButtonText,
  submitButtonLoadingText,
  initialAddress,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
      isLoading={isLoading}
      submitButtonLoadingText={submitButtonLoadingText}
      initialValues={{
        name: initialAddress?.name,
        userName: initialAddress?.userName,
        userSurname: initialAddress?.userSurname,
        city: initialAddress?.city,
        street: initialAddress?.street,
        postalCode: initialAddress?.postalCode,
        phoneNumber: initialAddress?.phoneNumber,
      }}
    >
      <Form.Input
        labelText="Address name"
        fieldName="name"
        placeholder="My address"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Name length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Name length can't be longer than 100",
          },
          pattern: {
            value: /^[A-Za-z0-9\s'-]+$/,
            message: "Invalid address name",
          },
        }}
      />
      <Form.Input
        labelText="User name"
        fieldName="userName"
        placeholder="Name"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Name length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Name length can't be longer than 100",
          },
          pattern: {
            value: /^[A-Z][a-z]*([- ][A-Z][a-z]*)*$/,
            message: "Invalid name",
          },
        }}
      />
      <Form.Input
        labelText="User surname"
        fieldName="userSurname"
        placeholder="Surname"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Surname length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Surname length can't be longer than 100",
          },
          pattern: {
            value: /^[A-Z][a-z]*([- ][A-Z][a-z]*)*$/,
            message: "Invalid surname",
          },
        }}
      />
      <Form.Input
        labelText="City"
        fieldName="city"
        placeholder="City"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "City length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "City length can't be longer than 100",
          },
          pattern: {
            value: /^[A-Z][a-z]*([- ][A-Z][a-z]*)*$/,
            message: "Invalid city name",
          },
        }}
      />

      <Form.Input
        labelText="Street and house number"
        fieldName="street"
        placeholder="Street 12"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Street length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Street length can't be longer than 100",
          },
          pattern: {
            value: /^[A-Z][a-z]*(?:[ -][A-Z][a-z]*)*\s\d+[A-Za-z]*$/,
            message: "Invalid street name",
          },
        }}
      />

      <Form.Input
        labelText="Postal code"
        fieldName="postalCode"
        placeholder="20-501"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Postal code length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Postal code length can't be longer than 100",
          },
          pattern: {
            value: /^[0-9]{2}-[0-9]{3}$/,
            message: "Invalid postal code (valid exmaple: 20-501)",
          },
        }}
      />

      <Form.Input
        labelText="Phone number"
        fieldName="phoneNumber"
        placeholder="+48987654321"
        validation={{
          required: "This field is required",
          minLength: {
            value: 3,
            message: "Phone number length should be at least 3",
          },
          maxLength: {
            value: 100,
            message: "Phone number length can't be longer than 100",
          },
          pattern: {
            value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            message: "Invalid phone number",
          },
        }}
      />
    </Form>
  );
}

export default AddressForm;
