import {logCommand} from '../verbose/start.js';
import {getVerboseInfo} from '../verbose/info.js';
import {getStartTime} from '../return/duration.js';
import {joinCommand} from './escape.js';
import {normalizeFdSpecificOption} from './specific.js';

export const handleCommand = (filePath, rawArguments, rawOptions) => {
	const startTime = getStartTime();
	const {command, escapedCommand} = joinCommand(filePath, rawArguments);
	const verboseInfo = getVerboseInfo(normalizeFdSpecificOption(rawOptions, 'verbose'));
	logCommand(escapedCommand, verboseInfo, rawOptions);
	return {
		command,
		escapedCommand,
		startTime,
		verboseInfo,
	};
};