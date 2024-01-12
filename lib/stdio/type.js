import {isStream as isNodeStream} from 'is-stream';
import {isUint8Array} from './utils.js';

// The `stdin`/`stdout`/`stderr` option can be of many types. This detects it.
export const getStdioOptionType = stdioOption => {
	if (isUrl(stdioOption)) {
		return 'fileUrl';
	}

	if (isFilePathObject(stdioOption)) {
		return 'filePath';
	}

	if (isWebStream(stdioOption)) {
		return 'webStream';
	}

	if (isNodeStream(stdioOption)) {
		return 'native';
	}

	if (isUint8Array(stdioOption)) {
		return 'uint8Array';
	}

	if (isIterableObject(stdioOption)) {
		return 'iterable';
	}

	return 'native';
};

export const isUrl = stdioOption => Object.prototype.toString.call(stdioOption) === '[object URL]';
export const isRegularUrl = stdioOption => isUrl(stdioOption) && stdioOption.protocol !== 'file:';

const isFilePathObject = stdioOption => typeof stdioOption === 'object'
	&& stdioOption !== null
	&& Object.keys(stdioOption).length === 1
	&& isFilePathString(stdioOption.file);
export const isFilePathString = file => typeof file === 'string';

export const isUnknownStdioString = (type, stdioOption) => type === 'native' && typeof stdioOption === 'string' && !KNOWN_STDIO_STRINGS.has(stdioOption);
const KNOWN_STDIO_STRINGS = new Set(['ipc', 'ignore', 'inherit', 'overlapped', 'pipe']);

const isReadableStream = stdioOption => Object.prototype.toString.call(stdioOption) === '[object ReadableStream]';
export const isWritableStream = stdioOption => Object.prototype.toString.call(stdioOption) === '[object WritableStream]';
const isWebStream = stdioOption => isReadableStream(stdioOption) || isWritableStream(stdioOption);

const isIterableObject = stdioOption => typeof stdioOption === 'object'
	&& stdioOption !== null
	&& !Array.isArray(stdioOption)
	&& (typeof stdioOption[Symbol.asyncIterator] === 'function' || typeof stdioOption[Symbol.iterator] === 'function');

// Convert types to human-friendly strings for error messages
export const TYPE_TO_MESSAGE = {
	fileUrl: 'a file URL',
	filePath: 'a file path string',
	webStream: 'a web stream',
	nodeStream: 'a Node.js stream',
	native: 'any value',
	iterable: 'an iterable',
	string: 'a string',
	uint8Array: 'a Uint8Array',
};