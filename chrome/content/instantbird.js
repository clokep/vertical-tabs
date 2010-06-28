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
 
function dump(aMessage) {
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
									 .getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage("Vertical-Tabs: " + aMessage);
}

let verticalTabs = {
	startup: function()	{
		let tabbrowser = getBrowser();
		let document = tabbrowser.ownerDocument;
		
		let tabbox = tabbrowser.mTabBox;
		tabbox.orient = "horizontal";
		
		let tabstrip = tabbrowser.mStrip;
		tabstrip.orient = "vertical";
		
		let tabcontainer = tabbrowser.mTabContainer;
		tabcontainer.orient = "vertical";
		tabcontainer.align = "stretch";
		
		let tabstack = document.getAnonymousNodes(tabcontainer)[0];
		tabstack.orient = "vertical";
		
		let tabscontainer = tabstack.firstChild.nextSibling;
		tabscontainer.orient = "vertical";

		let arrowscrollbox = tabcontainer.mTabstrip;
		arrowscrollbox.orient = "vertical";

		let scrollbox = document.getAnonymousElementByAttribute(arrowscrollbox,"anonid","scrollbox");
		scrollbox.orient = "vertical";

		let tabs = tabbrowser.mTabs;
		tabs[0].sizing = "padding-box";
		tabs[0].border = "4px solid";
		tabs[0].backgroundColor = "black";
		
		let tabpanels = tabbox.lastChild.tagName;
		tabpanels.orient = "vertical";
	}
}

window.addEventListener("load", function(e) {verticalTabs.startup();}, false);
