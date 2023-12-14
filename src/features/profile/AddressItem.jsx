function AddressItem({ address }) {
  return (
    <div className="flex flex-col">
      <p>
        <span className="font-medium">Name: </span>
        {address.name}
      </p>
      <p>
        <span className="font-medium">Full name: </span>
        {address.userName} {address.userSurname}
      </p>
      <p>
        <span className="font-medium">City: </span>
        {address.city}
      </p>
      <p>
        <span className="font-medium">Street: </span>
        {address.street}
      </p>
      <p>
        <span className="font-medium">Postal code: </span>
        {address.postalCode}
      </p>
      <p>
        <span className="font-medium">Phone number: </span>
        {address.phoneNumber}
      </p>
    </div>
  );
}

export default AddressItem;
