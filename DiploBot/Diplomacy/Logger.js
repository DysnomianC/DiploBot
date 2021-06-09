import Moment from "moment";
import fs from "fs";
import config from "./config.js"; // Requires running with flag --experimental-json-modules

const logFilePath = config.logger.logFile;

let logWriter = null;

const WriteMessageToLogFile = (message) => {
	if (!logWriter) {
		const options = {
			flags: "a", // see https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options
		}
		logWriter = fs.createWriteStream(logFilePath, options);
		logWriter.on("error", (err) => {
			LogToConsole(`ERROR in log write stream:\r\n${err}`);
		});
	}
	// don't /need/ to wait for log writer to be open, if it's still being opened the write will be queued.
	const data = message.slice(-1) == "\n" ? message : message + "\r\n";
	logWriter.write(data);

}

const LogToConsole = (text) => {
	const displayNow = Moment().format("W-E HH:mm:ss.SSS");
	const message = "[" + displayNow + "] " + text;
	console.log(message);
};

const LogToFile = (text) => {
	if (!logFilePath) return;

	const fileDisplayNow = Moment().format("GGGG-W-E HH:mm:ss.SSS");
	const message = "[" + fileDisplayNow + "] " + text;

	try {
	 	WriteMessageToLogFile(message);
	} catch (e) {
	 	// swallow exception so that we can keep running - logging shouldn't crash the app.
	 	LogToConsole(`ERROR Unhandled exception trying to log to file:\r\n${e}`);
	}
};

const _LogToConsole = LogToConsole;
export { _LogToConsole as LogToConsole };
const _LogToFile = LogToFile;
export { _LogToFile as LogToFile };