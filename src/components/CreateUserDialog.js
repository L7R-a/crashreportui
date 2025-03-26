import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const CreateUserDialog = ({ visible, setVisible, handleSubmit, renderInputField }) => {
  return (
    <Dialog
      header="Create User"
      visible={visible.create}
      style={{ width: "40vw" }}
      onHide={() => setVisible({ ...visible, create: false })}
      modal
      className="p-fluid"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("create");
        }}
      >
        {renderInputField("Username", "username")}
        {renderInputField("Password", "password", "password")}
        {renderInputField("First Name", "fName")}
        {renderInputField("Last Name", "lName")}
        <Button label="Create" type="submit" className="p-button-success" />
      </form>
    </Dialog>
  );
};

export default CreateUserDialog;
