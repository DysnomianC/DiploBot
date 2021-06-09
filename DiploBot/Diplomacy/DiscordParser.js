import Discord from "discord.js";

import Action from "./Action.js";
import { Send, Log } from "./DiscordHelper.js";
import Location from "./Location.js";
import { do_the_parse } from "./Parser.js";
import { StringsAreEqual } from "./StringAssistant.js";

const ParseOrder = (message) => {
	const orders = message.content.split("\n");
	let messageText = "Interpreted as:";
	let parsedAnOrder = false;

	try {
		for (const order of orders) {
			const myAction = do_the_parse(order);
			if (myAction) {
				messageText += "\r\n" + myAction.GetDisplayString();
				parsedAnOrder = true;
			}
		}
	} catch (e) {
		Log(`ERROR Unhandled exception trying to parse an order ("${message}"):\r\n${e}`);
		parsedAnOrder = false;
	}

	if (!parsedAnOrder) {
		messageText =
			"Could not parse that order, feel free to edit the order, or don't. Bot can't parse support or convoy orders yet.";
	}
	Send(message.channel, messageText);
};

const _ParseOrder = ParseOrder;
export { _ParseOrder as ParseOrder };
