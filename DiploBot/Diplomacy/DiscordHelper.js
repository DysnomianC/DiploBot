import { LogToConsole, LogToFile } from "./Logger.js";

const SendWithId = function(client, channelID, messageText, tts = false) {
	const channel = client.channels.get(channelID);
	return Send(channel, messageText, tts);
};

const Send = (channel, messageText, tts = false) => {
	if (messageText.length > 0) {
		const messageOptions = {
			tts: tts ? true : false,
			content: messageText,
		};

		return channel
			.send(messageText, messageOptions)
			.then(message => Log("Sent:\r\n" + message.content + "\r\nto [" + message.channelID + "]"));
	}
};

const Log = text => {
	LogToConsole(text);
	LogToFile(text);
};

const _SendWithId = SendWithId;
export { _SendWithId as SendWithId };
const _Send = Send;
export { _Send as Send };
const _Log = Log;
export { _Log as Log };
