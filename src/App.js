import React, { useState, useRef, useEffect } from "react";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

// Import all dialogs
import LoginDialog from "./components/LoginDialog";
import CreateUserDialog from "./components/CreateUserDialog";
import ReadUserDialog from "./components/ReadUserDialog";
import UpdateUserDialog from "./components/UpdateUserDialog";
import DeleteUserDialog from "./components/DeleteUserDialog";

import {
  createUserCredential,
  createCustomer,
  loginUser,
  getCustomerByUsername,
  updateUserCredential,
  updateCustomer,
  deleteUserCredential,
  deleteCustomer,
  getLocations,
  getLocationByLid
} from "./services/apiService";


function App() {

  //UseStates used
  const [visible, setVisible] = useState({ login: false, create: false, read: false, update: false, delete: false, readResult: false });
  const [formData, setFormData] = useState({});
  const [toastData, setToastData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const toast = useRef(null);
  const [readData, setReadData] = useState(null); // State to hold the data to display in the read dialog
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // UseEffect used to show the backend results
  useEffect(() => {
    if (toastData) {
      toast.current.show(toastData);
      setToastData(null);
    }
  }, [toastData]);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationData = await getLocations();
      setLocations(locationData);
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.value);
    setFormData({ ...formData, lid: e.value.lid });
  };

  //HandleInputChange function used to handle the input change in the forms
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //HandleReadData function used to read the data from the local storage. 
  // Used in Read user data button
  const handleReadData = () => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      setReadData(JSON.parse(storedData));
      setVisible({ ...visible, readResult: true });
    } else {
      setToastData({severity: "warn",summary: "No Data",detail: "No user data found. Please log in or create an account.",life: 5000,});
    }
  };

  const handleSubmit = async (action) => {
    const storedData = localStorage.getItem("userData");
    const userData = storedData ? JSON.parse(storedData) : null;
    
    // Check if they are strings before parsing
    if (userData) {
      userData.userCredentials =
        typeof userData.userCredentials === "string"
          ? JSON.parse(userData.userCredentials)
          : userData.userCredentials;

      userData.customer =
        typeof userData.customer === "string"
          ? JSON.parse(userData.customer)
          : userData.customer;
    }
    
    
  
    if (action === "create") {
      if (!formData.username || !formData.password || !formData.email || !formData.fName || !formData.lName || !formData.lid) {
        setToastData({ severity: "error", summary: "Error", detail: "All fields must be filled in.", life: 5000 });
        return;
      }
  
      try {

        // Create UserCredential first
        const userMessage = await createUserCredential({
          username: formData.username,
          password: formData.password,
          email: formData.email,
        });  
        if (userMessage) {
          // Proceed to create customer if user creation worked
          const customerData = { fName: formData.fName, lName: formData.lName, username: formData.username, lid: formData.lid};
          const customerMessage = await createCustomer(customerData);
  
          if (customerMessage) {
            setToastData({ severity: "success", summary: "Success", detail: "User and customer created successfully!", life: 5000 });
          } else {
            setToastData({ severity: "warn", summary: "Partial Success", detail: `User created, but failed to create customer: ${customerMessage}`, life: 5000 });
          }
        }
      } catch (error) {
        setToastData({ severity: "error", summary: "Error", detail: error.message || "Error creating user.", life: 5000 });
        return;
      }
  
    } else if (action === "login") {
      if (!formData.username || !formData.password) {
        setToastData({
          severity: "error",
          summary: "Error",
          detail: "Username and password cannot be blank.",
          life: 5000,
        });
        return;
      }
    
      try {
        const userMessage = await loginUser(formData);
    
        if (userMessage) {
          // Fetch customer data after successful login
          let customer = await getCustomerByUsername(formData.username);

          // Check if customer is an object and not a string
          if (typeof customer === "string") {
            console.log("Customer is a string. Parsing...");
            customer = JSON.parse(customer);
          } else {
            console.log("Customer is already an object.");
          }
          
          // Check the type and lid
          console.log("Customer:", customer);
          console.log("LID:", customer.lid);

          if (customer) {
            let location = null;
            if (customer.lid) {
              try {
                location = await getLocationByLid(customer.lid);
              } catch (error) {
                console.error("Error fetching location:", error);
              }
            }
    
            const userData = {
              userCredentials: userMessage,
              customer: customer,
              location: location || { city: "Unknown", state: "Unknown" },
            };
    
            localStorage.setItem(
              "userData",
              JSON.stringify({
                userCredentials:
                  typeof userMessage === "string" ? JSON.parse(userMessage) : userMessage,
                customer: typeof customer === "string" ? JSON.parse(customer) : customer,
                location: location || { city: "Unknown", state: "Unknown" },
              })
            );
    
            setReadData(userData);
    
            setToastData({
              severity: "success",
              summary: "Success",
              detail: "Logged in successfully!",
              life: 5000,
            });
            setIsLoggedIn(true);
          } else {
            setToastData({
              severity: "warn",
              summary: "Partial Success",
              detail: "Logged in, but customer data could not be retrieved.",
              life: 5000,
            });
          }
        }
      } catch (error) {
        setToastData({
          severity: "error",
          summary: "Error",
          detail: error.message || "Error logging in.",
          life: 5000,
        });
        return;
      }
    } else if (action === "update") {
      if (!formData.newFName && !formData.newLName && !formData.newPassword && !formData.newEmail) {
        setToastData({ severity: "error", summary: "Error", detail: "Please enter new information to update.", life: 5000 });
        return;
      }
  
      try {
        const updateData = {
          username: userData.userCredentials.username,
          password: formData.newPassword || userData.userCredentials.password,
          email: formData.newEmail || userData.userCredentials.email,
        };
  
        const updateMessage = await updateUserCredential(updateData);
  
        if (updateMessage) {
          const customerData = {
            username: userData.userCredentials.username,
            fName: formData.newFName || userData.customer.fName,
            lName: formData.newLName || userData.customer.lName,
            cid: userData.customer.cid,
            lid: userData.customer.lid,
          };
  
          const customerMessage = await updateCustomer(customerData);
  
          if (customerMessage) {
            const updatedUserData = {
              userCredentials: {
                username: updateData.username,
                password: updateData.password,
                email: updateData.email
              },
              customer: {
                cid: customerData.cid,
                lid: customerData.lid,
                username: customerData.username,
                fName: customerData.fName,
                lName: customerData.lName,
              },
              location: userData.location,
            };
  
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            setToastData({ severity: "success", summary: "Success", detail: "Information updated successfully!", life: 5000 });
          } else {
            setToastData({ severity: "warn", summary: "Partial Success", detail: "User updated, but failed to update customer.", life: 5000 });
          }
        }
      } catch (error) {
        setToastData({ severity: "error", summary: "Error", detail: error.message || "Error updating user.", life: 5000 });
      }
    }
  
    // Handle delete
    else if (action === "delete") {
      try {
        const username = userData.userCredentials.username;
        const cid = userData.customer.cid;
  
        const deleteUserMessage = await deleteUserCredential(username);
  
        if (deleteUserMessage) {
          const deleteCustomerMessage = await deleteCustomer(cid);
  
          if (deleteCustomerMessage) {
            localStorage.removeItem("userData");
            setIsLoggedIn(false);
            setToastData({ severity: "success", summary: "Success", detail: "User and customer deleted successfully!", life: 5000 });
          } else {
            setToastData({ severity: "warn", summary: "Partial Success", detail: "User deleted, but failed to delete customer.", life: 5000 });
          }
        }
      } catch (error) {
        setToastData({ severity: "error", summary: "Error", detail: error.message || "Error deleting user.", life: 5000 });
      }
    }
  
    // Close the dialog and reset form
    setVisible({ ...visible, [action]: false });
    setFormData({});
  };

  //RenderInputField function used to render each input field in the form of the dialogs
  const renderInputField = (label, name, type = "text") => (
    <div className="p-field" style={{ marginBottom: "1rem" }}>
      <label htmlFor={name} style={{ fontWeight: "bold", display: "block", marginBottom: "0.5rem" }}>
        {label}
      </label>
      <InputText
        id={name}
        name={name}
        type={type}
        value={formData[name] || ""}
        onChange={handleInputChange}
        className="p-inputtext-lg"
        style={{ width: "100%" }}
      />
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <div
        className="App"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          backgroundColor: "#f5f8fa",
          padding: "2rem",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>Crash Report Application</h1>

        <div className="button-group" style={{ display: "flex", gap: "1rem" }}>
          {!isLoggedIn ? (
            <>
              <Button label="Login" icon="pi pi-sign-in" onClick={() => setVisible({ ...visible, login: true })} />
              <Button label="Create Account" icon="pi pi-user-plus" onClick={() => setVisible({ ...visible, create: true })} />
            </>
          ) : (
            <>
              <Button label="Read User Data" icon="pi pi-eye" onClick={handleReadData}/>
              <Button label="Update User" icon="pi pi-pencil" onClick={() => setVisible({ ...visible, update: true })} />
              <Button label="Delete User" icon="pi pi-trash" onClick={() => setVisible({ ...visible, delete: true })} />
              <Button label="Logout" icon="pi pi-power-off" className="p-button-danger" onClick={() => {setIsLoggedIn(false);     localStorage.removeItem("userData");}} />
            </>
          )}
        </div>

        <LoginDialog visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} renderInputField={renderInputField} />
        <CreateUserDialog visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} renderInputField={renderInputField}  
            locations={locations} selectedLocation={selectedLocation} handleLocationChange={handleLocationChange}/>
        <ReadUserDialog visible={visible} setVisible={setVisible} readData={readData} />
        <UpdateUserDialog visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} renderInputField={renderInputField} />
        <DeleteUserDialog visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} />
      </div>
    </>
  );
}

export default App;


