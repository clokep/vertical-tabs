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

		tabbrowser._onDragStart = (function(aEvent) {
			var target = aEvent.target;
			if (target.localName == "tab" &&
				aEvent.originalTarget.localName != "toolbarbutton") {
				var dt = aEvent.dataTransfer;
				dt.mozSetDataAt(TAB_DROP_TYPE, target, 0);

				aEvent.stopPropagation();
				target._dragOffsetY =
				aEvent.screenY - window.screenY - target.getBoundingClientRect().top;
				target._dragOffsetX = aEvent.screenX - window.screenX;
			}

			this._dragLeftWindow = false;
		});
		// Probably need: _setEffectAllowedForDataTransfer
		// Definitely need: _onDragOver
		// Possibly need _onDrop but I don't think so
		tabbrowser._onDragEnd = (function(aEvent) {
			// Note: while this case is correctly handled here, this event
			// isn't dispatched when the tab is moved within the tabstrip,
			// see bug 460801.

			// Collapse the drop indicator, just to be sure...
			this.mTabDropIndicatorBar.collapsed = true;

			// * mozUserCancelled = the user pressed ESC to cancel the drag
			var dt = aEvent.dataTransfer;
			if (dt.mozUserCancelled || dt.dropEffect != "none")
				return;

			// Disable detach within the browser toolbox
			var eX = aEvent.screenX;
			var wY = window.screenY;
			var eY = aEvent.screenY;
			// check if the drop point is horizontally within the window
			if (eY > wY && eY < (wY + window.outerHeight)) {
				var bo = this.mTabContainer.mTabstrip.boxObject;
				// also avoid detaching if the the tab was dropped too close to
				// the tabbar (half a tab)
				var endScreenX = bo.screenX + 1.5 * bo.width;
				if (eX < endScreenX && eX > window.screenX)
					return;
			}

			var draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
			let win = this.replaceTabsWithWindow([draggedTab]);
			if (win) {
				win.moveTo(eX - draggedTab._dragOffsetX,
						   eY - draggedTab._dragOffsetY);
			}
			aEvent.stopPropagation();
		});
		tabbrowser.getNewIndex = (function(aEvent) {
			var i;
			if (window.getComputedStyle(this.parentNode, null).direction == "ltr") {
				for (i = aEvent.target.localName == "tab" ? aEvent.target._tPos : 0; i < this.mTabs.length; i++)
					if (aEvent.screenY < this.mTabs[i].boxObject.screenY + this.mTabs[i].boxObject.height / 2)
						return i;
			} else {
				for (i = aEvent.target.localName == "tab" ? aEvent.target._tPos : 0; i < this.mTabs.length; i++)
					if (aEvent.screenY > this.mTabs[i].boxObject.screenY + this.mTabs[i].boxObject.height / 2)
						return i;
			}
			return this.mTabs.length;
		});
		
		tabbrowser.mTabMaxWidth = "100px";
		tabbrowser.mTabMinWidth = "100px";
		
		let document = tabbrowser.ownerDocument;
		
		let tabbox = tabbrowser.mTabBox;
		//tabbox.orient = "horizontal"; // Set in CSS
		
		let tabstrip = tabbrowser.mStrip;
		tabstrip.orient = "vertical";
		
		let tabcontainer = tabbrowser.mTabContainer;
		tabcontainer.orient = "vertical";
		//tabcontainer.align = "stretch"; // Set in CSS
		
		let tabstack = document.getAnonymousNodes(tabcontainer)[0];
		tabstack.orient = "horizontal";

		/*let tabsbottom = tabstack.firstChild.lastChild;
		dump(tabsbottom.tagName);
		let tabssplitter = tabsbottom.ownerDocument.createElement("splitter");
		tabssplitter.className = "tabs-bottom";
		tabssplitter.collapse = "before";
		tabssplitter.appendChild(document.createElement("grippy"));
		tabstack.firstChild.replaceChild(tabsbottom, tabssplitter);*/
		
		let tabscontainer = tabstack.firstChild.nextSibling;
		tabscontainer.orient = "vertical";

		let arrowscrollbox = tabcontainer.mTabstrip;
		arrowscrollbox.orient = "vertical";

		let scrollbox = document.getAnonymousElementByAttribute(arrowscrollbox,"anonid","scrollbox");
		scrollbox.orient = "vertical";

		let tabs = tabbrowser.mTabs;
		// Set on creation of tabs?
		
		let tabpanels = tabbox.lastChild.tagName;
		tabpanels.orient = "vertical";
	}
}

window.addEventListener("load", function(e) {verticalTabs.startup();}, false);
