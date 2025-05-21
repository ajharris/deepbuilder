import React, { useState, useEffect } from "react";
import axios from "axios";

function Form({ setSharedState }) {
  const [formData, setFormData] = useState({
    modelType: "",
    lossFunction: "",
    optimizer: "",
    learningRate: "",
  });
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({
    modelTypes: [],
    lossFunctions: [],
    optimizers: [],
  });

  useEffect(() => {
    axios
      .get("/api/parameter-options")
      .then((res) => setOptions(res.data))
      .catch(() => setOptions({ modelTypes: [], lossFunctions: [], optimizers: [] }));
  }, []);

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

  // Defensive: ensure options are always arrays
  const safeOptions = {
    modelTypes: Array.isArray(options.modelTypes) ? options.modelTypes : [],
    lossFunctions: Array.isArray(options.lossFunctions) ? options.lossFunctions : [],
    optimizers: Array.isArray(options.optimizers) ? options.optimizers : [],
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="modelType">Model Type:</label>
        <select
          id="modelType"
          name="modelType"
          value={formData.modelType}
          onChange={handleChange}
        >
          <option value="">Select Model Type</option>
          {safeOptions.modelTypes.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.modelType && <p style={{ color: "red" }}>{errors.modelType}</p>}
      </div>
      <div>
        <label htmlFor="lossFunction">Loss Function:</label>
        <select
          id="lossFunction"
          name="lossFunction"
          value={formData.lossFunction}
          onChange={handleChange}
        >
          <option value="">Select Loss Function</option>
          {safeOptions.lossFunctions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.lossFunction && <p style={{ color: "red" }}>{errors.lossFunction}</p>}
      </div>
      <div>
        <label htmlFor="optimizer">Optimizer:</label>
        <select
          id="optimizer"
          name="optimizer"
          value={formData.optimizer}
          onChange={handleChange}
        >
          <option value="">Select Optimizer</option>
          {safeOptions.optimizers.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
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

// Add default props for testing environments
Form.defaultProps = {
  setSharedState: undefined,
};

export default Form;
