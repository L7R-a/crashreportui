import { InputText } from "primereact/inputtext";

export const renderInputField = (label, name, formData, handleInputChange, type = "text") => (
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
