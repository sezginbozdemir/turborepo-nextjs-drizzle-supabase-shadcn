import { AsyncLocalStorage } from "node:async_hooks";

export type RequestContext = {
  reqId: string;
  method: string;
  url: string;
  body: unknown;
};

export const requestContext = new AsyncLocalStorage<RequestContext>();
