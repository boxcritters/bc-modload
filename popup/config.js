/*
 * config.js
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

function remove(url, id)
{
	document.getElementById(id).parentNode.parentNode.removeChild(document.getElementById(id).parentNode);
	browser.storage.local.get(["mods"], function (values) {
		values.mods.splice(values.mods.indexOf(url), 1);
		browser.storage.local.set({
			"mods": values.mods
		});
	});
}

function main()
{
	browser.storage.local.get(["mods"], function (values) {
		values.mods.forEach(function (mod) {
			var req = new Request(mod, {
				"method": "GET",
				"redirect": "follow",
				"referrer": "client"
			});

			fetch(req).then(function (res) {
				return res.text();
			}).then(function (body) {
				try
				{
					var name = body.match(/\/\/\s*@name\s+(.*)\s*\n/i)[1];
					var description = body.match(/\/\/\s*@description\s+(.*)\s*\n/i)[1];
					var author = body.match(/\/\/\s*@author\s+(.*)\s*\n/i)[1];
					var version = body.match(/\/\/\s*@version\s+(.*)\s*\n/i)[1];
					document.getElementById("nomods").style.display = "none";
					document.getElementById("mods").innerHTML = `${document.getElementById("mods").innerHTML}\n\t\t\t\t\t<div class="card-body">\n\t\t\t\t\t\t<div id="${name.toLowerCase().replace(/ /, "-")}">\n\t\t\t\t\t\t\t<div class="list-group-item tp-item btn-group">\n\t\t\t\t\t\t\t\t<div class="tp-link">\n\t\t\t\t\t\t\t\t\t<div class="d-flex w-100 justify-content-between">\n\t\t\t\t\t\t\t\t\t\t<h5 class="mb-1">${name}\t<small class="text-muted" id="version">${version}</small></h5><button type="button" class="close" aria-label="Remove" id="remove-${name.toLowerCase().replace(/ /, "-")}"><img src="../icons/trash.svg"></img></button>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t<p class="mb-1">${description}</p>\n\t\t\t\t\t\t\t\t\t<small class="text-muted">by ${author}</small>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>`;
					document.getElementById(`remove-${name.toLowerCase().replace(/ /, "-")}`).addEventListener("click", function (event) {
						remove(mod, name.toLowerCase().replace(/ /, "-"));
					});
				} catch (err)
				{
					error_dom.innerHTML = `Error: ${err}`;
					error_dom.style.visibility = "visible";
				}
			}).catch(function (err) {
				error_dom.innerHTML = `Error: ${err}`;
				error_dom.style.visibility = "visible";
			});
		});
	});
}

main();
