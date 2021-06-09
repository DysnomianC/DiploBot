// run with "node_modules/.bin/jest Parser.test.js"

import { GetLocationsFromStrParts, UnitType, do_something } from "./Parser.js";
import { Action, ActionType } from "./Action.js";
import { AreEqual } from "./StringAssistant.js";

describe("StringAssistant", () => {
	test("AreEqual", () => {
		expect(AreEqual("Word", "Word")).toBe(true);
		expect(AreEqual("Word", "word")).toBe(true);
		expect(AreEqual("Word", "w'ord")).toBe(true);
		expect(AreEqual("Word", "w ord")).toBe(true);
		expect(AreEqual("Word", "woord")).toBe(false);
		expect(AreEqual("Word_Two", "Word Two")).toBe(true);
		expect(AreEqual("Wo'rd_tWo", "Word Two")).toBe(true);
	});
});

describe("Parser", () => {
	const portugal = expect.objectContaining({ names: expect.arrayContaining(["Portugal"]) });
	const spain = expect.objectContaining({ names: expect.arrayContaining(["Spain"]) });

	test("should be able to GetLocationsFromStrParts", () => {
		expect(GetLocationsFromStrParts(["F", "POR", "->", "SPA"])).toStrictEqual([portugal, spain]);
		expect(GetLocationsFromStrParts(["F", "POR", "->", "SPA"], 1)).toStrictEqual([portugal]);
	});

	test("should be able to do_something", () => {
		const result = new Action(ActionType.Move, UnitType.Fleet, portugal, spain);
		expect(do_something("F POR -> SPA")).toBeTruthy();
	});
});
