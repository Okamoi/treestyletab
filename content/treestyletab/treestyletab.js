var TreeStyleTabService = { 
	/* attributes */
	kID                 : 'treestyletab-id',
	kCHILDREN           : 'treestyletab-children',
	kPARENT             : 'treestyletab-parent',
	kANCESTOR           : 'treestyletab-ancestors',
	kNEST               : 'treestyletab-nest',
	kINSERT_BEFORE      : 'treestyletab-insert-before',
	kINSERT_AFTER       : 'treestyletab-insert-after',

	kID_RESTORING       : 'treestyletab-id-restoring',
	kCHILDREN_RESTORING : 'treestyletab-children-restoring',

	kSUBTREE_COLLAPSED  : 'treestyletab-subtree-collapsed',
	kCOLLAPSED          : 'treestyletab-collapsed',
	kCOLLAPSED_DONE     : 'treestyletab-collapsed-done',
	kCOLLAPSING         : 'treestyletab-collapsing',
	kALLOW_COLLAPSE     : 'treestyletab-allow-subtree-collapse',

	kX_OFFSET           : 'treestyletab-x-offset',
	kY_OFFSET           : 'treestyletab-y-offset',

	kTABBAR_POSITION    : 'treestyletab-tabbar-position',
	kMODE               : 'treestyletab-mode',

	kHIDE_ALLTABS       : 'treestyletab-hide-alltabs-button',
	kSTYLE              : 'treestyletab-style',
	kFIRSTTAB_BORDER    : 'treestyletab-firsttab-border',
	kFIXED              : 'treestyletab-tabbar-fixed',
	kRESIZING           : 'treestyletab-tabbar-resizing',
	kINDENTED           : 'treestyletab-tabs-indented',

	kTAB_INVERTED          : 'treestyletab-tab-inverted',
	kTAB_CONTENTS_INVERTED : 'treestyletab-tab-contents-inverted',
	kCLOSEBOX_INVERTED     : 'treestyletab-closebox-inverted',
	kSCROLLBAR_INVERTED    : 'treestyletab-scrollbar-inverted',

	kTWISTY_HOVER       : 'treestyletab-twisty-hover',
	kTWISTY_STYLE       : 'treestyletab-twisty-style',

	kDROP_POSITION      : 'treestyletab-drop-position',
	kDRAG_TYPE_TABBAR   : 'application/x-moz-treestyletab-tabbrowser-tabbar',
	kDROP_POSITION_UNKNOWN : 'unknown',
	kTABBAR_MOVE_FORCE  : 'force',
	kTABBAR_MOVE_NORMAL : 'normal',

	/* classes */
	kTWISTY                : 'treestyletab-twisty',
	kTWISTY_CONTAINER      : 'treestyletab-twisty-container',
	kDROP_MARKER           : 'treestyletab-drop-marker',
	kDROP_MARKER_CONTAINER : 'treestyletab-drop-marker-container',
	kCOUNTER               : 'treestyletab-counter',
	kCOUNTER_CONTAINER     : 'treestyletab-counter-container',
	kSPLITTER              : 'treestyletab-splitter',
	kTABBAR_TOGGLER        : 'treestyletab-tabbar-toggler',

	kMENUITEM_REMOVESUBTREE_SELECTION : 'multipletab-selection-item-removeTabSubtree',

	kFOCUS_ALL     : 0,
	kFOCUS_VISIBLE : 1,

	kDROP_BEFORE : -1,
	kDROP_ON     : 0,
	kDROP_AFTER  : 1,

	kACTION_MOVE      : 1 << 0,
	kACTION_STAY      : 1 << 1,
	kACTION_DUPLICATE : 1 << 2,
	kACTION_IMPORT    : 1 << 3,
	kACTION_NEWTAB    : 1 << 4,
	kACTION_ATTACH    : 1 << 10,
	kACTION_PART      : 1 << 11,
	kACTIONS_FOR_SOURCE      : (1 << 0) | (1 << 1),
	kACTIONS_FOR_DESTINATION : (1 << 2) | (1 << 3),

	kTABBAR_TOP    : 1 << 0,
	kTABBAR_BOTTOM : 1 << 1,
	kTABBAR_LEFT   : 1 << 2,
	kTABBAR_RIGHT  : 1 << 3,

	kTABBAR_HORIZONTAL : (1 << 0) | (1 << 1),
	kTABBAR_VERTICAL   : (1 << 2) | (1 << 3),

	kINSERT_FISRT : 0,
	kINSERT_LAST  : 1,

	baseIndent : 12,
	shouldDetectClickOnIndentSpaces : true,

	smoothScrollEnabled  : true,
	smoothScrollDuration : 150,

	animationEnabled : true,
	indentDuration   : 200,
	collapseDuration : 150,

	NSResolver : {
		lookupNamespaceURI : function(aPrefix)
		{
			switch (aPrefix)
			{
				case 'xul':
					return 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
				case 'html':
				case 'xhtml':
					return 'http://www.w3.org/1999/xhtml';
				case 'xlink':
					return 'http://www.w3.org/1999/xlink';
				default:
					return '';
			}
		}
	},

	get SessionStore() {
		if (!this._SessionStore) {
			this._SessionStore = Components
					.classes['@mozilla.org/browser/sessionstore;1']
					.getService(Components.interfaces.nsISessionStore);
		}
		return this._SessionStore;
	},
	_SessionStore : null,

	get ObserverService() {
		if (!this._ObserverService) {
			this._ObserverService = Components
					.classes['@mozilla.org/observer-service;1']
					.getService(Components.interfaces.nsIObserverService);
		}
		return this._ObserverService;
	},
	_ObserverService : null,

	get IOService() {
		if (!this._IOService) {
			this._IOService = Components
					.classes['@mozilla.org/network/io-service;1']
					.getService(Components.interfaces.nsIIOService);
		}
		return this._IOService;
	},
	_IOService : null,

	get WindowMediator() {
		if (!this._WindowMediator) {
			this._WindowMediator = Components
					.classes['@mozilla.org/appshell/window-mediator;1']
					.getService(Components.interfaces.nsIWindowMediator);
		}
		return this._WindowMediator;
	},
	_WindowMediator : null,

	get EffectiveTLD()
	{
		if (!('_EffectiveTLD' in this)) {
			this._EffectiveTLD = 'nsIEffectiveTLDService' in Components.interfaces ?
				Components
					.classes['@mozilla.org/network/effective-tld-service;1']
					.getService(Components.interfaces.nsIEffectiveTLDService) :
				null ;
		}
		return this._EffectiveTLD;
	},
//	_EffectiveTLD : null,

	get PromptService()
	{
		if (!this._PromptService) {
			this._PromptService = Components
					.classes['@mozilla.org/embedcomp/prompt-service;1']
					.getService(Components.interfaces.nsIPromptService);
		}
		return this._PromptService;
	},
	_PromptService : null,

	get XULAppInfo() {
		if (!this._XULAppInfo) {
			this._XULAppInfo = Components
					.classes['@mozilla.org/xre/app-info;1']
					.getService(Components.interfaces.nsIXULAppInfo);
		}
		return this._XULAppInfo;
	},
	_XULAppInfo : null,
	get Comparator() {
		if (!this._Comparator) {
			this._Comparator = Components
					.classes['@mozilla.org/xpcom/version-comparator;1']
					.getService(Components.interfaces.nsIVersionComparator);
		}
		return this._Comparator;
	},
	_Comparator : null,

	get treeBundle() {
		return window['piro.sakura.ne.jp']
				.stringBundle
				.get('chrome://treestyletab/locale/treestyletab.properties');
	},
	get tabbrowserBundle() {
		return window['piro.sakura.ne.jp']
				.stringBundle
				.get('chrome://browser/locale/tabbrowser.properties');
	},
	
/* API */ 
	
	readyToOpenChildTab : function TSTService_readyToOpenChildTab(aFrameOrTabBrowser, aMultiple, aInsertBefore) /* PUBLIC API */ 
	{
		if (!this.getTreePref('autoAttachNewTabsAsChildren')) return;

		var frame = this.getFrameFromTabBrowserElements(aFrameOrTabBrowser);
		if (!frame) return;

		var ownerBrowser = this.getTabBrowserFromFrame(frame);

		var parentTab = this.getTabFromFrame(frame, ownerBrowser);
		ownerBrowser.treeStyleTab.ensureTabInitialized(parentTab);
		var parentId = parentTab.getAttribute(this.kID);

		var refId = null;
		if (aInsertBefore) {
			ownerBrowser.treeStyleTab.ensureTabInitialized(parentTab);
			refId = aInsertBefore.getAttribute(this.kID);
		}

		ownerBrowser.treeStyleTab.readiedToAttachNewTab   = true;
		ownerBrowser.treeStyleTab.readiedToAttachMultiple = aMultiple || false ;
		ownerBrowser.treeStyleTab.multipleCount           = 0;
		ownerBrowser.treeStyleTab.parentTab               = parentId;
		ownerBrowser.treeStyleTab.insertBefore            = refId;
	},
 
	readyToOpenNewTabGroup : function TSTService_readyToOpenNewTabGroup(aFrameOrTabBrowser, aTreeStructure) /* PUBLIC API */ 
	{
		if (!this.getTreePref('autoAttachNewTabsAsChildren')) return;

		var frame = this.getFrameFromTabBrowserElements(aFrameOrTabBrowser);
		if (!frame) return;

		this.stopToOpenChildTab(frame);

		var ownerBrowser = this.getTabBrowserFromFrame(frame);
		ownerBrowser.treeStyleTab.readiedToAttachNewTabGroup = true;
		ownerBrowser.treeStyleTab.readiedToAttachMultiple    = true;
		ownerBrowser.treeStyleTab.multipleCount              = 0;
		ownerBrowser.treeStyleTab.treeStructure              = aTreeStructure;
	},
 
	stopToOpenChildTab : function TSTService_stopToOpenChildTab(aFrameOrTabBrowser) /* PUBLIC API */ 
	{
		var frame = this.getFrameFromTabBrowserElements(aFrameOrTabBrowser);
		if (!frame) return;

		var ownerBrowser = this.getTabBrowserFromFrame(frame);
		ownerBrowser.treeStyleTab.readiedToAttachNewTab      = false;
		ownerBrowser.treeStyleTab.readiedToAttachNewTabGroup = false;
		ownerBrowser.treeStyleTab.readiedToAttachMultiple    = false;
		ownerBrowser.treeStyleTab.multipleCount              = 0;
		ownerBrowser.treeStyleTab.parentTab                  = null;
		ownerBrowser.treeStyleTab.insertBefore               = null;
		ownerBrowser.treeStyleTab.treeStructure              = null;
	},
 
	checkToOpenChildTab : function TSTService_checkToOpenChildTab(aFrameOrTabBrowser) /* PUBLIC API */ 
	{
		var frame = this.getFrameFromTabBrowserElements(aFrameOrTabBrowser);
		if (!frame) return false;

		var ownerBrowser = this.getTabBrowserFromFrame(frame);
		return ownerBrowser.treeStyleTab.readiedToAttachNewTab || ownerBrowser.treeStyleTab.readiedToAttachNewTabGroup ? true : false ;
	},
 
	checkReadyToOpenNewTab : function TSTService_checkReadyToOpenNewTab(aInfo) 
	{
/*
	挙動の説明

	・現在のサイトと異なるサイトを読み込む場合にタブを開く時：
	  →特に何もしない。新しく開くタブを子タブにする場合は別途
	    readyToOpenChildTabを使う。

	・現在のサイトと同じサイトのページを読み込む場合にタブを開く時：
	  →親のタブは同じサイトか？
	    No ：子タブを開く
	    Yes：兄弟としてタブを開く。ただし、このタブからのタブはすべて
	         現在のタブと次の兄弟タブとの間に開かれ、仮想サブツリーとなる。
	         →現在のタブに「__treestyletab__next」プロパティが
	           あるか？
	           Yes：__treestyletab__nextで示されたタブの直前に
	                新しい兄弟タブを挿入する。
	           No ：現在のタブの次の兄弟タブのIDを__treestyletab__next
	                プロパティに保持し、仮想の子タブを挿入する位置の
	                基準とする。
*/

		var info = aInfo || { uri : '' };
		if (/^javascript:/.test(info.uri)) return false;

		var frame = this.getFrameFromTabBrowserElements(info.target);
		if (!frame) return false;

		var external = info.external || {};
		var internal = info.internal || {};

		var b       = this.getTabBrowserFromFrame(frame);
		var nextTab = b.treeStyleTab.getNextSiblingTab(currentTab);

		var targetHost  = this._getDomainFromURI(info.uri);
		var currentTab  = this.getTabFromFrame(frame);
		var currentURI  = frame.location.href;
		var currentHost = this._getDomainFromURI(currentURI);
		var parentTab   = b.treeStyleTab.getParentTab(currentTab);
		var parentURI   = parentTab ? parentTab.linkedBrowser.currentURI : null ;
		var parentHost  = this._getDomainFromURI(parentURI);

		var openTab      = false;
		var parent       = null;
		var insertBefore = null;

		if (info.modifier) openTab = true;

		if (
			internal.newTab &&
			currentHost == targetHost &&
			currentURI != 'about:blank' &&
			currentURI.split('#')[0] != info.uri.split('#')[0]
			) {
			openTab = info.modifier && info.invert ? !openTab : true ;
			parent = ('forceChild' in internal && !internal.forceChild) ? null :
					(parentHost == targetHost && !internal.forceChild) ? parentTab :
					frame ;
			insertBefore = parentHost == targetHost && !internal.forceChild &&
					(this.getTreePref('insertNewChildAt') == this.kINSERT_FIRST ?
						nextTab :
						(
							b.treeStyleTab.getTabById(currentTab.__treestyletab__next) ||
							(nextTab ? (currentTab.__treestyletab__next = nextTab.getAttribute(this.kID), nextTab) : null )
						)
					);
		}
		else if (
			external.newTab &&
			currentHost != targetHost &&
			currentURI != 'about:blank'
			) {
			openTab = info.modifier && info.invert ? !openTab : true ;
			if (external.forceChild) {
				parent = frame;
			}
		}

		if (openTab && parent) {
			this.readyToOpenChildTab(parent, false, insertBefore);
		}
		return openTab;
	},
	checkReadyToOpenNewTabOnLocationBar : function TSTService_checkReadyToOpenNewTabOnLocationBar(aURI, aModifier)
	{
		return this.checkReadyToOpenNewTab({
			uri      : aURI,
			external : {
				newTab     : this.getTreePref('urlbar.loadDifferentDomainToNewTab'),
				forceChild : this.getTreePref('urlbar.loadDifferentDomainToNewTab.asChild')
			},
			internal : {
				newTab     : this.getTreePref('urlbar.loadSameDomainToNewTab'),
				forceChild : this.getTreePref('urlbar.loadSameDomainToNewTab.asChild')
			},
			modifier : aModifier,
			invert   : this.getTreePref('urlbar.invertDefaultBehavior')
		});
	},
	_getDomainFromURI : function TSTService__getDomainFromURI(aURI)
	{
		if (!aURI) return null;

		if (this.getTreePref('useEffectiveTLD') && this.EffectiveTLD) {
			try {
				var uri = aURI;
				if (!(uri instanceof Ci.nsIURI)) uri = this.makeURIFromSpec(uri);
				var domain = this.EffectiveTLD.getBaseDomain(uri, 0);
				if (domain) return domain;
			}
			catch(e) {
			}
		}

		var str = aURI;
		if (str instanceof Ci.nsIURI) str = aURI.spec;
		return /^\w+:\/\/([^:\/]+)/.test(getShortcutOrURI(str)) ?
				RegExp.$1 :
				null ;
	},
 
	readyToOpenDivertedTab : function TSTService_readyToOpenDivertedTab(aFrameOrTabBrowser) 
	{
		var frame = this.getFrameFromTabBrowserElements(aFrameOrTabBrowser);
		if (!frame) return;
		var ownerBrowser = this.getTabBrowserFromFrame(frame);
		ownerBrowser.treeStyleTab.readiedToOpenDivertedTab = true;
	},
 
	setTabbarWidth : function TSTService_setTabbarWidth(aWidth, aForceExpanded) /* PUBLIC API */ 
	{
		gBrowser.treeStyleTab.autoHide.setWidth(aWidth, aForceExpanded);
	},
 
	setContentWidth : function TSTService_setContentWidth(aWidth, aKeepWindowSize) /* PUBLIC API */ 
	{
		var treeStyleTab = gBrowser.treeStyleTab;
		var tabbarWidth = treeStyleTab.splitterWidth + (treeStyleTab.isVertical ? gBrowser.mStrip.boxObject.width : 0 );
		var contentWidth = gBrowser.boxObject.width - tabbarWidth;
		if (aKeepWindowSize ||
			window.fullScreen ||
			window.windowState != Components.interfaces.nsIDOMChromeWindow.STATE_NORMAL) {
			this.setTabbarWidth(Math.max(10, gBrowser.boxObject.width - aWidth));
		}
		else if (tabbarWidth + aWidth <= screen.availWidth) {
			window.resizeBy(aWidth - contentWidth, 0);
		}
		else {
			window.resizeBy(screen.availWidth - window.outerWidth, 0);
			this.setTabbarWidth(gBrowser.boxObject.width - aWidth);
		}
	},
 
	toggleAutoHide : function TSTService_toggleAutoHide() 
	{
		TreeStyleTabBrowserAutoHide.toggleMode();
	},
 
	toggleFixed : function TSTService_toggleFixed() 
	{
		var pos = this.currentTabbarPosition;
		var isVertical = (pos == 'left' || pos == 'right');

		var orient = isVertical ? 'vertical' : 'horizontal' ;
		var pref = 'tabbar.fixed.'+orient;
		this.setTreePref(pref, !this.getTreePref(pref));

		if (!this.getTreePref('tabbar.syncRelatedPrefsForDynamicPosition')) return;

		if (!isVertical)
			this.setTreePref('enableSubtreeIndent.horizontal', !this.getTreePref(pref));
	},
 
	changeTabbarPosition : function TSTService_changeTabbarPosition(aNewPosition) /* PUBLIC API (obsolete, for backward compatibility) */ 
	{
		this.currentTabbarPosition = aNewPosition;
	},
 
	get currentTabbarPosition() /* PUBLIC API */ 
	{
		return this.common.currentTabbarPosition;
	},
	set currentTabbarPosition(aValue)
	{
		return this.common.currentTabbarPosition = aValue;
	},
 
	rollbackTabbarPosition : function TSTService_rollbackTabbarPosition() /* PUBLIC API */ 
	{
		return this.common.rollbackTabbarPosition();
	},
  
/* backward compatibility */ 
	getTempTreeStyleTab : function TSTService_getTempTreeStyleTab(aTabBrowser)
	{
		return aTabBrowser.treeStyleTab || new TreeStyleTabBrowser(aTabBrowser);
	},
	
	initTabAttributes : function TSTService_initTabAttributes(aTab, aTabBrowser) 
	{
		var b = aTabBrowser || this.getTabBrowserFromChild(aTab);
		this.getTempTreeStyleTab(b).initTabAttributes(aTab);
	},
 
	initTabContents : function TSTService_initTabContents(aTab, aTabBrowser) 
	{
		var b = aTabBrowser || this.getTabBrowserFromChild(aTab);
		this.getTempTreeStyleTab(b).initTabContents(aTab);
	},
 
	initTabContentsOrder : function TSTService_initTabContentsOrder(aTab, aTabBrowser) 
	{
		var b = aTabBrowser || this.getTabBrowserFromChild(aTab);
		this.getTempTreeStyleTab(b).initTabContentsOrder(aTab);
	},
  
/* Utilities */ 
	
	stopRendering : function TSTService_stopRendering() 
	{
		window['piro.sakura.ne.jp'].stopRendering.stop();
	},
	startRendering : function TSTService_startRendering()
	{
		window['piro.sakura.ne.jp'].stopRendering.start();
	},
 
	isEventFiredOnTwisty : function TSTService_isEventFiredOnTwisty(aEvent) 
	{
		var tab = this.getTabFromEvent(aEvent);
		if (!tab || !this.hasChildTabs(tab)) return false;

		var expression = 'ancestor-or-self::*[@class="'+this.kTWISTY+'"]';
		if (this.canExpandTwistyArea(this.getTabBrowserFromChild(tab)))
			expression += ' | ancestor-or-self::*[@class="tab-icon" and ancestor::xul:tabbrowser[@'+this.kMODE+'="vertical"]]';

		return this.evaluateXPath(
				expression,
				aEvent.originalTarget || aEvent.target,
				XPathResult.BOOLEAN_TYPE
			).booleanValue;
	},
	canExpandTwistyArea : function TSTService_canExpandTwistyArea(aTabBrowser)
	{
		return (
				this.expandTwistyArea &&
				this._expandTwistyAreaAllowance.every(function(aFunc) {
					return aFunc.call(this, aTabBrowser);
				}, this)
			);
	},
	expandTwistyArea : true,
 
	isEventFiredOnClosebox : function TSTService_isEventFiredOnClosebox(aEvent) 
	{
		return this.evaluateXPath(
				'ancestor-or-self::*[contains(concat(" ", normalize-space(@class), " "), " tab-close-button ")]',
				aEvent.originalTarget || aEvent.target,
				XPathResult.BOOLEAN_TYPE
			).booleanValue;
	},
 
	isEventFiredOnClickable : function TSTService_isEventFiredOnClickable(aEvent) 
	{
		return this.evaluateXPath(
				'ancestor-or-self::*[contains(" button toolbarbutton scrollbar popup menupopup panel tooltip ", concat(" ", local-name(), " "))]',
				aEvent.originalTarget,
				XPathResult.BOOLEAN_TYPE
			).booleanValue;
	},
 
	isNewTabAction : function TSTService_isNewTabAction(aEvent) 
	{
		return aEvent.button == 1 || (aEvent.button == 0 && this.isAccelKeyPressed(aEvent));
	},
 
	isAccelKeyPressed : function TSTService_isAccelKeyPressed(aEvent) 
	{
		var isMac = navigator.platform.toLowerCase().indexOf('mac') > -1;
		var nsIDOMKeyEvent = Components.interfaces.nsIDOMKeyEvent;
		if ( // this is releasing of the accel key!
			(aEvent.type == 'keyup') &&
			(aEvent.keyCode == (isMac ? nsIDOMKeyEvent.DOM_VK_META : nsIDOMKeyEvent.DOM_VK_CONTROL ))
			) {
			return false;
		}
		return isMac ?
			(aEvent.metaKey || (aEvent.keyCode == nsIDOMKeyEvent.DOM_VK_META)) :
			(aEvent.ctrlKey || (aEvent.keyCode == nsIDOMKeyEvent.DOM_VK_CONTROL)) ;
	},
 
	get browserWindow() 
	{
		return this.WindowMediator.getMostRecentWindow('navigator:browser');
	},
 
	get browser() 
	{
		var w = this.browserWindow;
		return !w ? null :
			'SplitBrowser' in w ? w.SplitBrowser.activeBrowser :
			w.gBrowser ;
	},
 
	evaluateXPath : function TSTService_evaluateXPath(aExpression, aContext, aType) 
	{
		if (!aType) aType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
		try {
			var xpathResult = (aContext.ownerDocument || aContext || document).evaluate(
					aExpression,
					(aContext || document),
					this.NSResolver,
					aType,
					null
				);
		}
		catch(e) {
			return {
				singleNodeValue : null,
				snapshotLength  : 0,
				snapshotItem    : function() {
					return null
				}
			};
		}
		return xpathResult;
	},
 
	getArrayFromXPathResult : function TSTService_getArrayFromXPathResult(aXPathResult) 
	{
		var max = aXPathResult.snapshotLength;
		var array = new Array(max);
		if (!max) return array;

		for (var i = 0; i < max; i++)
		{
			array[i] = aXPathResult.snapshotItem(i);
		}

		return array;
	},
 
	getBoxObjectFor : function TSTService_getBoxObjectFor(aNode) 
	{
		return window['piro.sakura.ne.jp'].boxObject.getBoxObjectFor(aNode);
	},
 
	getTabFromEvent : function TSTService_getTabFromEvent(aEvent) 
	{
		return this.getTabFromChild(aEvent.originalTarget || aEvent.target);
	},
 
	getTabFromFrame : function TSTService_getTabFromFrame(aFrame, aTabBrowser) 
	{
		var b = aTabBrowser || this.browser;
		var docShell = aFrame.top
			.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
			.getInterface(Components.interfaces.nsIWebNavigation)
			.QueryInterface(Components.interfaces.nsIDocShell);
		var tabs = this.getTabs(b);
		var tab;
		for (var i = 0, maxi = tabs.snapshotLength; i < maxi; i++)
		{
			tab = tabs.snapshotItem(i);
			if (tab.linkedBrowser.docShell == docShell)
				return tab;
		}
		return null;
	},
 
	getTabFromChild : function TSTService_getTabFromChild(aTab) 
	{
		return this.evaluateXPath(
				'ancestor-or-self::xul:tab[ancestor::xul:tabbrowser]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getTabbarFromEvent : function TSTService_getTabbarFromEvent(aEvent) 
	{
		return this.evaluateXPath(
				'ancestor-or-self::*[contains(concat(" ", normalize-space(@class), " "), " tabbrowser-strip ")]',
				aEvent.originalTarget || aEvent.target,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getTabBrowserFromChild : function TSTService_getTabBrowserFromChild(aTabBrowserChild) 
	{
		if (!aTabBrowserChild) return null;

		if (aTabBrowserChild.__treestyletab__linkedTabBrowser)
			return aTabBrowserChild.__treestyletab__linkedTabBrowser;

		if (aTabBrowserChild.localName == 'tabbrowser')
			return aTabBrowserChild;

		return this.evaluateXPath(
				'ancestor::xul:tabbrowser[1]',
				aTabBrowserChild,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getTabBrowserFromFrame : function TSTService_getTabBrowserFromFrame(aFrame) 
	{
		var w = this.browserWindow;
		return !w ? null :
			('SplitBrowser' in w) ? this.getTabBrowserFromChild(w.SplitBrowser.getSubBrowserAndBrowserFromFrame(aFrame.top).browser) :
			this.browser ;
	},
 
	getFrameFromTabBrowserElements : function TSTService_getFrameFromTabBrowserElements(aFrameOrTabBrowser) 
	{
		var frame = aFrameOrTabBrowser;
		if (frame == '[object XULElement]') {
			if (frame.localName == 'tab') {
				frame = frame.linkedBrowser.contentWindow;
			}
			else if (frame.localName == 'browser') {
				frame = frame.contentWindow;
			}
			else {
				frame = this.getTabBrowserFromChild(frame);
				if (!frame) return null;
				frame = frame.contentWindow;
			}
		}
		if (!frame)
			frame = this.browser.contentWindow;

		return frame;
	},
 
	makeNewId : function TSTService_makeNewId() 
	{
		return 'tab-<'+Date.now()+'-'+parseInt(Math.random() * 65000)+'>';
	},
 
	makeURIFromSpec : function TSTService_makeURIFromSpec(aURI) 
	{
		var newURI;
		aURI = aURI || '';
		if (aURI && String(aURI).indexOf('file:') == 0) {
			var fileHandler = this.IOService.getProtocolHandler('file').QueryInterface(Components.interfaces.nsIFileProtocolHandler);
			var tempLocalFile = fileHandler.getFileFromURLSpec(aURI);
			newURI = this.IOService.newFileURI(tempLocalFile);
		}
		else {
			if (!/^\w+\:/.test(aURI)) aURI = 'http://'+aURI;
			newURI = this.IOService.newURI(aURI, null, null);
		}
		return newURI;
	},
 
	getPropertyPixelValue : function TSTService_getPropertyPixelValue(aElementOrStyle, aProp) 
	{
		var style = aElementOrStyle instanceof Components.interfaces.nsIDOMCSSStyleDeclaration ?
					aElementOrStyle :
					window.getComputedStyle(aElementOrStyle, null) ;
		return Number(style.getPropertyValue(aProp).replace(/px$/, ''));
	},
 
	getGroupTabURI : function TSTService_getGroupTabURI(aTitle) 
	{
		return 'about:treestyletab-group'+(aTitle === void(0) ? '' : '?'+encodeURIComponent(aTitle) );
	},
 
/* get tab(s) */ 
	
	getTabById : function TSTService_getTabById(aId, aTabBrowserChildren) 
	{
		if (!aId) return null;
		var b = this.getTabBrowserFromChild(aTabBrowserChildren) || this.browser;
		return this.evaluateXPath(
				'descendant::xul:tab[@'+this.kID+' = "'+aId+'"]',
				b.mTabContainer,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	isTabDuplicated : function TSTService_isTabDuplicated(aTab) 
	{
		if (!aTab) return false;
		var id = this.getTabValue(aTab, this.kID);
		var b = this.getTabBrowserFromChild(aTab) || this.browser;
		return this.evaluateXPath(
				'count(descendant::xul:tab[@'+this.kID+' = "'+id+'" or @'+this.kID_RESTORING+' = "'+id+'"]) > 1',
				b.mTabContainer,
				XPathResult.BOOLEAN_TYPE
			).booleanValue;
	},
 
	getTabs : function TSTService_getTabs(aTabBrowserChild) 
	{
		var b = this.getTabBrowserFromChild(aTabBrowserChild);
		return this.evaluateXPath(
				'descendant::xul:tab',
				b.mTabContainer
			);
	},
 
	getTabsArray : function TSTService_getTabsArray(aTabBrowserChild) 
	{
		var tabs = this.getTabs(aTabBrowserChild);
		var array = [];
		for (var i = 0, maxi = tabs.snapshotLength; i < maxi; i++)
		{
			array.push(tabs.snapshotItem(i));
		}
		return array;
	},
 
	getFirstTab : function TSTService_getFirstTab(aTabBrowserChild) 
	{
		var b = this.getTabBrowserFromChild(aTabBrowserChild);
		return this.evaluateXPath(
				'child::xul:tab[1]',
				b.mTabContainer,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getLastTab : function TSTService_getLastTab(aTabBrowserChild) 
	{
		var b = this.getTabBrowserFromChild(aTabBrowserChild);
		return this.evaluateXPath(
				'child::xul:tab[last()]',
				b.mTabContainer,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getNextTab : function TSTService_getNextTab(aTab) 
	{
		if (!aTab) return null;
		return this.evaluateXPath(
				'following-sibling::xul:tab[1]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getPreviousTab : function TSTService_getPreviousTab(aTab) 
	{
		if (!aTab) return null;
		return this.evaluateXPath(
				'preceding-sibling::xul:tab[1]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getTabIndex : function TSTService_getTabIndex(aTab) 
	{
		if (!aTab) return -1;
		return this.evaluateXPath(
				'count(preceding-sibling::xul:tab)',
				aTab,
				XPathResult.NUMBER_TYPE
			).numberValue;
	},
 
	getNextVisibleTab : function TSTService_getNextVisibleTab(aTab) 
	{
		if (!aTab) return null;

		if (!this.canCollapseSubtree(aTab))
			return this.getNextTab(aTab);

		return this.evaluateXPath(
				'following-sibling::xul:tab[not(@'+this.kCOLLAPSED+'="true")][1]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getPreviousVisibleTab : function TSTService_getPreviousVisibleTab(aTab) 
	{
		if (!aTab) return null;

		if (!this.canCollapseSubtree(aTab))
			return this.getPreviousTab(aTab);

		return this.evaluateXPath(
				'preceding-sibling::xul:tab[not(@'+this.kCOLLAPSED+'="true")][1]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getLastVisibleTab : function TSTService_getLastVisibleTab(aTabBrowserChild) 
	{
		var b = this.getTabBrowserFromChild(aTabBrowserChild);
		if (!b) return null;

		if (!this.canCollapseSubtree(b))
			return this.getLastTab(b);

		return this.evaluateXPath(
				'child::xul:tab[not(@'+this.kCOLLAPSED+'="true")][last()]',
				b.mTabContainer,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getVisibleTabs : function TSTService_getVisibleTabs(aTabBrowserChild) 
	{
		var b = this.getTabBrowserFromChild(aTabBrowserChild);
		if (!this.canCollapseSubtree(b))
			return this.getTabs(b);

		var xpathResult = this.evaluateXPath(
				'child::xul:tab[not(@'+this.kCOLLAPSED+'="true")]',
				b.mTabContainer
			);
		return xpathResult;
	},
 
	getVisibleIndex : function TSTService_getVisibleIndex(aTab) 
	{
		if (!aTab) return -1;

		if (!this.canCollapseSubtree(aTab))
			return this.getTabIndex(aTab);

		return aTab.getAttribute(this.kCOLLAPSED) == 'true' ?
			-1 :
			this.evaluateXPath(
				'count(preceding-sibling::xul:tab[not(@'+this.kCOLLAPSED+'="true")])',
				aTab,
				XPathResult.NUMBER_TYPE
			).numberValue;
	},
  
/* tree manipulations */ 
	
	get rootTabs() /* PUBLIC API */ 
	{
		return this.getArrayFromXPathResult(
				this.evaluateXPath(
					'child::xul:tab[not(@'+this.kNEST+') or @'+this.kNEST+'="0" or @'+this.kNEST+'=""]',
					this.browser.mTabContainer
				)
			);
	},
 
	canCollapseSubtree : function TSTService_canCollapseSubtree(aTabBrowser) /* PUBLIC API */ 
	{
		var b = this.getTabBrowserFromChild(aTabBrowser) || this.browser;
		return b.getAttribute(this.kALLOW_COLLAPSE) == 'true';
	},
 
	isCollapsed : function TSTService_isCollapsed(aTab) /* PUBLIC API */ 
	{
		if (!aTab || !this.canCollapseSubtree(aTab))
			return false;

		return aTab.getAttribute(this.kCOLLAPSED) == 'true';
	},
 
	isSubtreeCollapsed : function TSTService_isSubtreeCollapsed(aTab) /* PUBLIC API */ 
	{
		if (!aTab || !this.canCollapseSubtree(aTab) || !this.hasChildTabs(aTab))
			return false;

		return aTab.getAttribute(this.kSUBTREE_COLLAPSED) == 'true';
	},
 
	getParentTab : function TSTService_getParentTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;
		var id = aTab.getAttribute(this.kID);
		if (!id) return null; // not initialized yet
		return this.evaluateXPath(
				'parent::*/child::xul:tab[contains(concat("|", @'+this.kCHILDREN+', "|"), "|'+id+'|")]',
				aTab,
				XPathResult.FIRST_ORDERED_NODE_TYPE
			).singleNodeValue;
	},
 
	getRootTab : function TSTService_getRootTab(aTab) /* PUBLIC API */ 
	{
		var parent = aTab;
		var root   = aTab;
		while (parent = this.getParentTab(parent))
		{
			root = parent;
		}
		return root;
	},
 
	getNextSiblingTab : function TSTService_getNextSiblingTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;

		var parentTab = this.getParentTab(aTab);

		if (!parentTab) {
			let next = aTab;
			do {
				next = next.nextSibling;
			}
			while (next &&
					next.nodeType == Node.ELEMENT_NODE &&
					this.getParentTab(next));
			return next;
		}

		var children = parentTab.getAttribute(this.kCHILDREN);
		if (children) {
			let list = ('|'+children).split('|'+aTab.getAttribute(this.kID))[1].split('|');
			for (let i = 0, maxi = list.length; i < maxi; i++)
			{
				let firstChild = this.getTabById(list[i], aTab);
				if (firstChild) return firstChild;
			}
		}
		return null;
	},
 
	getPreviousSiblingTab : function TSTService_getPreviousSiblingTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;

		var parentTab = this.getParentTab(aTab);

		if (!parentTab) {
			let prev = aTab;
			do {
				prev = prev.previousSibling;
			}
			while (prev &&
					prev.nodeType == Node.ELEMENT_NODE &&
					this.getParentTab(prev));
			return prev;
		}

		var children = parentTab.getAttribute(this.kCHILDREN);
		if (children) {
			let list = ('|'+children).split('|'+aTab.getAttribute(this.kID))[0].split('|');
			for (let i = list.length-1; i > -1; i--)
			{
				let lastChild = this.getTabById(list[i], aTab);
				if (lastChild) return lastChild;
			}
		}
		return null;
	},
 
	getChildTabs : function TSTService_getChildTabs(aTab, aAllTabsArray) /* PUBLIC API */ 
	{
		var tabs = [];
		if (!aTab) return tabs;

		var children = aTab.getAttribute(this.kCHILDREN);
		if (!children) return tabs;

		if (aAllTabsArray) tabs = aAllTabsArray;

		var list = children.split('|');
		for (let i = 0, maxi = list.length; i < maxi; i++)
		{
			let tab = this.getTabById(list[i], aTab);
			if (!tab) continue;
			tabs.push(tab);
			if (aAllTabsArray)
				this.getChildTabs(tab, tabs);
		}

		return tabs;
	},
 
	hasChildTabs : function TSTService_hasChildTabs(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return false;
		return aTab.hasAttribute(this.kCHILDREN);
	},
 
	getDescendantTabs : function TSTService_getDescendantTabs(aTab) /* PUBLIC API */ 
	{
		var tabs = [];
		this.getChildTabs(aTab, tabs);
		return tabs;
	},
 
	getFirstChildTab : function TSTService_getFirstChildTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;

		var children   = aTab.getAttribute(this.kCHILDREN);
		var firstChild = null;
		if (children) {
			let list = children.split('|');
			for (let i = 0, maxi = list.length; i < maxi; i++)
			{
				firstChild = this.getTabById(list[i], aTab);
				if (firstChild) break;
			}
		}
		return firstChild;
	},
 
	getLastChildTab : function TSTService_getLastChildTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;

		var children  = aTab.getAttribute(this.kCHILDREN);
		var lastChild = null;
		if (children) {
			let list = children.split('|');
			for (let i = list.length-1; i > -1; i--)
			{
				lastChild = this.getTabById(list[i], aTab);
				if (lastChild) break;
			}
		}
		return lastChild;
	},
 
	getLastDescendantTab : function TSTService_getLastDescendantTab(aTab) /* PUBLIC API */ 
	{
		if (!aTab) return null;

		var tabs = this.getDescendantTabs(aTab);
		return tabs.length ? tabs[tabs.length-1] : null ;
	},
 
	getChildIndex : function TSTService_getChildIndex(aTab, aParent) 
	{
		var parent = this.getParentTab(aTab);
		if (!aParent || !parent || aParent != parent) {
			parent = aTab;
			while (parent && parent != aParent)
			{
				aTab = parent;
				parent = this.getParentTab(parent);
			}
			if (parent != aParent)
				return -1;
			aParent = parent;
		}

		if (aParent) {
			let children = aParent.getAttribute(this.kCHILDREN);
			let list = children.split('|');
			let id = aTab.getAttribute(this.kID);
			for (let i = 0, maxi = list.length; i < maxi; i++)
			{
				if (list[i] == id) return i;
			}
			return -1;
		}
		else {
			let tabs = this.rootTabs;
			for (let i = 0, maxi = tabs.length; i < maxi; i++)
			{
				if (tabs[i] == aTab) return i;
			}
		}
	},
 
	getXOffsetOfTab : function TSTService_getXOffsetOfTab(aTab) 
	{
		var extraCondition = this.canCollapseSubtree(aTab) ?
								'[not(@'+this.kCOLLAPSED+'="true")]' :
								'' ;

		return this.evaluateXPath(
			'sum((self::* | preceding-sibling::xul:tab'+extraCondition+')/attribute::'+this.kX_OFFSET+')',
			aTab,
			XPathResult.NUMBER_TYPE
		).numberValue;
	},
	getYOffsetOfTab : function TSTService_getYOffsetOfTab(aTab)
	{
		var extraCondition = this.canCollapseSubtree(aTab) ?
								'[not(@'+this.kCOLLAPSED+'="true")]' :
								'';

		return this.evaluateXPath(
			'sum((self::* | preceding-sibling::xul:tab'+extraCondition+')/attribute::'+this.kY_OFFSET+')',
			aTab,
			XPathResult.NUMBER_TYPE
		).numberValue;
	},
 
	isGroupTab : function TSTService_isGroupTab(aTab, aLazyCheck) 
	{
		return (
			(aLazyCheck || aTab.linkedBrowser.sessionHistory.count == 1) &&
			aTab.linkedBrowser.currentURI.spec.indexOf('about:treestyletab-group') > -1
		);
	},
  
/* Session Store API */ 
	
	getTabValue : function TSTService_getTabValue(aTab, aKey) 
	{
		var value = '';
		try {
			value = this.SessionStore.getTabValue(aTab, aKey);
		}
		catch(e) {
		}

		if (this.useTMPSessionAPI) {
			let TMPValue = aTab.getAttribute(this.kTMP_SESSION_DATA_PREFIX+aKey);
			if (TMPValue) value = TMPValue;
		}

		return value;
	},
 
	setTabValue : function TSTService_setTabValue(aTab, aKey, aValue) 
	{
		if (!aValue) return this.deleteTabValue(aTab, aKey);

		aTab.setAttribute(aKey, aValue);
		try {
			this.checkCachedSessionDataExpiration(aTab);
			this.SessionStore.setTabValue(aTab, aKey, aValue);
		}
		catch(e) {
		}

		if (this.useTMPSessionAPI)
			aTab.setAttribute(this.kTMP_SESSION_DATA_PREFIX+aKey, aValue);

		return aValue;
	},
 
	deleteTabValue : function TSTService_deleteTabValue(aTab, aKey) 
	{
		aTab.removeAttribute(aKey);
		try {
			this.checkCachedSessionDataExpiration(aTab);
			this.SessionStore.setTabValue(aTab, aKey, '');
			this.SessionStore.deleteTabValue(aTab, aKey);
		}
		catch(e) {
		}

		if (this.useTMPSessionAPI)
			aTab.removeAttribute(this.kTMP_SESSION_DATA_PREFIX+aKey);
	},
 
	// workaround for http://piro.sakura.ne.jp/latest/blosxom/mozilla/extension/treestyletab/2009-09-29_debug.htm
	checkCachedSessionDataExpiration : function TSTService_checkCachedSessionDataExpiration(aTab) 
	{
		if (aTab.linkedBrowser.parentNode.__SS_data &&
			aTab.linkedBrowser.parentNode.__SS_data._tabStillLoading &&
			aTab.getAttribute('busy') != 'true')
			aTab.linkedBrowser.parentNode.__SS_data._tabStillLoading = false;
	},
 
	useTMPSessionAPI : false, 
	kTMP_SESSION_DATA_PREFIX : 'tmp-session-data-',
  
	dropLinksOnTabBehavior : function TSTService_dropLinksOnTabBehavior() 
	{
		var behavior = this.getTreePref('dropLinksOnTab.behavior');
		if (behavior & this.kDROPLINK_FIXED) return behavior;

		var checked = { value : false };
		var newChildTab = this.PromptService.confirmEx(window,
				this.treeBundle.getString('dropLinkOnTab.title'),
				this.treeBundle.getString('dropLinkOnTab.text'),
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_0) +
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_1),
				this.treeBundle.getString('dropLinkOnTab.openNewChildTab'),
				this.treeBundle.getString('dropLinkOnTab.loadInTheTab'),
				null,
				this.treeBundle.getString('dropLinkOnTab.never'),
				checked
			) == 0;

		behavior = newChildTab ? this.kDROPLINK_NEWTAB : this.kDROPLINK_LOAD ;
		if (checked.value)
			this.setTreePref('dropLinksOnTab.behavior', behavior);

		return behavior
	},
	kDROPLINK_ASK    : 0,
	kDROPLINK_FIXED  : 1 + 2,
	kDROPLINK_LOAD   : 1,
	kDROPLINK_NEWTAB : 2,
 
	openGroupBookmarkBehavior : function TSTService_openGroupBookmarkBehavior() 
	{
		var behavior = this.getTreePref('openGroupBookmark.behavior');
		if (behavior & this.kGROUP_BOOKMARK_FIXED) return behavior;

		var dummyTabFlag = behavior & this.kGROUP_BOOKMARK_USE_DUMMY;

		var checked = { value : false };
		var button = this.PromptService.confirmEx(window,
				this.treeBundle.getString('openGroupBookmarkBehavior.title'),
				this.treeBundle.getString('openGroupBookmarkBehavior.text'),
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_0) +
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_1) +
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_2),
				this.treeBundle.getString('openGroupBookmarkBehavior.subTree'),
				this.treeBundle.getString('openGroupBookmarkBehavior.separate'),
				this.treeBundle.getString('openGroupBookmarkBehavior.replace'),
				this.treeBundle.getString('openGroupBookmarkBehavior.never'),
				checked
			);

		if (button < 0) button = 1;
		var behaviors = [
				this.kGROUP_BOOKMARK_SUBTREE | dummyTabFlag,
				this.kGROUP_BOOKMARK_SEPARATE,
				this.kGROUP_BOOKMARK_REPLACE
			];
		behavior = behaviors[button];

		if (checked.value) {
			this.setTreePref('openGroupBookmark.behavior', behavior);
			this.setPref('browser.tabs.loadFolderAndReplace', behavior & this.kGROUP_BOOKMARK_REPLACE ? true : false );
		}
		return behavior;
	},
	kGROUP_BOOKMARK_ASK       : 0,
	kGROUP_BOOKMARK_FIXED     : 1 + 2 + 4,
	kGROUP_BOOKMARK_SUBTREE   : 1,
	kGROUP_BOOKMARK_SEPARATE  : 2,
	kGROUP_BOOKMARK_REPLACE   : 4,
	kGROUP_BOOKMARK_USE_DUMMY : 256,
	kGROUP_BOOKMARK_USE_DUMMY_FORCE : 1024,
	kGROUP_BOOKMARK_DONT_RESTORE_TREE_STRUCTURE : 512,
  
/* Initializing */ 
	
	preInit : function TSTService_preInit() 
	{
		if (this.preInitialized) return;
		this.preInitialized = true;

		window.removeEventListener('DOMContentLoaded', this, true);
		if (!document.getElementById('content')) return;

		var namespace = {};
		Components.utils.import(
			'resource://treestyletab-modules/common.jsm',
			namespace
		);
		this.common = namespace.TreeStyleTabCommon;
		this.common.init();

		window.addEventListener('SSTabRestoring', this, true);

		if ('swapBrowsersAndCloseOther' in document.getElementById('content')) {
			var source = window.BrowserStartup.toSource();
			if (source.indexOf('!MultipleTabService.tearOffSelectedTabsFromRemote()') > -1) {
				eval('window.BrowserStartup = '+source.replace(
					'!MultipleTabService.tearOffSelectedTabsFromRemote()',
					'!TreeStyleTabService.tearOffSubtreeFromRemote() && $&'
				));
			}
			else {
				eval('window.BrowserStartup = '+source.replace(
					'gBrowser.swapBrowsersAndCloseOther(gBrowser.selectedTab, uriToLoad);',
					'if (!TreeStyleTabService.tearOffSubtreeFromRemote()) { $& }'
				));
			}
		}

		eval('nsBrowserAccess.prototype.openURI = '+
			nsBrowserAccess.prototype.openURI.toSource().replace(
				/(switch\s*\(aWhere\))/,
				<![CDATA[
					if (aOpener &&
						aWhere == Components.interfaces.nsIBrowserDOMWindow.OPEN_NEWTAB) {
						TreeStyleTabService.readyToOpenChildTab(aOpener);
					}
					$1]]>
			)
		);

		this.overrideExtensionsPreInit(); // hacks.js

		this.registerTabFocusAllowance(this.defaultTabFocusAllowance);

		this.migratePrefs();
	},
	preInitialized : false,
	
	defaultTabFocusAllowance : function TSTService_defaultTabFocusAllowance(aBrowser) 
	{
		var tab = aBrowser.selectedTab;
		return (
			!this.getPref('browser.tabs.selectOwnerOnClose') ||
			!tab.owner ||
			(
				aBrowser._removingTabs &&
				aBrowser._removingTabs.indexOf(tab.owner) > -1
			)
		);
	},
 
	kPREF_VERSION : 5,
	migratePrefs : function TSTService_migratePrefs() 
	{
		// migrate old prefs
		var orientalPrefs = [];
		switch (this.getTreePref('prefsVersion'))
		{
			case 0:
				orientalPrefs = orientalPrefs.concat([
					'extensions.treestyletab.tabbar.fixed',
					'extensions.treestyletab.enableSubtreeIndent',
					'extensions.treestyletab.allowSubtreeCollapseExpand'
				]);
			case 1:
				orientalPrefs = orientalPrefs.concat([
					'extensions.treestyletab.tabbar.hideAlltabsButton'
				]);
			case 2:
				if (this.getTreePref('urlbar.loadSameDomainToNewChildTab') !== null) {
					let value = this.getTreePref('urlbar.loadSameDomainToNewChildTab');
					this.setTreePref('urlbar.loadSameDomainToNewTab', value);
					this.setTreePref('urlbar.loadSameDomainToNewTab.asChild', value);
					if (value) this.setTreePref('urlbar.loadDifferentDomainToNewTab', value);
					this.clearTreePref('urlbar.loadSameDomainToNewChildTab');
				}
			case 3:
				if (this.getTreePref('loadDroppedLinkToNewChildTab') !== null) {
					this.setTreePref('dropLinksOnTab.behavior',
						this.getTreePref('loadDroppedLinkToNewChildTab.confirm') ?
							this.kDROPLINK_ASK :
						this.getTreePref('loadDroppedLinkToNewChildTab') ?
							this.kDROPLINK_NEWTAB :
							this.kDROPLINK_LOAD
					);
					this.clearTreePref('loadDroppedLinkToNewChildTab.confirm');
					this.clearTreePref('loadDroppedLinkToNewChildTab');
				}
				if (this.getTreePref('openGroupBookmarkAsTabSubTree') !== null) {
					let behavior = 0;
					if (this.getTreePref('openGroupBookmarkAsTabSubTree.underParent'))
						behavior += this.kGROUP_BOOKMARK_USE_DUMMY;
					if (!this.getTreePref('openGroupBookmarkBehavior.confirm')) {
						behavior += (
							this.getTreePref('openGroupBookmarkAsTabSubTree') ?
								this.kGROUP_BOOKMARK_SUBTREE :
							this.getTreePref('browser.tabs.loadFolderAndReplace') ?
								this.kGROUP_BOOKMARK_REPLACE :
								this.kGROUP_BOOKMARK_SEPARATE
						);
					}
					this.setTreePref('openGroupBookmark.behavior', behavior);
					this.clearTreePref('openGroupBookmarkBehavior.confirm');
					this.clearTreePref('openGroupBookmarkAsTabSubTree');
					this.clearTreePref('openGroupBookmarkAsTabSubTree.underParent');
					this.setPref('browser.tabs.loadFolderAndReplace', behavior & this.kGROUP_BOOKMARK_REPLACE ? true : false );
				}
			case 4:
				[
					'extensions.treestyletab.autoCollapseExpandSubTreeOnSelect',
					'extensions.treestyletab.autoCollapseExpandSubTreeOnSelect.onCurrentTabRemove',
					'extensions.treestyletab.autoCollapseExpandSubTreeOnSelect.whileFocusMovingByShortcut',
					'extensions.treestyletab.autoExpandSubTreeOnAppendChild',
					'extensions.treestyletab.autoExpandSubTreeOnCollapsedChildFocused',
					'extensions.treestyletab.collapseExpandSubTree.dblclick',
					'extensions.treestyletab.createSubTree.underParent',
					'extensions.treestyletab.show.context-item-reloadTabSubTree',
					'extensions.treestyletab.show.context-item-removeTabSubTree',
					'extensions.treestyletab.show.context-item-bookmarkTabSubTree',
					'extensions.multipletab.show.multipletab-selection-item-removeTabSubTree',
					'extensions.multipletab.show.multipletab-selection-item-createSubTree'
				].forEach(function(aPref) {
					var value = this.getPref(aPref);
					if (value === null) return;
					this.setPref(aPref.replace('SubTree', 'Subtree'), value);
					this.clearPref(aPref);
				}, this);
			default:
				orientalPrefs.forEach(function(aPref) {
					let value = this.getPref(aPref);
					if (value === null) return;
					this.setPref(aPref+'.horizontal', value);
					this.setPref(aPref+'.vertical', value);
					this.clearPref(aPref);
				}, this);
				break;
		}
		this.setTreePref('prefsVersion', this.kPREF_VERSION);
	},
  
	init : function TSTService_init() 
	{
		if (!('gBrowser' in window)) return;

		if (this.initialized) return;
		this.initialized = true;

		if (!this.preInitialized) {
			this.preInit();
		}
		window.removeEventListener('SSTabRestoring', this, true);

		window.removeEventListener('load', this, false);
		window.addEventListener('unload', this, false);
		document.addEventListener('popupshowing', this, false);
		document.addEventListener('popuphiding', this, false);

		var appcontent = document.getElementById('appcontent');
		appcontent.addEventListener('SubBrowserAdded', this, false);
		appcontent.addEventListener('SubBrowserRemoveRequest', this, false);

		this.addPrefListener(this);
		this.ObserverService.addObserver(this, 'private-browsing-change-granted', false);

		this.initUninstallationListener();

		this.overrideExtensionsOnInitBefore(); // hacks.js
		this.overrideGlobalFunctions();
		this.initTabBrowser(gBrowser);
		this.overrideExtensionsOnInitAfter(); // hacks.js

		this.processRestoredTabs();

		this.onPrefChange('extensions.treestyletab.indent');
		this.onPrefChange('extensions.treestyletab.tabbar.autoHide.mode');
		this.onPrefChange('extensions.treestyletab.clickOnIndentSpaces.enabled');
		this.onPrefChange('browser.link.open_newwindow.restriction.override');
		this.onPrefChange('browser.tabs.loadFolderAndReplace.override');
		this.onPrefChange('browser.tabs.insertRelatedAfterCurrent.override');
		this.onPrefChange('extensions.treestyletab.tabbar.style');
		this.onPrefChange('extensions.treestyletab.tabbar.scroll.smooth');
		this.onPrefChange('extensions.treestyletab.tabbar.scroll.duration');
		this.onPrefChange('extensions.treestyletab.animation.enabled');
		this.onPrefChange('extensions.treestyletab.animation.indent.duration');
		this.onPrefChange('extensions.treestyletab.animation.collapse.duration');
		this.onPrefChange('extensions.treestyletab.twisty.expandSensitiveArea');
		this.onPrefChange('extensions.treestyletab.autoCollapseExpandSubtreeOnSelect.whileFocusMovingByShortcut');
	},
	initialized : false,
	initUninstallationListener : function TSTService_initUninstallationListener()
	{
		var prefs = window['piro.sakura.ne.jp'].prefs;
		var restorePrefs = function() {
				if (!prefs) return;
				[
					'browser.link.open_newwindow.restriction',
					'browser.tabs.loadFolderAndReplace',
					'browser.tabs.insertRelatedAfterCurrent'
				].forEach(function(aPref) {
					var backup = prefs.getPref(aPref+'.backup');
					if (backup === null) return;
					prefs.setPref(aPref, backup);
					prefs.clearPref(aPref+'.backup');
				});
				prefs = null;
				restorePrefs = null;
			};
		new window['piro.sakura.ne.jp'].UninstallationListener({
			id : 'treestyletab@piro.sakura.ne.jp',
			onuninstalled : restorePrefs,
			ondisabled : restorePrefs
		});
	},
	
	initTabBrowser : function TSTService_initTabBrowser(aTabBrowser) 
	{
		if (aTabBrowser.localName != 'tabbrowser') return;
		aTabBrowser.treeStyleTab = new TreeStyleTabBrowser(aTabBrowser);
		aTabBrowser.treeStyleTab.init();
	},
 
	updateTabDNDObserver : function TSTService_updateTabDNDObserver(aObserver) 
	{
		if ('_onDragStart' in aObserver) { // Firefox 3.5 or later
			eval('aObserver._onDragStart = '+
				aObserver._onDragStart.toSource().replace(
					'if (target.localName == "tab"',
					<![CDATA[
						if (this.treeStyleTab.tabbarDNDObserver.canDragTabbar(aEvent)) {
							let sv = this.treeStyleTab;
							let dt = aEvent.dataTransfer;
							dt.mozSetDataAt(
								sv.kDRAG_TYPE_TABBAR,
								aEvent.shiftKey ?
									sv.kTABBAR_MOVE_FORCE :
									sv.kTABBAR_MOVE_NORMAL,
								0
							);
							dt.mozCursor = 'move';
//							let tabbar = this.mTabContainer;
//							let box = tabbar.boxObject;
//							dt.setDragImage(
//								tabbar,
//								aEvent.screenX - box.screenX,
//								aEvent.screenY - box.screenY
//							);
							// no feedback image, because it's annoying...
							dt.setDragImage(new Image(), 0, 0);
							aEvent.stopPropagation();
							this.treeStyleTab.tabbarDNDObserver.readyToStartDrag();
						}
						else $&]]>
				)
			);
		}
		else { // Firefox 3.0.x
			eval('aObserver.onDragStart = '+
				aObserver.onDragStart.toSource().replace( // native
					'aEvent.target.localName == "tab"',
					<![CDATA[
						(
							!this.treeStyleTab.tabbarDNDObserver.canDragTabbar(aEvent) &&
							$&
						)
					]]>
				)
			);
		}

		var canDropFunctionName = '_setEffectAllowedForDataTransfer' in aObserver ?
				'_setEffectAllowedForDataTransfer' : // Firefox 3.5 or later
				'canDrop' ; // Firefox 3.0.x
		eval('aObserver.'+canDropFunctionName+' = '+
			aObserver[canDropFunctionName].toSource().replace(
				'{',
				'{ var TSTTabBrowser = this;'
			).replace(
				/\.screenX/g, '[TreeStyleTabService.getTabBrowserFromChild(TSTTabBrowser).treeStyleTab.positionProp]'
			).replace(
				/\.width/g, '[TreeStyleTabService.getTabBrowserFromChild(TSTTabBrowser).treeStyleTab.sizeProp]'
			).replace(
				/(return (?:true|dt.effectAllowed = "copyMove");)/,
				<![CDATA[
					if (!(function(aSelf) {
try{
							var node = TST_DRAGSESSION.sourceNode;
							var tab = TSTTabBrowser.treeStyleTab.getTabFromChild(node);
							if (!node ||
								!tab ||
								tab.parentNode != aSelf.mTabContainer)
								return true;

							tab = TSTTabBrowser.treeStyleTab.getTabFromEvent(aEvent);
							if (TreeStyleTabService.isCollapsed(tab))
								return false;

							var info = TSTTabBrowser.treeStyleTab.getDropAction(aEvent, TST_DRAGSESSION);
							return info.canDrop;
}
catch(e) {
	dump('TreeStyleTabService::canDrop\n'+e+'\n');
	return false;
}
						})(TSTTabBrowser)) {
						return TST_DRAGDROP_DISALLOW_RETRUN_VALUE;
					}
					$1
				]]>
			).replace(
				/TST_DRAGSESSION/g,
				(canDropFunctionName == 'canDrop' ?
					'aDragSession' :
					'TSTTabBrowser.treeStyleTab.getCurrentDragSession()'
				)
			).replace(
				/TST_DRAGDROP_DISALLOW_RETRUN_VALUE/g,
				(canDropFunctionName == 'canDrop' ?
					'false' :
					'dt.effectAllowed = "none"'
				)
			)
		);

		var dragOverFunctionName = '_onDragOver' in aObserver ?
				'_onDragOver' : // Firefox 3.5 or later
				'onDragOver' ; // Firefox 3.0.x
		eval('aObserver.'+dragOverFunctionName+' = '+
			aObserver[dragOverFunctionName].toSource().replace(
				'{',
				<![CDATA[
					{
						var TSTTabBrowser = this;
						if ((function(aSelf) {
try{
							window['piro.sakura.ne.jp'].autoScroll.processAutoScroll(aEvent);

							var info = TSTTabBrowser.treeStyleTab.getDropAction(aEvent, TST_DRAGSESSION);

							// auto-switch for staying on tabs (Firefox 3.0 or later)
							if ('_setEffectAllowedForDataTransfer' in aSelf &&
								info.target &&
								!info.target.selected &&
								'mDragTime' in aSelf &&
								'mDragOverDelay' in aSelf) {
								let effects = aSelf._setEffectAllowedForDataTransfer(aEvent);
								if (effects == 'link') {
									let now = Date.now();
									if (!aSelf.mDragTime)
										aSelf.mDragTime = now;
									if (now >= aSelf.mDragTime + aSelf.mDragOverDelay)
										aSelf.selectedTab = info.target;
								}
							}

							if (!info.target || info.target != TreeStyleTabService.evaluateXPath(
									'child::xul:tab[@'+TreeStyleTabService.kDROP_POSITION+']',
									aSelf.mTabContainer,
									XPathResult.FIRST_ORDERED_NODE_TYPE
								).singleNodeValue)
								TSTTabBrowser.treeStyleTab.clearDropPosition();

							if (TST_DRAGDROP_DISALLOW_CHECK) return true;

							info.target.setAttribute(
								TreeStyleTabService.kDROP_POSITION,
								info.position == TreeStyleTabService.kDROP_BEFORE ? 'before' :
								info.position == TreeStyleTabService.kDROP_AFTER ? 'after' :
								'self'
							);
							aSelf.mTabDropIndicatorBar.setAttribute('dragging', (info.position == TreeStyleTabService.kDROP_ON) ? 'false' : 'true' );
							return (info.position == TreeStyleTabService.kDROP_ON || aSelf.getAttribute(TreeStyleTabService.kTABBAR_POSITION) != 'top')
}
catch(e) {
	dump('TreeStyleTabService::onDragOver\n'+e+'\n');
}
						})(TSTTabBrowser)) {
							return;
						}
				]]>
			).replace(
				/TST_DRAGSESSION/g,
				(canDropFunctionName == 'canDrop' ?
					'aDragSession' :
					'null'
				)
			).replace(
				/TST_DRAGDROP_DISALLOW_CHECK/g,
				(canDropFunctionName == 'canDrop' ?
					'!aSelf.canDrop(aEvent, aDragSession)' :
					'aSelf._setEffectAllowedForDataTransfer(aEvent) == "none"'
				)
			)
		);

		var dragExitFunctionName = '_onDragLeave' in aObserver ?
				'_onDragLeave' : // Firefox 3.5 or later
				'onDragExit' ; // Firefox 3.0.x
		eval('aObserver.'+dragExitFunctionName+' = '+
			aObserver[dragExitFunctionName].toSource().replace(
				/(this.mTabDropIndicatorBar\.[^;]+;)/,
				'$1; this.treeStyleTab.clearDropPosition();'
			)
		);

		var dropFunctionName = '_onDrop' in aObserver ?
				'_onDrop' : // Firefox 3.5 or later
				'onDrop' ; // Firefox 3.0.x
		eval('aObserver.'+dropFunctionName+' = '+
			aObserver[dropFunctionName].toSource().replace(
				'{',
				<![CDATA[
					{
						var TSTTabBrowser = this;
						TSTTabBrowser.treeStyleTab.clearDropPosition();
						var dropActionInfo = TSTTabBrowser.treeStyleTab.getDropAction(aEvent, TST_DRAGSESSION);
				]]>
			).replace( // Firefox 3.0.x, 3.5 or later
				/(if \((accelKeyPressed|isCopy|dropEffect == "copy")\) {)/,
				<![CDATA[
					if (TSTTabBrowser.treeStyleTab.performDrop(dropActionInfo, draggedTab))
						return;
					$1]]>
			).replace( // Firefox 3, duplication of tab
				/(this.selectedTab = newTab;)(\s*\})?/g,
				<![CDATA[$1;
					if (dropActionInfo.position == TreeStyleTabService.kDROP_ON)
						TSTTabBrowser.treeStyleTab.attachTabTo(newTab, dropActionInfo.target);
				$2]]>
			).replace( // Firefox 3, dragging tab from another window
				'else if (draggedTab) {',
				<![CDATA[$&
					if (TSTTabBrowser.treeStyleTab.performDrop(dropActionInfo, draggedTab))
						return;
				]]>
			).replace(
				/(this.loadOneTab\([^;]+\));/,
				<![CDATA[
					TSTTabBrowser.treeStyleTab.performDrop(dropActionInfo, $1);
					return;
				]]>
			).replace(
				'document.getBindingParent(aEvent.originalTarget).localName != "tab"',
				'!TreeStyleTabService.getTabFromEvent(aEvent)'
			).replace(
				'var tab = aEvent.target;',
				<![CDATA[$&
					var loadDroppedLinkToNewChildTab = (
							dropActionInfo.position != TreeStyleTabService.kDROP_ON ||
							tab.getAttribute('locked') == 'true' // Tab Mix Plus (or others)
						);
					if (!loadDroppedLinkToNewChildTab &&
						dropActionInfo.position == TreeStyleTabService.kDROP_ON) {
						loadDroppedLinkToNewChildTab = TreeStyleTabService.dropLinksOnTabBehavior() == TreeStyleTabService.kDROPLINK_NEWTAB;
					}
					if (
						loadDroppedLinkToNewChildTab ||
						tab.getAttribute('locked') == 'true' // Tab Mix Plus (or others)
						) {
						TSTTabBrowser.treeStyleTab.performDrop(dropActionInfo, TSTTabBrowser.loadOneTab(getShortcutOrURI(url), null, null, null, bgLoad, false));
						return;
					}
				]]>
			).replace(
				/TST_DRAGSESSION/g,
				(canDropFunctionName == 'canDrop' ?
					'aDragSession' :
					'TSTTabBrowser.treeStyleTab.getCurrentDragSession()'
				)
			)
		);
	},
 
	overrideGlobalFunctions : function TSTService_overrideGlobalFunctions() 
	{
//		window.__treestyletab__BrowserCustomizeToolbar = window.BrowserCustomizeToolbar;
//		window.BrowserCustomizeToolbar = function() {
//			TreeStyleTabService.destroyBar();
//			window.__treestyletab__BrowserCustomizeToolbar.call(window);
//		};

		let (toolbox) {
			toolbox = document.getElementById('navigator-toolbox');
			if (toolbox.customizeDone) {
				toolbox.__treestyletab__customizeDone = toolbox.customizeDone;
				toolbox.customizeDone = function(aChanged) {
					this.__treestyletab__customizeDone(aChanged);
					TreeStyleTabService.initBar();
				};
			}
			if ('BrowserToolboxCustomizeDone' in window) {
				window.__treestyletab__BrowserToolboxCustomizeDone = window.BrowserToolboxCustomizeDone;
				window.BrowserToolboxCustomizeDone = function(aChanged) {
					window.__treestyletab__BrowserToolboxCustomizeDone.apply(window, arguments);
					TreeStyleTabService.initBar();
				};
			}
			this.initBar();
			toolbox = null;
		}

		this._splitFunctionNames(<![CDATA[
			window.permaTabs.utils.wrappedFunctions["window.BrowserLoadURL"]
			window.BrowserLoadURL
		]]>).forEach(function(aFunc) {
			let source = this._getFunctionSource(aFunc);
			if (!source || !/^\(?function BrowserLoadURL/.test(source))
				return;
			eval(aFunc+' = '+source.replace(
				'aTriggeringEvent && aTriggeringEvent.altKey',
				'TreeStyleTabService.checkReadyToOpenNewTabOnLocationBar(url, $&)'
			));
			source = null;
		}, this);


		eval('nsContextMenu.prototype.openLinkInTab = '+
			nsContextMenu.prototype.openLinkInTab.toSource().replace(
				'{',
				<![CDATA[$&
					TreeStyleTabService.readyToOpenChildTab(this.target.ownerDocument.defaultView);
				]]>
			)
		);
		eval('nsContextMenu.prototype.openFrameInTab = '+
			nsContextMenu.prototype.openFrameInTab.toSource().replace(
				'{',
				<![CDATA[$&
					TreeStyleTabService.readyToOpenChildTab(this.target.ownerDocument.defaultView);
				]]>
			)
		);
		var viewImageMethod = ('viewImage' in nsContextMenu.prototype) ? 'viewImage' : 'viewMedia' ;
		eval('nsContextMenu.prototype.'+viewImageMethod+' = '+
			nsContextMenu.prototype[viewImageMethod].toSource().replace(
				'openUILink(',
				<![CDATA[
					if (String(whereToOpenLink(e, false, true)).indexOf('tab') == 0)
						TreeStyleTabService.readyToOpenChildTab(this.target.ownerDocument.defaultView);
					$&]]>
			)
		);
		eval('nsContextMenu.prototype.viewBGImage = '+
			nsContextMenu.prototype.viewBGImage.toSource().replace(
				'openUILink(',
				<![CDATA[
					if (String(whereToOpenLink(e, false, true)).indexOf('tab') == 0)
						TreeStyleTabService.readyToOpenChildTab(this.target.ownerDocument.defaultView);
					$&]]>
			)
		);
		eval('nsContextMenu.prototype.addDictionaries = '+
			nsContextMenu.prototype.addDictionaries.toSource().replace(
				'openUILinkIn(',
				<![CDATA[
					if (where.indexOf('tab') == 0)
						TreeStyleTabService.readyToOpenChildTab(this.target.ownerDocument.defaultView);
					$&]]>
			)
		);

		this._splitFunctionNames(<![CDATA[
			window.duplicateTab.handleLinkClick
			window.__treestyletab__highlander__origHandleLinkClick
			window.__splitbrowser__handleLinkClick
			window.__ctxextensions__handleLinkClick
			window.handleLinkClick
		]]>).some(function(aFunc) {
			let source = this._getFunctionSource(aFunc);
			if (!source || !/^\(?function handleLinkClick/.test(source))
				return false;
			eval(aFunc+' = '+source.replace(
				/(openNewTabWith\()/g,
				<![CDATA[
					if (!TreeStyleTabService.checkToOpenChildTab(event.target.ownerDocument.defaultView)) TreeStyleTabService.readyToOpenChildTab(event.target.ownerDocument.defaultView);
					$1]]>
			).replace(
				/(event.ctrlKey|event.metaKey)/,
				<![CDATA[
					TreeStyleTabService.checkReadyToOpenNewTab({
						uri      : href,
						external : {
							newTab : TreeStyleTabService.getTreePref('openOuterLinkInNewTab') || TreeStyleTabService.getTreePref('openAnyLinkInNewTab'),
							forceChild : true
						},
						internal : {
							newTab : TreeStyleTabService.getTreePref('openAnyLinkInNewTab')
						},
						modifier : $1,
						invert   : TreeStyleTabService.getTreePref('link.invertDefaultBehavior')
					}) ?
						(
							(TreeStyleTabService.isNewTabAction(event) ? null : TreeStyleTabService.readyToOpenDivertedTab()),
							true
						) :
						(TreeStyleTabService.readyToOpenChildTab(), false)
				]]>
			).replace(
				/* あらゆるリンクからタブを開く設定の時に、アクセルキーが押されていた場合は
				   反転された動作（通常のリンク読み込み）を行う */
				'return false;case 1:',
				<![CDATA[
						if (( // do nothing for Tab Mix Plus
								!TreeStyleTabService.getTreePref('compatibility.TMP') ||
								!('TMP_contentAreaClick' in window)
							) &&
							TreeStyleTabService.checkToOpenChildTab()) {
							TreeStyleTabService.stopToOpenChildTab();
							if (TreeStyleTabService.isAccelKeyPressed(event)) {
								if (linkNode)
									urlSecurityCheck(href,
										'nodePrincipal' in linkNode.ownerDocument ?
											linkNode.ownerDocument.nodePrincipal :
											linkNode.ownerDocument.location.href
									);
								var postData = {};
								href = getShortcutOrURI(href, postData);
								if (!href) return false;
								loadURI(href, null, postData.value, false);
							}
						}
						return false;
					case 1:
				]]>
			));
			source = null;
			return true;
		}, this);

		this._splitFunctionNames(<![CDATA[
			window.permaTabs.utils.wrappedFunctions["window.contentAreaClick"]
			window.__contentAreaClick
			window.__ctxextensions__contentAreaClick
			window.contentAreaClick
		]]>).forEach(function(aFunc) {
			let source = this._getFunctionSource(aFunc);
			if (!source || !/^\(?function contentAreaClick/.test(source))
				return;
			eval(aFunc+' = '+source.replace(
				/((openWebPanel\([^\;]+\);|PlacesUIUtils.showMinimalAddBookmarkUI\([^;]+\);)event.preventDefault\(\);return false;\})/,
				<![CDATA[
					$1
					else if (
						( // do nothing for Tab Mix Plus
							!TreeStyleTabService.getTreePref('compatibility.TMP') ||
							!('TMP_contentAreaClick' in window)
						) &&
						TreeStyleTabService.checkReadyToOpenNewTab({
							uri      : wrapper.href,
							external : {
								newTab : TreeStyleTabService.getTreePref('openOuterLinkInNewTab') || TreeStyleTabService.getTreePref('openAnyLinkInNewTab'),
								forceChild : true
							},
							internal : {
								newTab : TreeStyleTabService.getTreePref('openAnyLinkInNewTab')
							}
						})
						) {
						event.stopPropagation();
						event.preventDefault();
						handleLinkClick(event, wrapper.href, linkNode);
						return true;
					}
				]]>
			));
			source = null;
		}, this);

		this._splitFunctionNames(<![CDATA[
			window.duplicateTab.gotoHistoryIndex
			window.duplicateTab.BrowserBack
			window.duplicateTab.BrowserForward
			window.__rewindforward__BrowserForward
			window.__rewindforward__BrowserBack
			window.gotoHistoryIndex
			window.BrowserForward
			window.BrowserBack
		]]>).forEach(function(aFunc) {
			let source = this._getFunctionSource(aFunc);
			if (!source || !/^\(?function (gotoHistoryIndex|BrowserForward|BrowserBack)/.test(source))
				return;
			eval(aFunc+' = '+source.replace(
				/(openUILinkIn\()/g,
				<![CDATA[
					if (where == 'tab' || where == 'tabshifted')
						TreeStyleTabService.readyToOpenChildTab();
					$1]]>
			));
			source = null;
		}, this);

		this._splitFunctionNames(<![CDATA[
			permaTabs.utils.wrappedFunctions["window.BrowserHomeClick"]
			window.BrowserHomeClick
			window.BrowserGoHome
		]]>).forEach(function(aFunc) {
			let source = this._getFunctionSource(aFunc);
			if (!source || !/^\(?function (BrowserHomeClick|BrowserGoHome)/.test(source))
				return;
			eval(aFunc+' = '+source.replace(
				'gBrowser.loadTabs(',
				<![CDATA[
					TreeStyleTabService.readyToOpenNewTabGroup(gBrowser);
					$&]]>
			));
			source = null;
		}, this);

		eval('FeedHandler.loadFeed = '+
			FeedHandler.loadFeed.toSource().replace(
				'openUILink(',
				<![CDATA[
					if (String(whereToOpenLink(event, false, true)).indexOf('tab') == 0)
						TreeStyleTabService.readyToOpenChildTab(gBrowser);
					$&]]>
			)
		);

		// Firefox 3 full screen
		eval('FullScreen._animateUp = '+
			FullScreen._animateUp.toSource().replace(
				'gBrowser.mStrip.boxObject.height',
				'((gBrowser.getAttribute(TreeStyleTabService.kTABBAR_POSITION) != "top") ? 0 : gBrowser.mStrip.boxObject.height)'
			)
		);
		eval('FullScreen.mouseoverToggle = '+
			FullScreen.mouseoverToggle.toSource().replace(
				'gBrowser.mStrip.setAttribute("moz-collapsed", !aShow);',
				'if (gBrowser.getAttribute(TreeStyleTabService.kTABBAR_POSITION) == "top") { $& }'
			)
		);
		eval('FullScreen.toggle = '+
			FullScreen.toggle.toSource().replace(
				'{',
				<![CDATA[{
					var treeStyleTab = gBrowser.treeStyleTab;
					if (gBrowser.getAttribute(treeStyleTab.kTABBAR_POSITION) != 'top') {
						if (window.fullScreen)
							treeStyleTab.autoHide.endForFullScreen();
						else
							treeStyleTab.autoHide.startForFullScreen();
					}
				]]>
			)
		);

		if (window.contentAreaDNDObserver &&
			!('getSupportedFlavours' in contentAreaDNDObserver)) { // Firefox 3.6 or later
			eval('contentAreaDNDObserver.onDrop = '+
				contentAreaDNDObserver.onDrop.toSource().replace(
					'var types = aEvent.dataTransfer.types;',
					<![CDATA[$&
						if (gBrowser.treeStyleTab.panelDNDObserver.canDrop(aEvent, gBrowser.treeStyleTab.getCurrentDragSession())) {
							return gBrowser.treeStyleTab.panelDNDObserver.onDrop(aEvent, null, gBrowser.treeStyleTab.getCurrentDragSession());
						}
					]]>
				)
			);
		}
	},
	_splitFunctionNames : function TSTService__splitFunctionNames(aString)
	{
		return String(aString)
				.split(/\s+/)
				.map(function(aString) {
					return aString
							.replace(/\/\*.*\*\//g, '')
							.replace(/\/\/.+$/, '')
							.replace(/^\s+|\s+$/g, '');
				});
	},
	_getFunctionSource : function TSTService__getFunctionSource(aFunc)
	{
		var func;
		try {
			eval('func = '+aFunc);
		}
		catch(e) {
			return null;
		}
		return func ? func.toSource() : null ;
	},
 
	initBar : function TSTService_initBar() 
	{
		var bar = document.getElementById('urlbar');
		if (!bar) return;

		var source;
		if (
			'handleCommand' in bar &&
			(source = bar.handleCommand.toSource()) &&
			source.indexOf('TreeStyleTabService') < 0
			) {
			eval('bar.handleCommand = '+source.replace(
				'aTriggeringEvent && aTriggeringEvent.altKey',
				'TreeStyleTabService.checkReadyToOpenNewTabOnLocationBar(url, $&)'
			));
		}
		bar    = null;
		source = null;
	},
  
	destroy : function TSTService_destroy() 
	{
		window.removeEventListener('unload', this, false);

		window['piro.sakura.ne.jp'].animationManager.stop();
		this.destroyTabBrowser(gBrowser);

		this.endListenKeyEventsFor(this.LISTEN_FOR_AUTOHIDE);
		this.endListenKeyEventsFor(this.LISTEN_FOR_AUTOEXPAND_BY_FOCUSCHANGE);

		document.removeEventListener('popupshowing', this, false);
		document.removeEventListener('popuphiding', this, false);

		var appcontent = document.getElementById('appcontent');
		appcontent.removeEventListener('SubBrowserAdded', this, false);
		appcontent.removeEventListener('SubBrowserRemoveRequest', this, false);

		this.removePrefListener(this);
		this.ObserverService.removeObserver(this, 'private-browsing-change-granted');
		this.ObserverService.removeObserver(this, 'sessionstore-windows-restored');
	},
	
	destroyTabBrowser : function TSTService_destroyTabBrowser(aTabBrowser) 
	{
		if (aTabBrowser.localName != 'tabbrowser') return;
		aTabBrowser.treeStyleTab.destroy();
		delete aTabBrowser.treeStyleTab;
	},
   
/* Event Handling */ 
	
	handleEvent : function TSTService_handleEvent(aEvent) 
	{
		switch (aEvent.type)
		{
			case 'DOMContentLoaded':
				this.preInit();
				return;

			case 'load':
				this.init();
				return;

			case 'unload':
				this.destroy();
				return;

			case 'SSTabRestoring':
				this.onTabRestored(aEvent);
				return;

			case 'popupshowing':
				if (!this.evaluateXPath(
						'local-name() = "tooltip" or local-name() ="panel" or '+
						'parent::*/ancestor-or-self::*[local-name()="popup" or local-name()="menupopup"]',
						aEvent.originalTarget,
						XPathResult.BOOLEAN_TYPE
					).booleanValue) {
					this.popupMenuShown = true;
					window.setTimeout(function(aSelf, aPopup) {
						if (!aPopup.boxObject.width || !aPopup.boxObject.height)
							aSelf.popupMenuShown = false;
					}, 10, this, aEvent.originalTarget);
				}
				return;

			case 'popuphiding':
				if (!this.evaluateXPath(
						'local-name() = "tooltip" or local-name() ="panel" or '+
						'parent::*/ancestor-or-self::*[local-name()="popup" or local-name()="menupopup"]',
						aEvent.originalTarget,
						XPathResult.BOOLEAN_TYPE
					).booleanValue) {
					this.popupMenuShown = false;
				}
				return;

			case 'keydown':
				this.onKeyDown(aEvent);
				return;

			case 'keyup':
			case 'keypress':
				this.onKeyRelease(aEvent);
				return;

			case 'SubBrowserAdded':
				this.initTabBrowser(aEvent.originalTarget.browser);
				return;

			case 'SubBrowserRemoveRequest':
				this.destroyTabBrowser(aEvent.originalTarget.browser);
				return;
		}
	},
	
	keyEventListening      : false, 
	keyEventListeningFlags : 0,

	LISTEN_FOR_AUTOHIDE                  : 1,
	LISTEN_FOR_AUTOEXPAND_BY_FOCUSCHANGE : 2,
	
	startListenKeyEventsFor : function TSTService_startListenKeyEventsFor(aReason) 
	{
		if (this.keyEventListeningFlags & aReason) return;
		if (!this.keyEventListening) {
			window.addEventListener('keydown',  this, true);
			window.addEventListener('keyup',    this, true);
			window.addEventListener('keypress', this, true);
			this.keyEventListening = true;
		}
		this.keyEventListeningFlags |= aReason;
	},
 
	endListenKeyEventsFor : function TSTService_endListenKeyEventsFor(aReason) 
	{
		if (!(this.keyEventListeningFlags & aReason)) return;
		this.keyEventListeningFlags ^= aReason;
		if (!this.keyEventListeningFlags && this.keyEventListening) {
			window.removeEventListener('keydown',  this, true);
			window.removeEventListener('keyup',    this, true);
			window.removeEventListener('keypress', this, true);
			this.keyEventListening = false;
		}
	},
 
	onKeyDown : function TSTService_onKeyDown(aEvent) 
	{
		this.accelKeyPressed = this.isAccelKeyPressed(aEvent);

		/* PUBLIC API */
		let event = document.createEvent('Events');
		event.initEvent('TreeStyleTabFocusSwitchingKeyDown', true, true);
		event.sourceEvent = aEvent;
		this.browser.dispatchEvent(event);
	},
	accelKeyPressed : false,
 
	onKeyRelease : function TSTService_onKeyRelease(aEvent) 
	{
		var b = this.browser;
		if (!b || !b.treeStyleTab) return;
		var sv = b.treeStyleTab;

		var scrollDown,
			scrollUp;

		this.accelKeyPressed = this.isAccelKeyPressed(aEvent);

		var standBy = scrollDown = scrollUp = (!aEvent.altKey && this.accelKeyPressed);

		scrollDown = scrollDown && (
				!aEvent.shiftKey &&
				(
					aEvent.keyCode == aEvent.DOM_VK_TAB ||
					aEvent.keyCode == aEvent.DOM_VK_PAGE_DOWN
				)
			);

		scrollUp = scrollUp && (
				aEvent.shiftKey ? (aEvent.keyCode == aEvent.DOM_VK_TAB) : (aEvent.keyCode == aEvent.DOM_VK_PAGE_UP)
			);

		var onlyShiftKey = (!aEvent.shiftKey && aEvent.keyCode == 16 && (aEvent.type == 'keyup' || aEvent.charCode == 0));

		if (
			scrollDown ||
			scrollUp ||
			( // when you release "shift" key
				standBy && onlyShiftKey
			)
			) {
			/* PUBLIC API */
			let event = document.createEvent('Events');
			event.initEvent('TreeStyleTabFocusSwitchingStart', true, true);
			event.scrollDown = scrollDown;
			event.scrollUp = scrollUp;
			event.standBy = standBy;
			event.onlyShiftKey = onlyShiftKey;
			event.sourceEvent = aEvent;
			b.dispatchEvent(event);
			return;
		}

		// when you just release accel key...

		/* PUBLIC API */
		let (event) {
			event = document.createEvent('Events');
			event.initEvent('TreeStyleTabFocusSwitchingEnd', true, true);
			event.scrollDown = scrollDown;
			event.scrollUp = scrollUp;
			event.standBy = standBy;
			event.onlyShiftKey = onlyShiftKey;
			event.sourceEvent = aEvent;
			b.dispatchEvent(event);
		}

		if (this._tabShouldBeExpandedAfterKeyReleased) {
			let tab = this._tabShouldBeExpandedAfterKeyReleased;
			if (this.hasChildTabs(tab) &&
				this.isSubtreeCollapsed(tab)) {
				this.getTabBrowserFromChild(tab)
						.treeStyleTab
						.collapseExpandTreesIntelligentlyFor(tab);
			}
		}
		this._tabShouldBeExpandedAfterKeyReleased = null;
	},
 
	get shouldListenKeyEventsForAutoExpandByFocusChange() 
	{
		return !this.ctrlTabPreviewsEnabled &&
				!this.getTreePref('autoCollapseExpandSubtreeOnSelect.whileFocusMovingByShortcut') &&
				this.getTreePref('autoCollapseExpandSubtreeOnSelect');
	},
 
	get ctrlTabPreviewsEnabled() 
	{
		return 'allTabs' in window &&
				this.getPref('browser.ctrlTab.previews');
	},
   
	onTabbarResized : function TSTService_onTabbarResized(aEvent) 
	{
		var b = this.getTabBrowserFromChild(aEvent.currentTarget);
		window.setTimeout(function(aSelf) {
			if (!b.treeStyleTab.clickedOnTabbarResizerGrippy) {
				if (!b.treeStyleTab.isVertical) {
					aSelf.setTreePref('tabbar.height', b.mStrip.boxObject.height);
				}
				else {
					if (!b.treeStyleTab.autoHide.expanded)
						aSelf.setTreePref('tabbar.shrunkenWidth', b.mStrip.boxObject.width);
					else
						aSelf.setTreePref('tabbar.width', b.mStrip.boxObject.width);
				}
			}
			b.treeStyleTab.clickedOnTabbarResizerGrippy = false;
		}, 10, this);
	},
	onTabbarResizerClick : function TSTService_onTabbarResizerClick(aEvent)
	{
		var b = this.getTabBrowserFromChild(aEvent.currentTarget);
		b.treeStyleTab.clickedOnTabbarResizerGrippy = this.evaluateXPath(
				'ancestor-or-self::xul:grippy',
				aEvent.originalTarget,
				XPathResult.BOOLEAN_TYPE
			).booleanValue;
	},
 
	showHideSubtreeMenuItem : function TSTService_showHideSubtreeMenuItem(aMenuItem, aTabs) 
	{
		if (!aMenuItem ||
			aMenuItem.getAttribute('hidden') == 'true' ||
			!aTabs ||
			!aTabs.length)
			return;

		var hasSubtree = false;
		for (var i = 0, maxi = aTabs.length; i < maxi; i++)
		{
			if (!this.hasChildTabs(aTabs[i])) continue;
			hasSubtree = true;
			break;
		}
		if (hasSubtree)
			aMenuItem.removeAttribute('hidden');
		else
			aMenuItem.setAttribute('hidden', true);
	},
	showHideSubTreeMenuItem : function() { return this.showHideSubtreeMenuItem.apply(this, arguments); }, // obsolete, for backward compatibility
 
	updateTabWidthPrefs : function TSTService_updateTabWidthPrefs(aPrefName) 
	{
		var expanded = this.getTreePref('tabbar.width');
		var shrunken = this.getTreePref('tabbar.shrunkenWidth');
		if (expanded <= shrunken) {
			this.tabbarWidthResetting = true;
			if (aPrefName == 'extensions.treestyletab.tabbar.width')
				this.setTreePref('tabbar.shrunkenWidth', parseInt(expanded / 1.5));
			else
				this.setTreePref('tabbar.width', parseInt(shrunken * 1.5));
			this.tabbarWidthResetting = false;
		}
	},
 
	handleTooltip : function TSTService_handleTooltip(aEvent, aTab) 
	{
		var label;
		var collapsed = this.isSubtreeCollapsed(aTab);

		var base = parseInt(aTab.getAttribute(this.kNEST) || 0);
		var descendant = this.getDescendantTabs(aTab);
		var indentPart = '  ';
		var tree = (this.getTreePref('tooltip.includeChildren') && descendant.length) ?
					[aTab].concat(descendant)
						.map(function(aTab) {
							let label = aTab.getAttribute('label');
							let indent = '';
							let nest = parseInt(aTab.getAttribute(this.kNEST) || 0) - base;
							for (let i = 0; i < nest; i++)
							{
								indent += indentPart;
							}
							return this.treeBundle.getFormattedString('tooltip.item.label', [label, indent]);
						}, this)
						.join('\n') :
					null ;

		if ('mOverCloseButton' in aTab && aTab.mOverCloseButton) {
			if (descendant.length &&
				(collapsed || this.getTreePref('closeParentBehavior') == this.CLOSE_PARENT_BEHAVIOR_CLOSE)) {
				label = this.treeBundle.getString('tooltip.closeTree');
			}
		}
		else if (aTab.getAttribute(this.kTWISTY_HOVER) == 'true') {
			let key = collapsed ?
						'tooltip.expandSubtree' :
						'tooltip.collapseSubtree' ;
			label = tree || aTab.getAttribute('label');
			label = label ?
					this.treeBundle.getFormattedString(key+'.labeled', [label]) :
					this.treeBundle.getString(key) ;
		}
		else if (collapsed) {
			label = tree;
		}

		if (label)
			aEvent.target.setAttribute('label', label);

		return label;
	},
  
/* Tree Style Tabの初期化が行われる前に復元されたセッションについてツリー構造を復元 */ 
	
	_restoringTabs : [], 
 
	onTabRestored : function TSTService_onTabRestored(aEvent) 
	{
		this._restoringTabs.push(aEvent.originalTarget);
	},
 
	processRestoredTabs : function TSTService_processRestoredTabs() 
	{
		this._restoringTabs.forEach(function(aTab) {
			try {
				var b = this.getTabBrowserFromChild(aTab);
				if (b) b.treeStyleTab.restoreStructure(aTab, true);
			}
			catch(e) {
			}
		}, this);
		this._restoringTabs = [];
	},
  
/* Commands */ 
	
	removeTabSubtree : function TSTService_removeTabSubtree(aTabOrTabs, aOnlyChildren) 
	{
		var tabs = this._normalizeToTabs(aTabOrTabs, aOnlyChildren);
		if (!this.warnAboutClosingTabs(tabs.length))
			return;

		var b = this.getTabBrowserFromChild(tabs[0]);
		for (var i = tabs.length-1; i > -1; i--)
		{
			b.removeTab(tabs[i]);
		}
	},
	warnAboutClosingTabSubtreeOf : function TSTService_warnAboutClosingTabSubtreeOf(aTab)
	{
		if (!this.shouldCloseTabSubtreeOf(aTab))
			return true;

		var tabs = [aTab].concat(this.getDescendantTabs(aTab));
		return this.warnAboutClosingTabs(tabs.length);
	},
	shouldCloseTabSubtreeOf : function TSTService_shouldCloseTabSubtreeOf(aTab)
	{
		return (
			this.hasChildTabs(aTab) &&
			(
				this.getTreePref('closeParentBehavior') == this.CLOSE_PARENT_BEHAVIOR_CLOSE ||
				this.isSubtreeCollapsed(aTab)
			)
		);
	},
	shouldCloseLastTabSubtreeOf : function TSTService_shouldCloseLastTabSubtreeOf(aTab)
	{
		var b = this.getTabBrowserFromChild(aTab);
		return (
			this.shouldCloseTabSubtreeOf(aTab) &&
			this.getDescendantTabs(aTab).length + 1 == this.getTabs(b).snapshotLength
		);
	},
	warnAboutClosingTabs : function TSTService_warnAboutClosingTabs(aTabsCount)
	{
		if (
			aTabsCount <= 1 ||
			!this.getPref('browser.tabs.warnOnClose')
			)
			return true;
		var checked = { value:true };
		window.focus();
		var shouldClose = this.PromptService.confirmEx(window,
				this.tabbrowserBundle.getString('tabs.closeWarningTitle'),
				this.tabbrowserBundle.getFormattedString('tabs.closeWarningMultipleTabs', [aTabsCount]),
				(this.PromptService.BUTTON_TITLE_IS_STRING * this.PromptService.BUTTON_POS_0) +
				(this.PromptService.BUTTON_TITLE_CANCEL * this.PromptService.BUTTON_POS_1),
				this.tabbrowserBundle.getString('tabs.closeButtonMultiple'),
				null, null,
				this.tabbrowserBundle.getString('tabs.closeWarningPromptMe'),
				checked
			) == 0;
		if (shouldClose && !checked.value)
			this.setPref('browser.tabs.warnOnClose', false);
		return shouldClose;
	},
	// obsolete, for backward compatibility
	removeTabSubTree : function() { return this.removeTabSubtree.apply(this, arguments); },
	warnAboutClosingTabSubTreeOf : function() { return this.warnAboutClosingTabSubtreeOf.apply(this, arguments); },
	shouldCloseTabSubTreeOf : function() { return this.shouldCloseTabSubtreeOf.apply(this, arguments); },
	shouldCloseLastTabSubTreeOf : function() { return this.shouldCloseLastTabSubtreeOf.apply(this, arguments); },
	
	_normalizeToTabs : function TSTService__normalizeToTabs(aTabOrTabs, aOnlyChildren) 
	{
		var tabs = aTabOrTabs;
		if (!(tabs instanceof Array)) {
			tabs = [aTabOrTabs];
		}

		var b = this.getTabBrowserFromChild(tabs[0]);
		var descendant = [];
		for (var i = 0, maxi = tabs.length; i < maxi; i++)
		{
			descendant = descendant.concat(b.treeStyleTab.getDescendantTabs(tabs[i]));
		}

		if (aOnlyChildren)
			tabs = this.cleanUpTabsArray(descendant);
		else
			tabs = this.cleanUpTabsArray(tabs.concat(descendant));

		return tabs;
	},
 
	cleanUpTabsArray : function TSTService_cleanUpTabsArray(aTabs) 
	{
		var newTabs = [];
		aTabs.forEach(function(aTab) {
			if (!aTab.parentNode) return; // ignore removed tabs
			if (newTabs.indexOf(aTab) < 0) newTabs.push(aTab);
		});
		newTabs.sort(this.sortTabsByOrder);
		return newTabs;
	},
	
	sortTabsByOrder : function TSTService_sortTabsByOrder(aA, aB) 
	{
		return aA._tPos - aB._tPos;
	},
   
	reloadTabSubtree : function TSTService_reloadTabSubtree(aTabOrTabs, aOnlyChildren) 
	{
		var tabs = this._normalizeToTabs(aTabOrTabs, aOnlyChildren);
		var b = this.getTabBrowserFromChild(tabs[0]);
		for (var i = tabs.length-1; i > -1; i--)
		{
			b.reloadTab(tabs[i]);
		}
	},
	reloadTabSubTree : function() { return this.reloadTabSubtree.apply(this, arguments); }, // obsolete, for backward compatibility
 
	createSubtree : function TSTService_createSubtree(aTabs) 
	{
		aTabs = this.getRootTabs(aTabs);
		if (!aTabs.length) return;

		var b = this.getTabBrowserFromChild(aTabs[0]);

		var parent = this.getParentTab(aTabs[0]);

		var next = aTabs[0];
		while (
			(next = this.getNextSiblingTab(next)) &&
			aTabs.indexOf(next) > -1
		);

		var root = this.getTreePref('createSubtree.underParent') ?
					b.addTab(this.getGroupTabURI()) :
					aTabs.shift() ;
		window.setTimeout(function(aSelf) {
			aTabs.forEach(function(aTab) {
				b.treeStyleTab.attachTabTo(aTab, root);
				b.treeStyleTab.collapseExpandTab(aTab, false);
			}, aSelf);
			if (parent) {
				b.treeStyleTab.attachTabTo(root, parent, {
					insertBefore : next
				});
			}
			else if (next) {
				b.treeStyleTab.moveTabSubtreeTo(root, next._tPos);
			}
		}, 0, this);
	},
	createSubTree : function() { return this.createSubtree.apply(this, arguments); }, // obsolete, for backward compatibility
	
	canCreateSubtree : function TSTService_canCreateSubtree(aTabs) 
	{
		aTabs = this.getRootTabs(aTabs);
		if (aTabs.length < 2) return false;

		var lastParent = this.getParentTab(aTabs[0]);
		for (let i = 1, maxi = aTabs.length-1; i < maxi; i++)
		{
			let parent = this.getParentTab(aTabs[i]);
			if (!lastParent || parent != lastParent) return true;
			lastParent = parent;
		}
		return this.getChildTabs(lastParent).length != aTabs.length;
	},
	canCreateSubTree : function() { return this.canCreateSubtree.apply(this, arguments); }, // obsolete, for backward compatibility
 
	getRootTabs : function TSTService_getRootTabs(aTabs) 
	{
		var roots = [];
		if (!aTabs || !aTabs.length) return roots;
		aTabs = this.cleanUpTabsArray(aTabs);
		aTabs.forEach(function(aTab) {
			var parent = this.getParentTab(aTab);
			if (parent && aTabs.indexOf(parent) > -1) return;
			roots.push(aTab);
		}, this);
		return roots;
	},
  
	collapseExpandAllSubtree : function TSTService_collapseExpandAllSubtree(aCollapse) 
	{
		this.ObserverService.notifyObservers(
			window,
			'TreeStyleTab:collapseExpandAllSubtree',
			(aCollapse ? 'collapse' : 'open' )
		);
	},
 
	promoteTab : function TSTService_promoteTab(aTab) /* PUBLIC API */ 
	{
		var b = this.getTabBrowserFromChild(aTab);
		var sv = b.treeStyleTab;

		var parent = sv.getParentTab(aTab);
		if (!parent) return;

		var nextSibling = sv.getNextSiblingTab(parent);

		var grandParent = sv.getParentTab(parent);
		if (grandParent) {
			sv.attachTabTo(aTab, grandParent, {
				insertBefore : nextSibling
			});
		}
		else {
			sv.partTab(aTab);
			let index = nextSibling ? nextSibling._tPos : b.mTabContainer.childNodes.length ;
			if (index > aTab._tPos) index--;
			b.moveTabTo(aTab, index);
		}
	},
	promoteCurrentTab : function TSTService_promoteCurrentTab() /* PUBLIC API */
	{
		this.promoteTab(this.browser.selectedTab);
	},
 
	demoteTab : function TSTService_demoteTab(aTab) /* PUBLIC API */ 
	{
		var b = this.getTabBrowserFromChild(aTab);
		var sv = b.treeStyleTab;

		var previous = this.getPreviousSiblingTab(aTab);
		if (previous)
			sv.attachTabTo(aTab, previous);
	},
	demoteCurrentTab : function TSTService_demoteCurrentTab() /* PUBLIC API */
	{
		this.demoteTab(this.browser.selectedTab);
	},
 
	get treeViewEnabled() /* PUBLIC API */ 
	{
		return this._treeViewEnabled;
	},
	set treeViewEnabled(aValue)
	{
		this._treeViewEnabled = aValue ? true : false ;
		this.ObserverService.notifyObservers(
			window,
			'TreeStyleTab:changeTreeViewAvailability',
			this._treeViewEnabled
		);
		return aValue;
	},
	_treeViewEnabled : true,
 
	expandTreeAfterKeyReleased : function TSTService_expandTreeAfterKeyReleased(aTab) 
	{
		if (this.getTreePref('autoCollapseExpandSubtreeOnSelect.whileFocusMovingByShortcut')) return;
		this._tabShouldBeExpandedAfterKeyReleased = aTab || null;
	},
	_tabShouldBeExpandedAfterKeyReleased : null,
 
	registerTabFocusAllowance : function TSTService_registerTabFocusAllowance(aProcess) /* PUBLIC API */ 
	{
		this._tabFocusAllowance.push(aProcess);
	},
	_tabFocusAllowance : [],
 
	registerExpandTwistyAreaAllowance : function TSTService_registerExpandTwistyAreaAllowance(aProcess) /* PUBLIC API */ 
	{
		this._expandTwistyAreaAllowance.push(aProcess);
	},
	_expandTwistyAreaAllowance : [],
 
	tearOffSubtreeFromRemote : function TSTService_tearOffSubtreeFromRemote() 
	{
		var remoteTab = window.arguments[0];
		var remoteWindow  = remoteTab.ownerDocument.defaultView;
		var remoteService = remoteWindow.TreeStyleTabService;
		var remoteMultipleTabService = remoteWindow.MultipleTabService;
		if (remoteService.hasChildTabs(remoteTab) ||
			(remoteMultipleTabService && remoteMultipleTabService.isSelected(remoteTab))) {
			var remoteBrowser = remoteService.getTabBrowserFromChild(remoteTab);
			if (remoteBrowser.treeStyleTab.isDraggingAllTabs(remoteTab)) {
				window.close();
			}
			else {
				var actionInfo = {
						action : this.kACTIONS_FOR_DESTINATION | this.kACTION_IMPORT
					};
				window.setTimeout(function() {
					var blankTab = gBrowser.selectedTab;
					gBrowser.treeStyleTab.performDrop(actionInfo, remoteTab);
					window.setTimeout(function() {
						gBrowser.removeTab(blankTab);

						remoteTab = null;
						remoteBrowser = null;
						remoteWindow = null
						remoteService = null;
						remoteMultipleTabService = null;
					}, 0);
				}, 0);
			}
			return true;
		}
		return false;
	},
	tearOffSubTreeFromRemote : function() { return this.tearOffSubtreeFromRemote.apply(this, arguments); }, // obsolete, for backward compatibility
  
	observe : function TSTService_observe(aSubject, aTopic, aData) 
	{
		switch (aTopic)
		{
			case 'nsPref:changed':
				this.onPrefChange(aData);
				return;

			case 'private-browsing-change-granted':
				if (aData == 'enter')
					this.ObserverService.notifyObservers(window, 'TreeStyleTab:collapseExpandAllSubtree', 'expand-now');
				return;

			case 'sessionstore-windows-restored':
				if (!this.useTMPSessionAPI)
					this.restoringWindow = this.getRestoringTabsCount() > 1;
				return;
		}
	},
	restoringWindow : false,
	getRestoringTabsCount : function TSTService_getRestoringTabsCount()
	{
		return this.getTabsArray(this.browser)
				.filter(function(aTab) {
					var owner = aTab.linkedBrowser;
					var data = owner.parentNode.__SS_data;
					return data && data._tabStillLoading;
				}).length;
	},
 
/* Pref Listener */ 
	
	domains : [ 
		'extensions.treestyletab',
		'browser.link.open_newwindow.restriction',
		'browser.link.open_newwindow.restriction.override',
		'browser.tabs.loadFolderAndReplace',
		'browser.tabs.loadFolderAndReplace.override',
		'browser.tabs.insertRelatedAfterCurrent',
		'browser.tabs.insertRelatedAfterCurrent.override',
		'browser.ctrlTab.previews'
	],
 
	onPrefChange : function TSTService_onPrefChange(aPrefName) 
	{
		var value = this.getPref(aPrefName);
		switch (aPrefName)
		{
			case 'extensions.treestyletab.indent':
				this.baseIndent = value;
				this.ObserverService.notifyObservers(null, 'TreeStyleTab:indentModified', value);
				break;

			case 'extensions.treestyletab.tabbar.autoHide.mode':
				// don't set on this time, because appearance of all tabbrowsers are not updated yet.
				// this.autoHide.mode = this.getTreePref('tabbar.autoHide.mode');
			case 'extensions.treestyletab.tabbar.autoShow.accelKeyDown':
			case 'extensions.treestyletab.tabbar.autoShow.tabSwitch':
			case 'extensions.treestyletab.tabbar.autoShow.feedback':
				TreeStyleTabBrowserAutoHide.updateKeyListeners();
				break;

			case 'extensions.treestyletab.tabbar.width':
			case 'extensions.treestyletab.tabbar.shrunkenWidth':
				this.updateTabWidthPrefs(aPrefName);
				break;

			case 'browser.link.open_newwindow.restriction':
			case 'browser.tabs.loadFolderAndReplace':
			case 'browser.tabs.insertRelatedAfterCurrent':
				if (this.prefOverriding) return;
				aPrefName += '.override';
				this.setPref(aPrefName, value);
			case 'browser.link.open_newwindow.restriction.override':
			case 'browser.tabs.loadFolderAndReplace.override':
			case 'browser.tabs.insertRelatedAfterCurrent.override':
				this.prefOverriding = true;
				var target = aPrefName.replace('.override', '');
				var originalValue = this.getPref(target);
				if (originalValue !== null && originalValue != value)
					this.setPref(target+'.backup', originalValue);
				this.setPref(target, this.getPref(aPrefName));
				this.prefOverriding = false;
				break;

			case 'extensions.treestyletab.clickOnIndentSpaces.enabled':
				this.shouldDetectClickOnIndentSpaces = this.getPref(aPrefName);
				break;

			case 'extensions.treestyletab.tabbar.scroll.smooth':
				this.smoothScrollEnabled = value;
				break;
			case 'extensions.treestyletab.tabbar.scroll.duration':
				this.smoothScrollDuration = value;
				break;

			case 'extensions.treestyletab.animation.enabled':
				this.animationEnabled = value;
				break;
			case 'extensions.treestyletab.animation.indent.duration':
				this.indentDuration = value;
				break;
			case 'extensions.treestyletab.animation.collapse.duration':
				this.collapseDuration = value;
				break;

			case 'extensions.treestyletab.tabbar.style':
			case 'extensions.treestyletab.tabbar.position':
				this.preLoadImagesForStyle([
					this.getPref('extensions.treestyletab.tabbar.style'),
					this.currentTabbarPosition
				].join('-'));
				break;

			case 'extensions.treestyletab.twisty.expandSensitiveArea':
				this.expandTwistyArea = value;
				break;

			case 'browser.ctrlTab.previews':
				TreeStyleTabBrowserAutoHide.updateKeyListeners();
			case 'extensions.treestyletab.autoCollapseExpandSubtreeOnSelect.whileFocusMovingByShortcut':
			case 'extensions.treestyletab.autoCollapseExpandSubtreeOnSelect':
				if (this.shouldListenKeyEventsForAutoExpandByFocusChange)
					this.startListenKeyEventsFor(this.LISTEN_FOR_AUTOEXPAND_BY_FOCUSCHANGE);
				else
					this.endListenKeyEventsFor(this.LISTEN_FOR_AUTOEXPAND_BY_FOCUSCHANGE);
				break;

			default:
				break;
		}
	},
  
/* Save/Load Prefs */ 
	
	getTreePref : function TSTService_getTreePref(aPrefstring) 
	{
		return this.getPref('extensions.treestyletab.'+aPrefstring);
	},
 
	setTreePref : function TSTService_setTreePref(aPrefstring, aNewValue) 
	{
		return this.setPref('extensions.treestyletab.'+aPrefstring, aNewValue);
	},
 
	clearTreePref : function TSTService_clearTreePref(aPrefstring) 
	{
		return this.clearPref('extensions.treestyletab.'+aPrefstring);
	}
   
}; 

(function() {
	var namespace = {};
	Components.utils.import(
		'resource://treestyletab-modules/prefs.js',
		namespace
	);
	TreeStyleTabService.__proto__ = namespace.window['piro.sakura.ne.jp'].prefs;
})();
window.addEventListener('DOMContentLoaded', TreeStyleTabService, true);
window.addEventListener('load', TreeStyleTabService, false);
TreeStyleTabService.ObserverService.addObserver(TreeStyleTabService, 'sessionstore-windows-restored', false);
 
