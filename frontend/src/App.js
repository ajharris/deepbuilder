import React from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import Form from "./components/Form";

function App({ setSharedState }) {
  return (
    <div>
      <Header />
      <Message />
      <Form setSharedState={setSharedState}/>
    </div>
  );
}

export default App;
