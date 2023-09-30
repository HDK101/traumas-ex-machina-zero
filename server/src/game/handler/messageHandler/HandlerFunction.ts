import WebSocketClientHandler from "../../handler.js";
import {PlayerMessage} from "../../player/playerMessage.js";

export type HandlerFunction = (playerMessage: PlayerMessage) => void;
export type HandlerClosure = (clientHandler: WebSocketClientHandler) => HandlerFunction;
