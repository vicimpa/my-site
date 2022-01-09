/// <reference types="vite/client" />
import { RefObject } from "react";


declare module 'react' {
  function useRef<T = undefined>(): RefObject<T>;
}