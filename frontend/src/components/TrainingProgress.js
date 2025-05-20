import React, { useEffect, useState } from "react";
import axios from "axios";

function TrainingProgress() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    axios.get("/api/training_progress")
      .then(res => setProgress(res.data))
      .catch(() => setProgress({ error: "Could not fetch training progress" }));
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Training Progress</h2>
      {progress ? (
        progress.error ? (
          <p style={{ color: 'red' }}>{progress.error}</p>
        ) : (
          <ul>
            <li>Current Epoch: {progress.current_epoch}</li>
            <li>Total Epochs: {progress.total_epochs}</li>
            <li>Loss: {progress.loss !== null ? progress.loss : 'N/A'}</li>
          </ul>
        )
      ) : (
        <p>Loading training progress...</p>
      )}
    </div>
  );
}

export default TrainingProgress;
