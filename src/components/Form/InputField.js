import React from "react";
import PropTypes from "prop-types";

const InputField = ({
  id,
  name,
  type,
  value,
  required,
  field,
  errorMsg,
  ...rest
}) => {
  if (type === "radio") {
    return (
      <div className="input-field">
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          {...rest}
        />
        <label htmlFor={id} className="pl-2 mr-5">{field}</label>
      </div>
    );
  } else {
    return (
      <div className="input-field">
       {field && <label htmlFor={id}>
          {field}
          {required && <span className="required">*</span>}
        </label>}
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          {...rest}
        />
        {errorMsg !== "" ? <span className="error-msg">{errorMsg}</span> : ""}
      </div>
    );
  }
};

InputField.defaultProps = {
  type: "text",
  value: "",
  required: true,
  errorMsg: "",
};

InputField.propType = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string || PropTypes.number,
  field: PropTypes.string,
  required: PropTypes.bool,
};

export default InputField;
