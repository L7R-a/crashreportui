import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const CreateUserDialog = ({ visible, setVisible, handleSubmit, renderInputField, locations, selectedLocation, handleLocationChange }) => {
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
        {renderInputField("Email", "email", "email")}

        <div className="p-field" style={{ marginBottom: "1rem" }}>
          <label htmlFor="location" style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>
            Select City and State
          </label>
          <Dropdown
            id="location"
            value={selectedLocation}
            options={locations}
            optionLabel={(option) => `${option.city}, ${option.state}`}
            placeholder="Select City and State"
            onChange={handleLocationChange}
            className="p-inputtext-lg"
            style={{ width: "100%" }}
          />
        </div>

        <Button label="Create" type="submit" className="p-button-success" />
      </form>
    </Dialog>
  );
};

export default CreateUserDialog;
