import React, { useState, useEffect } from "react";
import axios from "axios";
import { parameterMeta } from "./ParameterExplanations";

function useWikiExplanation(term) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!term) {
      setSummary("");
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setSummary("");
    axios
      .get(`/api/explanation?term=${encodeURIComponent(term)}`)
      .then((res) => {
        setSummary(res.data.summary);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Error fetching explanation");
        setLoading(false);
      });
  }, [term]);

  return { summary, loading, error };
}

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
  const [selectedParam, setSelectedParam] = useState(null);

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

  const handleFocus = (param) => {
    setSelectedParam(param);
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
            setSharedState(formData);
          }
        })
        .catch(() => alert("Error submitting form."));
    }
  };

  const safeOptions = {
    modelTypes: Array.isArray(options.modelTypes) ? options.modelTypes : [],
    lossFunctions: Array.isArray(options.lossFunctions) ? options.lossFunctions : [],
    optimizers: Array.isArray(options.optimizers) ? options.optimizers : [],
  };

  // Dynamic explanation logic
  const paramWiki = selectedParam ? parameterMeta[selectedParam]?.wiki : null;
  const { summary: paramSummary, loading: paramLoading, error: paramError } = useWikiExplanation(paramWiki);

  // Option explanation logic
  let optionWiki = null;
  let optionValue = null;
  if (selectedParam && formData[selectedParam] && parameterMeta[selectedParam]?.options) {
    optionValue = formData[selectedParam];
    optionWiki = parameterMeta[selectedParam].options[optionValue]?.wiki;
  }
  const { summary: optionSummary, loading: optionLoading, error: optionError } = useWikiExplanation(optionWiki);

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: 500 }}>
        <div>
          <label htmlFor="modelType">Model Type:</label>
          <select
            id="modelType"
            name="modelType"
            value={formData.modelType}
            onChange={handleChange}
            onFocus={() => handleFocus("modelType")}
            onClick={() => handleFocus("modelType")}
          >
            <option value="">Select Model Type</option>
            {safeOptions.modelTypes.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.modelType && <p style={{ color: "red" }}>{errors.modelType}</p>}
          {selectedParam === "modelType" && formData.modelType && (
            <div className="option-explanation-box">
              <strong>Selected:</strong> {formData.modelType}<br />
              {optionLoading ? "Loading..." : optionError ? optionError : optionSummary}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="lossFunction">Loss Function:</label>
          <select
            id="lossFunction"
            name="lossFunction"
            value={formData.lossFunction}
            onChange={handleChange}
            onFocus={() => handleFocus("lossFunction")}
            onClick={() => handleFocus("lossFunction")}
          >
            <option value="">Select Loss Function</option>
            {safeOptions.lossFunctions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.lossFunction && <p style={{ color: "red" }}>{errors.lossFunction}</p>}
          {selectedParam === "lossFunction" && formData.lossFunction && (
            <div className="option-explanation-box">
              <strong>Selected:</strong> {formData.lossFunction}<br />
              {optionLoading ? "Loading..." : optionError ? optionError : optionSummary}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="optimizer">Optimizer:</label>
          <select
            id="optimizer"
            name="optimizer"
            value={formData.optimizer}
            onChange={handleChange}
            onFocus={() => handleFocus("optimizer")}
            onClick={() => handleFocus("optimizer")}
          >
            <option value="">Select Optimizer</option>
            {safeOptions.optimizers.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.optimizer && <p style={{ color: "red" }}>{errors.optimizer}</p>}
          {selectedParam === "optimizer" && formData.optimizer && (
            <div className="option-explanation-box">
              <strong>Selected:</strong> {formData.optimizer}<br />
              {optionLoading ? "Loading..." : optionError ? optionError : optionSummary}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="learningRate">Learning Rate:</label>
          <input
            type="text"
            id="learningRate"
            name="learningRate"
            value={formData.learningRate}
            onChange={handleChange}
            onFocus={() => handleFocus("learningRate")}
            onClick={() => handleFocus("learningRate")}
          />
          {errors.learningRate && <p style={{ color: "red" }}>{errors.learningRate}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* Right panel for parameter explanation */}
      <div className="parameter-explanation-panel">
        <h3>Parameter Explanation</h3>
        {selectedParam && parameterMeta[selectedParam] ? (
          <>
            <strong>{parameterMeta[selectedParam].label}</strong>
            <div style={{ minHeight: 60 }}>
              {paramLoading ? "Loading..." : paramError ? paramError : paramSummary}
            </div>
          </>
        ) : (
          <p>Select a parameter to see its explanation.</p>
        )}
      </div>
    </div>
  );
}

Form.defaultProps = {
  setSharedState: undefined,
};

export default Form;
