import { useState } from "react";
import FileUploader from "./components/FileUploader";
import MultiScanning from "./components/MultiScanning";
import { ProactiveDLPPage } from "./components/proactivedlp/ProactiveDLPPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <FileUploader /> */}
      {/* <MultiScanning /> */}
      <ProactiveDLPPage />
    </>
  );
}

export default App;
