import { jest } from "@jest/globals";
import { pollUploadStatus } from "../scripts/chrome-web-store/status.js";

function fakeClient(request) {
  return { itemPath: "/publishers/p/items/e", request };
}

describe("pollUploadStatus", () => {
  test("returns immediately on a terminal state", async () => {
    const request = jest.fn().mockResolvedValue({ uploadState: "SUCCESS" });
    const status = await pollUploadStatus(fakeClient(request), { sleep: jest.fn(), now: () => 0 });
    expect(status).toEqual({ uploadState: "SUCCESS" });
    expect(request).toHaveBeenCalledTimes(1);
  });

  test("polls again while the state is in progress, then returns on success", async () => {
    const request = jest
      .fn()
      .mockResolvedValueOnce({ uploadState: "IN_PROGRESS" })
      .mockResolvedValueOnce({ uploadState: "IN_PROGRESS" })
      .mockResolvedValueOnce({ uploadState: "SUCCESS" });
    const sleep = jest.fn().mockResolvedValue(undefined);

    const status = await pollUploadStatus(fakeClient(request), { sleep, now: () => 0, intervalMs: 10, timeoutMs: 1000 });

    expect(status.uploadState).toBe("SUCCESS");
    expect(request).toHaveBeenCalledTimes(3);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  test("times out and throws when the deadline passes while still in progress", async () => {
    const request = jest.fn().mockResolvedValue({ uploadState: "IN_PROGRESS" });
    let t = 0;
    const now = () => t;
    const sleep = jest.fn().mockImplementation(() => {
      t += 100;
      return Promise.resolve();
    });

    await expect(
      pollUploadStatus(fakeClient(request), { sleep, now, intervalMs: 100, timeoutMs: 250 })
    ).rejects.toThrow(/Timed out/);
  });

  test("treats a non-progress, non-SUCCESS terminal state (e.g. FAILURE) as terminal, not a timeout", async () => {
    const request = jest.fn().mockResolvedValue({ uploadState: "FAILURE" });
    const status = await pollUploadStatus(fakeClient(request), { sleep: jest.fn(), now: () => 0 });
    expect(status.uploadState).toBe("FAILURE");
  });
});
