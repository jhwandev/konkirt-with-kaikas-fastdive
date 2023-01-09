import { TestContext } from "./TestContext";
import { useContext } from "react";

function useTest() {
  return useContext(TestContext);
}

export default useTest;
