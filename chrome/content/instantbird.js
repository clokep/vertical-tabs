/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Vertical Tabs code.
 *
 * The Initial Developer of the Original Code is
 * Patrick Cloke <clokep@gmail.com>.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
//ss = "/* * Do not remove the @namespace line -- it's required for correct functioning*/@namespace url(\"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul\"); /* set default namespace to XUL */#conversations > tabbox {-moz-box-orient: horizontal !important;}#conversation > tabbox > .tabbrowser-strip,#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs,#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs > .tabs-stack,#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs > .tabs-stack > .tabs-container,#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs > .tabs-stack > .tabs-container > .tabbrowser-arrowscrollbox,#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs > .tabs-stack > .tabs-container > .tabbrowser-arrowscrollbox > scrollbox {	-moz-box-orient: vertical !important;}#conversation > tabbox > .tabbrowser-strip > .tabbrowser-tabs > .tabs-stack > .tabs-container > .tabbrowser-arrowscrollbox > scrollbox > box > tab {	min-height: 2em !important;	max-height: 2em !important;}";

// From http://forums.mozillazine.org/viewtopic.php?p=921150#921150
function getContents(aURL){
	var ioService=Components.classes["@mozilla.org/network/io-service;1"]
							.getService(Components.interfaces.nsIIOService);
	var scriptableStream=Components
						.classes["@mozilla.org/scriptableinputstream;1"]
						.getService(Components.interfaces.nsIScriptableInputStream);

	var channel=ioService.newChannel(aURL,null,null);
	var input=channel.open();
	scriptableStream.init(input);
	var str=scriptableStream.read(input.available());
	scriptableStream.close();
	input.close();
	return str;
}

/*try{
	alert(getContents("chrome://browser/content/browser.css"));
	alert(getContents("http://www.mozillazine.org/"));
}catch(e){alert(e)}*/

function dump(aMessage) {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
									 .getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage("Vertical-Tabs: " + aMessage);
}

let verticalTabs = {
	startup: function()	{
		// Get the document
		let document = getBrowser().ownerDocument;
		let tabbrowser = getBrowser();

		let arrowscrollbox = document.getAnonymousElementByAttribute(tabbrowser.mTabContainer, "anonid", "arrowscrollbox");
		arrowscrollbox.orient = "vertical"; // This is hard coded and must be changd in JS
		
		return;
		
		let tabbox = getBrowser().mTabBox;
		tabbox.orient = "horizontal";

		//let tabs = document.getAnonymousElementByAttribute(tabbox, "anonid", "tabcontainer");
		//dump("Tabs: " + tabs);
		
		let tabbrowserstrip = tabbox.firstChild.nextSibling;
		dump("1 " + tabbrowserstrip.tagName);
		dump("2 " + tabbrowser.mTabContainer.tagName);
		let tabs = tabbrowser.mTabs;
		tabs.orient = "vertical";
		
		let arrowscrollbox = document.getAnonymousElementByAttribute(tabbrowser.mTabContainer, "anonid", "arrowscrollbox");
		arrowscrollbox.orient = "vertical";

		return;
		
		dump(document.getElementById("tabbrowser-tabs"));
		dump(document.getAnonymousElementByAttribute(tabbrowser, "anonid", "arrowscrollbox"));
		document.getAnonymousElementByAttribute(tabbox, "anonid", "arrowscrollbox").orient = "vertical";
		//tabbrowser-tabs
		
		//document.getAnonymousElementByAttribute(tabs, "anonid", "scrollbox").orient = "vertical";
		/*document.getAnonymousElementByAttribute(tabs, "anonid", "arrowscrollbox").style["-moz-box-orient"] = "vertical !important";
		document.getAnonymousElementByAttribute(tabs, "anonid", "scrollbox").style["-moz-box-orient"] = "vertical !important";
		dump(document.getAnonymousElementByAttribute(tabs, "anonid", "arrowscrollbox").childNodes.length);*/
		return;

		let anonids = {
			"strip": {
				"orient" : "vertical !important"
			},
			"tabcontainer" : {
				"orient" : "vertical !important"
			}
		};

		for (var anonid in anonids) {
			var obj = anonids[anonid];
			for (var property in obj) {
				document.getAnonymousElementByAttribute(tabbrowser, "anonid", anonid)[property] = obj[property];
				dump(document.getAnonymousElementByAttribute(tabbrowser, "anonid", anonid) + "\t" + property + "\t" + obj[property]);
			}
		}

		return;

		try {
			let ss = getContents("chrome://vertical-tabs/content/instantbird.css");

			var parser = new CSSParser();
			var sheet = parser.parse(ss, false, false);
			if (sheet) {
				var i = (document.styleSheets.length - 1);
				for (; i >= 0; i--) {
					if (document.styleSheets[i].href == "chrome://instantbird/content/tabbrowser.css") {
						/*for (var j = (document.styleSheets[i].cssRules.length - 1); j >= 0; j--) {
							document.styleSheets[i].deleteRule(j); // Delete the jth rule
						}*/
						break;
					}
				}
				
				i = i ? i : document.styleSheets.length; // Add to a style sheet
				for (var k = 0; k < sheet.cssRules.length; k++) {
					document.styleSheets[i].insertRule(sheet.cssRules[k].cssText(), k);
				}
				
				//let newStylesheet = document.styleSheets.length + 1;
				//document.styleSheets[newStylesheet] = sheet;
			}
		} catch(e) {}
	}
}

window.addEventListener("load", function(e) {verticalTabs.startup();}, false);
