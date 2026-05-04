import { useContext } from "react";
import { RmdContext } from "../context/RmdContext";

export default function useRmd() {
  return useContext(RmdContext);
}