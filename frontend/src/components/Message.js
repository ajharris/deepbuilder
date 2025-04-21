import React, { useEffect, useState } from "react";
import axios from "axios";

function Message() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get("/api/hello")
      .then((res) => setMsg(res.data.message))
      .catch(() => setMsg("Error fetching data"));
  }, []);

  return <p>{msg}</p>;
}

export default Message;