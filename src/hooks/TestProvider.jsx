import { TestContext } from "./TestContext";
import { useState } from "react";
export default function TestProvider({ children }) {
  const [test, setTest] = useState("");
  return (
    <TestContext.Provider value={{ test, setTest }}>
      {children}
    </TestContext.Provider>
  );
}
