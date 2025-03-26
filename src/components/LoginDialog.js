import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const LoginDialog = ({ visible, setVisible, handleSubmit, renderInputField }) => {
  return (
    <Dialog
      header="Login"
      visible={visible.login}
      style={{ width: "30vw" }}
      onHide={() => setVisible({ ...visible, login: false })}
      modal
      className="p-fluid"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit("login");
        }}
      >
        {renderInputField("Username", "username")}
        {renderInputField("Password", "password", "password")}
        <Button label="Login" type="submit" className="p-button-primary" />
      </form>
    </Dialog>
  );
};

export default LoginDialog;
