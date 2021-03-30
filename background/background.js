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
var client = "";
var mods = "";

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
		fetch("https://cdn.bcmc.ga/crittersdk/master/src/lib.js").then(function (res) {
			return res.text();
		}).then(function (body) {
			filter.write(encoder.encode(str));
		}).catch(function (err) {
			console.error(`Error: ${err}`);
		});
		browser.storage.local.get(["mods"], function (values) {
			if (!values)
			{
				 values = new Array();
			}
			values.mods.forEach(function (mod) {
				fetch(mod).then(function (res) {
					return res.text();
				}).then(function (body) {
					str = `${str}\n${body}`;
					filter.write(encoder.encode(str));
					filter.disconnect();
				}).catch(function (err) {
					console.error(`Error: ${err}`);
				});
			});
		});
	};
}

function update(changes, ctx)
{
	browser.storage.local.get(["mods"], function (values) {
		if (values)
		{
			mods = btoa(JSON.stringify(values.mods));
		} else
		{
			mods = btoa(JSON.stringify(new Array()));
		}
	});
}

function chrome_listener(req)
{
	var req = new Request("https://play.boxcritters.com/lib/client.min.js", {
		"method": "GET",
		"redirect": "follow",
		"referrer": "client"
	});

	fetch(req).then(function (res) {
		return res.text();
	}).then(function (body) {
		client += body;
		update();
	}).catch(function (err) {
		console.error(`Error: ${err}`);
	});
	return {
		"redirectUrl": `https://api.bcmc.ga/applymod/${mods || btoa(JSON.stringify(new Array()))}`
	};
}

if (chrome)
{
	browser.storage.onChanged.addListener(update);
	browser.webRequest.onBeforeRequest.addListener(
		chrome_listener,
		{
			"urls": ["*://*.boxcritters.com/lib/client.min.js"],
			"types": ["main_frame", "script"]
		},
		["blocking"]
	);
} else
{
	browser.webRequest.onBeforeRequest.addListener(
		listener,
		{
			"urls": ["*://*.boxcritters.com/lib/client.min.js"],
			"types": ["main_frame", "script"]
		},
		["blocking"]
	);
}
