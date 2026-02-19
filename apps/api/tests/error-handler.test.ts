import { describe, it, expect, vi } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { errorHandler } from "#/app/middlewares/error-handler.middleware.js";
import { HttpException } from "#/app/errors/errors.js";

function mockRes() {
  const res: Partial<Response> = {};
  res.headersSent = false;

  res.status = vi.fn().mockImplementation(() => res as Response);
  res.json = vi.fn().mockImplementation(() => res as Response);

  return res as Response;
}

describe("errorHandler", () => {
  it("returns 400 for invalid json payload", () => {
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler({ type: "entity.parse.failed" }, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid JSON payload" });
  });

  it("returns status/message for HttpException", () => {
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(new HttpException(401, "Unauthorized"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
  });

  it("calls next(err) when headers already sent", () => {
    const req = {} as Request;
    const res = mockRes();
    (res as any).headersSent = true;
    const next = vi.fn() as unknown as NextFunction;

    const err = new Error("boom");
    errorHandler(err, req, res, next);

    expect(next).toHaveBeenCalledWith(err);
  });

  it("returns 500 for unknown errors", () => {
    const req = {} as Request;
    const res = mockRes();
    const next = vi.fn() as unknown as NextFunction;

    errorHandler(new Error("boom"), req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.any(String) }),
    );
  });
});
