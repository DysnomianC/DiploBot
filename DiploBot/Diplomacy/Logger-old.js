import Moment from "moment";
import fs from "fs";
import config from "./config.js"; // Requires running with flag --experimental-json-modules

const logFilePath = config.logger.logFile;
const keepLogOpenForMs = config.logger.keepLogOpenForMs; // now removed

const toBeWritten = [];

let logFileDescriptor = null;
let openingLogFile = false;
let closingLogFile = false;
let shouldCloseLogFileImmediately = false;
let shouldReopenLogFileImmediately = false;
let logFileTimeoutId = null;

const LogToConsole = (text) => {
	const displayNow = Moment().format("W-E HH:mm:ss.SSS");
	const message = "[" + displayNow + "] " + text;
	console.log(message);
};

const StartCloseLogFile = () => {
	const CloseLogFile = () => {
		closingLogFile = true;
		fs.close(logFileDescriptor, (err) => {
			if (err) {
				LogToConsole(`ERROR closing log file (fd: ${logFileDescriptor}):\r\n${err}`);
			}
			logFileDescriptor = null;
			closingLogFile = false;
			if (shouldReopenLogFileImmediately) {
				OpenLogFileAndWrite();
				shouldReopenLogFileImmediately = false;
			}
		});
	};

	if (closingLogFile) {
		// if we're already closing don't do anything.
	} else if (openingLogFile) {
		// if we're currently opening the file, flag to close it asap.
		shouldCloseLogFileImmediately = true;
	} else {
		CloseLogFile();
	}
};

const WriteMessageToLogFile = (message) => {
	const WriteToLogFile = () => {
		const Write = (message) => {
			const data = message.slice(-1) == "\n" ? message : message + "\r\n";
			fs.appendFile(logFileDescriptor, data, "utf8", (err) => {
				if (err) {
					LogToConsole(`ERROR appending to log file (fd: ${logFileDescriptor}):\r\n${err}`);
				}
				// TODO for some reason the appends aren't showing up in the file??? idk how to proceed.
			});
		};
		const StartCloseLogFileTimeout = () => {
			logFileTimeoutId = setTimeout(() => {
				StartCloseLogFile();
				logFileTimeoutId = null;
			}, keepLogOpenForMs);
		};

		for (const message of toBeWritten) {
			Write(message); // TODO writes are async so order not guaranteed
		}
		toBeWritten.length = 0; // clear toBeWritten since we just wrote them all and this is all synchronous

		// lmao do nothing cause it not work
		//fs.write(logFilePath, message);
		// Should be append.
		if (logFileTimeoutId) {
			clearInterval(logFileTimeoutId);
			StartCloseLogFileTimeout();
		} else {
			StartCloseLogFileTimeout();
		}
	};
	const OpenLogFileAndWrite = () => {
		openingLogFile = true;
		fs.open(logFilePath, "a", (err, fd) => {
			if (err) {
				LogToConsole(`ERROR opening log file (${logFilePath}):\r\n${err}`);
			} else {
				logFileDescriptor = fd;
				WriteToLogFile();
			}
			openingLogFile = false;
			if (shouldCloseLogFileImmediately) {
				StartCloseLogFile();
				shouldCloseLogFileImmediately = false;
			}
		});
	};

	// first push our message to the buffer to be written
	toBeWritten.push(message);
	if (logFileDescriptor) {
		// if our file is open we can write the buffer.
		WriteToLogFile();
	} else {
		if (openingLogFile) {
			// If the file is being opened right now then it file will write the buffer when it finishes.
		} else if (closingLogFile) {
			// if we're currently closing the file, flag that we should reopen the file.
			shouldReopenLogFileImmediately = true;
		} else {
			// we need to open the log file.
			OpenLogFileAndWrite();
		}
	}
};

const LogToFile = (text) => {
	const fileDisplayNow = Moment().format("GGGG-W-E HH:mm:ss.SSS");
	const message = "[" + fileDisplayNow + "] " + text;

	try {
		WriteMessageToLogFile(message);
	} catch (e) {
		// swallow exception so that we can keep running - logging shouldn't crash the app.
		LogToConsole(`ERROR Unhandled exception trying to log to file:\r\n${e}`);
	}
};

// Keep the explicit consts here - if the original declarations ever change to `let` this could cause some hard to track down bugs.
const _LogToConsole = LogToConsole;
export { _LogToConsole as LogToConsole };
const _LogToFile = LogToFile;
export { _LogToFile as LogToFile };
