import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "../../util/axios";
import { useAddresses } from "./useAddresses";

import ModalWindow from "../../components/ModalWindow";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import AddressForm from "./AddressForm";
import AddressItem from "./AddressItem";
import ErrorPage from "../../components/ErrorPage";

function Addresses() {
  const queryClient = useQueryClient();

  const {
    addresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useAddresses();

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const { mutate: addAddress, isLoading: isAddingAddress } = useMutation({
    mutationFn: (data) => {
      return axios.post(`/addresses`, {
        name: data.name,
        userName: data.userName,
        userSurname: data.userSurname,
        city: data.city,
        street: data.street,
        postalCode: data.postalCode,
        phoneNumber: data.phoneNumber,
      });
    },
    onSuccess: () => {
      toast.success("New address has been successfully added");
      setAddAddressOpen(false);
      queryClient.invalidateQueries(["addresses"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const handleEditAddressOpen = (address) => {
    setSelectedAddress(address);
    setEditAddressOpen(true);
  };
  const handleEditAddressClose = () => {
    setEditAddressOpen(false);
    setSelectedAddress(null);
  };
  const { mutate: editAddress, isLoading: isEditingAddress } = useMutation({
    mutationFn: (data) => {
      return axios.put(`/addresses/${selectedAddress.id}`, {
        name: data.name,
        userName: data.userName,
        userSurname: data.userSurname,
        city: data.city,
        street: data.street,
        postalCode: data.postalCode,
        phoneNumber: data.phoneNumber,
      });
    },
    onSuccess: () => {
      toast.success("Address has been successfully updated");
      handleEditAddressClose();
      queryClient.invalidateQueries(["addresses"]);
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  const [deleteAddressOpen, setDeleteAddressOpen] = useState(false);
  const handleDeleteAddressOpen = (address) => {
    setDeleteAddressOpen(true);
    setSelectedAddress(address);
  };
  const handleDeleteAddressClose = () => {
    setDeleteAddressOpen(false);
    setSelectedAddress(null);
  };
  const { mutate: deleteAddress, isLoading: isDeletingAddress } = useMutation({
    mutationFn: () => {
      return axios.delete(`/addresses/${selectedAddress.id}`);
    },
    onSuccess: () => {
      toast.success("Address has been successfully deleted");
      handleDeleteAddressClose();
      queryClient.invalidateQueries(["addresses"]);
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (err) => toast.error(err.response.data.message),
  });

  if (isLoadingAddresses) {
    return <Spinner />;
  }

  if (addressesError) {
    return <ErrorPage error={addressesError} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-10 py-4">
      <p className="my-4 w-full text-center text-2xl font-semibold">
        Addresses
      </p>

      {addresses?.length > 0 ? (
        <div className="flex w-full flex-col gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex flex-col gap-2">
              <p className="text-xl font-semibold">
                Address &quot;{addr.name}&quot;
              </p>
              <AddressItem address={addr} />

              <div className="flex items-center justify-between gap-2">
                <Button onClick={() => handleEditAddressOpen(addr)}>
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteAddressOpen(addr)}
                  type="red"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic">You don&apos;t have any adresses yet</p>
      )}
      {addresses?.length < 3 && (
        <Button onClick={() => setAddAddressOpen(true)} className="mt-4">
          Add new
        </Button>
      )}

      <ModalWindow
        open={addAddressOpen}
        onClose={() => setAddAddressOpen(false)}
      >
        <AddressForm
          onSubmit={addAddress}
          submitButtonText="Add new address"
          isLoading={isAddingAddress}
          submitButtonLoadingText="Adding..."
        />
        <Button type="red" onClick={() => setAddAddressOpen(false)}>
          Cancel
        </Button>
      </ModalWindow>

      {selectedAddress && (
        <>
          <ModalWindow
            open={editAddressOpen}
            onClose={(event, reason) => handleEditAddressClose(event, reason)}
          >
            <AddressForm
              onSubmit={editAddress}
              submitButtonText="Update address"
              isLoading={isEditingAddress}
              submitButtonLoadingText="Updating..."
              initialAddress={selectedAddress}
            />

            <Button type="red" onClick={handleEditAddressClose}>
              Cancel
            </Button>
          </ModalWindow>

          <ModalWindow
            open={deleteAddressOpen}
            onClose={handleDeleteAddressClose}
          >
            <p className="text-center text-2xl font-semibold">
              Are you sure you want to delete this address?
            </p>
            <AddressItem address={selectedAddress} />
            <Button disabled={isDeletingAddress} onClick={deleteAddress}>
              {isDeletingAddress ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={handleDeleteAddressClose} type="red">
              Cancel
            </Button>
          </ModalWindow>
        </>
      )}
    </div>
  );
}

export default Addresses;
