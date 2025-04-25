import { RequestHandler } from 'express';

declare module 'express-async-handler' {
  function expressAsyncHandler<P = any, ResBody = any, ReqBody = any>(
    handler: RequestHandler<P, ResBody, ReqBody>
  ): RequestHandler<P, ResBody, ReqBody>;

  export = expressAsyncHandler;
}
