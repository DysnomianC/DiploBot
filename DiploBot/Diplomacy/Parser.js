import { Action, ActionType } from "./Action.js";
import config from "./config.js";
import { StringsAreEqual } from "./StringAssistant.js";
import { Locations } from "./Location.js";

const is_debug = config.is_debug;

// user settings (not yet implemented).
const shortmode = false;
const preferred_index = shortmode ? 1 : 0;
const seperator = " ";

const UnitType = Object.freeze({
	// [0] is preferred name, [1] is short code, [2+] are other names.
	Army: { names: ["Army", "A", "Arm"] },
	Fleet: { names: ["Fleet", "F", "Fl", "Boat", "B", "Navy", "N", "Nav"] },
	Unit: { names: ["Unit", "U"] },
	GetAllUnits: () => [UnitType.Army, UnitType.Fleet, UnitType.Unit],
	GetUnitForStr: (str) =>
		UnitType.GetAllUnits().find((u) => u.names.some((u_name) => StringsAreEqual(u_name, str))),
});

const GetLocationsFromStrParts = (order_parts, maxLocations) => {
	const locations = new Array();
	for (const part of order_parts) {
		// find the location that has at least one name that equals the part.
		const location = Locations.find((loc) =>
			loc.names.some((loc_name) => StringsAreEqual(loc_name, part))
		);
		if (location) {
			if (is_debug) console.log("Location: " + location);
			locations.push(location);

			if (maxLocations !== undefined && locations.length >= maxLocations) break;
		}
	}
	return locations;
};

const Parse = (actionType, order_parts) => {
	const ParseMove = (order_parts) => {
		const locations = GetLocationsFromStrParts(order_parts);

		if (locations.length != 2) {
			return false;
		}

		let u = UnitType.GetUnitForStr(order_parts[0]);
		if (!u) {
			u = UnitType.Unit;
		}

		const myAction = new Action(ActionType.Move, u, locations[0], locations[1], null);
		return myAction;
	};

	const ParseHold = (order_parts) => {
		const locations = GetLocationsFromStrParts(order_parts);

		if (locations.length != 1) {
			return false;
		}

		let u = UnitType.GetUnitForStr(order_parts[0]);
		if (!u) {
			u = UnitType.Unit;
		}

		const myAction = new Action(ActionType.Hold, u, locations[0], null, null);
		return myAction;
	};

	switch (actionType) {
		case ActionType.Move:
			return ParseMove(order_parts);
		case ActionType.Hold:
			return ParseHold(order_parts);
		case ActionType.Support:
		case ActionType.Convoy:
			break;
	}
};

const do_the_parse = function (order) {
	// First replace all location names with 3-letter code versions, including coasts somehow.

	for (const location of Locations)
	{
		
	}

	const parts = order.split(seperator);
	let myAction = null;

	for (const part of parts) {
		if (is_debug) console.log("Part: " + part);
		for (const actionType of ActionType.GetAllActionTypes()) {
			for (const verb of actionType.verbs) {
				if (StringsAreEqual(part, verb)) {
					if (is_debug) console.log("Action: " + actionType.verbs[preferred_index]);
					myAction = Parse(actionType, parts);
					if (is_debug) {
						if (myAction.GetDisplayString) {
							const display = myAction.GetDisplayString(shortmode, preferred_index);
							console.log('Interpreted as "' + display + '"');
						}
					}
					break;
				}
			}
			if (myAction) break;
		}
		if (myAction) break;
	}

	return myAction;
};

//do_something("F Mid_Atlantic to Portugal");

const _do_the_parse = do_the_parse;
export { _do_the_parse as do_the_parse };
const _GetLocationsFromStrParts = GetLocationsFromStrParts;
export { _GetLocationsFromStrParts as GetLocationsFromStrParts };
const _UnitType = UnitType;
export { _UnitType as UnitType };

// also export user settings
const _shortmode = shortmode;
export { _shortmode as shortmode };
const _preferred_index = preferred_index;
export { _preferred_index as preferred_index };
const _seperator = seperator;
export { _seperator as seperator };
