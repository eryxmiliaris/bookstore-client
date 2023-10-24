import { useState } from "react";
import Form from "../../components/Form";
import ModalWindow from "../../components/ModalWindow";
import toast from "react-hot-toast";
import axios from "../../util/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

function AddressForm({
  onSubmit,
  isLoading,
  submitButtonText,
  submitButtonLoadingText,
  initialValues,
}) {
  return (
    <Form
      onSubmit={onSubmit}
      submitButtonText={submitButtonText}
      isLoading={isLoading}
      submitButtonLoadingText={submitButtonLoadingText}
      initialValues={initialValues}
    >
      <Form.Input
        labelText="Name"
        fieldName="name"
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
        }}
      />
      <Form.Input
        labelText="Surname"
        fieldName="surname"
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
        }}
      />
      <Form.Input
        labelText="City"
        fieldName="city"
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
        }}
      />

      <Form.Input
        labelText="Street"
        fieldName="street"
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
        }}
      />

      <Form.Input
        labelText="Postal code"
        fieldName="postalCode"
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

function Addresses() {
  const { data: addresses, isLoading: addressesIsLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async function () {
      const response = await axios.get("/user/address");
      return response.data;
    },
  });
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const handleAddAddressOpen = () => setAddAddressOpen(true);
  const handleAddAddressClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setAddAddressOpen(false);
  };
  const onAddAddressSubmit = async (data) => {
    const { name, surname, city, street, postalCode, phoneNumber } = data;
    setIsLoading(true);
    const response = await axios.post(`/user/address`, {
      name,
      surname,
      city,
      street,
      postalCode,
      phoneNumber,
    });
    if (response.data.success === true) {
      toast.success("New address has been successfully added");
      handleAddAddressClose();
      queryClient.invalidateQueries(["addresses"]);
    } else {
      toast.error("Error appeared: " + response.data.message);
    }
    setIsLoading(false);
  };

  const [editAddressIndex, setEditAddressIndex] = useState(0);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const handleEditAddressOpen = (id) => {
    setEditAddressIndex(id);
    setEditAddressOpen(true);
  };
  const handleEditAddressClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setEditAddressOpen(false);
  };
  const onEditAddressSubmit = async (data) => {
    const { name, surname, city, street, postalCode, phoneNumber } = data;
    setIsLoading(true);
    const response = await axios.put(
      `/user/address/${addresses[editAddressIndex].id}`,
      {
        name,
        surname,
        city,
        street,
        postalCode,
        phoneNumber,
      },
    );
    if (response.data.success === true) {
      toast.success("Address has been successfully updated");
      handleEditAddressClose();
      queryClient.invalidateQueries(["addresses"]);
    } else {
      toast.error("Error appeared: " + response.data.message);
    }
    setIsLoading(false);
  };

  const [deleteAddressId, setDeleteAddressId] = useState(0);
  const [deleteAddressIndex, setDeleteAddressIndex] = useState(0);
  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const handleDeleteAddressOpen = (id, index) => {
    setDeleteAddressOpen(true);
    setDeleteAddressId(id);
    setDeleteAddressIndex(index);
  };
  const handleDeleteAddressClose = () => setDeleteAddressOpen(false);
  const handleDeleteAddress = async () => {
    setIsLoading(true);
    const response = await axios.delete(`/user/address/${deleteAddressId}`);
    if (response.data.success === true) {
      toast.success("Address has been successfully deleted");
      handleDeleteAddressClose();
      queryClient.invalidateQueries(["addresses"]);
    } else {
      toast.error("Error appeared: " + response.data.message);
    }
    setIsLoading(false);
  };

  if (addressesIsLoading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-10 py-4">
      <p className="my-4 w-full text-center text-2xl font-semibold">
        Addresses
      </p>
      <ModalWindow
        open={addAddressOpen}
        onClose={(event, reason) => handleAddAddressClose(event, reason)}
      >
        <AddressForm
          onSubmit={onAddAddressSubmit}
          submitButtonText="Add new address"
          isLoading={isLoading}
          submitButtonLoadingText="Adding..."
        />
      </ModalWindow>
      {addresses.length > 0 ? (
        <>
          <ModalWindow
            open={editAddressOpen}
            onClose={(event, reason) => handleEditAddressClose(event, reason)}
          >
            <AddressForm
              onSubmit={onEditAddressSubmit}
              submitButtonText="Update address"
              isLoading={isLoading}
              submitButtonLoadingText="Updating..."
              initialValues={{
                name: addresses[editAddressIndex].name,
                surname: addresses[editAddressIndex].surname,
                city: addresses[editAddressIndex].city,
                street: addresses[editAddressIndex].street,
                postalCode: addresses[editAddressIndex].postalCode,
                phoneNumber: addresses[editAddressIndex].phoneNumber,
              }}
            />
          </ModalWindow>
          <ModalWindow
            open={deleteAddressOpen}
            onClose={handleDeleteAddressClose}
          >
            <p className="text-center text-2xl font-semibold">
              Are you sure you want to delete this address?
            </p>
            <div className="flex flex-col gap-2">
              <p>
                <span className="font-medium">Name: </span>
                {addresses[deleteAddressIndex].name}{" "}
                {addresses[deleteAddressIndex].surname}
              </p>
              <p>
                <span className="font-medium">City: </span>
                {addresses[deleteAddressIndex].city}
              </p>
              <p>
                <span className="font-medium">Street: </span>
                {addresses[deleteAddressIndex].street}
              </p>
              <p>
                <span className="font-medium">Postal code: </span>
                {addresses[deleteAddressIndex].postalCode}
              </p>
              <p>
                <span className="font-medium">Phone number: </span>
                {addresses[deleteAddressIndex].phoneNumber}
              </p>
            </div>
            <Button disabled={isLoading} onClick={handleDeleteAddress}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={handleDeleteAddressClose} type="red">
              Cancel
            </Button>
          </ModalWindow>

          <div className="flex w-full flex-col gap-6">
            {addresses.map((a, i) => (
              <div key={a.id} className="flex flex-col gap-2">
                <p className="text-xl font-semibold">Address {i + 1}</p>
                <div>
                  <p>
                    <span className="font-medium">Name: </span>
                    {a.name} {a.surname}
                  </p>
                  <p>
                    <span className="font-medium">City: </span>
                    {a.city}
                  </p>
                  <p>
                    <span className="font-medium">Street: </span>
                    {a.street}
                  </p>
                  <p>
                    <span className="font-medium">Postal code: </span>
                    {a.postalCode}
                  </p>
                  <p>
                    <span className="font-medium">Phone number: </span>
                    {a.phoneNumber}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Button onClick={() => handleEditAddressOpen(i)}>Edit</Button>
                  <Button
                    onClick={() => handleDeleteAddressOpen(a.id, i)}
                    type={"red"}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="italic">You don't have any adresses yet</p>
      )}
      {addresses?.length < 3 && (
        <Button onClick={handleAddAddressOpen} className="mt-4">
          Add new
        </Button>
      )}
    </div>
  );
}

export default Addresses;
