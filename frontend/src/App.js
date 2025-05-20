import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Message from "./components/Message";
import Form from "./components/Form";
import TrainingProgress from "./components/TrainingProgress";
import FileUpload from './components/FileUpload';

function App({ setSharedState }) {
  return (
    <div>
      <Header />
      <Message />
      <Form setSharedState={setSharedState}/>
      <TrainingProgress />
      <FileUpload />
    </div>
  );
}

export default App;
