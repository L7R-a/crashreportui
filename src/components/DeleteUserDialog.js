import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const DeleteUserDialog = ({ visible, setVisible, handleSubmit }) => {
  return (
    <Dialog
      header="Delete User"
      visible={visible.delete}
      style={{ width: "30vw" }}
      onHide={() => setVisible({ ...visible, delete: false })}
      modal
      className="p-fluid"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("delete");
        }}
      >
        <p style={{ color: "#555", marginBottom: "1rem" }}>
          Are you sure you want to delete your account? This action cannot be undone.
        </p>
        <Button label="Delete" type="submit" className="p-button-danger" />
      </form>
    </Dialog>
  );
};

export default DeleteUserDialog;
