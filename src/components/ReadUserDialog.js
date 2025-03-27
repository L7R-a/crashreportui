import React from "react";
import { Dialog } from "primereact/dialog";

const ReadUserDialog = ({ visible, setVisible, readData }) => {
  return (
    <Dialog
      header="User Data"
      visible={visible.readResult}
      style={{ width: "40vw" }}
      onHide={() => setVisible({ ...visible, readResult: false })}
      modal
      className="p-fluid"
    >
      {readData ? (
        <div>
          <p>
            <strong>Username:</strong> {readData.userCredentials.username}
          </p>
          <p>
            <strong>Email:</strong> {readData.userCredentials.email}
            </p>
          <p>
            <strong>Password:</strong> {readData.userCredentials.password}
          </p>
          <p>
            <strong>First Name:</strong> {readData.customer.fName}
          </p>
          <p>
            <strong>Last Name:</strong> {readData.customer.lName}
          </p>
          <p>
  <strong>Location:</strong>{" "}
  {readData.location?.city || "Unknown"}, {readData.location?.state || "Unknown"}
</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </Dialog>
  );
};

export default ReadUserDialog;
