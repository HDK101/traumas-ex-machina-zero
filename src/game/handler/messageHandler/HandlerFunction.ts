import WebSocketClientHandler from "../../handler.js";
import {PlayerMessage} from "../../types.js";

export type HandlerFunction = (playerMessage: PlayerMessage) => void;
export type HandlerClosure = (clientHandler: WebSocketClientHandler) => HandlerFunction;
