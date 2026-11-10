import { readFileSync } from "fs";
import { createContext, runInContext } from "vm";

// mutation-observer.js is a classic content script injected again on every
// Extract into the same content-script world; scripts run in one vm context
// share global lexical bindings the same way.
const source = readFileSync(
  new URL("../src/utils/mutation-observer.js", import.meta.url),
  "utf8",
);

describe("mutation-observer.js injection", () => {
  test("can be injected more than once into the same page", () => {
    const context = createContext({ window: {} });

    runInContext(source, context);
    expect(() => runInContext(source, context)).not.toThrow();

    const { leadGenerator } = context.window;
    expect(typeof leadGenerator.waitForElementWithTimeout).toBe("function");
    expect(typeof leadGenerator.waitForConditionWithTimeout).toBe("function");
    expect(typeof leadGenerator.waitForElementById).toBe("function");
  });
});
