import {HandlerClosure} from "./HandlerFunction.js";

export interface MessageHandler {
  name: string;
  handler: HandlerClosure;
}
