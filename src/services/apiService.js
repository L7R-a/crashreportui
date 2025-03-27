// apiService.js

const BASE_URL = "http://localhost:8080";

// Helper function for making API requests
const fetchData = async (url, options) => {
  const response = await fetch(url, options);
  const textResponse = await response.text();
  
  if (!response.ok) {
    throw new Error(textResponse || "An error occurred while fetching data");
  }

  return textResponse;
};

export const getLocations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/location`);
    if (!response.ok) {
      throw new Error("Failed to fetch locations.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
};

export const getLocationByLid = async (lid) => {
  try {
    const response = await fetch(`${BASE_URL}/location/${lid}`);
    if (!response.ok) {
      throw new Error("Failed to fetch location.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching location:", error);
    return [];
  }
};

// Function to create a user credential
export const createUserCredential = async (formData) => {
  return fetchData(`${BASE_URL}/user-credential/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};

// Function to create a customer
export const createCustomer = async (customerData) => {
  return fetchData(`${BASE_URL}/customer/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
};

// Function to login a user
export const loginUser = async (formData) => {
  return fetchData(`${BASE_URL}/user-credential/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
};

// Function to fetch customer data by username
export const getCustomerByUsername = async (username) => {
  return fetchData(`${BASE_URL}/customer/find/${username}`, { method: "GET" });
};

// Function to update user credentials
export const updateUserCredential = async (updateData) => {
  return fetchData(`${BASE_URL}/user-credential/update/${updateData.username}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
};

// Function to update customer data
export const updateCustomer = async (customerData) => {
  return fetchData(`${BASE_URL}/customer/${customerData.cid}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customerData),
  });
};

// Function to delete a user credential
export const deleteUserCredential = async (username) => {
  return fetchData(`${BASE_URL}/user-credential/${username}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};

// Function to delete a customer
export const deleteCustomer = async (cid) => {
  return fetchData(`${BASE_URL}/customer/${cid}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
};
