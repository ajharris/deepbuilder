import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import Form from "./components/Form";
import TrainingProgress from "./components/TrainingProgress";

function App({ setSharedState }) {
  return (
    <div>
      <Header />
      <Message />
      <Form setSharedState={setSharedState}/>
      <TrainingProgress />
    </div>
  );
}

export default App;
