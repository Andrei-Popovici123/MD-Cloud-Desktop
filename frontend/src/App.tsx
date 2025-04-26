import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import FileUploader from "./components/FileUploader";
import MultiScanning from "./components/MultiScanning";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/*   <FileUploader /> */}
      <MultiScanning />
    </>
  );
}

export default App;
