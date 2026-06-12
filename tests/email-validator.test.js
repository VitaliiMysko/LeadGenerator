import { parseVerifyResult, emailDataByDefault } from "../src/scripts/services/email-validator.js";

function freshEmailData() {
  return { ...emailDataByDefault };
}

describe("parseVerifyResult", () => {
  test("deliverable state sets ok and message", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "deliverable", reason: "", error: "" }, data);
    expect(data.ok).toBe(true);
    expect(data.message).toBe("Email found");
  });

  test("unknown state sets unknown flag and message", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "unknown", reason: "", error: "" }, data);
    expect(data.unknown).toBe(true);
    expect(data.message).toContain("unknown");
  });

  test("undeliverable + invalid_domain sets invalidDomain flag", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "undeliverable", reason: "invalid_domain", error: "" }, data);
    expect(data.invalidDomain).toBe(true);
    expect(data.message).toContain("Domain is invalid");
  });

  test("non-empty error sets error flag and includes error text in message", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "", reason: "", error: "timeout" }, data);
    expect(data.error).toBe(true);
    expect(data.message).toContain("timeout");
  });

  test("undeliverable with non-domain reason does not set invalidDomain", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "undeliverable", reason: "invalid_email", error: "" }, data);
    expect(data.invalidDomain).toBe(false);
  });

  test("deliverable does not set unrelated flags", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "deliverable", reason: "", error: "" }, data);
    expect(data.error).toBe(false);
    expect(data.unknown).toBe(false);
    expect(data.invalidDomain).toBe(false);
  });

  test("empty error string does not set error flag", () => {
    const data = freshEmailData();
    parseVerifyResult({ state: "deliverable", reason: "", error: "" }, data);
    expect(data.error).toBe(false);
  });
});
