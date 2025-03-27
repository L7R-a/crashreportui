import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const UpdateUserDialog = ({ visible, setVisible, handleSubmit, renderInputField }) => {
  return (
    <Dialog
      header="Update User"
      visible={visible.update}
      style={{ width: "40vw" }}
      onHide={() => setVisible({ ...visible, update: false })}
      modal
      className="p-fluid"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("update");
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#555" }}>Enter new information to update</h2>
        {renderInputField("New First Name", "newFName")}
        {renderInputField("New Last Name", "newLName")}
        {renderInputField("New Email", "newEmail", "email")}
        {renderInputField("New Password", "newPassword", "password")}
        <Button label="Submit" type="submit" className="p-button-warning" />
      </form>
    </Dialog>
  );
};

export default UpdateUserDialog;
