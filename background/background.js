/*
 * background.js
 * 
 * Copyright 2020 Alvarito050506 <donfrutosgomez@gmail.com>
 * Copyright 2020 The Box Critters Modding Community
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 2 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */

var browser = browser || chrome;

function listener(req)
{
	var filter = browser.webRequest.filterResponseData(req.requestId);
	var decoder = new TextDecoder("utf-8");
	var encoder = new TextEncoder();
	var data = [];
	var str = String();

	filter.ondata = function (event) {
		data.push(decoder.decode(event.data, {
			"stream": true
		}));
	};

	filter.onstop = function (event) {
		data.push(decoder.decode());
		str = data.join("");
		browser.storage.local.get(["mods"], function (values) {
			values.mods.forEach(function (mod) {
				fetch(mod).then(function (res) {
					return res.text();
				}).then(function (body) {
					str = `${str}\n${body}`;
					filter.write(encoder.encode(str));
					filter.disconnect();
					console.log(str);
				}).catch(function (err) {
					console.error(`Error: ${err}`);
				});
			});
		});
	};
}

browser.webRequest.onBeforeRequest.addListener(
	listener,
	{
		"urls": ["*://boxcritters.com/lib/*"],
		"types": ["main_frame", "script"]
	},
	["blocking"]
);
