/*
 * install.js
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

var error_dom = document.getElementById("error");
var success_dom = document.getElementById("success");
var name_dom = document.getElementById("name");
var description_dom = document.getElementById("description");
var author_dom = document.getElementById("author");
var textarea_dom = document.getElementById("textarea");

function get_url()
{
	return atob(new URLSearchParams(new URL(location.href).search).get("url"));
}

function add_mod()
{
	error_dom.style.display = "none";
	error_dom.innerHTML = "";

	browser.storage.local.get(["mods"], function (values) {
		if (values.mods && values.mods.indexOf(get_url()) == -1)
		{
			values.mods.push(get_url())
			browser.storage.local.set({
				"mods": values.mods
			});
			success_dom.style.display = "block";
		} else if (!values.mods)
		{
			browser.storage.local.set({
				"mods": [get_url()]
			});
			success_dom.style.display = "block";
		} else
		{
			error_dom.innerHTML = "Error: The mod is already installed.";
			success_dom.style.display = "none";
			error_dom.style.display = "block";
		}
	});
}

function main()
{
	error_dom.style.display = "none";
	error_dom.innerHTML = "";
	success_dom.style.display = "none";

	if (!get_url())
	{
		error_dom.innerHTML = "Error: Mod URL not provided.";
		error_dom.style.display = "block";
		return -1;
	}

	var req = new Request(get_url(), {
		"method": "GET",
		"redirect": "follow",
		"referrer": "client"
	});

	fetch(req).then(function (res) {
		return res.text();
	}).then(function (body) {
		textarea_dom.value = body;
		try
		{
			var name = body.match(/\/\/\s*@name\s+(.*)\s*\n/i)[1];
			var description = body.match(/\/\/\s*@description\s+(.*)\s*\n/i)[1];
			var author = body.match(/\/\/\s*@author\s+(.*)\s*\n/i)[1];
			var version = body.match(/\/\/\s*@version\s+(.*)\s*\n/i)[1];
			document.getElementById("noinfo").style.display = "none";
			document.getElementById("info").style.display = "block";
			name_dom.innerHTML = `${name}\t<small class="text-muted" id="version">${version}</small>`;
			description_dom.innerHTML = description;
			author_dom.innerHTML = `by ${author}`;
		} catch (err)
		{
			error_dom.innerHTML = `Error: ${err}`;
			error_dom.style.display = "block";
		}
	}).catch(function (err) {
		error_dom.innerHTML = `Error: ${err}`;
		error_dom.style.display = "block";
	});
}

document.getElementById("add").addEventListener("click", add_mod);
main();
