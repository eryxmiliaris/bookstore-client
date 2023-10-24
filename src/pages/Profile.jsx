import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Button from "../components/Button";
import Form from "../components/Form";
import Addresses from "../features/profile/Addresses";
import ModalWindow from "../components/ModalWindow";

function Profile() {
  const { user, updateUserData, isLoading, success } = useAuth();

  const [editUserOpen, setEditUserOpen] = useState(false);
  const handleEditUserOpen = () => setEditUserOpen(true);
  const handleEditUserClose = (event, reason) => {
    if (reason && reason == "backdropClick") return;
    setEditUserOpen(false);
  };
  const handleEditUser = async (data) => {
    console.log(data);
    const { username, email, birthDate } = data;
    await updateUserData(username, email, birthDate);
    if (success) handleEditUserClose();
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="mx-auto flex w-full flex-col items-center gap-4 p-4 sm:w-3/5">
        <p className="my-4 text-center text-2xl font-semibold">
          User information
        </p>
        <div className="flex flex-col items-center gap-2">
          <p className="font-medium text-gray-800">Username: </p>
          <p className="text-gray-600">{user?.username}</p>
          <p className="font-medium text-gray-800">Email:</p>
          <p className="text-gray-600">{user?.email}</p>
          <p className="font-medium text-gray-800">Birth date:</p>
          <p className="text-gray-600">{user?.birthDate}</p>
        </div>
        <Button onClick={handleEditUserOpen}>Update</Button>
      </div>
      <ModalWindow
        open={editUserOpen}
        onClose={(event, reason) => handleEditUserClose(event, reason)}
      >
        <div className="flex flex-col gap-2">
          <Form
            onSubmit={handleEditUser}
            submitButtonText="Update profile"
            isLoading={isLoading}
            submitButtonLoadingText="Updating..."
            initialValues={{
              username: user?.username,
              email: user?.email,
              birthDate: Date.parse(user?.birthDate),
            }}
          >
            <Form.Input
              labelText="Username"
              fieldName="username"
              validation={{
                required: "This field is required",
                minLength: {
                  value: 5,
                  message: "Username length should be at least 5",
                },
                maxLength: {
                  value: 20,
                  message: "Username length can't be longer than 100",
                },
              }}
            />
            <Form.Input
              labelText="Email"
              fieldName="email"
              validation={{
                required: "This field is required",
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Email is not valid.",
                },
              }}
            />
            <Form.DateInput
              labelText="Birth date"
              fieldName="birthDate"
              validation={{ required: "This field is required" }}
            />
          </Form>
          <Button onClick={handleEditUserClose} type="red">
            Cancel
          </Button>
        </div>
      </ModalWindow>

      <Addresses />
    </div>
  );
}

export default Profile;
