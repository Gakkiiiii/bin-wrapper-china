'use strict';

const {
	china: { ENVS, ...mirrors }
} = require("binary-mirror-config");

function toArray(io) {
	return Array.isArray(io) ? io : [io];
}

const replaceMaps = Object.values(mirrors)
	.filter(
		({ replaceHostMap, replaceHost, host }) =>
			replaceHostMap || (replaceHost && host)
	)
	.map(
		({ replaceHostMap, replaceHost = [], host }) =>
			replaceHostMap ||
			toArray(replaceHost).reduce((io, key) => ({ ...io, [key]: host }), {})
	)
	.flatMap(io => Object.entries(io));

module.exports = function urlReplacer(url) {
	const [match, target] =
		replaceMaps.find(([host]) => url.startsWith(host)) || [];

	return match ? url.replace(match, target) : url;
};
