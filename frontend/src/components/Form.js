import React, { useState } from "react";
import axios from "axios";

function Form({ setSharedState }) {
  const [formData, setFormData] = useState({
    modelType: "",
    lossFunction: "",
    optimizer: "",
    learningRate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.modelType) newErrors.modelType = "Model type is required.";
    if (!formData.lossFunction) newErrors.lossFunction = "Loss function is required.";
    if (!formData.optimizer) newErrors.optimizer = "Optimizer is required.";
    if (!formData.learningRate || isNaN(formData.learningRate)) {
      newErrors.learningRate = "Learning rate must be a valid number.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      axios
        .post("/api/submit", formData)
        .then(() => {
          alert("Form submitted successfully!");
          if (setSharedState) {
            setSharedState(formData); // ✅ This is what your test expects!
          }
        })
        .catch(() => alert("Error submitting form."));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="modelType">Model Type:</label>
        <input
          type="text"
          id="modelType"
          name="modelType"
          value={formData.modelType}
          onChange={handleChange}
        />
        {errors.modelType && <p style={{ color: "red" }}>{errors.modelType}</p>}
      </div>
      <div>
        <label htmlFor="lossFunction">Loss Function:</label>
        <input
          type="text"
          id="lossFunction"
          name="lossFunction"
          value={formData.lossFunction}
          onChange={handleChange}
        />
        {errors.lossFunction && <p style={{ color: "red" }}>{errors.lossFunction}</p>}
      </div>
      <div>
        <label htmlFor="optimizer">Optimizer:</label>
        <input
          type="text"
          id="optimizer"
          name="optimizer"
          value={formData.optimizer}
          onChange={handleChange}
        />
        {errors.optimizer && <p style={{ color: "red" }}>{errors.optimizer}</p>}
      </div>
      <div>
        <label htmlFor="learningRate">Learning Rate:</label>
        <input
          type="text"
          id="learningRate"
          name="learningRate"
          value={formData.learningRate}
          onChange={handleChange}
        />
        {errors.learningRate && <p style={{ color: "red" }}>{errors.learningRate}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
