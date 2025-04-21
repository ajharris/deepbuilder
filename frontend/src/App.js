import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get("/api/hello").then((res) => setMsg(res.data.message));
  }, []);

  return (
    <div>
      <h1>DeepBuilder</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
