/*
 * main.js
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

var url_dom = document.getElementById("url");
var error_dom = document.getElementById("error");
var encoded_url;

function add_mod()
{
	error_dom.style.visibility = "hidden";

	var req = new Request(url_dom.value, {
		"method": "GET",
		"redirect": "follow",
		"referrer": "client"
	});

	fetch(req).then(function (res) {
		return res.text();
	}).then(function (text) {
		encoded_url = `${browser.extension.getURL("popup/install.html")}?url=${btoa(url_dom.value)}`;
		browser.tabs.create({
			"url": encoded_url,
			"active": true
		});
		window.close();
	}).catch(function (err) {
		document.getElementById("error").innerHTML = `Error: ${err.message}`;
		error_dom.style.visibility = "visible";
	});
}

function open_config()
{
	error_dom.style.visibility = "hidden";
	browser.tabs.create({
		"url": browser.extension.getURL("popup/config.html"),
		"active": true
	});
	window.close();
}

document.getElementById("add").addEventListener("click", add_mod);
document.getElementById("config").addEventListener("click", open_config);
