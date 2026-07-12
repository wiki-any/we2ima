/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getAllMetas = void 0;
    var contentHeader_1 = __importDefault(__webpack_require__(2));
    var metas_1 = __webpack_require__(8);
    var paragraph_1 = __webpack_require__(9);
    var imgs_1 = __webpack_require__(10);
    function getAllMetas() {
        var _a, _b;
        var infoMeta = (0, metas_1.getMetas)();
        var headers = (0, contentHeader_1.default)();
        var paragraphs = (0, paragraph_1.getParagraphs)();
        var imgs = (0, imgs_1.getAllImgs)();
        if ((headers === null || headers === void 0 ? void 0 : headers.length) > 0 && (paragraphs === null || paragraphs === void 0 ? void 0 : paragraphs.length) > 0) {
            var _loop_1 = function (index) {
                var text = headers[index].text;
                var minStart = ((_b = (_a = headers[index - 1]) === null || _a === void 0 ? void 0 : _a.range) === null || _b === void 0 ? void 0 : _b[0]) || -1;
                var startRange = paragraphs.findIndex(function (item, idex) { return item.text === text && idex > minStart; });
                var endRange = index === headers.length - 1
                    ? paragraphs.length - 1
                    : paragraphs.findIndex(function (item) { return item.text === headers[index + 1].text; }) - 1;
                if (startRange < 0 || endRange < 0 || startRange > endRange)
                    return "continue";
                headers[index].range = [startRange, endRange];
            };
            for (var index = 0; index < headers.length; index++) {
                _loop_1(index);
            }
        }
        return __assign(__assign({}, infoMeta), { headers: headers, paragraphs: paragraphs, imgs: imgs });
    }
    exports.getAllMetas = getAllMetas;
    
    
    /***/ }),
    /* 2 */
    /***/ (function(__unused_webpack_module, exports, __webpack_require__) {
    
    
    var __values = (this && this.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    var const_1 = __webpack_require__(3);
    var doms_1 = __webpack_require__(4);
    var headerPicker_1 = __webpack_require__(6);
    var path_1 = __webpack_require__(7);
    var regexp_1 = __webpack_require__(5);
    var isTableNode = function (node) { return (node === null || node === void 0 ? void 0 : node.tagName) === 'TABLE'; };
    var isSVGNode = function (node) { return (node === null || node === void 0 ? void 0 : node.tagName) === 'svg'; };
    var isMinishop = function (node) { var _a, _b; return (_b = (_a = node === null || node === void 0 ? void 0 : node.classList) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, 'minishop_iframe_wrp'); };
    var isLinkNode = function (node) { var _a; return (node === null || node === void 0 ? void 0 : node.tagName) === 'A' || (node === null || node === void 0 ? void 0 : node.tagName) === 'AI' || ((_a = node === null || node === void 0 ? void 0 : node.querySelector) === null || _a === void 0 ? void 0 : _a.call(node, 'a')); };
    var getPrevTextContainer = function (validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        return (validNodes === null || validNodes === void 0 ? void 0 : validNodes[validNodes.length - 2]) || null;
    };
    var isPreHeaderMerged = function (currentHeaders) {
        if (!currentHeaders || currentHeaders.length < 1)
            return false;
        return currentHeaders[currentHeaders.length - 1].isHeaderMerged;
    };
    var isPrevNodeHeader = function (preNode, currentHeaders, prevText) {
        var _a, _b;
        if (currentHeaders === void 0) { currentHeaders = []; }
        if (prevText === void 0) { prevText = ''; }
        if (!preNode || !currentHeaders || currentHeaders.length < 1)
            return false;
        var prevHeader = currentHeaders[currentHeaders.length - 1];
        if (preNode === document.querySelector(prevHeader.path))
            return true;
        if (prevHeader.isHeaderMerged && ((_b = (_a = prevHeader.text) === null || _a === void 0 ? void 0 : _a.endsWith) === null || _b === void 0 ? void 0 : _b.call(_a, prevText)))
            return true;
        return false;
    };
    var isContinuousCenteredHeadings = function (preNode, currentHeaders, _a) {
        var isCurrentNodeBold = _a.isCurrentNodeBold, hasBackground = _a.hasBackground, fontSize = _a.fontSize, prevFontSize = _a.prevFontSize, preText = _a.preText;
        return isPrevNodeHeader(preNode, currentHeaders, preText) &&
            (isCurrentNodeBold || hasBackground) &&
            (prevFontSize === fontSize || (0, const_1.isRawSureSerial)(preText));
    };
    var isContinuousLeftSerialHeadings = function (_a) {
        var prevText = _a.prevText, curText = _a.curText, isPrevNodeBold = _a.isPrevNodeBold, isCurrentNodeBold = _a.isCurrentNodeBold;
        return (0, const_1.startWithChineseSerial)(prevText) &&
            (0, const_1.startWithChineseSerial)(curText) &&
            (!isPrevNodeBold || isCurrentNodeBold);
    };
    var shouldProcessLeftSerialHeading = function (_a) {
        var curText = _a.curText, isCurrentNodeBold = _a.isCurrentNodeBold, hasBg = _a.hasBg;
        return (isCurrentNodeBold || hasBg) &&
            ((0, const_1.startWithSerial)(curText) || (0, const_1.startWithCommonChineseSerial)(curText));
    };
    var saveHeaderContent = function (currentNode, currentHeaders, currentNodeConfig) {
        var fontSize = currentNodeConfig.fontSize, _a = currentNodeConfig.align, align = _a === void 0 ? const_1.ContentAlign.CENTER : _a, _b = currentNodeConfig.hasBg, hasBg = _b === void 0 ? false : _b, _c = currentNodeConfig.isPreSerial, isPreSerial = _c === void 0 ? false : _c, _d = currentNodeConfig.hasSerial, hasSerial = _d === void 0 ? false : _d, _e = currentNodeConfig.isBiggest, isBiggest = _e === void 0 ? false : _e;
        var container = document.querySelector(const_1.CONTENT_SELECTOR_BASE);
        var curText = (0, doms_1.getNodeText)(currentNode);
        currentHeaders.push({
            path: "".concat(const_1.CONTENT_SELECTOR_BASE, " > ").concat((0, path_1.getElementPath)(currentNode, container)),
            text: curText.replace(/(\n)+/g, ' '),
            fontSize: fontSize,
            align: align,
            hasBg: hasBg,
            isPreSerial: isPreSerial,
            hasSerial: hasSerial,
            isBiggest: isBiggest,
            mergeCount: 0,
        });
    };
    var shouldMergeCenteredHeadings = function (preNode, _a) {
        var curText = _a.curText, preText = _a.preText, hasBackground = _a.hasBackground;
        return !(0, const_1.mergeHeaderExcept)(preText) &&
            (0, const_1.checkMergeCondition)(curText) &&
            ((0, const_1.isRawSureSerial)(preText) ||
                (0, doms_1.hasBackgroundColorInSelfOrAncestors)(preNode) === hasBackground);
    };
    var appendPrevHeaderContent = function (currentHeaders, _a) {
        var curText = _a.curText, _b = _a.isBiggest, isBiggest = _b === void 0 ? false : _b, _c = _a.fontSize, fontSize = _c === void 0 ? 0 : _c, _d = _a.prevFontSize, prevFontSize = _d === void 0 ? 0 : _d;
        console.log('满足标题合并');
        var prevHeader = currentHeaders === null || currentHeaders === void 0 ? void 0 : currentHeaders[(currentHeaders === null || currentHeaders === void 0 ? void 0 : currentHeaders.length) - 1];
        if (!prevHeader) {
            console.error('获取前序标题出错了!!!');
            return;
        }
        prevHeader.text = "".concat(prevHeader.text, " ").concat(curText);
        prevHeader.isHeaderMerged = true;
        if (isBiggest) {
            prevHeader.isBiggest = true;
        }
        if (fontSize > prevFontSize) {
            prevHeader.fontSize = fontSize;
        }
        if ((curText === null || curText === void 0 ? void 0 : curText.length) > 1) {
            prevHeader.mergeCount = (prevHeader.mergeCount || 0) + 1;
        }
    };
    var processContinuousCenteredHeadings = function (node, preNode, currentHeaders, _a) {
        var curText = _a.curText, hasBackground = _a.hasBackground, fontSize = _a.fontSize, nextFontSize = _a.nextFontSize, preText = _a.preText;
        if (!(0, doms_1.isNextToEachOther)(preNode, node)) {
            console.log('与前序节点不相邻，单独存');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
            });
            return true;
        }
        if ((0, const_1.shouldNotMerge)(curText) ||
            ((0, const_1.startWithChineseSerial)(preText) && (0, const_1.startWithCommonChineseSerial)(curText))) {
            console.log('命中特定不合并场景');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
            });
            return true;
        }
        if (shouldMergeCenteredHeadings(preNode, { curText: curText, preText: preText, hasBackground: hasBackground })) {
            appendPrevHeaderContent(currentHeaders, {
                curText: curText,
                isBiggest: fontSize > nextFontSize,
            });
            console.log('【标题合并】满足居中标题合并条件');
        }
        return true;
    };
    var hasMergedLeftHeadings = function (currentHeaders, preNode, _a) {
        var isCurrentNodeBold = _a.isCurrentNodeBold, hasBg = _a.hasBg, curText = _a.curText, prevText = _a.prevText, fontSize = _a.fontSize, prevFontSize = _a.prevFontSize, preHasBg = _a.preHasBg, isPrevNodeBold = _a.isPrevNodeBold;
        var isHeaderMerged = isPreHeaderMerged(currentHeaders);
        if (prevFontSize === fontSize &&
            (isCurrentNodeBold || (hasBg && preHasBg)) &&
            ((0, const_1.isLeftSureHalfSentence)(prevText) || (0, const_1.isRawNumber)(prevText))) {
            console.log('【标题合并】满足居左标题合并');
            appendPrevHeaderContent(currentHeaders, { curText: curText });
            return true;
        }
        if (prevFontSize === fontSize &&
            isCurrentNodeBold &&
            isPrevNodeBold &&
            preHasBg === hasBg &&
            (0, doms_1.isNodeLeft)(preNode) &&
            ((prevText === null || prevText === void 0 ? void 0 : prevText.length) < 40 || isHeaderMerged)) {
            console.log('【标题合并】满足居左标题合并[次条件]');
            appendPrevHeaderContent(currentHeaders, { curText: curText });
            return true;
        }
        return false;
    };
    var hasMergedRightHeadings = function (node, preNode, nextNode, currentHeaders, _a) {
        var curText = _a.curText, fontSize = _a.fontSize, isCurrentNodeBold = _a.isCurrentNodeBold, isBiggest = _a.isBiggest, hasBackground = _a.hasBackground, prevFontSize = _a.prevFontSize, preText = _a.preText, nextFontSize = _a.nextFontSize;
        var isNextNodeBold = (0, doms_1.isAllTextBold)(nextNode);
        var isNextAlignRight = !(0, doms_1.isElementCentered)(nextNode) && !(0, doms_1.isNodeLeft)(nextNode);
        var prevNodeIsHeader = isPrevNodeHeader(preNode, currentHeaders, preText);
        var isPreAlignRight = !(0, doms_1.isElementCentered)(preNode) && !(0, doms_1.isNodeLeft)(preNode);
        var isHeaderMerged = isPreHeaderMerged(currentHeaders);
        if (prevNodeIsHeader &&
            isPreAlignRight &&
            ((0, const_1.isRawSureSerial)(preText) ||
                (isHeaderMerged && fontSize === prevFontSize)) &&
            isCurrentNodeBold) {
            console.log('【√】前序节点有居右纯序列号进行标题合并');
            appendPrevHeaderContent(currentHeaders, {
                curText: curText,
            });
            return true;
        }
        if (isCurrentNodeBold &&
            fontSize > prevFontSize &&
            isNextNodeBold &&
            isNextAlignRight) {
            var nextNextNode = (0, doms_1.findNextTextElement)(nextNode);
            var nextNextFontSize = (0, doms_1.compareFontSize)(nextNode, node, nextNextNode).nextFontSize;
            if (nextFontSize > nextNextFontSize) {
                console.log('【√】居右连续合并');
                saveHeaderContent(node, currentHeaders, {
                    fontSize: fontSize,
                    isPreSerial: false,
                    isBiggest: isBiggest,
                    hasBg: hasBackground,
                    align: const_1.ContentAlign.OTHER,
                });
                appendPrevHeaderContent(currentHeaders, {
                    curText: (0, doms_1.getNodeText)(nextNode),
                });
                return true;
            }
        }
        return false;
    };
    var traverseNode = function (node, titleResults, validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        if (isTableNode(node) || isSVGNode(node)) {
            console.log('跳过表格以及SVG');
            return;
        }
        if (isMinishop(node)) {
            console.log('跳过广告');
            return;
        }
        try {
            var curText_1 = (0, doms_1.getNodeText)(node);
            if (!curText_1 || regexp_1.BLACKLIST_ALL_REGS.some(function (endReg) { return endReg.test(curText_1); })) {
                return;
            }
        }
        catch (e) {
            return;
        }
        if ((0, doms_1.isMiniParagraph)(node)) {
            return processNode(node, titleResults, validNodes);
        }
        else {
            for (var i = 0; i < node.childNodes.length; i++) {
                traverseNode(node.childNodes[i], titleResults, validNodes);
            }
        }
    };
    var processNode = function (node, currentHeaders, validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        if ((0, doms_1.isLikeMainContentStart)(node)) {
            currentHeaders = [];
            return;
        }
        if (!(0, doms_1.isValidNode)(node))
            return;
        validNodes.push(node);
        var curText = (0, doms_1.getNodeText)(node);
        if (regexp_1.BLACK_LIST_REGS.some(function (filterReg) { return filterReg.test(curText); })) {
            console.log('【跳过】命中黑名单===>', curText);
            return;
        }
        if (isLinkNode(node)) {
            console.log('【跳过】A链接', node === null || node === void 0 ? void 0 : node.tagName);
            return;
        }
        if ((0, doms_1.isElementCentered)(node)) {
            return processCenteredNode(node, currentHeaders, validNodes);
        }
        else if ((0, doms_1.isNodeLeft)(node)) {
            return processLeftNode(node, currentHeaders, validNodes);
        }
        else {
            console.log('【其余节点】', node);
            return processRightNode(node, currentHeaders, validNodes);
        }
    };
    var hasProcessedCenteredPrevNode = function (node, currentHeaders, _a) {
        if (currentHeaders === void 0) { currentHeaders = []; }
        var preNode = _a.preNode, preText = _a.preText, prevFontSize = _a.prevFontSize, fontSize = _a.fontSize, curText = _a.curText, hasBackground = _a.hasBackground, nextFontSize = _a.nextFontSize, isCurrentNodeBold = _a.isCurrentNodeBold, isBiggest = _a.isBiggest;
        console.log('【X】前序节点居中', preText);
        var isBiggerThanPre = fontSize > prevFontSize && fontSize >= nextFontSize;
        if (isBiggerThanPre && (isCurrentNodeBold || hasBackground)) {
            console.log('【√】前序为小一号字体');
            saveHeaderContent(node, currentHeaders, { fontSize: fontSize, hasBg: hasBackground });
            return true;
        }
        if ((0, const_1.isRawChineseSerial)(curText) && isCurrentNodeBold) {
            console.log('【√】纯中文序列号粗体');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
                hasSerial: true,
            });
            return true;
        }
        if (isContinuousCenteredHeadings(preNode, currentHeaders, {
            isCurrentNodeBold: isCurrentNodeBold,
            hasBackground: hasBackground,
            fontSize: fontSize,
            prevFontSize: prevFontSize,
            preText: preText,
        })) {
            console.log('连续居中标题');
            return processContinuousCenteredHeadings(node, preNode, currentHeaders, {
                curText: curText,
                hasBackground: hasBackground,
                fontSize: fontSize,
                nextFontSize: nextFontSize,
                preText: preText,
            });
        }
        if ((isBiggest || isCurrentNodeBold) &&
            ((preText === null || preText === void 0 ? void 0 : preText.length) > const_1.MAX_LEFT_TITLE_WORD_LENGTH || (0, const_1.isLeftSentence)(preText))) {
            console.log('【√】满足最大字号且前序为居中段落');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
                isBiggest: isBiggest,
            });
            return true;
        }
        if ((0, const_1.isCommentTxt)(preText)) {
            console.log('前序居中为备注，继续后继处理');
            return false;
        }
        console.log('【X】忽略');
        return true;
    };
    var processCenteredNextNode = function (node, currentHeaders, _a) {
        if (currentHeaders === void 0) { currentHeaders = []; }
        var nextNode = _a.nextNode, nextText = _a.nextText, fontSize = _a.fontSize, hasBackground = _a.hasBackground, nextFontSize = _a.nextFontSize, isCurrentNodeBold = _a.isCurrentNodeBold;
        if ((0, doms_1.isBoldText)(nextNode) && isCurrentNodeBold) {
            console.log('【√】连续居中标题保留第一个');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
            });
            return;
        }
        if (isCurrentNodeBold && fontSize > nextFontSize && !(0, doms_1.isBoldText)(nextNode)) {
            console.log('【√】后继节点居中，但是字号更小，并且不加粗');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
            });
            return;
        }
        var nextHasBg = (0, doms_1.hasBackgroundColorInSelfOrAncestors)(nextNode);
        if ((isCurrentNodeBold || (hasBackground && !nextHasBg)) &&
            nextText.length > const_1.MAX_LEFT_TITLE_WORD_LENGTH) {
            console.log('【√】后继节点居中为段落');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: hasBackground,
            });
            return;
        }
        if (isCurrentNodeBold &&
            !(0, doms_1.isBoldText)(nextNode) &&
            !(0, doms_1.isNextToEachOther)(node, nextNode)) {
            console.log('【√】后继节点不加粗不相邻');
            saveHeaderContent(node, currentHeaders, { fontSize: fontSize });
            return;
        }
        console.log('【X】后继节点居中，舍弃', nextText);
    };
    var shouldProcessPrevNodeHeader4LeftNode = function (node, preNode, _a) {
        var hasSerial = _a.hasSerial, prevNodeIsHeader = _a.prevNodeIsHeader;
        return !hasSerial && prevNodeIsHeader && (0, doms_1.isNextToEachOther)(preNode, node);
    };
    var processPrevNodeHeader4LeftNode = function (node, preNode, currentHeaders, _a) {
        if (currentHeaders === void 0) { currentHeaders = []; }
        var curText = _a.curText, prevText = _a.prevText, fontSize = _a.fontSize, isCurrentNodeBold = _a.isCurrentNodeBold, _b = _a.hasBg, hasBg = _b === void 0 ? false : _b, nextFontSize = _a.nextFontSize, prevFontSize = _a.prevFontSize;
        console.log('前序节点为标题');
        if ((0, const_1.isChineseNumber)(prevText) || (0, const_1.isRawSureSerial)(prevText)) {
            console.log('【前序节点为纯序列号】【标题合并】');
            appendPrevHeaderContent(currentHeaders, { curText: curText });
            return;
        }
        var isPrevNodeBold = (0, doms_1.isAllTextBold)(preNode);
        if (isContinuousLeftSerialHeadings({
            prevText: prevText,
            curText: curText,
            isPrevNodeBold: isPrevNodeBold,
            isCurrentNodeBold: isCurrentNodeBold,
        })) {
            console.log('连续序列号，并且非(前序粗体,当前非粗体)');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasSerial: true,
            });
            return;
        }
        if (shouldProcessLeftSerialHeading({
            curText: curText,
            isCurrentNodeBold: isCurrentNodeBold,
            hasBg: hasBg,
        })) {
            console.log('【当前节点为序列号标题】');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasSerial: true,
                hasBg: hasBg,
            });
            return;
        }
        var preHasBg = (0, doms_1.hasBackgroundColorInSelfOrAncestors)(preNode);
        if (hasMergedLeftHeadings(currentHeaders, preNode, {
            isCurrentNodeBold: isCurrentNodeBold,
            hasBg: hasBg,
            curText: curText,
            prevText: prevText,
            fontSize: fontSize,
            prevFontSize: prevFontSize,
            preHasBg: preHasBg,
            isPrevNodeBold: isPrevNodeBold,
        })) {
            return;
        }
        if ((0, doms_1.isNodeLeft)(preNode) && hasBg && preHasBg && prevFontSize < fontSize) {
            console.log('【有背景】【前序节点居中并且字号小于了当前节点】');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasBg: hasBg,
            });
            return;
        }
        if ((0, doms_1.isElementCentered)(preNode) &&
            isCurrentNodeBold &&
            fontSize >= nextFontSize) {
            console.log('前序为居中标题，当前标题加粗且字号大于后继节点');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasBg: hasBg,
            });
            return;
        }
        if (isCurrentNodeBold && hasBg && !preHasBg) {
            console.log('前序为不带背景的标题，当前标题带背景保留');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasBg: hasBg,
            });
        }
        return;
    };
    var shouldIgnorePreNode = function (preNode, preText) {
        if (preText === void 0) { preText = ''; }
        return !(0, doms_1.hasBackgroundColorInSelfOrAncestors)(preNode) ||
            (preText === null || preText === void 0 ? void 0 : preText.length) > const_1.MAX_LEFT_TITLE_WORD_LENGTH ||
            (0, doms_1.isNodeLeft)(preNode);
    };
    var shouldProcessHasBackground = function (_a) {
        var _b = _a.hasBackground, hasBackground = _b === void 0 ? false : _b, _c = _a.isCurrentNodeBold, isCurrentNodeBold = _c === void 0 ? false : _c, _d = _a.isBiggest, isBiggest = _d === void 0 ? false : _d, preNode = _a.preNode, _e = _a.preText, preText = _e === void 0 ? '' : _e;
        return hasBackground &&
            (isCurrentNodeBold || isBiggest) &&
            shouldIgnorePreNode(preNode, preText);
    };
    var hasSerialPrefix = function (curText) {
        if (curText === void 0) { curText = ''; }
        return (0, const_1.startWithSerial)(curText) ||
            (0, const_1.isRawChineseSerial)(curText) ||
            (0, const_1.startWithComplitArabicSerial)(curText);
    };
    var shouldProcessStartWithSerial = function (_a) {
        var isCurrentNodeBold = _a.isCurrentNodeBold, isBiggest = _a.isBiggest, hasBackground = _a.hasBackground, curText = _a.curText;
        return (isCurrentNodeBold || isBiggest || hasBackground) && hasSerialPrefix(curText);
    };
    var shouldProcessBiggest = function (_a) {
        var isCurrentNodeBold = _a.isCurrentNodeBold, isBiggest = _a.isBiggest, hasBackground = _a.hasBackground;
        return (isCurrentNodeBold || hasBackground) && isBiggest;
    };
    var shouldProcessPrevSerial = function (_a) {
        var isBiggest = _a.isBiggest, isSmallest = _a.isSmallest, isCurrentNodeBold = _a.isCurrentNodeBold, preText = _a.preText;
        return (isBiggest || (!isSmallest && isCurrentNodeBold)) &&
            (/^(Q|Part|part|PART|PART\.|Part\.|NO\.|Prediction)?\s*\d{1,3}$/.test(preText) ||
                (0, const_1.isChineseNumber)(preText) ||
                (0, const_1.isRawNumber)(preText) ||
                (0, const_1.isSomeLikeRawChineseSerial)(preText));
    };
    var isValidText4CenteredNode = function (curText, isCurrentNodeBold) {
        if (curText === void 0) { curText = ''; }
        if (isCurrentNodeBold === void 0) { isCurrentNodeBold = false; }
        if (curText.length >= const_1.CENTERED_HEADER_TEXT_LENGTH_LIMIT)
            return false;
        if (!isCurrentNodeBold && (0, const_1.isHalfSentence)(curText))
            return false;
        return true;
    };
    var isNextNodeBoldAndBigger = function (nextNode, _a) {
        var curText = _a.curText, fontSize = _a.fontSize, nextFontSize = _a.nextFontSize;
        return (0, doms_1.isAllTextBold)(nextNode) &&
            nextFontSize > fontSize &&
            !(0, const_1.isRawSureSerial)(curText);
    };
    var shouldDiscardLeftNode = function (_a) {
        var curText = _a.curText, isCurrentNodeBold = _a.isCurrentNodeBold, hasSerial = _a.hasSerial, hasBg = _a.hasBg;
        return (!(isCurrentNodeBold && (hasSerial || hasBg)) &&
            (0, const_1.countChineseCharsAndDigits)(curText) > const_1.MAX_LEFT_TITLE_WORD_LENGTH) ||
            (0, const_1.checkPureEnglishChars)(curText);
    };
    var shouldDiscardLeftSentence = function (_a) {
        var curText = _a.curText, isBiggest = _a.isBiggest, isCurrentNodeBold = _a.isCurrentNodeBold, hasSerial = _a.hasSerial;
        return ((0, const_1.isSentence)(curText) ||
            (!isBiggest && !isCurrentNodeBold && (0, const_1.isLeftSentence)(curText))) &&
            !hasSerial &&
            !(0, const_1.isReasonSentence)(curText);
    };
    var shouldProcessLeftNodeBiggest = function (_a) {
        var curText = _a.curText, isCurrentNodeBold = _a.isCurrentNodeBold, isBiggest = _a.isBiggest;
        return isBiggest &&
            (0, const_1.countChineseCharsAndDigits)(curText) < const_1.MAX_LEFT_BIGGEST_TITLE_LEGTH &&
            (!(0, const_1.isSentence)(curText) || isCurrentNodeBold);
    };
    var processCommonRest4CenteredNode = function (node, currentHeaders, _a) {
        var e_1, _b;
        if (currentHeaders === void 0) { currentHeaders = []; }
        var isBiggest = _a.isBiggest, isCurrentNodeBold = _a.isCurrentNodeBold, hasBackground = _a.hasBackground, fontSize = _a.fontSize;
        var probableResults = [
            { value: isBiggest, text: '字体最大' },
            { value: isCurrentNodeBold, text: '粗体' },
            { value: hasBackground, text: '有背景色' },
        ];
        try {
            for (var probableResults_1 = __values(probableResults), probableResults_1_1 = probableResults_1.next(); !probableResults_1_1.done; probableResults_1_1 = probableResults_1.next()) {
                var result = probableResults_1_1.value;
                if (result.value) {
                    console.log("\u3010\u221A\u3011\u6EE1\u8DB3".concat(result.text));
                    saveHeaderContent(node, currentHeaders, {
                        fontSize: fontSize,
                        align: const_1.ContentAlign.CENTER,
                        hasBg: hasBackground,
                    });
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (probableResults_1_1 && !probableResults_1_1.done && (_b = probableResults_1.return)) _b.call(probableResults_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    var processPrevNodeIsSerial = function (node, currentHeaders, _a) {
        var curText = _a.curText, fontSize = _a.fontSize, isBiggest = _a.isBiggest, hasBackground = _a.hasBackground, prevFontSize = _a.prevFontSize;
        if (/^\d+$/.test(curText) || (0, const_1.isChineseNumber)(curText)) {
            console.log('前序为纯序列号，当前节点也是纯序列号');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasSerial: true,
                isBiggest: isBiggest,
                hasBg: hasBackground,
            });
        }
        else {
            console.log('【√】【标题合并】满足前序为序列号，字体最大加粗并且不是最小');
            appendPrevHeaderContent(currentHeaders, {
                curText: curText,
                isBiggest: isBiggest,
                fontSize: fontSize,
                prevFontSize: prevFontSize,
            });
        }
    };
    var processCenteredNode = function (node, currentHeaders, validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        var curText = (0, doms_1.getNodeText)(node);
        console.log('!!!【居中节点】', curText);
        var isCurrentNodeBold = (0, doms_1.isAllTextBold)(node);
        if (!isValidText4CenteredNode(curText, isCurrentNodeBold)) {
            console.log('杂糅，字符超过阈值或者半句');
            return;
        }
        var preNode = getPrevTextContainer(validNodes);
        var nextNode = (0, doms_1.findNextTextElement)(node);
        var _a = (0, doms_1.compareFontSize)(node, preNode, nextNode), isBiggest = _a.isBiggest, isSmallest = _a.isSmallest, fontSize = _a.fontSize, prevFontSize = _a.prevFontSize, nextFontSize = _a.nextFontSize;
        var hasBackground = (0, doms_1.hasBackgroundColorInSelfOrAncestors)(node);
        var preText = (0, doms_1.getNodeText)(preNode);
        var nextText = (0, doms_1.getNodeText)(nextNode);
        console.log('获取信息为', {
            preNode: preText,
            nextNode: nextText,
            isBiggest: isBiggest,
            hasBackground: hasBackground,
            isCurrentNodeBold: isCurrentNodeBold,
        });
        if (shouldProcessPrevSerial({
            isBiggest: isBiggest,
            isSmallest: isSmallest,
            isCurrentNodeBold: isCurrentNodeBold,
            preText: preText,
        })) {
            processPrevNodeIsSerial(node, currentHeaders, {
                curText: curText,
                fontSize: fontSize,
                isBiggest: isBiggest,
                hasBackground: hasBackground,
                prevFontSize: prevFontSize,
            });
            return;
        }
        if ((0, const_1.isRawSureSerial)(curText)) {
            console.log('【√】纯序列号');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasSerial: true,
                isBiggest: isBiggest,
                hasBg: hasBackground,
            });
            return;
        }
        if (shouldProcessHasBackground({
            hasBackground: hasBackground,
            isCurrentNodeBold: isCurrentNodeBold,
            isBiggest: isBiggest,
            preNode: preNode,
            preText: preText,
        })) {
            console.log('【√】粗体有背景，忽略前序居中');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasBg: true,
                hasSerial: (0, const_1.startWithSerial)(curText),
                isBiggest: isBiggest,
            });
            return;
        }
        if (shouldProcessStartWithSerial({
            isCurrentNodeBold: isCurrentNodeBold,
            isBiggest: isBiggest,
            hasBackground: hasBackground,
            curText: curText,
        })) {
            console.log('【√】粗体或者字号最大并且序列号开头');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                hasSerial: true,
                isBiggest: isBiggest,
                hasBg: hasBackground,
            });
            return;
        }
        if (shouldProcessBiggest({ isCurrentNodeBold: isCurrentNodeBold, hasBackground: hasBackground, isBiggest: isBiggest })) {
            console.log('【√】粗体或者有背景并且字体最大');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                isBiggest: isBiggest,
                hasBg: hasBackground,
            });
            return;
        }
        if ((0, doms_1.isElementCentered)(preNode) &&
            (0, doms_1.isNextToEachOther)(preNode, node) &&
            hasProcessedCenteredPrevNode(node, currentHeaders, {
                preNode: preNode,
                preText: preText,
                prevFontSize: prevFontSize,
                fontSize: fontSize,
                curText: curText,
                hasBackground: hasBackground,
                nextFontSize: nextFontSize,
                isCurrentNodeBold: isCurrentNodeBold,
                isBiggest: isBiggest,
            })) {
            return;
        }
        if ((0, doms_1.isElementCentered)(nextNode)) {
            return processCenteredNextNode(node, currentHeaders, {
                nextNode: nextNode,
                nextText: nextText,
                fontSize: fontSize,
                hasBackground: hasBackground,
                nextFontSize: nextFontSize,
                isCurrentNodeBold: isCurrentNodeBold,
            });
        }
        if (isSmallest && !hasBackground) {
            console.log('【X】小于上下');
            return;
        }
        if (processCommonRest4CenteredNode(node, currentHeaders, {
            isBiggest: isBiggest,
            isCurrentNodeBold: isCurrentNodeBold,
            hasBackground: hasBackground,
            fontSize: fontSize,
        })) {
            return;
        }
        console.log('!!居中节点，未匹配到任何条件!!', node);
    };
    var processLeftNode = function (node, currentHeaders, validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        var curText = (0, doms_1.getNodeText)(node);
        console.log('!!!【左节点】', curText);
        var isCurrentNodeBold = (0, doms_1.isAllTextBold)(node);
        var hasSerial = (0, const_1.startWithChineseSerial)(curText) || (0, const_1.isRawSureSerial)(curText);
        var hasBg = (0, doms_1.hasBackgroundColorInSelfOrAncestors)(node);
        if (shouldDiscardLeftNode({
            curText: curText,
            isCurrentNodeBold: isCurrentNodeBold,
            hasSerial: hasSerial,
            hasBg: hasBg,
        })) {
            console.log('超过阈值，【舍弃】');
            return;
        }
        var preNode = getPrevTextContainer(validNodes);
        var nextNode = (0, doms_1.findNextTextElement)(node);
        var _a = (0, doms_1.compareFontSize)(node, preNode, nextNode), isSmallest = _a.isSmallest, isBiggest = _a.isBiggest, fontSize = _a.fontSize, nextFontSize = _a.nextFontSize, prevFontSize = _a.prevFontSize;
        var prevText = (0, doms_1.getNodeText)(preNode);
        var nextText = (0, doms_1.getNodeText)(nextNode);
        var prevNodeIsHeader = isPrevNodeHeader(preNode, currentHeaders, prevText);
        console.log('当前节点获取结果', {
            isCurrentNodeBold: isCurrentNodeBold,
            isBiggest: isBiggest,
            fontSize: fontSize,
            hasSerial: hasSerial,
            prevText: prevText,
            nextText: nextText,
            hasBg: hasBg,
        });
        if (shouldProcessLeftNodeBiggest({ curText: curText, isCurrentNodeBold: isCurrentNodeBold, isBiggest: isBiggest })) {
            console.log('【√】满足比上下大条件条件', curText);
            if (isCurrentNodeBold || !curText.endsWith('：')) {
                if (prevNodeIsHeader && (0, const_1.isRawSureSerial)(prevText)) {
                    appendPrevHeaderContent(currentHeaders, {
                        curText: curText,
                        isBiggest: isBiggest,
                        fontSize: fontSize,
                        prevFontSize: prevFontSize,
                    });
                }
                else {
                    saveHeaderContent(node, currentHeaders, {
                        fontSize: fontSize,
                        isBiggest: true,
                        align: const_1.ContentAlign.LEFT,
                        hasSerial: hasSerial,
                        hasBg: hasBg,
                    });
                }
                return;
            }
        }
        if (shouldDiscardLeftSentence({
            curText: curText,
            isBiggest: isBiggest,
            isCurrentNodeBold: isCurrentNodeBold,
            hasSerial: hasSerial,
        })) {
            console.log('居左句子，【舍弃】');
            return;
        }
        if (shouldProcessPrevNodeHeader4LeftNode(node, preNode, {
            hasSerial: hasSerial,
            prevNodeIsHeader: prevNodeIsHeader,
        })) {
            return processPrevNodeHeader4LeftNode(node, preNode, currentHeaders, {
                curText: curText,
                prevText: prevText,
                fontSize: fontSize,
                nextFontSize: nextFontSize,
                prevFontSize: prevFontSize,
                isCurrentNodeBold: isCurrentNodeBold,
                hasBg: hasBg,
            });
        }
        if (isSmallest && !hasSerial) {
            console.log('字号最小【舍弃】');
            return;
        }
        if (hasBg) {
            console.log('【√】满足背景颜色条件');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasBg: true,
                isBiggest: isBiggest,
                hasSerial: hasSerial,
                isPreSerial: (0, doms_1.isPreRawSerialNumber)(node),
            });
            return;
        }
        if (isCurrentNodeBold) {
            if (isNextNodeBoldAndBigger(nextNode, { curText: curText, fontSize: fontSize, nextFontSize: nextFontSize })) {
                console.log('后继有更大的粗体标题');
                return;
            }
            console.log('【√】满足粗体条件', curText);
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                isBiggest: isBiggest,
                hasSerial: hasSerial,
            });
            return;
        }
        if (hasSerial) {
            if ((0, const_1.isLikeSentence)(curText)) {
                console.log('【X】序列号开头，但是为句子');
                return;
            }
            console.log('【√】序列号开头');
            saveHeaderContent(node, currentHeaders, {
                fontSize: fontSize,
                align: const_1.ContentAlign.LEFT,
                hasSerial: true,
            });
            return;
        }
        console.log('没有匹配上任何策略');
    };
    var processRightNode = function (node, currentHeaders, validNodes) {
        if (validNodes === void 0) { validNodes = []; }
        var curText = (0, doms_1.getNodeText)(node);
        console.log('!!!【右节点】', curText);
        try {
            var preNode = getPrevTextContainer(validNodes);
            var nextNode = (0, doms_1.findNextTextElement)(node);
            var _a = (0, doms_1.compareFontSize)(node, preNode, nextNode), isBiggest = _a.isBiggest, fontSize = _a.fontSize, prevFontSize = _a.prevFontSize, nextFontSize = _a.nextFontSize;
            var hasBackground = (0, doms_1.hasBackgroundColorInSelfOrAncestors)(node);
            var isCurrentNodeBold = (0, doms_1.isAllTextBold)(node);
            var preText = (0, doms_1.getNodeText)(preNode);
            console.log('当前节点获取结果', {
                isCurrentNodeBold: isCurrentNodeBold,
                isBiggest: isBiggest,
                fontSize: fontSize,
                hasBackground: hasBackground,
                preText: preText,
            });
            if ((0, const_1.isRawSureSerial)(curText)) {
                if (isBiggest && isCurrentNodeBold) {
                    console.log('【√】纯序列号大字号加粗');
                    saveHeaderContent(node, currentHeaders, {
                        fontSize: fontSize,
                        isBiggest: isBiggest,
                        hasSerial: true,
                        align: const_1.ContentAlign.OTHER,
                    });
                }
                else {
                    validNodes.pop();
                }
                return;
            }
            if (isCurrentNodeBold && (0, const_1.startWithSerial)(curText)) {
                console.log('【√】粗体并且序列号开头');
                saveHeaderContent(node, currentHeaders, {
                    fontSize: fontSize,
                    hasSerial: true,
                    align: const_1.ContentAlign.OTHER,
                });
                return;
            }
            if (isCurrentNodeBold && isBiggest && hasBackground) {
                console.log('【√】粗体最大有背景');
                saveHeaderContent(node, currentHeaders, {
                    fontSize: fontSize,
                    hasSerial: false,
                    isBiggest: isBiggest,
                    hasBg: hasBackground,
                    align: const_1.ContentAlign.OTHER,
                });
                return;
            }
            var isPreSerial = (0, doms_1.isPreRawSerialNumber)(node);
            if (isCurrentNodeBold && isBiggest && isPreSerial) {
                saveHeaderContent(node, currentHeaders, {
                    fontSize: fontSize,
                    isPreSerial: true,
                    isBiggest: isBiggest,
                    align: const_1.ContentAlign.OTHER,
                });
                return;
            }
            if ((isCurrentNodeBold || hasBackground) && isBiggest) {
                console.log('【√】粗体最大或者粗体有背景');
                saveHeaderContent(node, currentHeaders, {
                    fontSize: fontSize,
                    isPreSerial: false,
                    isBiggest: isBiggest,
                    hasBg: hasBackground,
                    align: const_1.ContentAlign.OTHER,
                });
                return;
            }
            if (hasMergedRightHeadings(node, preNode, nextNode, currentHeaders, {
                curText: curText,
                fontSize: fontSize,
                isCurrentNodeBold: isCurrentNodeBold,
                isBiggest: isBiggest,
                hasBackground: hasBackground,
                prevFontSize: prevFontSize,
                preText: preText,
                nextFontSize: nextFontSize,
            })) {
                return;
            }
            if (isCurrentNodeBold && hasBackground) {
                console.log('【√】粗体有背景');
                if ((0, const_1.isRawSureSerial)(preText)) {
                    appendPrevHeaderContent(currentHeaders, {
                        curText: curText,
                    });
                }
                else {
                    saveHeaderContent(node, currentHeaders, {
                        fontSize: fontSize,
                        isPreSerial: false,
                        isBiggest: isBiggest,
                        hasBg: hasBackground,
                        align: const_1.ContentAlign.OTHER,
                    });
                }
                return;
            }
            console.log('【X】居右，暂时未匹配到任何条件');
        }
        catch (e) {
            console.error('右节点抽取，报错');
        }
    };
    function getContentHeaders() {
        var titleResults = [];
        var container = document.querySelector(const_1.CONTENT_SELECTOR_BASE);
        if (!container)
            return titleResults;
        var validNodes = [];
        try {
            traverseNode(container, titleResults, validNodes);
        }
        catch (e) {
            if (e.message !== '正文已结束')
                console.error(e);
        }
        console.log('获取到的全标题为', titleResults);
        return (0, headerPicker_1.pickHeaders)(titleResults);
    }
    exports["default"] = getContentHeaders;
    
    
    /***/ }),
    /* 3 */
    /***/ (function(__unused_webpack_module, exports) {
    
    
    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.fixHeadersSubfix = exports.isAllValidArabicSerialHeaders = exports.isAllArabicSerialHeaders = exports.isAllChineseHeaders = exports.isAllSerialHeaders = exports.ContentAlign = exports.countChineseCharsAndDigits = exports.shortEnglishTitleWhiteList = exports.checkPureEnglishChars = exports.shouldSaveTitle = exports.shouldNotMerge = exports.checkMergeCondition = exports.mergeHeaderExcept = exports.isLeftSureHalfSentence = exports.isLikeSentence = exports.isLeftSentence = exports.isReasonSentence = exports.isSentence = exports.isCommentTxt = exports.isHalfSentence = exports.startWithCommonChineseSerial = exports.isRawChineseSerial = exports.startWithChineseSerial = exports.isSomeLikeRawChineseSerial = exports.isRawSureSerial = exports.twoChineseAtLeast = exports.startWithComplitArabicSerial = exports.startWithSerial = exports.startWithArabicSerial = exports.isChineseNumber = exports.isRawNumber = exports.TITLE_MERGE_COUNT_LIMIT = exports.COMMON_LINE_HEIGHT = exports.PARAGRAPH_TEXT_LENGTH_LIMIT = exports.CENTERED_HEADER_TEXT_LENGTH_LIMIT = exports.MIN_HEADERS_SIZE = exports.HAS_BACKGROUND_PRE_LIMIT = exports.MAX_FONTSIZE_HEADERS_LIMIT = exports.CENTERED_HEADERS_LIMIT = exports.MAX_LEFT_TITLE_WORD_LENGTH = exports.MAX_REVISE_TITLE_LIMIT = exports.MAX_LEFT_BIGGEST_TITLE_LEGTH = exports.MAX_HEADERS_LENGTH = exports.HEADER_REPEAT_THREHOLD = exports.HEADER_SIZE_THREHOLD = exports.HX_TAG_WHITELIST = exports.CONTENT_SELECTOR_BASE = void 0;
    exports.CONTENT_SELECTOR_BASE = '#js_content';
    exports.HX_TAG_WHITELIST = ['H1', 'H2', 'H3', 'H4'];
    exports.HEADER_SIZE_THREHOLD = 58;
    exports.HEADER_REPEAT_THREHOLD = 20;
    exports.MAX_HEADERS_LENGTH = 30;
    exports.MAX_LEFT_BIGGEST_TITLE_LEGTH = 24;
    exports.MAX_REVISE_TITLE_LIMIT = 20;
    exports.MAX_LEFT_TITLE_WORD_LENGTH = 40;
    exports.CENTERED_HEADERS_LIMIT = 3;
    exports.MAX_FONTSIZE_HEADERS_LIMIT = 3;
    exports.HAS_BACKGROUND_PRE_LIMIT = 7;
    exports.MIN_HEADERS_SIZE = 2;
    exports.CENTERED_HEADER_TEXT_LENGTH_LIMIT = 68;
    exports.PARAGRAPH_TEXT_LENGTH_LIMIT = 4800;
    exports.COMMON_LINE_HEIGHT = 30;
    exports.TITLE_MERGE_COUNT_LIMIT = 2;
    var isRawNumber = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^[-]?\s*\d+\s*[.|、|-|#]?$/.test(txt);
    };
    exports.isRawNumber = isRawNumber;
    var isChineseNumber = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^([-])*\s*[一二三四五六七八九十]\s*([.|、|-])*$/.test(txt);
    };
    exports.isChineseNumber = isChineseNumber;
    var startWithArabicSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^(1[0-9]|[1-9]|0[1-9])([\.|、|，|,|\s|\#])/.test(txt) &&
            !/^(1[0-9]|[1-9]|0[1-9])([\.|、|，|,|\s|\#])(\d)/.test(txt);
    };
    exports.startWithArabicSerial = startWithArabicSerial;
    var startWithSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return (0, exports.startWithChineseSerial)(txt) ||
            (0, exports.startWithArabicSerial)(txt) ||
            /^(0)?[0-9]$/.test(txt);
    };
    exports.startWithSerial = startWithSerial;
    var startWithComplitArabicSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^0[1-9][\u4e00-\u9fa5“]/.test(txt);
    };
    exports.startWithComplitArabicSerial = startWithComplitArabicSerial;
    var twoChineseAtLeast = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^[\u4e00-\u9fa5]{2,}$/.test(txt);
    };
    exports.twoChineseAtLeast = twoChineseAtLeast;
    var isRawSureSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^(\#|NO\.)?([0-9]|0[1-9]|1[0-9]|2[0-9]|Q[1-9])(\.|\s*\/\s*)?$/.test(txt) ||
            (0, exports.isRawChineseSerial)(txt) ||
            (0, exports.isSomeLikeRawChineseSerial)(txt);
    };
    exports.isRawSureSerial = isRawSureSerial;
    var isSomeLikeRawChineseSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^第[一二三四五六七八九十]+(站|问\s*\:\s*)$/.test(txt);
    };
    exports.isSomeLikeRawChineseSerial = isSomeLikeRawChineseSerial;
    var startWithChineseSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^(第)?[一二三四五六七八九十]{1,2}([.|、|，|,|\s|是])/.test(txt);
    };
    exports.startWithChineseSerial = startWithChineseSerial;
    var isRawChineseSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^[一二三四五六七八九十]+$/.test(txt);
    };
    exports.isRawChineseSerial = isRawChineseSerial;
    var startWithCommonChineseSerial = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^(\(|（)[一二三四五六七八九十]+(\)|）)/.test(txt);
    };
    exports.startWithCommonChineseSerial = startWithCommonChineseSerial;
    var isHalfSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^“.*，$/.test(txt) && !/”/.test(txt);
    };
    exports.isHalfSentence = isHalfSentence;
    var isCommentTxt = function (txt) {
        var _a;
        if (txt === void 0) { txt = ''; }
        return /^（.*）$/.test(txt) ||
            ((_a = txt.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) > 6 ||
            /\s+摄$/.test(txt) ||
            /^网络供图$/.test(txt);
    };
    exports.isCommentTxt = isCommentTxt;
    var isSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /[。！；](”)?$/.test(txt) ||
            /(？？|？～|？”)$/.test(txt) ||
            (/(，(”)?|：)$/.test(txt) && countChineseCharsAndDigits(txt) > 12);
    };
    exports.isSentence = isSentence;
    var isReasonSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^原因[一二三四五六七八九十]\s*：.*！$/.test(txt) ||
            /^细节[一二三四五六七八九十]\s*(，|：)/.test(txt);
    };
    exports.isReasonSentence = isReasonSentence;
    var isLeftSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /(。|！|？|——)(”)?$/.test(txt) || /(？？|？～|~)$/.test(txt);
    };
    exports.isLeftSentence = isLeftSentence;
    var isLikeSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /[。|！|；|，](”)?$/.test(txt);
    };
    exports.isLikeSentence = isLikeSentence;
    var isLeftSureHalfSentence = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /[，：\d的]$/.test(txt) && !/\d+:\d+\-\d+:\d+/.test(txt);
    };
    exports.isLeftSureHalfSentence = isLeftSureHalfSentence;
    var mergeHeaderExcept = function (preText) {
        if (preText === void 0) { preText = ''; }
        return /^《.*》$/.test(preText) &&
            !/^《.*(工作办法|管理办法（送审稿）)》$/.test(preText);
    };
    exports.mergeHeaderExcept = mergeHeaderExcept;
    var checkMergeCondition = function (curText) {
        if (curText === void 0) { curText = ''; }
        return !/^第[一二三四五六七八九十]{1,2}步：/.test(curText) &&
            !/^第[一二三四五六七八九十]{1,2}章\s/.test(curText);
    };
    exports.checkMergeCondition = checkMergeCondition;
    var shouldNotMerge = function (curText) {
        if (curText === void 0) { curText = ''; }
        return /^第[一二三四五六七八九十]{1,2}章\s/.test(curText);
    };
    exports.shouldNotMerge = shouldNotMerge;
    var shouldSaveTitle = function (preText, curText) {
        if (preText === void 0) { preText = ''; }
        if (curText === void 0) { curText = ''; }
        var reg = /^..地区$/;
        return reg.test(preText) && reg.test(curText);
    };
    exports.shouldSaveTitle = shouldSaveTitle;
    var checkPureEnglishChars = function (txt) {
        if (txt === void 0) { txt = ''; }
        return !/[\u4e00-\u9fa5]/g.test(txt) && txt.length > 120;
    };
    exports.checkPureEnglishChars = checkPureEnglishChars;
    var shortEnglishTitleWhiteList = function (txt) {
        if (txt === void 0) { txt = ''; }
        return /^APP$/.test(txt);
    };
    exports.shortEnglishTitleWhiteList = shortEnglishTitleWhiteList;
    function countChineseCharsAndDigits(str) {
        if (str === void 0) { str = ''; }
        var chineseCharAndDigitRegex = /[\u4e00-\u9fa5]|[0-9]/g;
        var matchedChars = str === null || str === void 0 ? void 0 : str.match(chineseCharAndDigitRegex);
        return matchedChars ? matchedChars.length : 0;
    }
    exports.countChineseCharsAndDigits = countChineseCharsAndDigits;
    var ContentAlign;
    (function (ContentAlign) {
        ContentAlign[ContentAlign["CENTER"] = 0] = "CENTER";
        ContentAlign[ContentAlign["LEFT"] = 1] = "LEFT";
        ContentAlign[ContentAlign["OTHER"] = 2] = "OTHER";
    })(ContentAlign || (exports.ContentAlign = ContentAlign = {}));
    function isAllSerialHeaders(headers) {
        if (headers === void 0) { headers = []; }
        return headers.every(function (item) { return (0, exports.startWithSerial)(item.text); });
    }
    exports.isAllSerialHeaders = isAllSerialHeaders;
    function isAllChineseHeaders(headers) {
        if (headers === void 0) { headers = []; }
        return headers.every(function (item) { return (0, exports.startWithChineseSerial)(item.text); });
    }
    exports.isAllChineseHeaders = isAllChineseHeaders;
    function isAllArabicSerialHeaders(headers) {
        if (headers === void 0) { headers = []; }
        return headers.every(function (item) { return (0, exports.startWithArabicSerial)(item.text); });
    }
    exports.isAllArabicSerialHeaders = isAllArabicSerialHeaders;
    function isAllValidArabicSerialHeaders(headers) {
        if (headers === void 0) { headers = []; }
        var serials = headers.map(function (item) { var _a, _b; return parseInt((_b = (_a = item.text) === null || _a === void 0 ? void 0 : _a.match(/^\d+/)) === null || _b === void 0 ? void 0 : _b[0], 10); });
        for (var i = 1; i < serials.length; i++) {
            if (serials[i] > serials[i - 1] + 3) {
                return false;
            }
        }
        return true;
    }
    exports.isAllValidArabicSerialHeaders = isAllValidArabicSerialHeaders;
    function fixHeadersSubfix(headers) {
        if (headers === void 0) { headers = []; }
        var fixTextSubfix = function (text) {
            if (text === void 0) { text = ''; }
            var subfixReg = /(,|，)$/;
            if (subfixReg.test(text)) {
                return text.slice(0, -1);
            }
            return text;
        };
        return headers.map(function (item) {
            var text = item.text;
            return __assign(__assign({}, item), { text: fixTextSubfix(text) });
        });
    }
    exports.fixHeadersSubfix = fixHeadersSubfix;
    
    
    /***/ }),
    /* 4 */
    /***/ (function(__unused_webpack_module, exports, __webpack_require__) {
    
    
    var __read = (this && this.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.isNextToEachOther = exports.hasBackgroundColorInSelfOrAncestors = exports.isNodeLeft = exports.compareFontSize = exports.isInlineElement = exports.isBlockElement = exports.isElementCentered = exports.isRectCentered = exports.isInlineBlockParentNode = exports.isNearestTextParentNode = exports.isAllTextBold = exports.isBoldText = exports.getFirstTextNodeStyles = exports.findNextTextElement = exports.isPreRawSerialNumber = exports.isValidNode = exports.isLikeMainContentStart = exports.isMiniParagraph = exports.getNodeText = void 0;
    var const_1 = __webpack_require__(3);
    var regexp_1 = __webpack_require__(5);
    var getNodeText = function (node) {
        var _a, _b;
        var txt = ((_b = (_a = node === null || node === void 0 ? void 0 : node.textContent) === null || _a === void 0 ? void 0 : _a.trim) === null || _b === void 0 ? void 0 : _b.call(_a)) || '';
        return txt.replace(/\u200D+/g, '');
    };
    exports.getNodeText = getNodeText;
    var hasValidWord = function (node) {
        return /[\u4e00-\u9fa5a-zA-Z0-9]+/.test((0, exports.getNodeText)(node));
    };
    var isMiniParagraph = function (node) {
        var _a;
        var textLength = ((_a = (0, exports.getNodeText)(node)) === null || _a === void 0 ? void 0 : _a.length) || 0;
        return ((isNearestTextParentNode(node) || isInlineBlockParentNode(node)) &&
            textLength < const_1.PARAGRAPH_TEXT_LENGTH_LIMIT);
    };
    exports.isMiniParagraph = isMiniParagraph;
    var isLikeMainContentStart = function (node) {
        return regexp_1.MAIN_CONTENT_START_REGS.some(function (reg) { return reg.test((0, exports.getNodeText)(node)); });
    };
    exports.isLikeMainContentStart = isLikeMainContentStart;
    var isValidNode = function (node, checkEndings) {
        var _a;
        if (checkEndings === void 0) { checkEndings = true; }
        var curText = (0, exports.getNodeText)(node);
        if ((_a = node === null || node === void 0 ? void 0 : node.querySelector) === null || _a === void 0 ? void 0 : _a.call(node, '.mp-video-player')) {
            checkEndings && console.log('【跳过】视频===>', node.classList);
            return false;
        }
        if (checkEndings && regexp_1.ENDING_REGS.some(function (endReg) { return endReg.test(curText); })) {
            console.log('【结束】命中正文结束===>', curText);
            throw new Error('正文已结束');
        }
        if (checkEndings &&
            regexp_1.ENDING_REGS_WITH_CONDITION.some(function (endReg) {
                var _a;
                return endReg.test(curText) &&
                    !endReg.test((_a = document.querySelector(const_1.CONTENT_SELECTOR_BASE)) === null || _a === void 0 ? void 0 : _a.innerText);
            })) {
            console.log('【结束】待条件命中正文结束===>', curText);
            throw new Error('正文已结束');
        }
        var reg = /[\u4e00-\u9fa5a-zA-Z0-9]+/;
        if (!curText || !reg.test(curText)) {
            checkEndings && console.log('【跳过】字符不满足要求控制===>', curText);
            return false;
        }
        if (!/[\u4e00-\u9fa50-9]/.test(curText) &&
            curText.length <= 3 &&
            !(0, const_1.shortEnglishTitleWhiteList)(curText)) {
            checkEndings && console.log('【跳过】仅仅英文加符号长度限制===>', curText);
            return false;
        }
        return true;
    };
    exports.isValidNode = isValidNode;
    function isPreRawSerialNumber(node) {
        var textContent = '';
        var isRawSerialNumber = function (txt) {
            if (txt === void 0) { txt = ''; }
            return /^\d+$/.test(txt) || (0, const_1.isChineseNumber)(txt);
        };
        while (node) {
            while (node.previousSibling) {
                node = node.previousSibling;
                textContent = (0, exports.getNodeText)(node);
                if (node.nodeType === Node.TEXT_NODE && textContent) {
                    return isRawSerialNumber(textContent);
                }
                while (node.lastChild) {
                    node = node.lastChild;
                    textContent = (0, exports.getNodeText)(node);
                    if (node.nodeType === Node.TEXT_NODE && textContent) {
                        return isRawSerialNumber(textContent);
                    }
                }
            }
            node = node.parentNode;
        }
        return false;
    }
    exports.isPreRawSerialNumber = isPreRawSerialNumber;
    function findNextTextElement(node) {
        var nextNodeBlackRegs = [/^[<]{1,}滑动查看下一张图片[>]{1,}$/];
        var isValidNextNode = function (node) {
            return (isBlockElement(node) &&
                isNearestTextParentNode(node) &&
                (0, exports.isValidNode)(node, false) &&
                !nextNodeBlackRegs.some(function (reg) { return reg.test((0, exports.getNodeText)(node)); }));
        };
        while (node) {
            while (node.nextSibling) {
                node = node.nextSibling;
                if (isValidNextNode(node)) {
                    return node;
                }
                while (node.firstChild) {
                    node = node.firstChild;
                    if (isValidNextNode(node)) {
                        return node;
                    }
                }
            }
            node = node.parentNode;
        }
        return null;
    }
    exports.findNextTextElement = findNextTextElement;
    function getFirstTextContainerNode(node) {
        function findFirstTextNode(node) {
            if (!node) {
                return null;
            }
            if (node.nodeType === Node.TEXT_NODE && hasValidWord(node)) {
                return node;
            }
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                var textNode = findFirstTextNode(childNode);
                if (textNode) {
                    return textNode;
                }
            }
            return null;
        }
        var firstTextNode = findFirstTextNode(node);
        if (!firstTextNode) {
            console.log('没有找到文本节点', node);
            return null;
        }
        return firstTextNode.parentElement;
    }
    function getFirstTextNodeStyles(node) {
        var parentElement = getFirstTextContainerNode(node);
        if (!parentElement)
            return null;
        var computedStyle = window.getComputedStyle(parentElement);
        return {
            fontSize: computedStyle.getPropertyValue('font-size'),
            fontWeight: computedStyle.getPropertyValue('font-weight'),
        };
    }
    exports.getFirstTextNodeStyles = getFirstTextNodeStyles;
    function isBoldText(node) {
        if (!node)
            return false;
        function isBold(computedStyle) {
            var fontWeight = computedStyle.getPropertyValue('font-weight');
            return fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
        }
        var parentElement = getFirstTextContainerNode(node);
        if (!parentElement) {
            console.log('没有找到非空的文本节点');
            return false;
        }
        var parentText = (0, exports.getNodeText)(parentElement);
        if (parentText.length < 3 &&
            !(0, const_1.isChineseNumber)(parentText) &&
            !(0, const_1.twoChineseAtLeast)(parentText)) {
            console.log('无效节点', parentElement);
            return false;
        }
        var computedStyle = window.getComputedStyle(parentElement);
        return isBold(computedStyle);
    }
    exports.isBoldText = isBoldText;
    function isAllTextBold(node) {
        function isBold(element) {
            var fontWeight = window
                .getComputedStyle(element)
                .getPropertyValue('font-weight');
            return fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600;
        }
        if (!node)
            return true;
        if (node.nodeType === Node.TEXT_NODE && hasValidWord(node)) {
            if (!isBold(node.parentNode)) {
                return false;
            }
        }
        for (var i = 0; i < node.childNodes.length; i++) {
            if (!isAllTextBold(node.childNodes[i])) {
                return false;
            }
        }
        return true;
    }
    exports.isAllTextBold = isAllTextBold;
    function isNearestTextParentNode(element) {
        var _a;
        if (!(element === null || element === void 0 ? void 0 : element.childNodes))
            return false;
        var childNodes = __spreadArray([], __read(element.childNodes), false);
        var isInlineElementTags = (element.tagName === 'SPAN' || element.tagName === 'STRONG') &&
            !childNodes.every(function (subNode) { return ['SECTION', 'P'].includes(subNode.tagName); });
        var isChildrenContainTextNode = childNodes.some(function (subNode) { return (subNode === null || subNode === void 0 ? void 0 : subNode.nodeType) === 3 && !!(0, exports.getNodeText)(subNode); });
        var isAllChildrenInline = childNodes.every(function (subNode) {
            return (subNode === null || subNode === void 0 ? void 0 : subNode.nodeType) === 3 ||
                isInlineElement(subNode) ||
                isNoneElement(subNode);
        });
        var isSpanContainBlockNode = function () {
            if (childNodes.length !== 1)
                return false;
            if (childNodes[0].tagName !== 'SPAN')
                return false;
            var subChild = childNodes[0];
            if (!(subChild === null || subChild === void 0 ? void 0 : subChild.childNodes))
                return false;
            var subSubChildNodes = __spreadArray([], __read(subChild.childNodes), false);
            if (subSubChildNodes.every(function (subNode) {
                return ['SECTION', 'P'].includes(subNode.tagName);
            })) {
                return true;
            }
            return false;
        };
        var isBrNodeValid = ((_a = childNodes.filter(function (item) { return item.tagName === 'BR'; })) === null || _a === void 0 ? void 0 : _a.length) < 2;
        return (isInlineElementTags ||
            isChildrenContainTextNode ||
            (isAllChildrenInline && isBrNodeValid && !isSpanContainBlockNode()));
    }
    exports.isNearestTextParentNode = isNearestTextParentNode;
    function isInlineBlockParentNode(element) {
        if (!(element === null || element === void 0 ? void 0 : element.childNodes))
            return false;
        if (!isInlineBlockElement(element))
            return false;
        var childNodes = __spreadArray([], __read(element.childNodes), false);
        return childNodes.every(function (subNode) {
            return isInlineBlockElement(subNode) ||
                isInlineElement(subNode) ||
                isNoneElement(subNode);
        });
    }
    exports.isInlineBlockParentNode = isInlineBlockParentNode;
    function isRectCentered(node, limit) {
        if (limit === void 0) { limit = 0; }
        var parentNodeRect = document
            .querySelector(const_1.CONTENT_SELECTOR_BASE)
            .getBoundingClientRect();
        var nodeRect = node.getBoundingClientRect();
        var leftMargin = nodeRect.left - parentNodeRect.left;
        var rightMargin = parentNodeRect.right - nodeRect.right;
        var errorMargin = 30;
        return (Math.abs(leftMargin - rightMargin) <= errorMargin &&
            Math.abs(leftMargin) >= limit);
    }
    exports.isRectCentered = isRectCentered;
    function getEffectiveTextAlign(element) {
        var rootNode = document.querySelector(const_1.CONTENT_SELECTOR_BASE);
        while (element !== rootNode) {
            var style = window.getComputedStyle(element);
            var textAlign = style.getPropertyValue('text-align');
            if (textAlign && textAlign !== 'inherit' && textAlign !== 'justify') {
                if (textAlign === 'start')
                    return 'left';
                if (textAlign === '-webkit-center')
                    return 'center';
                return textAlign;
            }
            var justifyContent = style.getPropertyValue('justify-content');
            var justifyMap = { center: 'center', 'flex-start': 'left' };
            if (justifyMap[justifyContent]) {
                return justifyMap[justifyContent];
            }
            element = element.parentElement;
        }
        return 'justify';
    }
    function isElementCentered(element) {
        try {
            if (!element)
                return false;
            if (getEffectiveTextAlign(element) === 'center')
                return true;
            var textNode = getFirstTextContainerNode(element);
            if (!textNode)
                return false;
            var textAlign = getEffectiveTextAlign(textNode);
            if (textAlign === 'center')
                return true;
            if (isInlineElement(textNode))
                return false;
            var isTextJustified = textAlign === 'justify';
            if (isTextJustified &&
                isRectCentered(textNode, 60) &&
                isRectCentered(element, 40)) {
                return true;
            }
            return false;
        }
        catch (e) {
            return false;
        }
    }
    exports.isElementCentered = isElementCentered;
    function isBlockElement(element) {
        var _a;
        var result = false;
        try {
            var display = ((_a = window.getComputedStyle(element)) === null || _a === void 0 ? void 0 : _a.display) || '';
            result =
                display.includes('block') || display === 'table' || display === 'flex';
        }
        catch (e) { }
        return result;
    }
    exports.isBlockElement = isBlockElement;
    function isInlineElement(element) {
        var _a;
        var result = false;
        try {
            var tagName = element === null || element === void 0 ? void 0 : element.tagName;
            result =
                tagName === 'SPAN' ||
                    tagName === 'STRONG' ||
                    (((_a = window.getComputedStyle(element)) === null || _a === void 0 ? void 0 : _a.display) === 'inline' &&
                        tagName !== 'SECTION');
        }
        catch (e) { }
        return result;
    }
    exports.isInlineElement = isInlineElement;
    var isInlineBlockElement = function (element) { var _a; return ((_a = element === null || element === void 0 ? void 0 : element.style) === null || _a === void 0 ? void 0 : _a.display) === 'inline-block'; };
    var isNoneElement = function (element) { var _a; return ((_a = element === null || element === void 0 ? void 0 : element.style) === null || _a === void 0 ? void 0 : _a.display) === 'none'; };
    var getAllFontSize = function (current, prev, next) {
        var _a = (getFirstTextNodeStyles(current) || {}).fontSize, fontSize = _a === void 0 ? '0' : _a;
        var prevFontSize = prev ? getFirstTextNodeStyles(prev).fontSize : '0';
        var nextFontSize = next ? getFirstTextNodeStyles(next).fontSize : '0';
        console.log('字号[前序，当前，后续]', prevFontSize, fontSize, nextFontSize);
        return {
            fontSize: parseFloat(fontSize),
            prevFontSize: parseFloat(prevFontSize),
            nextFontSize: parseFloat(nextFontSize),
        };
    };
    function compareFontSize(current, prev, next) {
        var _a = getAllFontSize(current, prev, next), fontSize = _a.fontSize, prevFontSize = _a.prevFontSize, nextFontSize = _a.nextFontSize;
        return {
            isBiggest: fontSize > prevFontSize && fontSize > nextFontSize,
            isSmallest: fontSize < prevFontSize && fontSize < nextFontSize,
            fontSize: fontSize,
            prevFontSize: prevFontSize,
            nextFontSize: nextFontSize,
        };
    }
    exports.compareFontSize = compareFontSize;
    function isNodeLeft(current) {
        var alignResult = getEffectiveTextAlign(current);
        if (alignResult === 'left')
            return true;
        if (alignResult === 'justify') {
            var elementRect = current.getBoundingClientRect();
            var parentRect = document
                .querySelector(const_1.CONTENT_SELECTOR_BASE)
                .getBoundingClientRect();
            return elementRect.left - parentRect.left < 36;
        }
        return false;
    }
    exports.isNodeLeft = isNodeLeft;
    function hasBackgroundColorInSelfOrAncestors(node, levels) {
        var _a;
        if (levels === void 0) { levels = 4; }
        function isBackgroundColorSet(computedStyle) {
            var backgroundColor = computedStyle.getPropertyValue('background-color');
            var backgroundColorFilters = [
                'rgb(253, 253, 254)',
                'rgba(0, 0, 0, 0)',
                'rgba(1, 0, 0, 0)',
                'rgb(255, 255, 255)',
                'rgb(254, 254, 254)',
                'rgba(255, 255, 255, 0)',
                'rgb(247, 247, 247)',
                'rgb(247, 247, 248)',
                'rgb(239, 239, 239)',
            ];
            return (backgroundColor !== 'transparent' &&
                !backgroundColorFilters.includes(backgroundColor));
        }
        function isBackgroundImageSet(computedStyle) {
            var backgroundImage = computedStyle.getPropertyValue('background-image');
            return backgroundImage && backgroundImage !== 'none';
        }
        function isTextShadowSet(computedStyle) {
            var textShadow = computedStyle.getPropertyValue('text-shadow');
            return textShadow && textShadow !== 'none';
        }
        function hasExplicitBorder(computedStyle) {
            var curText = (0, exports.getNodeText)(node);
            if ((0, const_1.isLeftSentence)(curText) && (0, const_1.countChineseCharsAndDigits)(curText) > 10)
                return false;
            var borderStyles = [
                'borderTopStyle',
                'borderRightStyle',
                'borderBottomStyle',
                'borderLeftStyle',
            ];
            var borderWidths = [
                'borderTopWidth',
                'borderRightWidth',
                'borderBottomWidth',
                'borderLeftWidth',
            ];
            var explicitStyles = borderStyles.some(function (style) { return computedStyle[style] !== 'none'; });
            if (explicitStyles) {
                return true;
            }
            var explicitWidths = borderWidths.some(function (width) {
                var value = parseFloat(computedStyle[width]);
                return !isNaN(value) && value > 0;
            });
            return explicitWidths;
        }
        function isHeightLimited(computedStyle, element) {
            var height = computedStyle.getPropertyValue('height');
            var actualHeight = height === 'auto' ? element.offsetHeight : height;
            return parseFloat(actualHeight) < 120;
        }
        var currentNode = node;
        var currentLevel = 0;
        var hasBackground = function (computedStyle, element) {
            return (isBackgroundColorSet(computedStyle) ||
                isBackgroundImageSet(computedStyle) ||
                hasExplicitBorder(computedStyle) ||
                isTextShadowSet(computedStyle)) &&
                isHeightLimited(computedStyle, element);
        };
        while (currentNode &&
            currentNode.nodeType === Node.ELEMENT_NODE &&
            currentLevel <= levels) {
            var computedStyle = window.getComputedStyle(currentNode);
            if (hasBackground(computedStyle, currentNode)) {
                return true;
            }
            currentNode = currentNode.parentElement;
            currentLevel++;
        }
        var subCurrentNode = node;
        var subCurrentLevel = 0;
        while (subCurrentNode &&
            subCurrentNode.nodeType === Node.ELEMENT_NODE &&
            ((_a = subCurrentNode.childNodes) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
            subCurrentLevel <= levels) {
            subCurrentNode = __spreadArray([], __read(subCurrentNode.childNodes), false).find(function (item) { return item.nodeType === Node.ELEMENT_NODE && (0, exports.getNodeText)(item); });
            if (!subCurrentNode)
                return false;
            var computedStyle = window.getComputedStyle(subCurrentNode);
            if (hasBackground(computedStyle, subCurrentNode)) {
                return true;
            }
            subCurrentLevel++;
        }
        return false;
    }
    exports.hasBackgroundColorInSelfOrAncestors = hasBackgroundColorInSelfOrAncestors;
    function isNextToEachOther(prevNode, nextNode) {
        var _a, _b;
        if (!prevNode || !nextNode)
            return false;
        var prevRect = (_a = prevNode === null || prevNode === void 0 ? void 0 : prevNode.getBoundingClientRect) === null || _a === void 0 ? void 0 : _a.call(prevNode);
        var nextRect = (_b = nextNode === null || nextNode === void 0 ? void 0 : nextNode.getBoundingClientRect) === null || _b === void 0 ? void 0 : _b.call(nextNode);
        var fontSize = window
            .getComputedStyle(prevNode)
            .getPropertyValue('font-size');
        var lineHeight = parseFloat(fontSize) * 1.5;
        var distance = Math.abs(nextRect.y - prevRect.y - prevNode.offsetHeight / 2);
        var isNext = distance < lineHeight * 3;
        console.log("\u4E24\u8282\u70B9".concat(isNext ? '相邻' : '不相邻'), distance, lineHeight);
        return isNext;
    }
    exports.isNextToEachOther = isNextToEachOther;
    
    
    /***/ }),
    /* 5 */
    /***/ ((__unused_webpack_module, exports) => {
    
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.ENDING_REGS = exports.ENDING_REGS_WITH_CONDITION = exports.BLACK_LIST_REGS = exports.MAIN_CONTENT_START_REGS = exports.BLACKLIST_ALL_REGS = void 0;
    exports.BLACKLIST_ALL_REGS = [
        /^用\sAI连接一切$/,
        /^\s*重\s*要\s*通\s*知\s*$/,
        /^\s*龙\s*行\s*大\s*吉\s*$/,
        /^\s*龙\s*年\s*大\s*吉\s*$/,
        /^\s*喜\s*迎\s*新\s*春\s*$/,
        /^★\s*龙\s*行\s*大\s*运\s*★$/,
        /^\s*生\s*活\s*不\s*便\s*$/,
        /^\s*美\s*好\s*生\s*活\s*$/,
        /^\s*新\s*春\s*快\s*乐\s*$/,
        /^\s*摄\s*影\s*指\s*导\s*$/,
        /^\s*长\s*按\s*关\s*注\s*$/,
        /^\s*2\s*0\s*2\s*3\s*$/,
        /^\s*2\s*0\s*2\s*4\s*$/,
        /^\s*2\s*0\s*2\s*5\s*$/,
        /^\s*读\s*READBOOK\s*书$/,
        /^\s*编\s*者\s*按\s*$/,
        /^\s*往\s*期\s*回\s*顾\s*$/,
        /^\s*霖\s*泰\s*建\s*设\s*$/,
        /^精彩视频\s*点击观看$/,
        /^更多精彩\s*点击关注$/,
        /^注意\s*微信最新.*版没有.*星标.*会收不到.*推送/,
        /^温馨提示：.*公众号推送机制改.*将.*设为.*星标.*最新动态(~)?$/,
        /^(\d+)?温馨提示：由于微信.*改版.*设置.*星标或者.*一键三连.*就能及时.*我们推送的.*干货啦！$/,
        /^点击.*点击右上角.*(点选|选择).*设为星标.*(及时查看更多文章|就更.*啦！|就容易.*啦！|就可以.*啦！|就能.*啦！)$/,
        /点击右上角.*选择“设为星标”(即可)?。$/,
        /^错过文章和专属福利.*点击链接.*点击右上角.*设为星标.*与你常相伴~$/,
        /^莫莫老师在此祝大家新年快乐.*新的一年，继续为大家的健康保驾护航！$/,
        /^关注.*收藏不迷路$/,
        /^\s*\d+\s*月\s*\d+\s*日\s*$/,
        /^点击\s*(上方)?蓝字\s*关注我们[~]{0,}\s*$/,
        /^(左)?(右)?滑动\s*预览更多$/,
        /^骗子在加你微信后\s*一般会进行下面几种操作/,
        /^推荐阅读：$/,
        /^语音播报$/,
        /^第一步.*第二步.*总社培训.*第八步$/,
        /^序\s*言.*引向坦途通。$/,
        /^\-\d+\/\d+\/\d+\-.*\-\s*泰达.*课堂\s*\-/,
        /^\s*0\s*0\s*中药学.*END\s*$/,
        /^酒\s*讯\s*ID.*酒圈大小事儿$/,
        /^\d+\s*仙客来\s*\d+\s*碧光环\s*\d+\s*兔尾草$/,
        /^投稿邮箱：\d+\@qq\.com$/,
        /^这些溺水认识误区要避开：$/,
        /^固定布局\s*工具条上设置固定宽高，\s*背景可以设置被包含，\s*可以完美对齐背景图和文字，\s*以及用于模板制作，\s*默认宽高比是.*，适合.*制作。$/,
        /^夏天到了\s*正是.*通关全流程吧\s*↓↓↓$/,
        /^长按识别\s*二维码\s*登记报名$/,
        /^yuan\s*元\s*xiao\s*宵\s*jie\s*节\s*xi\s*习\s*su\s*俗$/,
        /^来源\s*\|\s*公众号“中国新闻网”综合自.*第一财经、广州日报等$/,
        /^太湖生态岛\s*苏州太湖西山岛$/,
        /^扫码\s*关注我们\s*获得\s*更多精彩$/,
        /^觉得内容不错，\s*点个\s*分享给更多人！$/,
        /^点击下方微信公众号名片\s*.*关注.*第一时间.*了解最新.*消息(↓){0,}$/,
        /^长\s*按\s*二\s*维\s*码\s*关\s*注.*微信$/,
        /^同款.*http.*复制打开(手机)?淘宝$/,
        /^全城招聘\s*JOIN\sUS\sNOW.*与你一同去实现你我他最初的梦想。$/,
        /^二\s*十\s*([一二三四五六七八九十]\s*)?大$/,
        /^春日出游.*我们一起去春游吧$/,
        /^JOIN\s*US$/,
        /^兔年贺岁\s*岁月在流淌.*共同演绎灿烂而又辉煌的明天!$/,
        /^\d+\s*\d+\s*\d+\s*，一起来读书！$/,
        /^\d+家参展商\s*\d+\+同业\s*自由洽谈$/,
        /^乐山教育\s*乐山市教育局官方微信$/,
        /^新时代\s*党的教育方针\s*教育必须为社会主义.*社会实践相结合，培养.*社会主义建设者和接班人。$/,
        /^关注1：英伟达下一财年收入能否翻番？.*现在又推出了新的现在又推出了更强的芯片，这些会如何影响公司的订单和业绩，需要管理层给市场一个答案。$/,
        /^国保GUO\s*BAOXUN\s*LI巡礼$/,
        /^厚德精医\s*博学笃行\s*关爱生命\s*呵护健康$/,
        /^筑百年建筑·创国际标准\s*获取更多购房信息资讯\s*欢迎关注(👇){1,}$/,
        /^点点赞\s*点在看$/,
        /^NATION$/,
        /^TANIKAWA$/,
        /^来源：\s*永春县河长公众号$/,
        /^更多精彩，请点击上方蓝字关注我们！$/,
        /^了解更多信息\s*请点击下方进入👇$/,
        /^分享\s*收藏\s*在看\s*点赞$/,
        /^医疗机构组织管理\s*\d$/,
        /^SAIXIANSHENG$/,
        /^anlifenxi$/,
        /^SPRING$/,
        /^下期请关注\s*“杭州中心\·H23”$/,
        /^关注\s*三峡商报视频号$/,
        /^关注市场动态\s*提供便捷服务\s*发布权威信息\s*展示监管成果\s*点击".*"可以关注我们$/,
        /^提要\s*\d+月\d+日，《.*》.*发展动能》。现全文转载。$/,
        /^推普\/文明$/,
        /^喜欢就点赞\s*但爱是转发$/,
        /^网易文创浪潮工作室招聘.*招聘实习生和线上作者$/,
        /^关于梦的其他小秘密：$/,
    ];
    exports.MAIN_CONTENT_START_REGS = [/全文.*字.*阅读.*(需|约)/];
    exports.BLACK_LIST_REGS = [
        /^(作者|服务热线|供\s*稿|编\s*辑|(总)?审\s*核|记\s*者|监\s*制|来\s*源|总\s*监|校\s*对|监\s*审|撰稿\/编辑|校\s*验|审签|审\s*校|排版|复审|记者|统筹|编审|微编|投稿邮箱|邮箱|视频|采写|美编|主编|主管单位|主办单位|地址|封面图|签发|友情提醒|值班编委|爆料|微信ID|出团日期|出团价格|主办|承办|稿件来源|版面编辑|受访者|认领地点|联系人|全国(免费|招商)咨询|同名微博|公司地址|作\s*者|朗\s*诵|融媒体记者|融媒体编辑|(.*)新闻记者|文图|审发|投稿方式|征订热线|编译|我们的官网|总监制|投稿QQ|策划|关注|内容合作|商务合作|出品|文字|图片|编\s*辑|校\s*稿|主\s*编|图文编辑|供图|终\s*审|Twitter|题图来源)\s*[\||丨|：|:|｜|\/|∣|／]\s*/,
        /^(作者|统筹|监制|邮发代号)\s+/,
        /^█\s*(来源|编辑|校对|审核)：/,
        /^(关于)?作者：$/,
        /^(视觉)?设计\s*[\||丨|：|:]\s*/,
        /^(初|复|终)\s*审\s*[\||丨|：|:]\s*/,
        /^责(任)?\s*编(辑)?\s*[\||丨|：|:]\s*/,
        /^文\s*[\||丨|：|:]\s*/,
        /^文\/.*专栏作者/,
        /^撰(写)?\s*[\||丨|：|:]\s*/,
        /^全国(免费|招商)咨询$/,
        /^-(作者|主播)-$/,
        /点击这里，/,
        /立即购买/,
        /点击购买/,
        /购买\s*点(击)?这里/,
        /写于(.)+现在重发一次/,
        /^点击名片$/,
        /^观看更多$/,
        /点击?(.)+关注/,
        /点(.)+关注我/,
        /^加关注(，|\s*)?不迷路/,
        /^关注我们(，|\s*)?(了解更多|给生活一点颜色)/,
        /^镇赉在线$/,
        /关注我们，每天获取.*信息$/,
        /^关注我.*每天都有/,
        /^关注我，.*为你分享/,
        /^查询通道$/,
        /关注我.*给个关注/,
        /点击?阅读完整/,
        /(扫码)?加(微信|好友)/,
        /点击?“?阅读原文”?/,
        /点击?.*查看/,
        /^(【提示】：)?点击上方.*(字|订阅最新消息)/,
        /^点击上方.*(免费|可以).*订阅/,
        /^（.*）$/,
        /未经.*(授权|许可|允许).*(转载|搬运)/,
        /^参考链接(：)?$/,
        /^读者福利$/,
        /这篇文章对[你|您]有帮助(.)*分享/,
        /扫描(下方|上方的)?二维码/,
        /^每日福利大放送(~)?/,
        /^订阅号：/,
        /^图(\d)+[:|：]?$/,
        /^图\d(\.|. )/,
        /^图表(\d)+：/,
        /^图表：/,
        /^图.*的表征$/,
        /^(图片|文章)来源：/,
        /(资料|效果)图(）)?$/,
        /^(附)?表(\d+|[一二三四五六七八九十])?[:|：]/,
        /^(附|注)[:|：]/,
        /^资料来源：/,
        /^[一二三四五六七八九十]\s*审[:|：]/,
        /加微信：/,
        /^微信(号)?(:|：)/,
        /长按.*二维码/,
        /长按.*扫码.*加好友/,
        /点亮“在看”/,
        /^近期热门(视频)?$/,
        /^更多.*?(新闻|内容|视频|文章|资讯|推荐)$/,
        /^更多.*?(新闻|内容|视频|文章|精彩|资讯).*(下载|推荐)/,
        /^热点文章$/,
        /星标.*“.*”/,
        /星标.*不错过/,
        /把.*设为星标/,
        /点击.*右上角.*设为星标/,
        /^(把)?公众号设(置)?(为)?星标/,
        /不星标.*就错过推送/,
        /点击.*即可.*[购|买]/,
        /喜欢.*点个在看/,
        /点个赞(和在看)?(吧)?$/,
        /^【?温馨提示(:|：|~|】)?$/,
        /。End$/i,
        /(求留言|求反馈)([~|.|。|！|!])?$/,
        /请点这里/,
        /了解《.*》.*三观/,
        /查看.*主页.*获取更多/,
        /参考(资料|消息|文献)/,
        /以下为本文目录/,
        /延伸阅读/,
        /内容有删(减|改)/,
        /点击(.)+关注/,
        /点(.)+关注我/,
        /更多.*推荐.*关注我/,
        /投稿采编平台/,
        /好物推荐(：|:)/,
        /点击下方了解更多/,
        /^进群加V(：|:)/i,
        /^欢迎加入我们.*VX(：|:)/i,
        /^扫码加入我们$/,
        /^扫码咨询更多合集事宜$/,
        /关注.*(微信|公众|视频)号/,
        /^关注$/,
        /在线.*咨询(微信|wx|v)/i,
        /二维码.*加.*(微信|wx|v)/i,
        /【联系电话】/,
        /^投稿请发送/,
        /咨询(时间|电话)(:|：)/,
        /转载请注明/,
        /^本文来自公众号/,
        /授权转载作品$/,
        /经授权转载$/,
        /^首发于微信公众号：/,
        /^如需转载，请联系原作者/,
        /点击下(方)?图(片)?，/,
        /点击即可预约/,
        /^相关链接\s*(>)?(>)?(>)?$/,
        /QQ\s*(\d)+$/i,
        /^http(s)?.*(taobao\.com|tb\.cn)/,
        /（微信同号）/,
        /(电话)?(\d){10}/,
        /电话(:|：)(\d){4}-(\d){7}/,
        /^大家还在看$/,
        /版权归.*所有/,
        /^欢迎转发$/,
        /^欢迎订阅/,
        /一键三连.*点赞/,
        /欢迎“点赞”“打赏”“在看”三连/,
        /^(↑)+关注/,
        /^有彩蛋(！+|!|。+)$/,
        /欢\s*迎\s*分\s*享\s*到\s*朋\s*友\s*圈/,
        /欢迎找我探讨学习！/,
        /^(猜你|你可能)喜欢$/,
        /^比如$/,
        /^又如$/,
        /^观看完整视频$/,
        /^大家都在看$/,
        /^转发.*扩散.*周知/,
        /^转发给(身边的)?朋友/,
        /如果喜欢本文章.*请转发收藏/,
        /^梧州发布$/,
        /^点击图片.*放大.*观看/,
        /^\*本文为「.*」原创内容/,
        /^欢迎关注B站：/,
        /^欢迎关注“.*”(！)$/,
        /^欢迎关注(👇){1,}$/,
        /^.*>>$/,
        /^(重要提醒|扩散转发)(！|!)$/,
        /^像\s*话\s*吗！$/,
        /^.*微信工作室发布$/,
        /^\d+年\d+月\d+日\s*(星期[一二三四五六日])?(上午|下午)?(\d+时)?\s*(至)?\s*(\d+年)?(\d+月)?(\d+日)?(\d+时)?(（农历.*）)?$/,
        /^\—{1,}\d{4}\-{1,}\d{4}\—{1,}$/,
        /^本周周[一二三四五六日]（\d+月\d+日）$/,
        /^\—\—\s*以下内容为商城广告\s*\—\—$/,
        /^丨“/,
        /^现仅\d+，仅剩\d+个名额$/,
        /^(\*)?图片仅供参考/,
        /^酷玩实验室(视频号|作品)$/,
        /^首发于微信号/,
        /点击下图购买$/,
        /^点击(下|上)方小程序(可)?购买/,
        /^凡是搞.*都关注这个号了$/,
        /大促活动.*买到就(是)?赚到$/,
        /现在下单.*每人立减.*元(！)?$/,
        /^优惠价格：.*[\d\.]+\/\s*人/,
        /^梦幻雪国列车$/,
        /词牌名叫.*词的内容是这样写的：$/,
        /^消费者选购黄金产品$/,
        /^\(\d+年\d+月\d+日.*\)$/,
        /^36氪旗下双碳公众号$/,
        /^网友评论：$/,
        /^\/文末.*福利.*进行时\/$/,
        /^最.*团队.*新书.*重磅上市$/,
        /^探讨.*今日\d+(\.\d+)?折.*欢迎入手$/,
        /^相关链接：$/,
        /^限时抢\d+(\.\d+)?元\//,
        /^\d(月|日|号)$/,
        /^点击在线投递简历$/,
        /请关注我们▼$/,
        /^抢购价(:|：)\s*¥\s*(\d|\.)+(\s*-\s*(\d|\.)+)?$/,
        /^每天.*更新，客服微信\d+$/,
        /请直接将信息发送给本公众号(即可)?(。)?$/,
        /^更多.*信息请.*下方二维码查阅$/,
        /微信扫一扫下方/,
        /^更多热文$/,
        /^相关链接：/,
        /^\%\s*[A-Za-z0-9\/]+\s*\%$/,
        /^\+关注，立马/,
        /^《.*》视频号$/,
        /节特价课程$/,
        /报名二维码$/,
        /^(求|球)(分享|点赞|在看)(↓)?\s*$/,
        /^如果您觉得.*值得肯定，.*请.*在接到.*电话.*随机调查.*公正的评价.*谢谢(！)?$/,
        /^如果.*喜欢，分享给小伙伴们/,
        /^相关专题链接$/,
        /^商家推荐$/,
        /^点击下方名片，看更多/,
        /^(请)?点击关注(！)?$/,
        /以(上|下)内容非正文/,
        /^今日推荐↓$/,
        /^扫码报名，\d+元听课$/,
        /^图片来源于网络$/,
        /^点击边框调出视频工具条$/,
        /^活动费用：\d+元\/人$/,
        /^演出(时间|地点|名称)：/,
        /^2020$/,
        /^图文$/,
        /^官方唯一指定入口$/,
        /^Innovent$/,
        /^PREFACE$/,
        /^RECOMMENDATION$/,
        /^RUN\s*TO\s*BEAUTY$/,
        /^SLIDE$/,
        /^深受读者喜爱的.*公众号$/,
        /^扫码了解.*/,
        /觉得不错，请点亮在看并留言(↓){0,}$/,
        /^转载至/,
        /^关注我.*更多信息$/,
        /^·\s投稿方式\s·$/,
        /^向左滑动查看解析$/,
        /^(左)?(右)?滑动浏览海报$/,
        /^版权声明$/,
        /不喜勿入.*若有冒犯.*非我所愿.*提前道歉/,
        /^相关事宜可咨询.*客服中心：/,
        /^信息连读$/,
        /^欢迎添加.*，拉你进.*群！$/,
        /^划重点$/,
        /^格尔木市政务$/,
        /^自治区党委常委会召开会议$/,
        /^请注意！$/,
        /^请注意，前方不是演习！！！$/,
        /^315$/,
        /^狮城中学$/,
        /^小链接$/,
        /报备二维码$/,
        /^觉得这篇文章(肿|怎)么样/,
        /^欢迎点击下方发表评论/,
        /^这些(精彩)?(内容|文章|视频)不(要|容)错过[！]{0,}$/,
        /^静安教育$/,
        /^免试入学快速预约通道$/,
        /^办高质量发展的教育\s*办好人民满意的教育$/,
        /^人人都是疫情防控第一责任人，$/,
        /^科学防疫，从我做起！$/,
        /^(-){0,}\s*赶紧抢购\s*(-){0,}$/,
        /^下单前请看购买详情页$/,
        /超低价格，买到就是划算到/,
        /^点击这里可以/,
        /^“校服”$/,
        /^“警服”$/,
        /^本文来源：/,
        /^做法：$/,
        /重(量)?：\d+(\.\d+)?(g|克).*北京保利\d+元/,
        /^咸丰宝源局当.*(母钱|样钱)$/,
        /^每周好书$/,
        /^法\s*官\s*提\s*醒$/,
        /^比赛时间：\d+:\d+\-\d+:\d+$/,
        /^关于我们$/,
        /^导读$/,
        /^文明祭扫，注意防火！$/,
        /^中鹏新能$/,
        /^黑橘科技$/,
        /^免去：$/,
        /^等你来pick/i,
        /点击(.+)阅读原文/,
        /^本文来源：/,
        /^YiYa提示$/,
        /^资源编号👉【/,
        /^下面(，)?来和小.+具体了解下吧$/,
        /^更多精彩(请)?关注/,
        /^(下方)?查看历史文章/,
        /^请转发扩散/,
        /相互告知(~)?$/,
        /^真心希望大家$/,
        /^健康快乐，安全度夏~$/,
        /^九万里风鹏正举$/,
        /^石门学子正扬帆$/,
        /^版权及免责声明$/,
        /^点击图片即可阅读全文/,
        /这些活动爱了(…){2,}$/,
        /^如有意向(者)?请与.*联系$/,
        /^往期文章推荐$/,
        /觉得好看点这里/,
        /^news$/,
        /^微信号｜/,
        /这些文章大家都在看/,
        /^(云上白玉|官方抖音|官方微博)$/,
        /^还有这些信息值得关注:/,
        /^投稿须知$/,
        /^复制发送到微信打开：/,
        /^YUNJIANTINGYU$/,
        /^ZHIXUANTANG\s*智选堂$/,
        /^扫码订阅《.*》$/,
        /^渤船集团$/,
        /^分享是一种美德.*快把快乐分享给您的伙伴们吧$/,
        /^点击右上角.*发送给朋友.*分享到朋友圈/,
        /^扫码查看相关.*文件$/,
        /^关注.*情系微平台$/,
        /^复制.*口令.*到.*购买$/,
        /^欢迎有意.*入群$/,
        /^赞$/,
        /^(👉)?(点击图片放大|扫码添加辅导员|扫码查看公告)(👈)?$/,
        /(扫码立即|立即扫码|扫码)(立即)?(领取|参与).*(资料|福利|课程|优惠|免费)/,
        /^欢迎关注$/,
        /^更多.*发布.*信息.*把资料发送到邮箱.*\@.*\.com$/,
        /^\d+道题，测出你.*心理智商，测出你的.*率！/,
        /^扫码即测↓{3,}$/,
        /^\d+年CPA每日学习任务表$/,
        /^这里是.*官方(公众|公众号)?微信$/,
        /^受篇幅限制，这里仅展示部分$/,
        /^👇华策影视岗位信息整理好了👇$/,
        /^扫码回复：/,
        /^早签约、早腾退、早选房、早受益$/,
        /^已有\d+人参与测试$/,
        /^六科学霸or勉强一科？$/,
        /^POS圈事$/,
        /^和谐吉强$/,
        /^正在直播！$/,
        /^蓝字法条均可以点击打开！$/,
        /^文尾扫码获取WORD电子档$/,
        /^上岸喜报$/,
        /^关注平安西华\s*就是关注平安$/,
        /^为用心用情的老师们点赞！$/,
        /^一起来看看(↓){1,}$/,
        /^于都教科体$/,
        /^有书君精选$/,
        /^奋进达川$/,
        /^驾驶时拨打接听手持电话的违法行为。$/,
        /^打开.*扫码关注“.*”官方.*~$/,
        /^本期上榜！$/,
        /^文章内容来源于公众号：/,
        /^魔法AI官方网站：\s*http/,
        /^往期推荐$/,
        /^热点回顾$/,
        /^关注回复$/,
        /^原创声明$/,
        /^欢迎.*朋友扫码进群交流$/,
        /^参与性\s*观赏性\s*娱乐性$/,
        /^小编(诚)?邀(您|你)点击【在看】$/,
        /^【粉丝福利】$/,
        /^再次祝大家.*!$/,
        /^扫码加入高质量交流群$/,
        /^红包、福利、干货，精彩不停$/,
        /^◎.*科技日报记者/,
        /^电动车公社整理编辑$/,
        /发自\s*凹非寺.*公众号/,
        /每天文后都会有彩蛋哟，不要错过哈！/,
    ];
    exports.ENDING_REGS_WITH_CONDITION = [/^推\s*荐\s*阅\s*读\s*([:|：])?/];
    exports.ENDING_REGS = [
        /本文内容来自授权转载/,
        /本文不代表.*观点，转载.*授权/,
        /^OVER$/,
        /^（完）$/,
        /^\s*[—\-－~•\·\<\[\/]{0,12}(\s*【\s*)?(\s*THE)?\s*(END|完|华丽的分割线)(\s*】\s*)?\s*[—\-－~•\·\>\]\/]{0,12}\s*$/i,
        /^(-\s*){2,}\s*END\s*(-\s*){2,}$/i,
        /错过我们的更新/,
        /^扫$/,
        /^点(击)?分享$/,
        /^交流群（.+）$/,
        /^往期(优质文章)?推荐\s*.?$/,
        /^往期(热文|\s*·\s*)推荐$/,
        /^往期推荐\s*(●){1,}$/,
        /^往期好文(推荐)?$/,
        /^\·\s*往期文章推荐\s*\·$/,
        /转载须.*显著位置/,
        /(报|社)版权所有$/,
        /这里是尾巴(~)?$/,
        /注明.*来源.*违者必究/,
        /留言有礼/,
        /^欢迎留言$/,
        /点在看/,
        /^点个赞和在看给小编/,
        /^出品$/,
        /^责任编辑：/,
        /^来源：.+(公众号|办公室|研究所)$/,
        /转自.*致谢/,
        /往期(精彩)?(路线)?(内容)?回顾/,
        /^精彩回顾$/,
        /^近期文章精选：$/,
        /^猜你喜欢\s*｜\s*往期精选/,
        /^往(期|日)精选$/,
        /^相关链接$/,
        /^（文章来源：.*）$/,
        /^(●)?(\/\/)?\s*往期精彩\s*(\/\/)?(●)?(文章|推荐|内容|视频)?(：)?$/,
        /^原文链接([:|：])?$/,
        /^相关阅读([:|：])?$/,
        /^参考资料([:|：])?$/,
        /^[往|近]期文章([:|：])?$/,
        /我们下次再见~拜拜~/,
        /\*以上内容含广告/,
        /谢谢.*看完.*文.*点.*在看/,
        /这篇文章.*有帮助.*点.*在看/,
        /^扫码参与留言/,
        /^扫(描)?码关注/,
        /长期.*征稿.*稿酬丰厚/,
        /^SFC$/,
        /长按.*二维码.*入群/,
        /长按.*二维码报名/,
        /欢迎大家关注/,
        /^(扫一扫|长按扫码)关注我们$/,
        /^长按下(面|方)二维码关注我们$/,
        /^关注星标$/,
        /^可能你还想看$/,
        /^(精彩|热点|热门)视频推荐(↓)?$/,
        /^精彩(文章|视频|内容)推荐(（.*）)?$/,
        /一键三连/,
        /^(免责声明|来源网络).*(侵权|侵犯您的权益).*删除/,
        /^以上内容.*来源于网络.*版权归原作者所有.*侵权.*请.*删除/,
        /^免责声明$/,
        /^声明.*转载请.*授权.*侵权必究(！)?$/,
        /^注.*本公众号内容，未经允许不得.*转载(。)?$/,
        /未经授权不得转载.*来源于网络.*作者所有.*版权.*著作权.*与我们联系/,
        /^关注行业资讯.*尽在/,
        /把.*公众号设.*星标/,
        /^热文精选$/,
        /^点击阅读原文，$/,
        /^请在工作时间.*致电/,
        /欢迎发送.*至邮箱/,
        /^点赞前.*可获得/,
        /^本期.*科普.*到这(里)?$/,
        /更多(精彩|新闻)(内容)?(，|,)?(\s*敬)?请(关注|点击|登录)/,
        /^更多.*新闻值得关注$/,
        /^(》){3,}?相关新闻$/,
        /^猛戳\s*\+\s*$/,
        /^觉得好看.*请点.*和.*吧$/,
        /^(“)?分享\+(点)?赞\+在看(”)?$/,
        /^点赞\s*(\+)?在看$/,
        /^(分享|转发)给(你身边的)?(小伙伴)?(家人)?(朋友)?$/,
        /^图片源自于网络，仅供科普参考$/,
        /^觉得不错，请点这里/,
        /^点亮，让更多人知道(！|。|\s*)$/,
        /^请点亮\s*和\s*$/,
        /^点\s*\+\s*鼓励一下/,
        /^全文完.*感谢.*阅读.*点.*在看/,
        /更多精彩(内容|视频)?，?尽在/,
        /^喜欢就点个赞吧.*$/,
        /看到这.*点个关注.*走/,
        /^戳这里关注我/,
        /^热文回顾$/,
        /^来源：.*国家监委网(站)?$/,
        /^扫码下载.*APP了解更多$/,
        /^\s*前\s*文\s*回\s*顾(:|：)?\s*$/,
        /报告下载\s*.*电脑端复制链接/,
        /点击上图小程序/,
        /^假如您没有太多时间收看/,
        /^感谢(您|你)抽出.*来阅读$/,
        /^值班编辑(\s|：)/,
        /^独家.*深度.*为.*捕捉商业先机$/,
        /^本文为.*原创文章.*转载请联系.*微信/,
        /^原创文章.*转载.*后台留言$/,
        /^wuzhoufabu/,
        /^[-]{20,}$/,
        /^[—]{5,}粉丝福利[—]{5,}$/,
        /^[—]{2,}全文结束[—]{2,}$/,
        /^[~]{8,}$/,
        /^说明(:|：).*侵犯.*合法权益.*删除.*歉意/,
        /^参考来源：\s*\[/,
        /^参考文献：$/,
        /^温馨提示：.*需要.*小程序制作发布后台$/,
        /扫描.*二维码.*关注.*下一期更精彩(\.|。|！|!)$/,
        /^感觉精彩，点击“在看”/,
        /^更多土地信息(，)?$/,
        /^\s*(•)?\s*推荐视频\s*(•)?\s*$/,
        /^历史链接$/,
        /^视频推荐$/,
        /^今日荐文$/,
        /^南方都市报.*原创报道$/,
        /^视频拍剪、播音主持、直播带货$/,
        /^扫描(下方)?二维码(通过小程序注册)?报名$/,
        /^点击“直播中”即可，即可观看直播$/,
        /^更多.*点击推荐阅读$/,
        /文章.*对.*有.*启发.*更多.*以下文章/,
        /^媒体合作、品牌宣传请联系.*/,
        /^价格.*十分美丽.*年夜饭.*来一碗.*一起吃吧(。)$/,
        /优质来稿均有酬，欢迎点击上图投稿。$/,
        /^热点视频推荐↓↓↓$/,
        /^文末福利$/,
        /^（更多资讯，扫码关注）$/,
        /^长按识别下图二维码$/,
        /^来源\s*(\||：).*（记者.*）/,
        /^快给“.*”设个星标吧!$/,
        /^具体业务.*请戳.*链接或详见后文$/,
        /^赶紧扫码联系我们讨论吧$/,
        /福利抽奖来啦(！)?$/,
        /^每日话题$/,
        /^最近微信改版.*有读者说找不到.*文章$/,
        /^如果您有新闻线索.*可以拨打\d+.*为我们提供优质的.*素材(！)?$/,
        /^最后.*再次提醒大家.*感兴趣的.*扫码进群(哦！)?$/,
        /点个(“)?在看(”)?.*转发(分享)?给.*(身边的|家人)朋友/,
        /^来个“分享、点赞、在看”/,
        /点赞和在看，让更多的人受益，你的支持我的动力/,
        /^来源：中国新闻网$/,
        /^文末点个“在看”/,
        /^欢迎转发分享、点赞、点“在看”$/,
        /^欢迎大家补充一起安全实验！$/,
        /^如果你觉得这篇文章不错的话，别忘了文末点亮/,
        /^出品：湖北经视融媒体运营中心$/,
        /^👇🏻真诚推荐你关注👇🏻$/,
        /^三审\s*\|\s*/,
        /^在本公众号对话框回复$/,
        /^下一位尊贵的.*车主就是你啦！$/,
        /^回复关键词\s*\|\s*获取本期真题答案$/,
        /^来源：(东明县卫生健康局|江西人社|成都发布|中国合理用药|《党的二十大报告学习辅导百问》|文成交警|四川司法|南阳日报|甘肃日报|天津广播|洛阳晚报、网络|湖北疾控|云南人力资源和社会保障网)$/,
        /^来源：央视新闻（ID/,
        /^来源：.*微信公众号$/,
        /^向下滑动看新闻报道全文$/,
        /^回眸2023\s*展望2024$/,
        /^购买常见问题解答$/,
        /^分析人QQ：\d+/,
        /^来源：绍兴发布$/,
        /^打开微信，扫描“.*”小程序$/,
        /^本书（.*）可助您一臂之力(！){1,3}$/,
        /^扫码加管理员微信备注“进群”$/,
        /^别忘了点赞支持小编(哦！)?$/,
        /^编\s*后\s*语\s*/,
        /^▍考考你$/,
        /^并标注“读者”，加入我们的读者群$/,
        /^小布送福利啦$/,
        /^欢迎转载请注明来源！$/,
        /^欢迎转载，转载请标明来源/,
        /^转载请注明来自.*官方微信$/,
        /^转载本文内容请注明来源：.*微信公众号/,
        /^转载请联系.*或注明出处/,
        /^为你推荐$/,
        /^今日话题$/,
        /^转发周知！$/,
        /^(▲)?转载本平台信息需备注来源/,
        /^奋斗成就世界一流，$/,
        /^分享、在看与点赞$/,
        /^聚焦\s*\|\s*回顾$/,
        /^假日特别福利✦$/,
        /^江\s*湖\s*焦\s*点$/,
        /^(🎁)?电商广告(🎁)?$/,
        /^注：.*价行情主要取决于市场供需，具体价格.*主要考量，本报价仅供养殖户参考！$/,
        /^在文章下方评论区留言并注明：/,
        /^近期必读$/,
        /^◆\s*信息来源：/,
        /^往期战绩回顾$/,
        /^版权说明.*部分内容.*来自网络，如.*涉及版权.*问题，请联系我们。$/,
        /^↓查看完整招聘公告.*职位表↓$/,
        /^手账本使用反馈$/,
        /^更多精彩内容请加客服微信/,
        /^祝大家新年胜旧年。$/,
        /^青岛汽车总站所属汽车站$/,
        /^【作品基本信息】$/,
        /^.*办公研习社推出.*就不能错过啦~$/,
        /^中国青年报\·中国青年网出品$/,
        /^草鱼行情专题$/,
        /^\-\s*今日作者\s*\-$/,
        /^点开下方链接一起回顾一下$/,
        /^关注可私信.*台发消息，解锁你喜欢的.*$/,
        /^相关文章推荐$/,
        /^商\s+务\s+合\s+作$/,
        /^来源\/国家.*管理部$/,
        /^按识别二维码关注我们$/,
        /^期待与您(的)?再次相逢$/,
        /^特此公告！$/,
        /^↓\s优质视频在顶端\s↓$/,
        /^喜欢这篇推送，点这里/,
        /^天水人都在看$/,
        /^([—]{5,})?更多.*人都在看(的)?([—]{5,})?$/,
        /人已关注(并)?(且)?加入我们$/,
        /^最新动态：$/,
        /^谢谢你来，恰好我在$/,
        /^要闻回顾：$/,
        /^添加下方微信好友，立即咨询/,
        /^(·)?更多资讯(·)?$/,
        /^12340来电$/,
        /^踏新征程\s*共赴远方$/,
        /^是不是觉得还有好多宝藏店铺没有写$/,
        /^想要了解更多.*资讯，欢迎添加/,
        /^三伏天调理专场活动来啦$/,
        /^官方报名平台：$/,
        /版权归原作者所有，若对版权有异议，请后台联系我们处理$/,
        /^德明堂风水宝物结缘，.位座馆大师：$/,
        /^更多详细内容、报名方法以及.*可关注.*官方微信公众号.*访问官网/,
        /^后台回复关键词“.*”$/,
        /^分享\s*在看\s*点赞\s*.*我要拥有一个/,
        /^︱来源：/,
        /^石河子市开发区党政服务中心东附楼一楼/,
        /^“临沂临港宣传”视频号上新啦/,
        /^欢迎文章、图片、视频投稿$/,
        /^文章来源丨中国日报$/,
        /^综合来源：.*发布$/,
        /^更多精彩成交，大家可以浏览.*或者登.*查看。$/,
        /^供稿：特警大队$/,
        /^五经普知识问答小贴士$/,
        /^[\>]{2,}更多精彩视频(、资讯)?请关注/,
        /^\•\s*欢迎您加入我们的企业微信群\s*\•$/,
        /^民之所忧\s+我必念之$/,
        /^注：本文来源于.*微信公众号$/,
        /^点击下方公号名片，阅读更多/,
        /^防\s+骗\s+提\s+示$/,
        /^磨练,使人难以忍受,$/,
        /^原创不易\s*打赏随意$/,
        /^大庆市疾病预防控制中心$/,
        /^PTR\s*青少年发展课程介绍$/,
        /^后续将公布“.*”，敬请关注$/,
        /^终审(\s)：/,
        /等打造儿童健康调理型标杆门店！$/,
        /^（来源：(河南工信|黄石海事局)）$/,
        /^供稿：(党群办|.*教育培训监管科)/,
        /对.*前方工作组.*供稿$/,
        /^审核：宣传组$/,
        /^请大家注意个人防护，不扎堆、不聚集，$/,
        /^宝妈群内每日更新$/,
        /^投稿邮箱：/,
        /^快来戳一下”关注“给些鼓励吧！$/,
        /正在征文，欢迎投稿！$/,
        /^往(\||\/)期(\||\/)回(\||\/)顾$/,
        /^点击图片即可阅读全文$/,
        /^内容来源\/\s*上海市实验小学长兴分校$/,
        /^关注\s*\|\s*标准排名城市研究院$/,
        /^信息来源：勐腊海关$/,
        /^图文来源：实验小学/,
        /^分享、收藏、点赞、在看/,
        /^快点分享、点赞、在看/,
        /麻烦点一下再走啦~$/,
        /^▼点击左下角“阅读(原|全)文”马上获取专属你的免费留学评估/,
        /^来源\s*\|\s*《中国教育报》/,
        /^来源：(县融媒体中心|中央纪委国家监委网站)/,
        /^转自《上饶疾控》$/,
        /^有一种美好生活，叫彭州！$/,
        /^｜云涧听雨民宿｜$/,
        /^​如果您不关注此公众号$/,
        /^更多精彩内容，识别二维码查看$/,
        /^闽中仙地｜通海旺山$/,
        /^往期荐读$/,
        /^点亮【赞和在看】，让.*和.*都.*你。$/,
        /^转载请按以下格式注明来源/,
        /^欢迎关注\s*Welcome\s*to\s*follow$/i,
        /^特别说明：获取资料后仅限.*个人.*使用，不得.*比赛和.*商业用途，发现.*举报.*尊重知识产权，你我共识。$/,
        /^供稿：/,
        /^精彩回顾（点击.*阅读）$/,
        /点击“阅读原文”\s*查看精彩内容！$/,
        /^在看是一种鼓励(\||\s*)分享是最好支持$/,
        /^赣州教育微信公众号：/,
        /^因为你的分享、点赞、在看/,
        /^山东省人事考试中心$/,
        /^启航美好\s*幸福归家$/,
        /^后台回复文末关键词即可下载软件.*更多黑科技软件.*福利资源可加/,
        /^本文不构成个人投资建议，不代表.*平台观点，市场有风险，投资需谨慎，请独立判断和决策。$/,
        /^\*以上信息来源：/,
        /^一周凰榜$/,
        /^【商务合作】$/,
        /^长按下方二维码，添加“亚洲金融风险智库”加入粉丝群$/,
        /^\[1\]http(s)?\:\/\/www\./,
    ];
    
    
    /***/ }),
    /* 6 */
    /***/ (function(__unused_webpack_module, exports, __webpack_require__) {
    
    
    var __read = (this && this.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.pickHeaders = void 0;
    var const_1 = __webpack_require__(3);
    var filterMaxFontSizeHeaders = function (headers) {
        if (!headers || headers.length < 1)
            return [];
        var arr = __spreadArray([], __read(headers), false);
        arr.sort(function (a, b) { return b.fontSize - a.fontSize; });
        var maxFontsize = arr[0].fontSize;
        var secondMaxFontsize = null;
        var maxCount = 0;
        var secondMaxCount = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].fontSize === maxFontsize) {
                maxCount++;
            }
            else if (secondMaxFontsize === null ||
                arr[i].fontSize === secondMaxFontsize) {
                secondMaxFontsize = arr[i].fontSize;
                secondMaxCount++;
            }
        }
        if (maxCount === 1 && secondMaxCount >= 3) {
            return arr.filter(function (item) { return item.fontSize === secondMaxFontsize; });
        }
        else {
            return arr.filter(function (item) { return item.fontSize === maxFontsize; });
        }
    };
    var validArabicSerialAndBgHeaders = function (headers) {
        return headers.length > const_1.MIN_HEADERS_SIZE &&
            headers.every(function (item) { return item.hasBg && (0, const_1.startWithArabicSerial)(item.text); });
    };
    var checkSerialRepeat = function (headers) {
        return new Set(headers.map(function (item) { var _a; return (_a = item.text.match(/^\d+/)) === null || _a === void 0 ? void 0 : _a[0]; })).size !==
            headers.length;
    };
    var checkSameFontSizeNumber = function (headers, fontSizeHeaders) {
        return fontSizeHeaders.length ===
            headers.filter(function (item) { return item.fontSize === fontSizeHeaders[0].fontSize; })
                .length;
    };
    var hasSameAlign = function (headers) {
        return new Set(headers.map(function (item) { return item.align; })).size === 1;
    };
    var hasSameFontSize = function (headers) {
        return new Set(headers.map(function (item) { return item.fontSize; })).size === 1;
    };
    var filterMergeCountHeaders = function (headers) {
        return (headers || []).filter(function (item) { return item.hasSerial || item.mergeCount <= const_1.TITLE_MERGE_COUNT_LIMIT; });
    };
    var getFirstNotCenteredHeaderFontSize = function (headers) { var _a, _b; return (_b = (_a = headers.filter(function (item) { return item.align !== const_1.ContentAlign.CENTER; })) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.fontSize; };
    var getValidHeaders = function (headers, centerHeaders) {
        return (0, const_1.fixHeadersSubfix)(centerHeaders.length >= const_1.CENTERED_HEADERS_LIMIT ? centerHeaders : headers);
    };
    var shouldRevise = function (headers) {
        return headers.length >= const_1.MAX_REVISE_TITLE_LIMIT &&
            headers.every(function (item) {
                return item.align === const_1.ContentAlign.LEFT &&
                    !item.hasBg &&
                    !item.isPreSerial &&
                    !item.isBiggest &&
                    !item.hasSerial;
            });
    };
    var pickAtFirst = function (headers) {
        try {
            var hasSerialHeaders = headers.filter(function (item) { return item.hasSerial; });
            if (validArabicSerialAndBgHeaders(hasSerialHeaders) &&
                !checkSerialRepeat(hasSerialHeaders)) {
                console.log('带背景数字序号标题优先匹配成功');
                return hasSerialHeaders;
            }
            var maxFontSizeHeaders = filterMaxFontSizeHeaders(headers);
            var maxFontSizeHeadersLength = maxFontSizeHeaders.length;
            var hasSerialAndBgResults = maxFontSizeHeaders.filter(function (item) { return item.hasSerial && item.hasBg; });
            if (hasSerialAndBgResults.length > const_1.MIN_HEADERS_SIZE &&
                hasSameAlign(hasSerialAndBgResults)) {
                console.log('带背景带序列号过滤成功');
                return hasSerialAndBgResults;
            }
            var isSameAlign = hasSameAlign(maxFontSizeHeaders);
            if (maxFontSizeHeadersLength >= const_1.MIN_HEADERS_SIZE &&
                isSameAlign &&
                maxFontSizeHeaders.every(function (item) { return item.isBiggest; })) {
                console.log('按字号最大筛选成功');
                return maxFontSizeHeaders;
            }
            if (maxFontSizeHeadersLength === headers.length &&
                maxFontSizeHeadersLength > const_1.MIN_HEADERS_SIZE &&
                maxFontSizeHeaders.every(function (item) { return item.isBiggest; })) {
                console.log('全为大字体');
                return maxFontSizeHeaders;
            }
            if (maxFontSizeHeadersLength > const_1.MIN_HEADERS_SIZE &&
                checkSameFontSizeNumber(headers, maxFontSizeHeaders) &&
                isSameAlign &&
                maxFontSizeHeaders.every(function (item) { return item.hasSerial; })) {
                console.log('按序列号以及大字体过滤成功');
                return maxFontSizeHeaders;
            }
            return null;
        }
        catch (e) {
            console.error('初筛出错', e);
            return null;
        }
    };
    var pickFromCenter = function (centerHeaders, allHeaders) {
        var centeredLength = centerHeaders.length;
        if (centeredLength === const_1.CENTERED_HEADERS_LIMIT - 1 &&
            (centerHeaders.every(function (item) { return item.hasBg; }) ||
                (hasSameFontSize(centerHeaders) &&
                    centerHeaders[0].fontSize !==
                        getFirstNotCenteredHeaderFontSize(allHeaders)))) {
            console.log('处理仅仅两个居中标题成功');
            return (0, const_1.fixHeadersSubfix)(centerHeaders);
        }
        if (centeredLength > 1 &&
            centerHeaders.every(function (item) { return item.isHeaderMerged; })) {
            console.log('按居中合并标题筛选成功');
            return (0, const_1.fixHeadersSubfix)(centerHeaders);
        }
        return null;
    };
    var pickAtSecond = function (validHeaders) {
        if (validHeaders.every(function (item) { return item.hasSerial || item.isPreSerial; })) {
            console.log('按标题序列号过滤成功');
            return validHeaders;
        }
        if ((0, const_1.isAllArabicSerialHeaders)(validHeaders) &&
            (0, const_1.isAllValidArabicSerialHeaders)(validHeaders)) {
            console.log('纯数字规则过滤成功');
            return validHeaders;
        }
        var hasBgPrevResult = validHeaders.filter(function (item) { return item.hasBg; });
        var hasBgPrevSize = hasBgPrevResult === null || hasBgPrevResult === void 0 ? void 0 : hasBgPrevResult.length;
        if (hasBgPrevSize >= const_1.HAS_BACKGROUND_PRE_LIMIT &&
            hasBgPrevSize !== (validHeaders === null || validHeaders === void 0 ? void 0 : validHeaders.length)) {
            console.log('有背景规则过滤成功');
            return hasBgPrevResult;
        }
        var isPrevSerialResult = validHeaders.filter(function (item) { return item.isPreSerial; });
        if ((isPrevSerialResult === null || isPrevSerialResult === void 0 ? void 0 : isPrevSerialResult.length) >= const_1.MAX_FONTSIZE_HEADERS_LIMIT) {
            console.log('前序序列号标题规则过滤成功');
            return isPrevSerialResult;
        }
        var hasSerialResult = validHeaders.filter(function (item) { return item.hasSerial; });
        if ((hasSerialResult === null || hasSerialResult === void 0 ? void 0 : hasSerialResult.length) >= const_1.MAX_FONTSIZE_HEADERS_LIMIT) {
            console.log('序列号规则过滤成功');
            return hasSerialResult;
        }
        var maxFontSizeHeaders = filterMaxFontSizeHeaders(validHeaders);
        console.log('按字号过滤结果为', maxFontSizeHeaders);
        var maxFontSizeHeadersSize = maxFontSizeHeaders.length;
        if (maxFontSizeHeadersSize >= const_1.MAX_FONTSIZE_HEADERS_LIMIT ||
            ((maxFontSizeHeadersSize === validHeaders.length - 1 ||
                validHeaders.every(function (item) { return item.align === const_1.ContentAlign.LEFT; })) &&
                maxFontSizeHeadersSize >= const_1.MAX_FONTSIZE_HEADERS_LIMIT - 1)) {
            var hasBgResult_1 = maxFontSizeHeaders.filter(function (item) { return item.hasBg; });
            if ((hasBgResult_1 === null || hasBgResult_1 === void 0 ? void 0 : hasBgResult_1.length) >= const_1.MAX_FONTSIZE_HEADERS_LIMIT) {
                console.log('按大字号标题并且又背景过滤成功！');
                return hasBgResult_1;
            }
            console.log('按标题大字号过滤成功！');
            return maxFontSizeHeaders;
        }
        if (maxFontSizeHeadersSize >= const_1.MIN_HEADERS_SIZE &&
            maxFontSizeHeaders.every(function (item) { return item.isPreSerial; })) {
            console.log('标题都为大字号，并且都含前序序列号！', maxFontSizeHeaders);
            return maxFontSizeHeaders;
        }
        var hasBgResult = validHeaders.filter(function (item) { return item.hasBg; });
        if (maxFontSizeHeadersSize >= const_1.MIN_HEADERS_SIZE &&
            maxFontSizeHeaders.every(function (item) { return item.hasBg; }) &&
            maxFontSizeHeadersSize === (hasBgResult === null || hasBgResult === void 0 ? void 0 : hasBgResult.length)) {
            console.log('标题都为大字号，并且都有背景色');
            return maxFontSizeHeaders;
        }
        if ((hasBgResult === null || hasBgResult === void 0 ? void 0 : hasBgResult.length) >= const_1.MAX_FONTSIZE_HEADERS_LIMIT) {
            console.log('有背景过滤成功');
            return hasBgResult;
        }
        return null;
    };
    var headersValidation = function (headers) {
        if (headers.length < const_1.HEADER_SIZE_THREHOLD)
            return headers;
        var headerRepeatCount = headers.reduce(function (acc, item) {
            var header = item.text;
            if (header in acc) {
                acc[header]++;
            }
            else {
                acc[header] = 1;
            }
            return acc;
        }, {});
        var isRepeatReachThrehold = Object.keys(headerRepeatCount).some(function (header) { return headerRepeatCount[header] > const_1.HEADER_REPEAT_THREHOLD; });
        if (isRepeatReachThrehold) {
            console.log('标题重复达到阈值，被清理', const_1.HEADER_SIZE_THREHOLD, const_1.HEADER_REPEAT_THREHOLD, headerRepeatCount);
            return [];
        }
        return headers;
    };
    var pickHeaders = function (allHeaders) {
        var headers = filterMergeCountHeaders(allHeaders);
        var topPickHeaders = pickAtFirst(headers);
        if (topPickHeaders) {
            return headersValidation(topPickHeaders);
        }
        var centerHeaders = headers.filter(function (item) { return item.align === const_1.ContentAlign.CENTER; });
        console.log('居中结果：总计', centerHeaders);
        var pickCenterHeaders = pickFromCenter(centerHeaders, headers);
        if (pickCenterHeaders) {
            return headersValidation(pickCenterHeaders);
        }
        var validHeaders = getValidHeaders(headers, centerHeaders);
        if (validHeaders.length < const_1.MIN_HEADERS_SIZE)
            return [];
        if (shouldRevise(validHeaders)) {
            console.log('居左杂文标题修正成功');
            return [];
        }
        var pickAtSecondHeaders = pickAtSecond(validHeaders);
        if (pickAtSecondHeaders) {
            return headersValidation(pickAtSecondHeaders);
        }
        console.log('为命中分组策略，直接返回结果');
        return headersValidation(validHeaders);
    };
    exports.pickHeaders = pickHeaders;
    
    
    /***/ }),
    /* 7 */
    /***/ ((__unused_webpack_module, exports) => {
    
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getElementPath = void 0;
    var getElementPath = function (element, rootElement) {
        var path = [];
        while (element && element !== rootElement) {
            var tagName = element.tagName.toLowerCase();
            var siblings = Array.from(element.parentNode.children);
            var index = siblings.length > 1 ? ":nth-child(".concat(siblings.indexOf(element) + 1, ")") : '';
            path.unshift("".concat(tagName).concat(index));
            element = element.parentElement;
        }
        return path.join(' > ');
    };
    exports.getElementPath = getElementPath;
    
    
    /***/ }),
    /* 8 */
    /***/ (function(__unused_webpack_module, exports) {
    
    
    var __assign = (this && this.__assign) || function () {
        __assign = Object.assign || function(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    var __values = (this && this.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getMetas = exports.clearDom = void 0;
    function clearDom() {
        var e_1, _a;
        var _b;
        var selectors = ['#content_bottom_area'];
        var payContentId = '#js_pay_panel';
        try {
            for (var selectors_1 = __values(selectors), selectors_1_1 = selectors_1.next(); !selectors_1_1.done; selectors_1_1 = selectors_1.next()) {
                var selector = selectors_1_1.value;
                var element = document.querySelector(selector);
                if (element) {
                    var payContent = element.querySelector(payContentId);
                    if (payContent) {
                        return;
                    }
                    (_b = element.style) === null || _b === void 0 ? void 0 : _b.setProperty('display', 'none', 'important');
                    console.log(selector, '已清洗');
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (selectors_1_1 && !selectors_1_1.done && (_a = selectors_1.return)) _a.call(selectors_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    exports.clearDom = clearDom;
    function getMetaContentsByProperties(propertyArr) {
        var e_2, _a;
        var _b;
        if (propertyArr === void 0) { propertyArr = []; }
        var results = {};
        var metaTags = document.getElementsByTagName('meta');
        try {
            for (var propertyArr_1 = __values(propertyArr), propertyArr_1_1 = propertyArr_1.next(); !propertyArr_1_1.done; propertyArr_1_1 = propertyArr_1.next()) {
                var property = propertyArr_1_1.value;
                results[property] = '';
                for (var i = 0; i < (metaTags === null || metaTags === void 0 ? void 0 : metaTags.length); i++) {
                    if (((_b = metaTags[i]) === null || _b === void 0 ? void 0 : _b.getAttribute('property')) === property) {
                        results[property] = metaTags[i].getAttribute('content');
                        break;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (propertyArr_1_1 && !propertyArr_1_1.done && (_a = propertyArr_1.return)) _a.call(propertyArr_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return results;
    }
    function getMetas() {
        var _a, _b;
        clearDom();
        var findElement = function (selectors) {
            var e_3, _a;
            try {
                for (var selectors_2 = __values(selectors), selectors_2_1 = selectors_2.next(); !selectors_2_1.done; selectors_2_1 = selectors_2.next()) {
                    var selector = selectors_2_1.value;
                    var element = document.querySelector(selector);
                    if (element === null || element === void 0 ? void 0 : element.innerText) {
                        return { selector: selector, innerText: element.innerText };
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (selectors_2_1 && !selectors_2_1.done && (_a = selectors_2.return)) _a.call(selectors_2);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return { selector: null, innerText: null };
        };
        var titleSelectors = [
            '#activity-name',
            'h1.rich_media_title',
            '#js_video_page_title',
            'title',
            '#js_tag_name',
        ];
        var authorSelectors = [
            '#js_name',
            '#js_wx_follow_nickname',
            '.account_nickname_inner',
            '.album__author-name',
        ];
        var publishTimeSelectors = [
            '#publish_time',
        ];
        var publishLocationSelectors = [
            '#js_ip_wording',
        ];
        var titleInfo = findElement(titleSelectors);
        if (!(titleInfo === null || titleInfo === void 0 ? void 0 : titleInfo.innerText)) {
            console.log('各种title获取失败，使用og:title兜底');
            var ogTitleSelector = 'meta[property="og:title"]';
            var innerText = ((_b = (_a = document.querySelector(ogTitleSelector)) === null || _a === void 0 ? void 0 : _a.getAttribute) === null || _b === void 0 ? void 0 : _b.call(_a, 'content')) || '';
            console.log('og:title获取到的结果为', innerText);
            if (innerText) {
                titleInfo.innerText = innerText;
                titleInfo.selector = ogTitleSelector;
            }
        }
        var authorInfo = findElement(authorSelectors);
        var publishTimeInfo = findElement(publishTimeSelectors);
        var publishLocationInfo = findElement(publishLocationSelectors);
        var metaProperties = ['og:url', 'og:description'];
        var metas = __assign({ title: titleInfo.innerText, titleSelector: titleInfo.selector, author: authorInfo.innerText, authorSelector: authorInfo.selector, publishTime: publishTimeInfo.innerText, publishTimeSelector: publishTimeInfo.selector, publishLocation: publishLocationInfo.innerText, publishLocationSelector: publishLocationInfo.selector }, getMetaContentsByProperties(metaProperties));
        console.log('文章基础信息', metas);
        return metas;
    }
    exports.getMetas = getMetas;
    
    
    /***/ }),
    /* 9 */
    /***/ ((__unused_webpack_module, exports, __webpack_require__) => {
    
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getParagraphs = exports.getParagraphsBackVersion = void 0;
    var const_1 = __webpack_require__(3);
    var doms_1 = __webpack_require__(4);
    var path_1 = __webpack_require__(7);
    function getParagraphsBackVersion() {
        var _a, _b;
        var paragraphs = [];
        var container = document.querySelector(const_1.CONTENT_SELECTOR_BASE);
        var baseSelector = const_1.CONTENT_SELECTOR_BASE;
        while (container.children.length === 1 ||
            (container.children.length === 2 &&
                container.children[1].tagName === 'P' &&
                ((_a = container.children[1].style) === null || _a === void 0 ? void 0 : _a.display) === 'none')) {
            container = container.children[0];
            baseSelector += " > ".concat(container.tagName.toLocaleLowerCase());
        }
        for (var i = 0; i < (container === null || container === void 0 ? void 0 : container.children.length); i++) {
            var node = container.children[i];
            if (!node || !((_b = node.innerText) === null || _b === void 0 ? void 0 : _b.trim())) {
                continue;
            }
            paragraphs.push({
                type: 0,
                path: "".concat(baseSelector, " > ").concat((0, path_1.getElementPath)(node, container)),
                text: node.innerText,
            });
        }
        console.log('获取到的段落信息为', paragraphs);
        return paragraphs;
    }
    exports.getParagraphsBackVersion = getParagraphsBackVersion;
    function getParagraphs() {
        var _a, _b, _c;
        var paragraphs = [];
        var container = document.querySelector(const_1.CONTENT_SELECTOR_BASE);
        if (!container)
            return paragraphs;
        function traverseContainer(node) {
            var _a, _b, _c;
            if ((0, doms_1.isMiniParagraph)(node)) {
                var text = (_a = node === null || node === void 0 ? void 0 : node.innerText) === null || _a === void 0 ? void 0 : _a.trim();
                var picElementNode = (_b = node.querySelector) === null || _b === void 0 ? void 0 : _b.call(node, 'img');
                var picSrc = '';
                var picLazySrc = '';
                if (picElementNode) {
                    picSrc = (picElementNode === null || picElementNode === void 0 ? void 0 : picElementNode.src) || '';
                    picLazySrc = picElementNode.getAttribute('data-src') || '';
                }
                if ((_c = node === null || node === void 0 ? void 0 : node.querySelector) === null || _c === void 0 ? void 0 : _c.call(node, '.mp-video-player')) {
                    console.log('【跳过】视频===>', text);
                    return;
                }
                if (text) {
                    paragraphs.push({
                        type: 0,
                        path: "".concat(const_1.CONTENT_SELECTOR_BASE, " > ").concat((0, path_1.getElementPath)(node, container)),
                        text: text,
                    });
                }
                if (picElementNode && (picSrc.startsWith('http') || (picLazySrc.startsWith('http')))) {
                    paragraphs.push({
                        type: 1,
                        path: "".concat(const_1.CONTENT_SELECTOR_BASE, " > ").concat((0, path_1.getElementPath)(node, container)),
                        text: picLazySrc || picSrc,
                        size: {
                            width: picElementNode.naturalWidth,
                            height: picElementNode.naturalHeight,
                            renderWidth: picElementNode.clientWidth,
                            renderHeight: picElementNode.clientHeight,
                        }
                    });
                }
            }
            else {
                for (var i = 0; i < node.childNodes.length; i++) {
                    traverseContainer(node.childNodes[i]);
                }
            }
        }
        traverseContainer(container);
        console.log('获取到的段落信息为', paragraphs);
        if (((_a = paragraphs === null || paragraphs === void 0 ? void 0 : paragraphs[0]) === null || _a === void 0 ? void 0 : _a.text) === '更多阅读' &&
            ((_c = (_b = paragraphs === null || paragraphs === void 0 ? void 0 : paragraphs[1]) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.startsWith('解读大模型价格战：着急的大厂'))) {
            console.log('命中');
            return [];
        }
        return paragraphs;
    }
    exports.getParagraphs = getParagraphs;
    
    
    /***/ }),
    /* 10 */
    /***/ ((__unused_webpack_module, exports) => {
    
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    exports.getAllImgs = void 0;
    var getAllImgs = function () {
        var imgsList = Array.from(document.getElementsByTagName('img'))
            .filter(function (img) { return !!img.src && img.src.startsWith('http'); })
            .sort(function (a, b) { return b.width * b.height - a.width * a.height; })
            .map(function (img) { return img.src; });
        return imgsList;
    };
    exports.getAllImgs = getAllImgs;
    
    
    /***/ })
    /******/ 	]);
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
    /******/ 			return cachedModule.exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    (() => {
    var exports = __webpack_exports__;
    
    Object.defineProperty(exports, "__esModule", ({ value: true }));
    var forall_1 = __webpack_require__(1);
    var allMetas = (0, forall_1.getAllMetas)();
    console.log('获取到的所有信息为', allMetas);
    window.allMetas = allMetas;
    exports["default"] = forall_1.getAllMetas;
    
    })();
    return window.allMetas
    /******/ })()
    ;