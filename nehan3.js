/*
 nehan3.js
 Copyright (C) 2011, 2012, Watanabe Masaki<lambda.watanabe[at]gmail.com>

 licenced under MIT licence.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

var Nehan3;
if(!Nehan3){
  Nehan3 = {};
}

(function(){

// ------------------------------------------------------------------------
// config
// ------------------------------------------------------------------------
var config = {
  // define layout parametors.
  layout:{
    minFontSize:10,
    defFontSize:18,
    tabLength:4,
    defLeadingRate:1.8,
    rubySizeRate: 0.5,
    captionSizeRate: 0.65,
    captionMarginRate: 1.0,
    blockMarginRate: 0.8,
    readerBorder: 1,
    acceptableResizeRate: 0.6,
    headerScales:[
      2.4, // H1
      2.0, // H2
      1.6, // H3
      1.4, // H4
      1.0, // H5
      1.0  // H6
    ],
    indent:{
      indentBefore: 2,
      indentAfter: 1
    },
    blockquote:{
      indentBefore: 2,
      indentAfter: 1,
      fontSizeRate: 0.9,
      border: 1
    },
    fieldset:{
      indentBefore: 1,
      indentAfter: 0,
      fontSizeRate: 0.9,
      border: 1
    },
    textset:{
      tpart:{
	fontSizeRate:0.9
      }
    },
    dl:{
      indentBefore:0,
      indentAfter:0,
      dt:{
	indentBefore:0,
	indentAfter:0,
	fontSizeRate:0.9
      },
      dd:{
	indentBefore:1,
	indentAfter:0,
	fontSizeRate:0.9
      }
    },
    ul:{
      indentBefore:1,
      indentAfter:1,
      listMark:"・",
      li:{
	fontSizeRate:0.9
      }
    },
    ol:{
      indentBefore:1,
      indentAfter:1,
      listMark:"・",
      li:{
	fontSizeRate:0.9
      }
    },
    scenario:{
      // you can also set head size like <shead size='100'>.
      shead:{
	size:100,
	fontSizeRate:0.9
      },
      // you can also set foot size like <sfoot size='100'>.
      sfoot:{
	size:80,
	fontSizeRate:0.7
      },
      sbody:{
	fontSizeRate:1,
	marginRate: 0.2
      }
    }
  },
  // maybe you think color is not issue for layout engine,
  // but in vertical mode, some of character is substituted by image.
  // so we need color info to switch resource path of image.
  color:{
    defCharImgColor:"000000",
    labelCharImgColor:"FFFFFF"
  },
  // define class name of generated layout elements(line, img, page ..etc)
  className:{
    img:"nehan-img",
    line:"nehan-line",
    page:"nehan-page",
    wrap:"nehan-wrap",
    charImg:"nehan-char-img",
    charIcon:"nehan-char-icon",
    forkedPage:"nehan-forked-page",
    alignedPage:"nehan-aligned-page",
    inlineReader:"nehan-inline-reader",
    errorMsg:"nehan-error-msg",
    textLine:"nehan-text-line",
    rubyLine:"nehan-ruby-line",
    labelLine:"nehan-label-line",
    labelLineBody:"nehan-label-line-body",
    rubyText:"nehan-ruby-text",
    caption:"nehan-caption",
    blockElement:"nehan-block-element",
    tocLink:"nehan-toc-link"
  },
  // define regexp pattern that makes lexing tokens.
  rex:{
    word:/[\w!\.\?\/\_:#;]+/,
    nvAttr:/(?:\S+)=["']?(?:(?:.(?!["']?\s+(?:\S+)=|["']))+.)["']?/g
  },
  // define tag categories.
  tags:{
    single:[
      "img",
      "br",
      "end-page"
    ],
    tcy:[
      "pack",
      "tcy"
    ],
    greedy:[
      "pre"
    ],
    block:[
      "img",
      "table",
      "iframe",
      "textarea",
      "ireader",
      "ipage"
    ],
    fork:[
      "blockquote",
      "ul",
      "ol",
      "li",
      "dl",
      "dt",
      "dd",
      "fieldset",
      "indent",
      "textset",
      "scenario"
    ],
    toc:[
      "part",         // <toc level=0>
      "chapter",      // <toc level=1>
      "section",      // <toc level=2>
      "subsection"    // <toc level=3>
    ],
    content:[
      "blockquote",
      "indent",
      "table",
      "textarea",
      "iframe",
      "ipage",
      "ireader",
      "shead",
      "sbody",
      "sfoot",
      "tpart",
      "fieldset",
      "ul",
      "ol",
      "li",
      "dl",
      "dt",
      "dd"
    ]
  },
  // define token types
  types:{
    textToken:["char", "tcy", "word", "rb"]
  },
  // these parameters are used for parser and lexer.
  // don't touch if you are not familiar with.
  system:{
    lang:"ja-jp",

    // ignore <BR> tag
    // default: false
    nobr:false,
    
    // buffer size of BufferedLexer
    lexingBufferLen : 2000,

    // true: enable yakumono curning.
    // false: disable yakumono curning.
    // default: true
    enableYakuMetricsCheck : true,

    // 0: do nothing
    // 1: check single head(or tail) NG
    // 2: check double head(or tail) NG
    // default: 2
    lineBreakCheckLevel : 2
  },
  // define resource path for img of special characters.
  charImgRoot: "http://nehan.googlecode.com/hg/char-img"
};


// ------------------------------------------------------------------------
// BrowserDetect
// 
// url: http://www.quirksmode.org/js/detect.html
// ------------------------------------------------------------------------
var BrowserDetect = {
  init: function () {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) {
    for (var i=0;i<data.length;i++){
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;
      if (dataString) {
	if (dataString.indexOf(data[i].subString) != -1)
	  return data[i].identity;
      }
      else if (dataProp)
	return data[i].identity;
    }
  },
  searchVersion: function (dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    { string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {// for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    { // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS : [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]
};

BrowserDetect.init();



// ------------------------------------------------------------------------
// env
// ------------------------------------------------------------------------
var env = {
  init : function(){
    var browser = BrowserDetect.browser.toLowerCase();
    var os = BrowserDetect.OS.toLowerCase();
    var version = BrowserDetect.version;
    var ua = navigator.userAgent;

    this.isIE = (browser == "explorer");
    this.isWin = (os == "windows");
    this.isMac = (os == "mac");
    this.isIPhone = (navigator.platform == "iPhone");
    this.isIPad = (navigator.platform == "iPad");
    this.isIPod = (navigator.platform == "iPod");
    this.isMobileSafari = this.isIPhone || this.isIPad || this.isIPod;
    this.isAndroid = /android/.test(ua);
  }
};

env.init();


// ------------------------------------------------------------------------
// utilities
// ------------------------------------------------------------------------
var debug = function(str){
  //console.log(str);
};

var Util = {
  clone : function(src){
    var dst;
    if (typeof src == "object") {
      if (src instanceof Array) {
	dst = new Array;
	for (var i = 0, len = src.length; i < len; i++) {
	  dst[i] = this.clone(src[i]);
	}
      } else {
	dst = new Object;
	for (prop in src) {
	  dst[prop] = this.clone(src[prop]);
	}
      }
    } else {
      dst = src;
    }
    return dst;
  },

  // used when lexer gets string leteral from source code.
  cutQuote : function(src){
    return src.replace(/\"/g, "").replace(/\'/g, "");
  },

  cutTagHeadSpace : function(text){
    return text.replace(/[\s]+</g, "<");
  },

  cutHeadSpace : function(text){
    return text.replace(/^[\s]+/, "");
  },

  cutHeadCRLF : function(text){
    return text.replace(/^\n+/g, "");
  },

  cutTailCRLF : function(text){
    return text.replace(/\n+$/g, "");
  },

  cutEdgeCRLF : function(text){
    return this.cutTailCRLF(this.cutHeadCRLF(text));
  },

  escape : function(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#039;")
      .replace(/"/g, "&quot;")
  },

  filenameConcat : function(p1, p2){
    p1 = (p1=="")? "" : (p1.slice(-1) == "/")? p1 : p1 + "/";
    p2 = (p2=="")? "" : (p2[0] == "/")? p2.substring(1, p2.length) : p2;
    return p1 + p2;
  }
};

var Closure = {
  eq : function(x){
    return function(y){
      return x == y;
    };
  },

  onkeypress : function(fn){
    return function(e){
      var key= env.isIE? event.keyCode : (e.keyCode || e.which);
      fn(key);
    };
  }
};

var Args = {
  copy : function(dst, args){
    for(prop in args){
      dst[prop] = args[prop];
    }
    return dst;
  },

  init : function(dst, defs, args){
    for(prop in defs){
      dst[prop] = (typeof args[prop] == "undefined")? defs[prop] : args[prop];
    }
    return dst;
  }
};

var List = {
  iter : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++)(function(obj){
      fn(obj);
    })(lst[i]);
  },

  iteri : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++)(function(obj){
      fn(i, obj);
    })(lst[i]);
  },

  map : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++)(function(obj){
      ret.push(fn(obj));
    })(lst[i]);
    return ret;
  },

  fold : function(lst, start, fn){
    var ret = start;
    for(var i = 0, len = lst.length; i < len; i++)(function(obj){
      ret = fn(ret, obj)
    })(lst[i]);
    return ret;
  },

  filter : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++)(function(obj){
      if(fn(obj)){
	ret.push(obj);
      }
    })(lst[i]);
    return ret;
  },

  find : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj)){
	return obj;
      }
    }
    return null;
  },

  exists : function(lst, fn){
    return this.find(lst, fn) != null;
  }
};

var Attr = {
  html : function(attr){
    var ret = [];
    for(prop in attr){
      var value = attr[prop] + "";
      value = Util.escape(value);
      if(attr[prop] != ""){
	ret.push(prop + "='" + value + "'");
      }
    }
    return (ret == [])? "" : ret.join(" ");
  },

  css : function(attr){
    var ret = [];
    for(prop in attr){
      var value = attr[prop] + "";
      value = Util.escape(value);
      ret.push(prop + ":" + value + ";");
    }
    return ret.join("");
  }
};

var Tag = {
  isStartTagName : function(name){
    return name.charAt(0) != "/";
  },

  isTcyTagName : function(name){
    return List.exists(config.tags.tcy, Closure.eq(name));
  },

  isSingleTagName : function(name){
    return List.exists(config.tags.single, Closure.eq(name));
  },

  isBlockTagName : function(name){
    return List.exists(config.tags.block, Closure.eq(name));
  },

  isForkPageTagName : function(name){
    return List.exists(config.tags.fork, Closure.eq(name));
  },

  isContentTagName : function(name){
    return List.exists(config.tags.content, Closure.eq(name));
  },

  start : function(name, attr){
    var ret = "<" + name;
    if(typeof attr != "undefined" || attr == null){
      var attrs = Attr.html(attr);
      ret = (attrs != "")? [ret, attrs].join(" ") : ret;
    }
    ret += this.isSingleTagName(name)? " />" : ">";
    return ret;
  },

  wrap : function(name, attr, body){
    return [this.start(name, attr), body, "</" + name + ">"].join("");
  },

  end : function(name){
    return "</" + name + ">";
  }
};

var Token = {
  isCharCountableToken : function(token){
    if(!this.isTextToken(token)){
      return false;
    }
    var str = token.data;
    if(/\s/.test(str)){
      return false;
    }
    if(token.type == "char" && token.img){
      return false; // yakumono is not countable
    }
    return true;
  },

  isEndPageToken : function(token){
    return token.type == "tag" && token.data.name == "end-page";
  },

  isTextToken : function(token){
    return List.exists(config.types.textToken, Closure.eq(token.type));
  },

  isBlockToken : function(token){
    if(token.type != "tag"){
      return false;
    }
    return Tag.isBlockTagName(token.data.name);
  },

  isForkPageToken : function(token){
    if(token.type != "tag"){
      return false;
    }
    return Tag.isForkPageTagName(token.data.name);
  }
};

var Word = {
  isTcy : function(word){
    if(word.length != 2){
      return false;
    }
    if(word == "!!" || word == "!?" || word == "??"){
      return true;
    }
    return word.match(/\d\d/) != null;
  }
};

var Char = {
  isHeadNg : function(c1){
    return /[）\)」】〕］\]。』＞〉》、．\.,]/.test(c1);
  },

  isTailNg : function(c1){
    return /[（\(「【［〔『＜〈《]/.test(c1);
  },

  isTailConnectiveChar : function(c1){
    return /[、。\.．,，」』）]/.test(c1);
  },

  isKakkoStartChar : function(c1){
    return /[「『【［（《〈≪＜\[\(]/.test(c1);
  },

  isKakkoEndChar : function(c1){
    return /[」』】］）》〉≫＞\]\)]/.test(c1);
  },

  isKutenTouten : function(c1){
    return /[、。,.]/.test(c1);
  },

  isZenkaku : function(c1){
    return escape(c1).charAt(1) == "u";
  },

  isHankaku : function(c1){
    return !this.isZenkaku(c1);
  },

  isSmallKana : function(c1){
    var code = c1.charCodeAt(0);
    return List.exists([
      12353, 12355, 12357, 12359, 12361, 12387, 12419, 12421, 12423, 12430, 12449,
      12451, 12453, 12455, 12457, 12483, 12515, 12517, 12519, 12526, 12533, 12534
    ], function(x){ return x == code });
  },

  ofImgSrc : function(imgid, color){
    var color = (typeof color != "undefined")? color : config.color.defCharImgColor;
    return Util.filenameConcat(config.charImgRoot, imgid + "/" + color + ".png");
  }
};

var LayoutParam = {
  parseWidth : function(klass){
    var ret = 0;
    if(klass.match(/lp-width-([0-9]+)/)){
      return parseInt(RegExp.$1);
    }
    return ret;
  },

  parseHeight : function(klass){
    var ret = 0;
    if(klass.match(/lp-height-([0-9]+)/)){
      return parseInt(RegExp.$1);
    }
    return ret;
  },

  parseFontSize : function(klass){
    var ret = config.layout.defFontSize;
    if(klass.match(/lp-font-size-([0-9]+)/)){
      ret = parseInt(RegExp.$1);
    }
    return ret;
  },

  parseDirection : function(klass){
    if(/lp-vertical/.test(klass)){
      return "vertical";
    }
    return "horizontal"
  },

  parseNoPager : function(klass){
    if(/lp-nopager/.test(klass)){
      return true;
    }
    return false;
  }
};

var Toc = {
  getLevel : function(name){
    var levels = config.tags.toc;
    for(var level = 0, len = levels.length; level < len; level++){
      if(levels[level] == name){
	return level;
      }
    }
    return 0;
  }
};

var CodeSyntax = {
  parseLangName : function(klass){
    if(klass.match(/lang-([a-zA-Z0-9\-]+)/i)){
      return RegExp.$1.toLowerCase();
    }
    return "js";
  },
  js : function(line){
    return line
      .replace(/[^:\"\'](\/\/.+)$/, "<span class='kw-cmt'>$1</span>")
      .replace(/(\/\*[^\*]+\*\/)/, "<span class='kw-cmt'>$1</span>")
      .replace(/(\"[^\"]+\")/g, "<span class='kw-string'>$1</span>");
  },

  html : function(line){
    return line;
  }
};

var CharImgColor = {
  RG : [0, 36, 73, 109, 146, 182, 219, 255],
  B : [0, 85, 170, 255],
  namedColors : {
    "black": {r:0, g:0, b:0},
    "red": {r:256, g:0, b:0},
    "green": {r:0, g:256, b:0},
    "blue": {r:0, g:0, b:256},
    "white": {r:256, g:256, b:256}
  },
  findNear : function(val, ary){
    if(val == 0 || val == 255){
      return val;
    }
    var min = 256;
    var ret = 0;
    for(var i = 0; i < ary.length; i++){
      var dist = Math.abs(val - ary[i]);
      if(dist < min){
	min = dist;
	ret = ary[i];
      }
    }
    return ret;
  },
  get : function(cstr){
    var cvalue = cstr.replace("#", "").toLowerCase();

    if(cvalue == "000000" || cvalue == "000" || cvalue == "black"){
      return "000000";
    }
    if(cvalue == "ffffff" || cvalue == "fff" || cvalue == "white"){
      return "FFFFFF";
    }

    if(this.namedColors[cvalue]){
      var c = this.namedColors[cvalue];
      var r = c.r;
      var g = c.g;
      var b = c.b;
    } else if(/[^0-9a-f]/.test(cvalue)){
      return "000000";
    } else if(cvalue.length == 3){
      var r = parseInt([cvalue[0], cvalue[0]].join(""), 16);
      var g = parseInt([cvalue[1], cvalue[1]].join(""), 16);
      var b = parseInt([cvalue[2], cvalue[2]].join(""), 16);
    } else if(cvalue.length == 6){
      var r = parseInt(cvalue.substring(0,2), 16);
      var g = parseInt(cvalue.substring(2,4), 16);
      var b = parseInt(cvalue.substring(4,6), 16);
    }

    var nr = this.findNear(r, this.RG);
    var ng = this.findNear(g, this.RG);
    var nb = this.findNear(b, this.B);

    var zerofix = function(s){
      return (s.length <= 1)? "0" + s : s;
    };

    var sr = zerofix(nr.toString(16));
    var sg = zerofix(ng.toString(16));
    var sb = zerofix(nb.toString(16));

    return (sr + sg + sb).toUpperCase();
  }
};


// ------------------------------------------------------------------------
// lexer
// ------------------------------------------------------------------------
var Lexer = (function LexerClosure(){
  var getTagSrc = function(text, pstart){
    var pend = text.indexOf(">", pstart + 1);
    if(pend < 0){
      return "";
    }
    return text.substring(pstart, pend+1);
  };

  var parseTagSingleAttr = function(src){
    var parts = src.split(/\s+/);
    parts.shift();
    return List.map(parts, function(part){
      return part.replace(/=.+/, "")
    });
  };

  var parseTagNvAttr = function(src){
    var attr = new Object;
    var matches = src.match(config.rex.nvAttr);
    if(matches == null){
      return attr;
    }
    List.iter(matches, function(nv){
      if(nv.match(/([\w\-]+)=(.+)/)){
	var name = RegExp.$1.toLowerCase();
	var value = Util.cutQuote(RegExp.$2);
	attr[name] = value;
      }
    });
    return attr;
  };

  var parseTagAttr = function(src){
    var src = src.replace(/[\s]+=[\s]+/g, "=");
    var singleAttr = parseTagSingleAttr(src);
    var attr = parseTagNvAttr(src);
    List.iter(singleAttr, function(prop){
      if(typeof attr[prop] == "undefined"){
	attr[prop] = true;
      }
    });
    return attr;
  };

  var parseTagName = function(src){
    return src.split(/[\s\t　]+/)[0].toLowerCase();
  };

  var parseTag = function(src){
    var src2 = src.replace("<", "").replace("/>", "").replace(">","");
    var name = parseTagName(src2);
    var attr = parseTagAttr(src2);
    return {type:"tag", data:{name:name, attr:attr}};
  };

  var findCloseTag = function(text, name, offset){
    var p1 = text.indexOf("</" + name, offset);
    var p2 = text.indexOf("<"  + name, offset);
    if(p1 < 0){
      return -1;
    }
    if(p2 < 0 || p1 < p2){
      return p1;
    }
    return findCloseTag(text, name, p1 + 1);
  };

  var getContentBody = function(text, name, offset){
    var pend = findCloseTag(text, name, offset);
    return text.substring(offset, pend);
  };

  function Lexer(text){
    this.text = this._preprocess(text);
    this.pos = 0;
    this.rb = "";
  }

  Lexer.prototype = {

    // 1. confirm that all tag names are lowercased.
    // 2. confirm that all block elements(such as img, table etc) are prepended by newline.
    // 3. remove br if config.system.nobr is true.
    _preprocess : function(text){
      var tab_space = "";
      for(var i = 0; i < config.layout.tabLength; i++){
	tab_space += "&nbsp;";
      }
      text =
	text.replace(/(\t)/, function(all, grp){
	  return tab_space;
	})
	.replace(/<([\w\-]+)/g, function(all, grp){
	  return "<" + grp.toLowerCase();
	})
	.replace(/<\/([\w\-]+)/g, function(all, grp){
	  return "</" + grp.toLowerCase();
	})
	.replace(/([^\n])<img/g, "$1\n<img") 
	.replace(/([^\n])<table/g, "$1\n<table")
	.replace(/([^\n])<end-page/g, "$1\n<end-page")
	.replace(/([^\n])<blockquote/g, "$1\n<blockquote")
	.replace(/([^\n])<indent/g, "$1\n<indent")
	.replace(/([^\n])<iframe/g, "$1\n<iframe")
	.replace(/([^\n])<ipage/g, "$1\n<ipage")
	.replace(/([^\n])<ireader/g, "$1\n<ireader")

      if(config.system.nobr){
	text = text.replace(/<br>/gi, "").replace(/<br \/>/gi, "");
      }
      return text;
    },

    _lookChar : function(offset){
      var pos = this.pos + (offset || 0);
      if(pos == this.text.length){
	return "\n";
      }
      if(pos > this.text.length){
	throw "BufferEnd";
      }
      return this.text.charAt(pos);
    },

    _mapChar : function(pstart, c1){
      var code = c1.charCodeAt(0);
      var ret = {
	type:"char",
	data:c1,
	hscaleImg:1,
	half:Char.isHankaku(c1),
	pos:pstart
      };
      var imgchar = function(img, hscaleImg){
	ret.img = img;
	ret.hscaleImg = hscaleImg;
	return ret;
      };
      var cnvchar = function(cnv){
	ret.cnv = cnv;
	return ret;
      };
      if(Char.isSmallKana(c1)){
	ret.skana = true;
	return ret;
      }
      if(c1 == " "){
	return cnvchar("&nbsp;");
      }
      switch(code){
      case 12300:
	return imgchar("kakko1", 0.5);
      case 65378:
	return imgchar("kakko1", 0.5);
      case 12301:
	return imgchar("kakko2", 0.5);
      case 65379:
	return imgchar("kakko2", 0.5);
      case 12302:
	return imgchar("kakko3", 0.5);
      case 12303:
	return imgchar("kakko4", 0.5);
      case 65288:
	return imgchar("kakko5", 0.5);
      case 40:
	return imgchar("kakko5", 0.5);
      case 65371:
	return imgchar("kakko5", 0.5);
      case 123:
	return imgchar("kakko5", 0.5);
      case 65289:
	return imgchar("kakko6", 0.5);
      case 41:
	return imgchar("kakko6", 0.5);
      case 65373:
	return imgchar("kakko6", 0.5);
      case 125:
	return imgchar("kakko6", 0.5);
      case 65308:
	return imgchar("kakko7", 0.5);
      case 60:
	return imgchar("kakko7", 0.5);
      case 12296:
	return imgchar("kakko7", 0.5);
      case 65310:
	return imgchar("kakko8", 0.5);
      case 62:
	return imgchar("kakko8", 0.5);
      case 12297:
	return imgchar("kakko8", 0.5);
      case 12298:
	return imgchar("kakko9", 0.5);
      case 8810:
	return imgchar("kakko9", 0.5);
      case 12299:
	return imgchar("kakko10", 0.5);
      case 8811:
	return imgchar("kakko10", 0.5);
      case 65339:
	return imgchar("kakko11", 0.5);
      case 12308:
	return imgchar("kakko11", 0.5);
      case 91:
	return imgchar("kakko11", 0.5);
      case 65341:
	return imgchar("kakko12", 0.5);
      case 12309:
	return imgchar("kakko12", 0.5);
      case 93:
	return imgchar("kakko12", 0.5);
      case 12304:
	return imgchar("kakko17", 0.5);
      case 12305:
	return imgchar("kakko18", 0.5);
      case 65306:
	return imgchar("tenten", 0.5);
      case 58:
	return imgchar("tenten", 0.5);
      case 12290:
	return imgchar("kuten", 0.5);
      case 65377:
	return imgchar("kuten", 0.5);
      case 65294:
	return imgchar("period", 1);
      case 46:
	return imgchar("period", 1);
      case 12289:
	return imgchar("touten", 0.5);
      case 65380:
	return imgchar("touten", 0.5);
      case 44:
	return imgchar("touten", 0.5);
      case 65292:
	return imgchar("touten", 0.5);
      case 65374:
	return imgchar("kara", 1);
      case 12316:
	return imgchar("kara", 1);
      case 8230:
	return imgchar("mmm", 1);
      case 8229:
	return imgchar("mm", 1);
      case 12317:
	return imgchar("dmn1", 1);
      case 12319:
	return imgchar("dmn2", 1);
      case 65309:
	return imgchar("equal", 1);
      case 61:
	return imgchar("equal", 1);
      case 12540:
	//return imgchar("onbiki", 1);
	return cnvchar("｜");
      case 45:
	return cnvchar("｜");
      case 8213:
	return cnvchar("｜");
      case 65293:
	return cnvchar("｜");
      case 9472:
	return cnvchar("｜");
      case 8593: // up
	return cnvchar("&#8594;");
      case 8594: // right
	return cnvchar("&#8595;");
      case 8658: // right2
	return cnvchar("&#8595;");
      case 8595: // down
	return cnvchar("&#8592;");
      case 8592: // left
	return cnvchar("&#8593;");
      }
      return ret;
    },

    _mapTag : function(pstart, tag){
      var name = tag.data.name;
      if(name == "ruby"){
	return this._readRubyTag(pstart, tag);
      } else if(name == "img"){
	return this._readImgTag(pstart, tag);
      } else if(Tag.isTcyTagName(name)){
	return this._readTcyTag(pstart, tag);
      } else if(Tag.isContentTagName(name)){
	return this._readContentTag(pstart, tag);
      } else {
	return tag;
      }
    },

    _skipComment : function(pstart){
      var end = this.text.indexOf("-->", pstart);
      this.pos = end + 3; // end + "-->".length
    },

    // caution: pstart is at "<"
    _readTag : function(pstart){
      var src = getTagSrc(this.text, pstart);
      var tag = parseTag(src);
      tag.pos = pstart;
      this.pos += src.length;
      return tag;
    },

    // cation: lexing pos(this.pos) is at the end of "<sometag>".
    // and pstart is at "<"
    _readContentTag : function(pstart, tag){
      var body = getContentBody(this.text, tag.data.name, this.pos);
      tag.data.content = body;
      this.pos += body.length + tag.data.name.length + 3;
      return tag;
    },

    // read structured tag data.
    // cation: lexing pos(this.pos) is at the end of "<sometag>".
    // and pstart is at "<"
    _readTagGroup : function(pstart, tag){
      var group = config.tags.group[tag.data.name];
      var body = getContentBody(this.text, tag.data.name, this.pos);
      this.pos += body.length + tag.data.name.length + 3;
      var child_data = function(name){
	var offset = body.indexOf("<" + name);
	if(offset < 0){
	  return null;
	}
	var src = getTagSrc(body, offset);
	if(src == ""){
	  return null;
	}
	var child = parseTag(src);
	child.data.content = getContentBody(body, name, offset + src.length);
	return child.data;
      };
      tag.data.childs = {};
      List.iter(group.childs, function(name){
	var child = child_data(name);
	if(child != null){
	  tag.data.childs[name] = child;
	}
      });
      return tag;
    },

    // cation: lexing pos(this.pos) is at the end of "<ruby>".
    // and pstart is at the "<"
    _readRubyTag : function(pstart, tag){
      var ret = {type:"ruby", pos:pstart};
      var body = getContentBody(this.text, tag.data.name, this.pos);
      this.pos += body.length + "</ruby>".length;
      if(body.match(/<rt>([^<]+)<\/rt>/i)){
	ret.yomi = RegExp.$1;
      }
      if(body.match(/<rb>([^<]+)<\/rb>/i)){ // when <rb> is used.
	this.rb = ret.kanji = RegExp.$1;
      } else if(body.match(/([^<]+)<rt>/i)) { // when <rb> is not used.
	this.rb = ret.kanji = RegExp.$1;
      }
      return ret;
    },

    // cation: lexing pos(this.pos) is at the end of "<tcy>" (or "<pack>")
    // and pstart is at the "<"
    _readTcyTag : function(pstart, tag){
      var word = getContentBody(this.text, tag.data.name, this.pos);
      this.pos += word.length + tag.data.name.length + 3; // "tcy".length + "</>".length or "pack".length + "</>".length
      return {type:"tcy", data:word, pos:pstart};
    },

    _readImgTag : function(pstart, tag){
      return tag;
    },

    _readRbChar : function(pstart){
      var c1 = this.rb.charAt(0);
      this.rb = this.rb.substring(1);
      var ret = this._mapChar(pstart, c1);
      ret.type = "rb";

      return ret;
    },

    _readSpecialChar : function(pstart, c1){
      var spmatch = this.text.substring(pstart).match(/&[a-zA-Z#0-9]+;/);
      var spchar = spmatch? spmatch.toString() : c1;
      // maybe there is no character reference longer than 10 chars.
      if(spchar == "" || spchar.length == 1 || spchar.length > 10){
	var ret = this._mapChar(pstart, c1);
	this.pos++;
	return ret;
      } else {
	this.pos += spchar.length;
	return {type:"char", data:spchar, hscaleImg:1, half:true, pos:pstart};
      }
    },

    _readChar : function(pstart, c1){
      var ret = this._mapChar(pstart, c1);
      this.pos++;
      return ret;
    },

    _readWord : function(pstart, c1){
      var word_match = this.text.substring(pstart).match(config.rex.word);
      var word = word_match? word_match.toString() : c1;
      var type = Word.isTcy(word)? "tcy" : "word";
      this.pos += word.length;
      if(word.length == 1){
	return this._mapChar(pstart, word);
      }
      return {type:type, data:word, pos:pstart};
    },

    getPos : function(){
      return this.pos;
    },

    getToken : function(){
      var pstart = this.pos;

      if(this.rb != ""){
	return this._readRbChar(pstart);
      } else {
	var c1 = this._lookChar();
      }

      if(c1 == "<"){
	try {
	  var c2 = this._lookChar(1);
	  if(c2 == "!"){
	    this._skipComment(pstart);
	    return this.getToken();
	  }
	} catch (e){
	  // do nothing
	}
	var tag = this._readTag(pstart);
	return this._mapTag(pstart, tag);
      } else if(c1 == "&"){
	return this._readSpecialChar(pstart, c1);
      } else if(c1.match(config.rex.word)){
	return this._readWord(pstart, c1);
      } else {
	return this._readChar(pstart, c1);
      } 
    }
  };

  return Lexer;
})();


// ------------------------------------------------------------------------
// buffered lexer
// ------------------------------------------------------------------------
var BufferedLexer = (function BufferedLexerClosure(){
  function BufferedLexer(text){
    this.lexer = new Lexer(text);
    this.tokens = [];
    this.pos = 0;
    this.eof = false;
    this.bufferSize = config.system.lexingBufferLen;
    this._doBuffer();
  };

  BufferedLexer.prototype = {

    _doBuffer : function(){
      try {
	for(var i = 0; i < this.bufferSize; i++){
	  this.tokens.push(this.lexer.getToken());
	}
      } catch (e){
	this.eof = true;
      }
    },

    setPos : function(pos){
      this.pos = pos;
    },

    getPos : function(){
      return this.pos;
    },

    isEnd : function(){
      return (this.eof && (this.pos >= this.tokens.length - 1));
    },

    stepPos : function(count){
      var count = (typeof count != "undefined")? count : 1;
      this.pos += count;
    },

    lookToken : function(offset){
      return this.lookTokenByIndex(this.pos + (offset || 0));
    },

    lookTokenByIndex : function(index){
      if(this.eof && index >= this.tokens.length){
	throw "BufferEnd";
      }
      if(index >= this.tokens.length){
	this._doBuffer();
      }
      var token = this.tokens[index];
      token.index = index;
      return token;
    },

    findUntil : function(start, plus, fn){
      var index = start;
      while(true){
	if(index < 0){
	  break;
	} else if(index >= this.tokens.length){
	  break;
	} else {
	  var token = this.lookTokenByIndex(index);
	  if(fn(token)){
	    return token;
	  }
	}
	index += plus;
      }
      return null;
    },

    getToken : function(){
      var token = this.lookToken();
      this.pos++;
      return token;
    },

    getBufferRestSize : function(){
      return Math.max(this.tokens.length - this.pos - 1, 0);
    },

    skipUntil : function(fn){
      while(true){
	var token = this.lookToken();
	if(!fn(token)){
	  break;
	}
	this.stepPos(1);
      }
    },

    skipUntilCRLF : function(){
      this.skipUntil(function(token){
	if(!Token.isTextToken(token)){
	  return false;
	}
	return token.data == "\r" || token.data == "\n";
      });
    },

    skipCRLF : function(){
      var token = this.lookToken();
      if(!Token.isTextToken(token)){
	return;
      }
      if(token.data == "\r"){
	this.stepPos(1);
	this.skipCRLF();
      } else if(token.data == "\n"){
	this.stepPos(1);
      }
    }
  };
  return BufferedLexer;
})();


// ------------------------------------------------------------------------
// parser context
// ------------------------------------------------------------------------
var ParserContext = (function ParserContextClosure(){
  function ParserContext(layout){
    this.tags = [];
    this.tocs = [];
    this.topicPath = [];
    this.lastTopicPath = null;
    this.seekNextChar = 0;
    this.seekNextLine = 0;
    this.seekPageNo = 0;
    this.seekCharCount = 0;
    this.seekTextPos = 0;
    this.textSpaceBefore = 0;
    this.textSpaceAfter = 0;
    this.lineChars = [];
    this.rubyList = [];
    this.inlinePages = [];
    this.curToc = null;
    this.greedyMode = false;
    this.labelAttr = null;
    this.fontColor = config.color.defCharImgColor;
    this.updateFontSize(layout.fontSize); // this.fontSize, this.fontSize2, this.fontSize4
  }

  var snapProps =
    
  ParserContext.prototype = {
    snap : function(){
      var ret = new Object;
      var clone = Util.clone;
      var props = [
	"tags", "tocs", "topicPath", "lastTopicPath",
	"seekNextChar", "seekNextLine", "seekCharCount",
	"seekTextPos", "textSpaceBefore", "textSpaceAfter",
	"lineChars", "rubyList", "inlinePages", "curToc",
	"greedyMode", "labelAttr", "fontSize", "fontSize2", "fontSize4",
	"fontColor"
      ];
      for(prop in props){
	ret[prop] = clone(this[prop]);
      }
      return ret;
    },

    restoreSnap : function(snap){
      for(prop in snap){
	this[prop] = snap[prop];
      }
    },
    
    createBlock : function(layout, args){
      return Args.init(new Object, {
	"type": "block",
	name: "",
	width: 0,
	height: 0,
	content:""
      }, args);
    },

    createImage : function(layout, args){
      return Args.init(this.createBlock(layout, args), {
	src: ""
      }, args);
    },

    createInlineFrame : function(layout, args){
      return Args.init(this.createBlock(layout, args), {
	src: "",
	frameborder: 0
      }, args);
    },

    createCaption : function(layout, args){
      return Args.init(new Object, {
	"type":"caption",
	data:"",
	captionPos: "",
	fontSize: layout.captFontSize,
	height: (layout.captFontSize + layout.captMargin),
	"text-align": "center",
	"margin-top": 0,
	"margin-bottom": 0
      }, args);
    },

    // ruby(rt) has it's offset from parent coordinate,
    createRuby : function(layout, args){
      return Args.init(new Object, {
	type:"ruby",
	data:"",
	fontSize:this.fontSize2,
	textFontSize:this.fontSize,
	direction: layout.direction,
	position:{x:0, y:0}
      }, args);
    },

    createLine : function(layout){
      if(this.labelAttr != null){
	var line = this.createLabelLine(layout, this.labelAttr);
	this.textSpaceBefore = Math.max(0, this.textSpaceBefore - layout.labelSpace * 2);
	this.textSpaceAfter = Math.max(0, this.textSpaceAfter - layout.labelSpace * 2);
	this.labelAttr = null;
      } else {
	var line = this.createTextLine(layout);
	// as font size of characters may be different each other,
	// fix ruby baseline position.
	this.fixRubyPos(layout);
      }
      this.lineChars = [];
      this.rubyList = [];
      this.seekNextChar = 0;
      return line;
    },

    createTextLine : function(layout){
      var maxFontSize = this.getMaxFontSizeOfLine(layout);
      var maxLineHeight = layout.enableRuby? Math.floor(maxFontSize * layout.leadingRate) : maxFontSize;
      var textSpaceSize = this.getTextSpaceSize();
      var width = layout.isVertical? maxLineHeight : layout.maxNextChar - textSpaceSize;
      var height = layout.isVertical? layout.maxNextChar - textSpaceSize : maxLineHeight;
      var textLineSize = {
	width:(layout.isVertical? maxFontSize: layout.width),
	height:(layout.isVertical? layout.height: maxFontSize)
      };
      var rubyLineSize = {
	width:(layout.enableRuby? (layout.isVertical? width - textLineSize.width : layout.width) : 0),
	height:(layout.enableRuby? (layout.isVertical? layout.height : height - textLineSize.height) : 0)
      };
      return {
	type:"line",
	width:width,
	height:height,
	direction:layout.direction,
	fontSize:layout.fontSize,
	textLineSize:textLineSize,
	rubyLineSize:rubyLineSize,
	childs:this.lineChars,
	rubyList:this.rubyList
      };
    },

    createLabelLine : function(layout, attr){
      var maxFontSize = this.getMaxFontSizeOfLine(layout);
      var maxLineHeight = Math.floor(maxFontSize * layout.leadingRate);
      var width = layout.isVertical? maxLineHeight : this.seekNextChar + 2 * layout.labelSpace;
      var height = layout.isVertical? this.seekNextChar + 2 * layout.labelSpace : maxLineHeight;

      return {
	type:"label-line",
	width:width,
	height:height,
	direction:layout.direction,
	fontSize:layout.fontSize,
	textLineSize:{width: width, height:height},
	rubyLineSize:{width:0, height:0},
	childs:this.lineChars,
	textSpaceBefore:layout.labelSpace,
	textSpaceAfter:layout.labelSpace,
	rubyList:[],
	attr:attr
      };
    },

    createPage : function(direction, width, height, childs){
      return {
	type:"page",
	direction:direction,
	width:width,
	height:height,
	childs:childs
      };
    },

    createErrorMsg : function(layout, msg){
      var lineHeight = layout.fontSize * 5;
      return this.createInlineReader(layout, {
	direction:"horizontal",
	width: (layout.isVertical?  lineHeight : layout.maxNextChar),
	height: (layout.isVertical? layout.maxNextChar : lineHeight),
	theme: "error",
	"class": "error",
	nopager:true,
	content:msg
      });
    },

    createInlineReader : function(layout, args){
      return Args.init(new Object, {
	type:"ireader",
	"class": "",
	direction:layout.direction,
	width:0,
	height:0,
	border:config.layout.readerBorder,
	fontSize:layout.fontSize,
	theme:"",
	syntax:"",
	nopager:false,
	content:""
      }, args);
    },

    getTocs : function(){
      return this.tocs;
    },

    pushTextToken : function(token){
      if(token.type == "char" || token.type == "rb" || token.type == "tcy"){
	this.pushCharToken(token);
      } else if(token.type == "word"){
	this.pushWordToken(token);
      }
    },

    // NOTICE: this function push token to 'this.lineChars'(not to 'this.tags').
    // these tag tokens are used in evaluation phase to generate proper html tag(like <a>, <b>... etc).
    pushTagToken : function(token){
      this.lineChars.push(token);
    },

    pushCharToken : function(token){
      this.seekNextChar += token.stepSize;
      this.lineChars.push(token);
      if(Token.isCharCountableToken(token)){
	this.seekCharCount++;
      }

      // if this character is used in toc tag, buffer it.
      if(this.curToc != null){
	this.curToc.title += token.data;
      }
    },

    pushWordToken : function(token){
      this.seekNextChar += token.stepSize;
      this.lineChars.push(token);
      this.seekCharCount += token.data.length;

      // if this word is used in toc tag, buffer it.
      if(this.curToc != null){
	this.curToc.title += token.data;
      }
    },

    pushTopicPath : function(toc){
      if(this.lastTopicPath != null){
	if(toc.level < this.lastTopicPath.level){ // un-indent
	  this.topicPath.pop(); // erase same level
	  this.topicPath.pop(); // erase parent level
	} else if(toc.level == this.lastTopicPath.level){
	  this.topicPath.pop(); // erase same level
	} 
      }
      this.topicPath.push(toc);
      this.lastTopicPath = toc;
    },

    pushTocStartToken : function(token){
      var attr = token.data.attr;
      var level = attr.level;
      var id = attr.id;
      this.curToc = {level:level, title:"", pageNo:this.seekPageNo, id:id};
      this.tocs.push(this.curToc);
      this.pushTagToken(token);
    },

    pushTocEndToken : function(token){
      this.pushTopicPath(this.curToc);
      this.curToc = null;
      this.pushTagToken(token);
    },

    // ruby pos is calculated assuming that all character in current line is same font size.
    // if different font size exists, it will be re-calculated when createLine by calling fixRubyPos.
    pushRubyToken : function(layout, token){
      if(layout.isVertical){
	var position = {x: 0, y:this.seekNextChar};
      } else {
	var paddingTop = Math.floor((layout.lineSpaceRate - config.layout.rubySizeRate) * this.fontSize / 2)
	var position = {x:this.seekNextChar, y:paddingTop};
      }
      //var ruby = this.createRuby(layout.direction, rubyFontSize, textFontSize, token.yomi, position);
      this.rubyList.push(this.createRuby(layout, {
	fontSize:Math.floor(this.fontSize * config.layout.rubySizeRate),
	textFontSize:this.fontSize,
	data:token.yomi,
	position:position
      }));
    },

    // if each size of fonts in line varies, we have to fix base position of ruby text.
    fixRubyPos : function(layout){
      var maxFontSize = this.getMaxFontSizeOfLine(layout);
      if(maxFontSize == layout.fontSize){
	return;
      }
      List.iter(this.rubyList, function(ruby){
	if(ruby.textFontSize < maxFontSize){
	  if(layout.isVertical){
	    ruby.position.x = -Math.floor((maxFontSize - ruby.textFontSize) / 2);
	  } else {
	    var paddingTop = Math.floor((maxFontSize - ruby.textFontSize) * (1 + layout.lineSpaceRate));
	    ruby.position.y = paddingTop;
	  }
	}
      });
    },

    startLabel : function(layout, token){
      this.textSpaceBefore += layout.labelSpace * 2;
      this.textSpaceAfter += layout.labelSpace * 2;
      this.labelAttr = token.data.attr;
    },

    endLabel : function(layout, token){
      // do nothing
    },

    getTextSpaceSize : function(){
      return this.textSpaceBefore + this.textSpaceAfter;
    },

    getRestCharSpace : function(layout){
      return layout.maxNextChar - this.seekNextChar - this.getTextSpaceSize();
    },

    getRestLineSpace : function(layout){
      return layout.maxNextLine - this.seekNextLine;
    },

    getRestWidth : function(layout){
      return layout.isVertical? this.getRestLineSpace(layout) : this.getRestCharSpace(layout);
    },

    getRestHeight : function(layout){
      return layout.isVertical? this.getRestCharSpace(layout) : this.getRestLineSpace(layout);
    },

    // get max font size in current line tokens.
    // this is used to fix base position of ruby text with various font size in same line.
    getMaxFontSizeOfLine : function(layout){
      return List.fold(this.lineChars, config.layout.minFontSize, function(ret, token){
	if(typeof token.fontSize != "undefined" && token.fontSize > ret){
	  return token.fontSize;
	} else {
	  return ret;
	}
      });
    },

    // find latest scaling tag, and calc current font size.
    // this is called when </font> tag is parsed.
    getCurFontSize : function(baseFontSize){
      for(i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == "font" && typeof tag.attr.scale != "undefined"){
	  return Math.floor(baseFontSize * tag.attr.scale);
	}
      }
      return baseFontSize;
    },

    getCurFontColor : function(){
      for(i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == "font" && typeof tag.attr.color != "undefined"){
	  return tag.attr.color;
	}
      }
      return config.color.defCharImgColor;
    },

    // for performance, half and quatro size of font are cached when font size is updated.
    updateFontSize : function(fontSize){
      this.fontSize = fontSize;
      this.fontSize2 = Math.floor(fontSize / 2);
      this.fontSize4 = Math.floor(fontSize / 4);
    },

    updateFontColor : function(fontColor){
      this.fontColor = CharImgColor.get(fontColor);
    },

    // NOTICE: in layout parsing, only <font scale='???'> tags matter,
    // because all other props(color, links ... etc) don't matter
    // for layouting element. that's just style of view, not sizing issue.
    // so other tags(both open and close) are just pushed to lineTokens,
    // and they are processed by evaluator.
    pushTag : function(data){
      this.tags.push(data);
    },

    popTag : function(name){
      var tmp = [];
      while(this.tags.length > 0){
	var top = this.tags.pop();
	if(top.name == name){
	  break;
	}
	tmp.push(top);
      }
      while(tmp.length > 0){
	this.tags.push(tmp.pop());
      }
    }
  };

  return ParserContext;
})();


// ------------------------------------------------------------------------
// theme
// ------------------------------------------------------------------------
var Theme = {
  code:{
    fontSizeRate : 0.7,
    leadingRate : 1.8
  },
  error:{
    fontSizeRate : 1.0,
    leadingRate : 1.8
  }
};

// ------------------------------------------------------------------------
// layout
// ------------------------------------------------------------------------
var Layout = (function LayoutClosure(){
  var cssProps = {
    "vertical":{
      "page-size":"width",
      "block-float":"right",
      "line-text-align":"center",
      "ruby-line-text-align": "left",

      // margin
      "margin-before":"margin-top",
      "margin-after":"margin-bottom",
      "margin-prev":"margin-right",
      "margin-next":"margin-left",
      
      // border
      "border-before":"border-top",
      "border-after":"border-bottom",
      "border-prev":"border-right",
      "border-next":"border-left",

      "dummy": ""
    },
    "horizontal":{
      "page-size":"height",
      "block-float":"left",
      "line-text-align":"left",
      "ruby-line-text-align": "left",

      // margin
      "margin-before":"margin-left",
      "margin-after":"margin-right",
      "margin-prev":"margin-top",
      "margin-next":"margin-bottom",

      // border
      "border-before":"border-left",
      "border-after":"border-right",
      "border-prev":"border-top",
      "border-next":"border-bottom",

      "dummy": ""
    }
  };

  var objProps = {
    "vertical": {
      "max-next-line": "width"
    },
    "horizontal": {
      "max-next-line": "height"
    }
  };

  function Layout(opt){
    Args.init(this, {
      direction: "vertical",
      theme: null,
      leadingRate: config.layout.defLeadingRate, // distance from current baseline to next baseline.
      width: 400,
      height: 300,
      fontSize: 16,
      enableRuby: true,
      disableTailSpace:false,
      charImgColor:"000000" // this is not used for color of font, but for color of character image.
    }, opt);

    this.update();
  }

  Layout.prototype = {
    // caution: these values must be updated always when basic values(such as width, height, fontSize...etc) are changed.
    update: function(){
      if(this.theme != null){
	this.fontSize = Math.floor(this.fontSize * (this.theme.fontSizeRate || 1));
	this.leadingRate = this.theme.leadingRate || this.leadingRate;
      }
      this.isVertical = this.direction.match(/vertical/)? true : false;
      this.lineSpaceRate = this.leadingRate - 1.0;
      this.blockMargin = Math.floor(this.fontSize * config.layout.blockMarginRate);
      this.labelSpace = Math.floor(this.fontSize * this.lineSpaceRate / 2);
      this.captFontSize = Math.floor(this.fontSize * config.layout.captionSizeRate);
      this.captMargin = Math.floor(this.captFontSize * config.layout.captionMarginRate);

      if(this.isVertical){
	this.spaceForHeadNG = this.disableTailSpace? 0 : Math.floor(this.fontSize / 2);
	this.maxNextChar = this.height - this.spaceForHeadNG;
	this.maxNextLine = this.width;
	this.maxBlockWidth = this.width;
	this.maxBlockHeight = this.maxNextChar - this.blockMargin;
      } else {
	// in horizontal mode, stepSize of character always same size
	// so spaceForHeadNg equals to fontSize.
	this.spaceForHeadNG = this.disableTailSpace? 0 : this.fontSize;
	this.maxNextChar = this.width - this.spaceForHeadNG;
	this.maxNextLine = this.height;
	this.maxBlockWidth = this.maxNextChar - this.blockMargin;
	this.maxBlockHeight = this.height;
      }
    },

    getCssProp : function(name){
      return cssProps[this.direction][name];
    },

    getProp : function(name){
      return objProps[this.direction][name];
    },

    getBlockRestWidth : function(blockWidth){
      return this.isVertical? blockWidth : this.maxBlockWidth - blockWidth;
    },

    getBlockRestHeight : function(blockHeight){
      return this.isVertical? this.maxBlockHeight - blockHeight : blockHeight;
    }
  };

  return Layout;
})();


// ------------------------------------------------------------------------
//  parser
// ------------------------------------------------------------------------
var DocumentParser = (function DocumentParserClosure() {
  var sizeOfElement = function(layout, element){
    if(layout.isVertical){
      var size = element.width || 0;
    } else {
      var size = element.height || 0;
    }
    if(element.type == "page" && element.tail){
      size = element.size;
    }
    if(typeof element.border != "undefined"){
      size += element.border * 2;
    }
    return size;
  };

  var sizeOfParentRest = function(parent_layout, cur_layout, cur_offset){
    return parent_layout.maxNextLine - (cur_layout.maxNextLine + cur_offset);
  };

  function ForkSet(rest_size_list){
    this.forks = [];
    this.rest_size_list = rest_size_list;
  }

  ForkSet.prototype = {
    add : function(fork){
      this.forks.push(fork);
    },

    hasNext : function(){
      return List.exists(this.forks, function(fork){
	return fork.hasNext();
      });
    },

    mergePages : function(layout, ctx, pages){
      if(pages.length == 1){
	return pages[0];
      }
      var self = this;
      var max_size = List.fold(pages, 0, function(max, page){
	var size = sizeOfElement(layout, page);
	return (size > max)? size : max;
      });
      var max_prop = layout.getProp("max-next-line");
      List.iter(pages, function(page){
	page[max_prop] = page.size = max_size;
      });
      var wrap_page_width = layout.isVertical? max_size : layout.width;
      var wrap_page_height = layout.isVertical? layout.height : max_size;
      return ctx.createPage(layout.direction, wrap_page_width, wrap_page_height, pages);
    },

    yieldPage : function(layout, ctx){
      var max_prop = layout.getProp("max-next-line");
      var max_next_line = (this.rest_size_list.length > 0)? this.rest_size_list.shift() : layout[max_prop];
      var pages = List.map(this.forks, function(fork){
	var orig_max = fork.layout[max_prop];
	fork.args = fork.args || {};
	fork.layout[max_prop] = max_next_line;
	if(fork.args.border){
	  fork.layout[max_prop] -= fork.args.border * 2;
	}
	if(orig_max != fork.layout[max_prop]){
	  fork.layout.update();
	}
	var page = fork.parsePage(fork.args);
	page.forked = true;
	return page;
      });
      return this.mergePages(layout, ctx, pages);
    }
  };

  function DocumentParser(lexer, layout, ctx){
    this.lexer = lexer;
    this.layout = layout;
    this.ctx = (typeof ctx != "undefined")? ctx : new ParserContext(layout);
    this.forkset = null;
    this.pushBlocks = [];
    this.finish = false;
    this.onParseElementBefore = function(lexer, layout, ctx, token){
      return token;
    };
  }

  DocumentParser.prototype = {
    getContext : function(){
      return this.ctx;
    },

    hasNext : function(){
      return !this.finish;
    },

    hasForkNext : function(){
      return List.exists(this.forks, function(fork){
	return fork.hasNext();
      });
    },

    findTextToken : function(lexer, layout, ctx, start){
      var ctx2 = null;
      var ret = {token:null, tags:[]};
      var lookahead = 50;
      for(var i = start; i < start + lookahead; i++){
	var token = lexer.lookTokenByIndex(i);

	// by lexing preprocessor, never happen but if found, it means there is no next char,
	// because block element is to be displayed AFTER newline.
	if(Token.isBlockToken(token)){
	  break;
	}
	if(Token.isTextToken(token)){
	  this.parseMetrics(lexer, layout, (ctx2 == null)? ctx : ctx2, token);
	  ret.token = token;
	  break;
	}
	if(token.type == "tag"){
	  ret.tags.push(token);
	  var name = token.data.name;
	  if(name == "font"){
	    ctx2 = (ctx2 == null)? Util.clone(ctx) : ctx2;
	    ctx2.pushTag(token.data);
	    ctx2.fontSize = ctx2.getCurFontSize(layout.fontSize);
	  } else if(name == "/font"){
	    ctx2 = (ctx2 == null)? Util.clone(ctx) : ctx2;
	    ctx2.popTag("font");
	    ctx2.fontSize = ctx2.getCurFontSize(layout.fontSize);
	  }
	}
      }
      return ret;
    },

    pushTextToLine : function(lexer, layout, ctx, token){
      var restSpace = ctx.getRestCharSpace(layout);
      var next = this.findTextToken(lexer, layout, ctx, token.index + 1);

      // ignore head half space if next text is word token.
      if(ctx.seekNextChar == 0 && token.data == " " && next.token.type == "word"){
	return;
      }

      if(next.token == null || next.token.data == "\r" || next.token.data == "\n"){
	ctx.pushTextToken(token);
	return;
      }

      if(restSpace - token.stepSize >= next.token.stepSize){
	ctx.pushTextToken(token);
	return;
      }

      // (by config): not check any next NG
      if(config.system.lineBreakCheckLevel == 0){
	throw "LineEnd";
      }

      if(Char.isTailNg(token.data)){
	lexer.setPos(token.index);
	throw "LineEnd";
      }

      if(!Char.isHeadNg(next.token.data) || next.token.type == "word"){
	ctx.pushTextToken(token); // as last char
	lexer.skipCRLF(); // avoid double newline
	throw "LineEnd";
      }

      // (by config): do not check  next NG
      if(config.system.lineBreakCheckLevel == 1){
	throw "LineEnd";
      }

      var next2 = this.findTextToken(lexer, layout, ctx, next.token.index + 1);
      if(next2.token == null || !Char.isHeadNg(next2.token.data)){
	next2.token.fontSize = layout.fontSize;
	ctx.pushTextToken(token);
	ctx.pushTextToken(next.token);
	lexer.setPos(next.token.index + 1);
	lexer.skipCRLF();

	// apply tags before next token
	for(var i = 0; i < next.tags.length; i++){
	  this.parseLineTag(lexer, layout, ctx, next.tags[i]);
	}
	throw "LineEnd";
      }
      lexer.setPos(token.index);
      throw "LineEnd";
    },

    pushLongWordToLine : function(lexer, layout, ctx, token){
      var restSpace = ctx.getRestCharSpace(layout);
      var partCount = Math.floor(restSpace / ctx.fontSize2);
      var totalCount = token.data.length;
      var wordPart = token.data.substring(0, partCount);
      var wordRest = token.data.substring(partCount, totalCount);

      // push first half of word
      var tokenPart = Util.clone(token);
      tokenPart.data = wordPart;
      this.parseMetrics(lexer, layout, ctx, tokenPart);
      ctx.pushTextToken(tokenPart);

      // on next loop, lexer start from rest part of this word
      lexer.setPos(token.index);
      token.data = wordRest;
      this.parseMetrics(lexer, layout, ctx, token);
      throw "LineEnd";
    },

    pushElementToPage : function(lexer, layout, ctx, page, element){
      var element_size = sizeOfElement(layout, element);
      if(ctx.seekNextLine + element_size > layout.maxNextLine){
	throw "Overflow";
      }
      ctx.seekNextLine += element_size;
      page.size += element_size;
      page.childs.push(element);
      if(ctx.seekNextLine == layout.maxNextLine){
	throw "EndPage";
      }
    },

    parseMetrics : function(lexer, layout, ctx, token){
      if(token.type == "char" || token.type == "rb"){
	if(token.src){
	  this.parseMetricsIconChar(lexer, layout, ctx, token);
	} else if(layout.isVertical && token.img){
	  this.parseMetricsImgChar(lexer, layout, ctx, token);
	} else {
	  this.parseMetricsChar(lexer, layout, ctx, token);
	}
      } else if(token.type == "tcy"){
	this.parseMetricsTcy(lexer, layout, ctx, token);
      } else if(token.type == "word"){
	this.parseMetricsWord(lexer, layout, ctx, token);
      }
    },

    parseMetricsChar : function(lexer, layout, ctx, token){
      token.fontSize = ctx.fontSize;
      token.stepSize = ctx.fontSize;

      if(layout.isVertical){
	if(token.cnv && token.cnv == "&nbsp;"){
	  token.stepSize = ctx.fontSize2;
	} else if(token.hscaleImg != 1){
	  token.stepSize = Math.floor(ctx.fontSize * token.hscaleImg);
	}
      } else if(token.half){
	token.stepSize = ctx.fontSize2;
      }
    },

    parseMetricsImgChar : function(lexer, layout, ctx, token){
      this.parseMetricsChar(lexer, layout, ctx, token);
      if(layout.isVertical){
	token.color = ctx.fontColor; // we need color to switch resource path of image for each color.
      }

      if(!config.system.enableYakuMetricsCheck){
	return;
      }

      if(token.img.indexOf("kakko") < 0 && token.img != "touten" && token.img != "kuten"){
	return;
      }

      var checker = function(token){
	return Token.isTextToken(token) || token.type == "ruby";
      };

      var prevToken = lexer.findUntil(token.index - 1, -1, checker);
      var prevText = "";
      if(prevToken != null){
	if(Token.isTextToken(prevToken)){
	  prevText = prevToken.data;
	} else if(prevToken.type == "ruby"){
	  prevText = prevToken.kanji.substring(-1);
	}
      }

      var nextToken = lexer.findUntil(token.index + 1, 1, checker);
      var nextText = "";
      if(nextToken != null){
	if(Token.isTextToken(nextToken)){
	  nextText = nextToken.data;
	} else if(nextToken.type == "ruby") {
	  //nextText = nextToken.kanji[0]; // IE error
	  nextText = nextToken.kanji.substring(0,1);
	}
      }

      // some special char needs curnning.
      if(Char.isKakkoStartChar(token.data) && prevText != ""){
	if(!Char.isKakkoStartChar(prevText) && !Char.isKutenTouten(prevText)){
	  token["margin-before"] = ctx.fontSize2;
	  token.stepSize = ctx.fontSize;
	}
      } else if(Char.isKakkoEndChar(token.data) && nextText != ""){
	if(!Char.isKakkoEndChar(nextText) && !Char.isKutenTouten(nextText)){
	  token["margin-after"] = ctx.fontSize2;
	  token.stepSize = ctx.fontSize;
	}
      } else if(token.img == "touten" && nextText != ""){
	if(!Char.isKakkoEndChar(nextText)){
	  token["margin-after"] = ctx.fontSize2;
	  token.stepSize = ctx.fontSize;
	}
      } else if(token.img == "kuten" && nextText != ""){
	if(!Char.isKakkoEndChar(nextText)){
	  token["margin-after"] = ctx.fontSize2;
	  token.stepSize = ctx.fontSize;
	}
      }
    },

    parseMetricsIconChar : function(lexer, layout, ctx, token){
      var size = layout.isVertical? token.height : token.width;
      token.fontSize = size;
      token.stepSize = size;
    },

    parseMetricsTcy : function(lexer, layout, ctx, token){
      token.fontSize = ctx.fontSize;
      token.stepSize = ctx.fontSize;
    },

    parseMetricsWord : function(lexer, layout, ctx, token){
      token.fontSize = ctx.fontSize;
      token.stepSize = token.data.length * ctx.fontSize2;
    },

    parseChar : function(lexer, layout, ctx, token){
      if(token.data == "\r"){
	return;
      }
      if(token.data == "\n"){
	throw "LineEnd";
      }
      if(token.data == " " && !ctx.greedyMode){
	lexer.skipUntil(function(token2){
	  return (token2.type == "char" && token2.data == " ");
	});
      }
      this.parseMetrics(lexer, layout, ctx, token);
      this.pushTextToLine(lexer, layout, ctx, token);
    },

    parseWord : function(lexer, layout, ctx, token){
      if(typeof token.stepSize == "undefined"){
	this.parseMetrics(lexer, layout, ctx, token);
      }
      // if word is longer than layout max, split it
      if(token.stepSize > layout.maxNextChar){
	this.pushLongWordToLine(lexer, layout, ctx, token);
      } else {
	// word is short enough to push as normal text token.
	this.pushTextToLine(lexer, layout, ctx, token);
      }
    },

    parseRuby : function(lexer, layout, ctx, token){
      ctx.pushRubyToken(layout, token);
    },

    parseFontStart : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      if(typeof attr.scale != "undefined"){
	var scale = attr.scale = parseFloat(attr.scale);
	var fontSize = Math.floor(ctx.fontSize * scale);
	ctx.updateFontSize(fontSize);
      }
      if(typeof attr.color != "undefined"){
	ctx.updateFontColor(attr.color);
      }
      ctx.pushTag(token.data);

      // although font size is already fetched, 
      // we still need this token for creating line object.
      ctx.pushTagToken(token);
    },

    parseFontEnd : function(lexer, layout, ctx, token){
      ctx.pushTagToken(token);
      ctx.popTag("font");
      var fontSize = ctx.getCurFontSize(layout.fontSize);
      var fontColor = ctx.getCurFontColor();
      ctx.updateFontSize(fontSize);
      ctx.updateFontColor(fontColor);
    },

    parseHeaderStart : function(lexer, layout, ctx, token){
      var level = parseInt(token.data.name.substring(1)) - 1;
      token.data.name = "font";
      token.data.attr.family = "Meiryo";
      token.data.attr.scale = config.layout.headerScales[level];
      this.parseFontStart(lexer, layout, ctx, token);
    },

    parseHeaderEnd : function(lexer, layout, ctx, token){
      token.data.name = "/font";
      this.parseFontEnd(lexer, layout, ctx, token);
      lexer.skipCRLF();
      throw "LineEnd";
    },

    parseTocStart : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      attr.level = parseInt(attr.level || 0);
      attr.id = attr.id || "";
      ctx.pushTocStartToken(token);
    },

    parseTocEnd : function(lexer, layout, ctx, token){
      ctx.pushTocEndToken(token);
    },

    parseLabelStart : function(lexer, layout, ctx, token){
      lexer.skipCRLF();
      ctx.updateFontColor(config.color.labelCharImgColor);
      ctx.startLabel(layout, token);
    },

    parseLabelEnd : function(lexer, layout, ctx, token){
      var fontColor = ctx.getCurFontColor();
      ctx.updateFontColor(fontColor);
      ctx.endLabel(layout, token);
      throw "LineEnd";
    },

    parseIcon : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      token.width = parseInt(attr.width || ctx.fontSize);
      token.height = parseInt(attr.height || ctx.fontSize);
      token.src = attr.src;
      token.type = "char";
      delete token.data;
      token.data = "";
      this.parseMetrics(lexer, layout, ctx, token);
      this.pushTextToLine(lexer, layout, ctx, token);
    },

    parseLineTag : function(lexer, layout, ctx, token){
      switch(token.data.name){
      case "br":
	throw "LineEnd";
      case "pre":
	ctx.greedyMode = true;
	break;
      case "/pre":
	ctx.greedyMode = false;
	break;
      case "font":
	this.parseFontStart(lexer, layout, ctx, token);
	break;
      case "/font":
	this.parseFontEnd(lexer, layout, ctx, token);
	break;
      case "h1": case "h2": case "h3": case "h4": case "h5": case "h6":
	this.parseHeaderStart(lexer, layout, ctx, token);
	break;
      case "/h1": case "/h2": case "/h3": case "/h4": case "/h5": case "/h6":
	this.parseHeaderEnd(lexer, layout, ctx, token);
	break;
      case "toc":
	this.parseTocStart(lexer, layout, ctx, token);
	break;
      case "/toc":
	this.parseTocEnd(lexer, layout, ctx, token);
	break;
      case "part": case "chapter": case "section": case "subsection":
	token.data.attr.level = Toc.getLevel(token.data.name);
	token.data.name = "toc";
	this.parseTocStart(lexer, layout, ctx, token);
	break;
      case "/part": case "/chapter": case "/section": case "/subsection":
	token.data.name = "/toc";
	this.parseTocEnd(lexer, layout, ctx, token);
	break;
      case "label":
	this.parseLabelStart(lexer, layout, ctx, token);
	break;
      case "/label":
	this.parseLabelEnd(lexer, layout, ctx, token);
	break;
      case "icon":
	this.parseIcon(lexer, layout, ctx, token);
	break;
      default:
	ctx.pushTagToken(token);
	break;
      }
    },

    // line element has it's layout max,
    // and filled by charactor object and ends with newline or blockelement
    // because preprocessor(Lexer::_preprocess) makes all block elements end with newline.
    parseLine : function(lexer, layout, ctx){
      try {
	while(true){
	  var token = lexer.getToken();
	  switch(token.type){
	  case "char": case "rb": case "tcy":
	    this.parseChar(lexer, layout, ctx, token);
	    break;
	  case "word":
	    this.parseWord(lexer, layout, ctx, token);
	    break;
	  case "ruby":
	    this.parseRuby(lexer, layout, ctx, token);
	    break;
	  case "tag":
	    this.parseLineTag(lexer, layout, ctx, token);
	    break;
	  }
	}
      } catch (e){
	if(e != "LineEnd"){
	  debug(e);
	  //alert(e);
	}
	return ctx.createLine(layout);
      }
    },

    parseBlockCaptions : function(layout, ctx, block, attr){
      var capts = [];
      List.iter(["caption-head", "caption-foot"], function(capt_pos){
	if(attr[capt_pos]){
	  capts.push(ctx.createCaption(layout, {
	    data: attr[capt_pos],
	    captionPos: capt_pos,
	    "margin-bottom": (capt_pos == "caption-head")? layout.captMargin : 0,
	    "margin-top": (capt_pos == "caption-foot")? layout.captMargin : 0
	  }));
	}
      });
      return capts;
    },

    parseBlockSizeAttr : function(layout, ctx, attr){
      var defsize = {
	"width": 0,
	"height": 0,
	"border": 0,
	"font-size": layout.fontSize
      };
      for(prop in defsize){
	attr[prop] = parseInt((typeof attr[prop] == "undefined")? defsize[prop] : attr[prop]);
      }
      return attr;
    },

    parseBlockSize : function(layout, ctx, block, capts){
      var b2 = block.border * 2;
      var rest_width = ctx.getRestWidth(layout);
      var rest_height = ctx.getRestHeight(layout);
      var capt_height = List.fold(capts, 0, function(ret, capt){
	return ret + capt.height;
      });

      if(block.width <= 0 || block.height <= 0){
	block.error = "block size invalid(" + block.width + "," + block.height + ")";
	return block;
      }

      // get actual block size(with margin size)
      // NOTICE: block margin is added to only one side.
      var act_width = (layout.isVertical? block.width : block.width + layout.blockMargin) + b2;
      var act_height = (layout.isVertical? block.height + layout.blockMargin: block.height) + b2 + capt_height;

      // if enough space is left, just put it.
      if(act_width < rest_width && act_height < rest_height){
	return block;
      }

      // if layout has enough space for whole size of block, but not enough for 'current' page,
      // put it in next page.
      if(act_width < layout.maxBlockWidth && act_height < layout.maxBlockHeight){
	throw "Overflow";
      }

      // act_width -> rest_width
      if(act_width > rest_width){
	// act_width : act_height = rest_width : ?
	var act_width2 = rest_width;
	var act_height2 = rest_width * act_height / act_width;
	act_width = Math.max(1, Math.floor(act_width2));
	act_height = Math.max(1, Math.floor(act_height2));
      }
      // act_height -> rest_height
      if(act_height > rest_height){
	// act_width : act_height = ? : rest_height
	var act_height2 = rest_height;
	var act_width2 = act_width * rest_height / act_height;
	act_width = Math.floor(act_width2);
	act_height = Math.floor(act_height2);
      }

      var enable_width = config.layout.acceptableResizeRate * block.width;
      var enable_height = config.layout.acceptableResizeRate * block.height;
      block.width = Math.max(0, (layout.isVertical? act_width : act_width - layout.blockMargin) - b2);
      block.height = Math.max(0, (layout.isVertical? act_height - layout.blockMargin : act_height) - b2 - capt_height);

      if(block.width < enable_width || block.height < enable_height){
	block.error = "try to resize block, but not acceptable for this layout(" + block.width + "," + block.height + ")";
      }
      return block;
    },
    
    parseImg : function(lexer, layout, ctx, token){
      var attr = this.parseBlockSizeAttr(layout, ctx, token.data.attr);
      var block = ctx.createImage(layout, {
	name:"img",
	width:attr.width,
	height:attr.height,
	border:attr.border,
	src:attr.src
      });
      return this.parseBlockElement(lexer, layout, ctx, block, attr);
    },

    parseTable : function(lexer, layout, ctx, token){
      var attr = this.parseBlockSizeAttr(layout, ctx, token.data.attr);
      var block = ctx.createBlock(layout, {
	width: attr.width,
	height: attr.height,
	content: token.data.content,
	name: token.data.name
      });
      return this.parseBlockElement(lexer, layout, ctx, block, attr);
    },

    parseTextarea : function(lexer, layout, ctx, token){
      var attr = this.parseBlockSizeAttr(layout, ctx, token.data.attr);
      var block = ctx.createBlock(layout, {
	width: attr.width,
	height: attr.height,
	content: token.data.content,
	name: token.data.name
      });
      block = this.parseBlockElement(lexer, layout, ctx, block, attr);
      return Args.copy(block, {
	"onclick": attr.onclick || ""
      });
    },

    parseInlineFrame : function(lexer, layout, ctx, token){
      var attr = this.parseBlockSizeAttr(layout, ctx, token.data.attr);
      var block = ctx.createInlineFrame(layout, {
	width: attr.width,
	height: attr.height,
	content: token.data.content,
	name: token.data.name,
	src: (attr.src || ""),
	frameborder: parseInt(attr.frameborder || 0)
      });
      return this.parseBlockElement(lexer, layout, ctx, block, attr);
    },

    parseInlinePage : function(lexer, layout, ctx, token){
      Args.copy(token.data.attr, {
	nopager: true
      });
      return this.parseInlineReader(lexer, layout, ctx, token);
    },

    parseInlineReader : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      attr.border = (typeof attr.border != "undefined")? parseInt(attr.border) : config.layout.readerBorder;
      attr = this.parseBlockSizeAttr(layout, ctx, attr);
      var block = ctx.createInlineReader(layout, {
	"class": (attr["class"] || ""),
	direction:(attr.direction || layout.direction),
	width:attr.width,
	height:attr.height,
	border:attr.border,
	fontSize:parseInt(attr["font-size"] || layout.fontSize),
	theme:(attr.theme || ""),
	syntax:(attr.syntax || ""),
	nopager:attr.nopager,
	content:Util.cutHeadCRLF(token.data.content)
      });
      return this.parseBlockElement(lexer, layout, ctx, block, attr);
    },

    parseBlockElement : function(lexer, layout, ctx, block, attr){
      // setup common props for block element
      Args.init(block, {
	"class": attr["class"] || "",
	"border": attr.border,
	"align": "",
	"direction": layout.direction
      }, attr);
      var capts = this.parseBlockCaptions(layout, ctx, block, attr);
      var block = this.parseBlockSize(layout, ctx, block, capts);

      if(block.error){
	return ctx.createErrorMsg(layout, "&lt;" + block.name + "&gt; " + block.error);
      }
      if(capts.length > 0){
	block = this.parseBlockWithCaption(lexer, layout, ctx, block, capts);
      }
      if(attr.pushed){
	return this.parseBlockWithPush(lexer, layout, ctx, block);
      } else if(block.align != ""){
	block = this.parseBlockWithAlign(lexer, layout, ctx, block);
      }
      return block;
    },

    parseBlockWithCaption : function(lexer, layout, ctx, block, capts){
      var childs = [block];
      var page_width = block.width;
      var page_height = block.height;

      List.iter(capts, function(capt){
	page_height += capt.height;
	if(capt.captionPos == "caption-head"){
	  childs.unshift(capt);
	} else {
	  childs.push(capt);
	}
      });
      var page = ctx.createPage(block.direction, page_width, page_height, childs);

      // delegate value to wrap page
      Args.copy(page, {
	"class": block["class"] || "",
	direction: block.direction,
	align: block.align
      });

      delete block.align;
      delete block["class"];

      return page;
    },

    parseBlockWithPush : function(lexer, layout, ctx, block){
      var push_margin = layout.blockMargin;
      var push_size = layout.isVertical? block.width + push_margin : block.height + push_margin;
      if(ctx.seekNextLine + push_size < layout.maxNextLine){
	ctx.seekNextLine += push_size;
	block["margin-prev"] = push_margin;
	block.push_size = push_size;
	this.pushBlocks.push(block);
      }
      return this.parseElement(lexer, layout, ctx);
    },

    parseBlockWithAlign : function(lexer, layout, ctx, block){
      var is_block_first = (block.align == "top" || block.align == "left");
      var disable_tail_space = block.direction == layout.direction; // if same direction, share rest space with parent layout.
      var aligned_width = layout.getBlockRestWidth(block.width);
      var aligned_height = layout.getBlockRestHeight(block.height);
      var backup_next_line = ctx.seekNextLine; // backup parent next line
      ctx.seekNextLine = 0; // temporary set zero
      var aligned_parser = new DocumentParser(lexer, new Layout({
	width:aligned_width,
	height:aligned_height,
	fontSize:layout.fontSize,
	direction:layout.direction,
	disableTailSpace:disable_tail_space
      }), ctx);
      aligned_parser.aligned = true;
      aligned_parser.parent = this;
      aligned_parser.offset = backup_next_line;
      var parser_args = new Object;
      parser_args[is_block_first? "margin-before" : "margin-after"] = layout.blockMargin;
      var aligned_page = aligned_parser.parsePage(parser_args); // output aligned page
      ctx.seekNextLine = backup_next_line; // restore parent next line
      aligned_page.aligned = true;
      this.forkset = aligned_parser.forkset; // inherit forks
      var page_width = layout.isVertical? block.width : layout.width;
      var page_height = layout.isVertical? layout.height : block.height;
      var page_childs = is_block_first? [block, aligned_page] : [aligned_page, block];
      return ctx.createPage(layout.direction, page_width, page_height, page_childs);
    },

    // block element has layout of fixed size.
    // but sometimes it has 'align' property(top, left, bottom, right)
    // that makes re-usable rest space.
    parseBlockTag : function(lexer, layout, ctx, token){
      lexer.stepPos();
      lexer.skipCRLF(); // avoid double newline.

      switch(token.data.name){
      case "img":
	return this.parseImg(lexer, layout, ctx, token);
      case "table":
	return this.parseTable(lexer, layout, ctx, token);
      case "textarea":
	return this.parseTextarea(lexer, layout, ctx, token);
      case "iframe":
	return this.parseInlineFrame(lexer, layout, ctx, token);
      case "ipage":
	return this.parseInlinePage(lexer, layout, ctx, token);
      case "ireader":
	return this.parseInlineReader(lexer, layout, ctx, token);
      }
      return null; // still not supported.
    },

    parseIndent : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      var conf = config.layout.indent;
      attr.before = parseInt(attr.before || conf.indentBefore);
      attr.after = parseInt(attr.after || conf.indentAfter);
      if(attr.count){
	attr.count = attr.before = attr.after = parseInt(attr.count);
      }
      attr.border = parseInt(attr.border || 0);
      attr["margin-before"] = layout.fontSize * attr.before;
      attr["margin-after"] = layout.fontSize * attr.after;
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseBlockquote : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      var conf = config.layout.blockquote;
      attr["font-size"] = parseInt(attr["font-size"] || Math.floor(layout.fontSize * conf.fontSizeRate));
      attr["border"] = (typeof attr.border != "undefined")? parseInt(attr.border) : conf.border;
      token.data.content = Tag.wrap("indent", {
	before:conf.indentBefore,
	after:conf.indentAfter,

	// delegate theme and syntax
	theme:(attr.theme || ""),
	syntax:(attr.syntax || "")
      }, token.data.content);
      attr.theme = "";
      attr.syntax = "";
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseFieldset : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      var conf = config.layout.fieldset;
      var content = Util.cutTagHeadSpace(token.data.content)
	.replace(/<\/legend>[\s]+/, "</legend>")
	.replace(/<legend([^>]*)>(.+)<\/legend>/, "\n<label$1>$2</label>\n");
      attr["border"] = conf.border || 1;
      attr["font-size"] = parseInt(attr["font-size"] || Math.floor(layout.fontSize * conf.fontSizeRate));
      token.data.content = Tag.wrap("indent", {
	before:conf.indentBefore,
	after:conf.indentAfter,
	raw:true,

	// delegate theme and syntax
	theme:(attr.theme || ""),
	syntax:(attr.syntax || "")
      }, content);
      attr.theme = "";
      attr.syntax = "";
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseDL : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      var conf = config.layout.dl;
      token.data.content = Util.cutTagHeadSpace(token.data.content);
      if(conf.indentBefore > 0 || conf.indentAfter > 0){
	attr["border"] = 0;
	token.data.content = Tag.wrap("indent", {
	  before:conf.indentBefore,
	  after:conf.indentAfter
	}, token.data.content);
      }
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseDT : function(lexer, layout, ctx, token){
      var conf = config.layout.dl.dt;
      var attr = token.data.attr;
      attr["font-size"] = parseInt(attr["font-size"] || Math.floor(layout.fontSize * conf.fontSizeRate));
      token.data.content = Util.cutTagHeadSpace(token.data.content);
      token.data.content = Tag.wrap("strong", {}, token.data.content);
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseDD : function(lexer, layout, ctx, token){
      var conf = config.layout.dl.dd;
      var attr = token.data.attr;
      attr["font-size"] = parseInt(attr["font-size"] || Math.floor(layout.fontSize * conf.fontSizeRate));
      token.data.content = Util.cutTagHeadSpace(token.data.content);
      token.data.content = Tag.wrap("indent", {
	before:conf.indentBefore,
	after:conf.indentAfter
      }, token.data.content);
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    // single fork page makes one recursive child page.
    // child page has it's own coordinate.
    parseSingleForkPage : function(lexer, layout, ctx, token){
      var text = token.data.content;
      var attr = token.data.attr;
      Args.init(attr, {
	"margin-before": 0,
	"margin-after": 0,
	"border": 0,
	"font-size": layout.fontSize
      }, attr);
      attr["border"] = parseInt(attr.border);
      attr["margin-before"] = parseInt(attr["margin-before"]);
      attr["margin-after"] = parseInt(attr["margin-after"]);
      var rest_next_line = ctx.getRestLineSpace(layout);
      var fork_extra = attr["margin-before"] + attr["margin-after"];
      var fork_width = layout.isVertical? rest_next_line : layout.maxNextChar - fork_extra;
      var fork_height = layout.isVertical? layout.maxNextChar - fork_extra : rest_next_line;
      var fork_theme = attr.theme? Theme[attr.theme] : null;
      var fork_lexer = new BufferedLexer(text);
      var fork_layout = new Layout({
	direction: layout.direction, // must be same direction.
	width: fork_width,
	height: fork_height,
	theme: fork_theme,
	fontSize: parseInt(attr["font-size"])
      });
      var fork_parser = new DocumentParser(fork_lexer, fork_layout);
      fork_parser.args = attr;
      fork_parser.forked = true;
      fork_parser.parent = this;
      var max_prop = layout.getProp("max-next-line");
      var fork_rest_size_list = [rest_next_line];
      if(this.aligned){
	var parent_rest_size = sizeOfParentRest(this.parent.layout, layout, this.offset);
	fork_rest_size_list.push(parent_rest_size);
      }
      this.forkset = new ForkSet(fork_rest_size_list);
      this.forkset.add(fork_parser);
      return this.forkset.yieldPage(layout, ctx);
    },

    parseTextset : function(lexer, layout, ctx, token){
      var parent = token;
      var tconf = config.layout.textset;
      parent.childs = [];
      while(true){
	var token = lexer.getToken();
	if(token.type == "tag"){
	  var name = token.data.name;
	  var attr = token.data.attr;
	  if(name == "/textset"){
	    break;
	  }
	  if(name == "tpart"){
	    attr.scale = parseFloat(attr.scale || tconf.tpart.fontSizeRate);
	    parent.childs.push(token.data);
	  }
	}
      }
      return this.parseSetForkPage(lexer, layout, ctx, parent);
    },

    parseUL : function(lexer, layout, ctx, token){
      var attr = token.data.attr;
      var conf = config.layout.ul;
      var content = token.data.content.replace(/[\s]+(<\/?li)/gi, "$1");
      attr["border"] = 0;
      token.data.content = Tag.wrap("indent", {
	before:conf.indentBefore,
	after:conf.indentAfter
      }, content);
      this.liCount = 1;
      return this.parseSingleForkPage(lexer, layout, ctx, token);
    },

    parseLI : function(lexer, layout, ctx, token){
      var set = {childs:[]};
      var ptag = this.parent.parent.forktag;
      var pconf = config.layout[ptag] || config.layout.ul;
      var lconf = pconf.li;
      var li = token.data;
      var fontScale = parseFloat(li.attr.scale || lconf.fontSizeRate);
      var scaledFontSize = Math.floor(layout.fontSize * fontScale);

      this.liIndex = this.parent.parent.liCount++;

      if(ptag == "ol"){
	if(layout.isVertical){
	  var headerSize = scaledFontSize + scaledFontSize;
	  var listMark = "<pack>" + this.liIndex + "</pack>&nbsp;";
	} else {
	  var headerSize = Math.floor(scaledFontSize * 2.5);
	  var listMark = this.liIndex + ".&nbsp;";
	}
      } else {
	var listMark = pconf.listMark;
	var headerSize = scaledFontSize;
      }
      var header = {
	content:listMark,
	attr:{
	  scale:fontScale,
	  size:headerSize
	}
      };
      li.attr.scale = fontScale;
      li.content = Util.cutEdgeCRLF(li.content);
      set.childs.push(header);
      set.childs.push(li);
      return this.parseSetForkPage(lexer, layout, ctx, set);
    },

    // scenario tag is constructed with tree parts.
    //
    // <shead>: scenario header scape(like <thead> in table tag).
    // <sbody>: scenario body space(like <tbody> in table tag).
    // <sfoot>: scenario footer space(like <tfoot> in table tag).
    //
    // each parts makes fork page,
    // and longest page is used for size of wrap page.
    parseScenario : function(lexer, layout, ctx, token){
      var parent = token;
      var child = {};
      var sconf = config.layout.scenario;
      parent.childs = [];
      while(true){
	var token = lexer.getToken();
	if(token.type == "tag"){
	  var data = token.data;
	  var name = data.name;
	  var attr = data.attr;
	  if(name == "/scenario"){
	    break;
	  }
	  switch(name){
	  case "sbody":
	    var margin = Math.floor(layout.fontSize * sconf.sbody.marginRate);
	    attr.scale = parseFloat(attr.scale || sconf[name].fontSizeRate);
	    data.args = {};
	    data.args["margin-before"] = margin;
	    data.args["margin-after"] = margin;
	    child[name] = data;
	    break;
	  case "shead":
	  case "sfoot":
	    attr.scale = parseFloat(attr.scale || sconf[name].fontSizeRate);
	    attr.size = parseInt(attr.size || sconf[name].size);
	    child[name] = data;
	    break;
	  default:
	    break;
	  }
	}
      }
      var props = ["shead", "sbody", "sfoot"]; // push order matters.
      for(var i = 0; i < props.length; i++)(function(prop){
	if(child[prop]){
	  parent.childs.push(child[prop]);
	}
      })(props[i]);
      return this.parseSetForkPage(lexer, layout, ctx, parent);
    },

    parseSetForkPage : function(lexer, layout, ctx, token){
      var self = this;
      var childs = token.childs;
      var sized_childs = List.filter(childs, function(child){
	return (typeof child.attr.size != "undefined");
      });
      var sized_total = List.fold(sized_childs, 0, function(ret, child){
	return ret + parseInt(child.attr.size);
      });
      var unsized_total = (layout.isVertical? layout.height : layout.width) - sized_total;
      var unsized_avg = Math.floor(unsized_total / (childs.length - sized_childs.length));
      var rest_next_line = ctx.getRestLineSpace(layout);
      var gen_parser = function(text, size, fontSize, args){
	var parser = new DocumentParser(
	  new BufferedLexer(text),
	  new Layout({
	    direction: layout.direction,
	    width: layout.isVertical? rest_next_line : size,
	    height: layout.isVertical? size : rest_next_line,
	    fontSize:fontSize
	  }));
	parser.args = args;
	parser.parent = self;
	return parser;
      };
      var fork_rest_size_list = [rest_next_line];
      if(this.aligned){
	var parent_rest_size = sizeOfParentRest(this.parent.layout, layout, this.offset);
	fork_rest_size_list.push(parent_rest_size);
      }
      this.forkset = new ForkSet(fork_rest_size_list);
      for(var i = 0, len = childs.length; i < len; i++)(function(child){
	var size = parseInt(child.attr.size || unsized_avg);
	child.args = child.args || {};
	size -= child.args["margin-before"] || 0;
	size -= child.args["margin-after"] || 0;
	var fontSize = Math.floor(parseFloat(child.attr.scale || 1.0) * layout.fontSize);
	var text = child.content;
	self.forkset.add(gen_parser(text, size, fontSize, child.args));
      })(childs[i]);

      return this.forkset.yieldPage(layout, ctx);
    },

    parseForkPageTag : function(lexer, layout, ctx, token){
      lexer.stepPos();
      lexer.skipCRLF();

      switch(token.data.name){
      case "indent":
	return this.parseIndent(lexer, layout, ctx, token);
      case "blockquote":
	return this.parseBlockquote(lexer, layout, ctx, token);
      case "ul":
	return this.parseUL(lexer, layout, ctx, token);
      case "ol":
	return this.parseUL(lexer, layout, ctx, token); // use same func of UL
      case "li":
	return this.parseLI(lexer, layout, ctx, token);
      case "dl":
	return this.parseDL(lexer, layout, ctx, token);
      case "dt":
	return this.parseDT(lexer, layout, ctx, token);
      case "dd":
	return this.parseDD(lexer, layout, ctx, token);
      case "fieldset":
	return this.parseFieldset(lexer, layout, ctx, token);
      case "textset":
	return this.parseTextset(lexer, layout, ctx, token);
      case "scenario":
	return this.parseScenario(lexer, layout, ctx, token);
      }
      return null;
    },

    parseEndPage : function(lexer, layout, ctx, token){
      // if aligned page, not step this token,
      // so end-page is parsed again by parent parser.
      if(!this.aligned){
	lexer.stepPos();
	lexer.skipUntilCRLF();
      }
      throw "EndPage";
    },

    // element is a part of page. types of elements are
    // 1. text line
    // 2. block element(img, table... etc)
    // 3. recursive page
    parseElement : function(lexer, layout, ctx){
      if(this.forkset != null && this.forkset.hasNext()){
	return this.forkset.yieldPage(layout, ctx);
      }

      try {
	var token = lexer.lookToken();
	ctx.seekTextPos = token.pos;
	token = this.onParseElementBefore(lexer, layout, ctx, token);
      } catch (e){
	//debug(e);
	return null;
      }
      if(Token.isEndPageToken(token)){
	return this.parseEndPage(lexer, layout, ctx, token);
      }
      if(Token.isBlockToken(token)){
	return this.parseBlockTag(lexer, layout, ctx, token);
      }
      if(Token.isForkPageToken(token)){
	this.forktag = token.data.name;
	return this.parseForkPageTag(lexer, layout, ctx, token);
      }
      return this.parseLine(lexer, layout, ctx);
    },

    // page is a list of elements.
    parsePage : function(args){
      var page = this.ctx.createPage(this.layout.direction, this.layout.width, this.layout.height, []);
      Args.copy(page, {
	size:0,
	no: this.ctx.seekPageNo,
	head: (this.ctx.seekPageNo == 0),
	spos: this.ctx.seekTextPos,
	cpos: this.ctx.seekCharCount
      });
      Args.copy(page, args || {});

      try {
	while(true){
	  var rollback_lexpos = this.lexer.getPos();
	  var rollback_context = this.ctx.snap();
	  var element = this.parseElement(this.lexer, this.layout, this.ctx);
	  if(element == null){
	    page.tail = true;
	    this.finish = true;
	    //this.finish = this.lexer.isEnd();
	    throw "EndPage";
	  } else {
	    this.pushElementToPage(this.lexer, this.layout, this.ctx, page, element);
	  }
	}
      } catch (e){
	if(e == "Overflow"){
	  this.lexer.setPos(rollback_lexpos);
	  this.ctx.restoreSnap(rollback_context);
	  this.ctx.seekNextLine = 0;
	} else if (e == "EndPage"){
	  this.ctx.seekNextLine = 0;
	} else {
	  debug(e);
	}
	if(this.pushBlocks.length > 0){
	  page.childs = page.childs.concat(this.pushBlocks);
	  page.size += List.fold(this.pushBlocks, 0, function(ret, block){
	    return ret + block.push_size;
	  });
	  this.pushBlocks = [];
	}
	// aligned parser shares context with parent, but not increment pageNo.
	// (while forked page has it's own paging no).
	if(typeof this.aligned == "undefined"){
	  page.topicPath = Util.clone(this.ctx.topicPath);
	  this.ctx.seekPageNo++;
	}
	return page;
      }
    }
  };
  return DocumentParser;
})();



// ------------------------------------------------------------------------
// eval context
// ------------------------------------------------------------------------
var EvalContext = (function EvalContextClosure(){
  function EvalContext(){
    this.tags = [];
    this.ireaders = [];
  }

  EvalContext.prototype = {
    getInlineReader : function(ireaderNo){
      return this.ireaders[ireaderNo];
    },

    pushInlineReader : function(block){
      var no = this.ireaders.length;
      this.ireaders.push(block);
      return no;
    },

    clearInlineReaders : function(){
      this.ireaders = [];
    },

    pushTag : function(tag){
      this.tags.push(tag);
    },
  
    popTag : function(name){
      ParserContext.prototype.popTag.call(this, name);
    },

    findTag : function(name){
      return List.find(this.tags, function(tag){
	return tag.name == name;
      });
    }
  };

  return EvalContext;
})();


// ------------------------------------------------------------------------
// evaluator
// ------------------------------------------------------------------------
var NehanEvaluator = (function NehanEvaluatorClosure(){
  var cssFont = function(layout, font){
    var css = {};
    if(typeof font.scale != "undefined"){
      var size = Math.floor(font.scale * layout.fontSize);
      css["font-size"] = size + "px";
      css["line-height"] = size + "px";
    }
    if(typeof font.family != "undefined"){
      css["font-family"] = font.family;
    }
    if(typeof font.weight != "undefined"){
      css["font-weight"] = font.weight;
    }
    if(typeof font.color != "undefined"){
      css["color"] = font.color;
    }
    return css;
  };

  var cssHalfSpaceCharVert = function(layout, text){
    var css = {
      "line-height": "0.5em",
      "height": "0.5em"
    };
    return css;
  };

  var cssCharSmallKanaVert = function(layout, text){
    var css = {
      "font-size": text.fontSize + "px",
      "overflow": "visible",
      "position": "relative",
      "top": "-0.2em",
      "right": "-0.12em",
      "height": text.stepSize + "px",
      "line-height": text.stepSize + "px"
    };
    return css;
  };

  var cssCharImgWrap = function(layout, text){
    var height = text.stepSize;
    var css = {
      "clear": "both",
      "height": height + "px",
      "line-height": height + "px"
    }
    return css;
  };

  var cssCharImg = function(layout, text){
    var height = Math.floor(text.fontSize * text.hscaleImg);
    var css = {
      "width": text.fontSize + "px",
      "height": height + "px",
      "line-height": height + "px"
    };
    if(typeof text["margin-before"] != "undefined"){
      css[layout.getCssProp("margin-before")] = text["margin-before"] + "px";
    }
    if(typeof text["margin-after"] != "undefined"){
      css[layout.getCssProp("margin-after")] = text["margin-after"] + "px";
    }
    return css;
  };

  var cssCharIcon = function(layout, text){
    var css = {};
    return css;
  };

  var cssWordVertIE = function(layout, text){
    var css = {
      //"line-height" : maxFontSize, // TODO
      "writing-mode": "tb-rl",
      "line-height": text.fontSize + "px"
    };
    return css;
  };

  var cssWordVert = function(layout, text){
    var word = text.data;
    var fontSize2 = Math.floor(text.fontSize / 2);
    var marginBefore = (typeof text["margin-before"] != "undefined")? text["margin-before"] : 0;
    var marginAfter = (typeof text["margin-after"] != "undefined")? text["margin-after"] : 0;
    if(word.length > 2){
      marginAfter += fontSize2 * (word.length - 2);
    }
    var css = {
      //"width" : maxFontSize + "px",
      //"line-height" : maxFontSize + "px",
      "margin-top": marginBefore + "px",
      "margin-bottom" : marginAfter + "px",
      "-webkit-transform" : "rotate(90deg)",
      "-webkit-transform-origin" : "50% 50%",
      "-moz-transform" : "rotate(90deg)",
      "-moz-transform-origin" : "50% 50%",
      "-o-transform" : "rotate(90deg)",
      "-o-transform-origin" : "50% 50%"
    };
    return css;
  };

  var cssImg = function(layout, img){
    var css = {
      "float": layout.getCssProp("block-float"),
      "width": img.width + "px",
      "height": img.height + "px",
      "margin": 0,
      "padding": 0
    };
    if(img["margin-prev"]){
      css[layout.getCssProp("margin-prev")] = img["margin-prev"] + "px";
    }
    return css;
  };

  var cssImgBody = function(layout, img){
    var css = {
      "border-width": img.border + "px"
    }
    return css;
  };

  var cssBlockElement = function(layout, block){
    var css = {
      "float": layout.getCssProp("block-float"),
      //"display": "block", // firefox has some trouble about it(especially in table).
      "width": block.width + "px",
      "height": block.height + "px",
      "border-width": block["border"] + "px",
      "margin": 0,
      "padding": 0
    };
    if(block["margin-prev"]){
      css[layout.getCssProp("margin-prev")] = block["margin-prev"] + "px";
    }
    return css;
  };

  var cssCaption = function(layout, parent, caption){
    var css = {
      "width": "100%",
      "font-size": caption.fontSize + "px",
      "line-height": caption.fontSize + "px",
      "float": "left",
      "text-align": "center",
      "padding": 0
    };
    if(typeof caption["margin-bottom"] != "undefined"){
      css["margin-bottom"] = caption["margin-bottom"] + "px";
    }
    if(typeof caption["margin-top"] != "undefined"){
      css["margin-top"] = caption["margin-top"] + "px";
    }
    if(typeof caption["text-align"] != "undefined"){
      css["text-align"] = caption["text-align"];
    }
    return css;
  };

  var cssRuby = function(layout, parent, ruby){
    var css = {
      "position": "absolute",
      "font-size": ruby.fontSize + "px",
      "line-height": ruby.fontSize + "px"
    };
    css["margin-left"] = ruby.position.x + "px";
    css["margin-top"] = ruby.position.y + "px";
    css["text-align"] = "left";
    return css;
  };

  var cssTextLine = function(layout, line){
    var lineHeight = layout.isVertical? line.fontSize : line.textLineSize.height;
    var css = {
      "display": "block",
      "float": layout.getCssProp("block-float"),
      "text-align": layout.getCssProp("line-text-align"),
      "font-size": line.fontSize + "px",
      "width": line.textLineSize.width + "px",
      "height": line.textLineSize.height +"px",
      "line-height": lineHeight + "px" // for IE
    };
     // for IE(in IE, sometimes bold text breaks float)
    if(env.isIE && layout.isVertical){
      css["overflow"] = "hidden";
    }
    return css;
  };

  var cssRubyLine = function(layout, line){
    var lineHeight = layout.isVertical? line.fontSize : line.rubyLineSize.height;
    var css ={
      "display": "block",
      "float": layout.getCssProp("block-float"),
      "width": line.rubyLineSize.width + "px",
      "height": line.rubyLineSize.height + "px",
      "line-height": lineHeight + "px" // for IE
    };
    return css;
  };

  var cssLine = function(layout, line){
    var css = {
      "display": "block",
      "overflow": "visible",
      "float": layout.getCssProp("block-float"),
      "width": line.width + "px",
      "height": line.height + "px"
    };
    // mobile safari sometimes makes extra charactor space
    // when font size is between 9px and 12px.
    if(env.isMobileSafari){
      css["letter-spacing"] = "-0.001em";
    }
    return css;
  };

  var cssLabelLine = function(layout, line){
    var css = cssLine(layout, line);
    var rpx = Math.floor(line.spaceBefore / 2) + "px";
    if(line.attr["background-color"]){
      css["background-color"] = line.attr["background-color"];
    }
    css[layout.isVertical? "height": "width"] = "100%";
    return css;
  };

  var cssLabelLineBody = function(layout, line){
    var css = {
      "font-size": line.fontSize + "px",
      "text-align":(layout.isVertical? "center" : "left"),
      "line-height": line.fontSize + "px"
    };
    if(!layout.isVertical){
      css["height"] = line.fontSize + "px";
    }
    css[layout.getCssProp("margin-before")] = line.textSpaceBefore + "px";
    css[layout.getCssProp("margin-after")] = line.textSpaceAfter + "px";
    if(!layout.isVertical){
      css["margin-top"] = Math.floor((line.height - line.fontSize) / 2) + "px";
    }
    if(line.attr["color"]){
      css["color"] = line.attr["color"];
    }
    return css;
  };

  var cssForkBorder = function(layout, page){
    var css = {};
    if(!page.head){
      css[layout.getCssProp("border-prev")] = "none";
    }
    if(!page.tail){
      css[layout.getCssProp("border-next")] = "none";
    }
    return css;
  };

  var cssPage = function(layout, page){
    var css = {
      "display": "block",
      "float": page["float"] || layout.getCssProp("block-float"),
      "width": page.width + "px",
      "height": page.height + "px"
    };
    if(page.size){
      css[layout.getCssProp("page-size")] = page.size + "px";
    }
    if(page["margin-before"]){
      css[layout.getCssProp("margin-before")] = page["margin-before"] + "px";
    }
    if(page["margin-after"]){
      css[layout.getCssProp("margin-after")] = page["margin-after"] + "px";
    }
    if(page["margin-prev"]){
      css[layout.getCssProp("margin-prev")] = page["margin-prev"] + "px";
    }
    if(page.border){
      css["border-width"] = page.border + "px";
      if(page.forked){
	Args.copy(css, cssForkBorder(layout, page));
      }
    }
    return css;
  };

  function NehanEvaluator(layout, ctx){
    this.layout = layout;
    this.ctx = (typeof ctx != "undefined")? ctx : new EvalContext();
    this.handlers = {};
  }

  NehanEvaluator.prototype = {
    getContext : function(){
      return this.ctx;
    },

    setOutputHandler : function(name, func){
      this.handlers[name] = func;
    },

    callOutputHandler : function(name, layout, ctx, parent, line, output){
      if(typeof this.handlers[name] != "undefined"){
	return (this.handlers[name])(layout, ctx, parent, line, output);
      }
      return output;
    },

    evalChar : function(layout, ctx, parent, text){
      if(text.src){
	return this.evalCharIcon(layout, ctx, parent, text);
      } else if(layout.isVertical){
	if(text.img){
	  return this.evalCharImgVertical(layout, ctx, parent, text);
	}
	return this.evalCharVertical(layout, ctx, parent, text);
      }
      return this.evalCharHorizontal(layout, ctx, parent, text);
    },

    evalWord : function(layout, ctx, parent, text){
      if(layout.isVertical){
	return this.evalWordVertical(layout, ctx, parent, text);
      }
      return text.data;
    },

    evalTcy : function(layout, ctx, parent, text){
      if(layout.isVertical){
	return text.data + "<br />";
      }
      return text.data;
    },

    evalCharVertical : function(layout, ctx, parent, text){
      var c1 = (typeof text.cnv != "undefined")? text.cnv : text.data;
      if(text.skana){
	return Tag.wrap("div", {
	  "style": Attr.css(cssCharSmallKanaVert(layout, text))
	}, c1);
      }
      if(c1 == "&nbsp;"){
	return Tag.wrap("div", {
	  "style": Attr.css(cssHalfSpaceCharVert(layout, text))
	}, c1);
      }
      return c1 + "<br />";
    },

    evalCharHorizontal : function(layout, ctx, parent, text){
      var c1 = text.data;
      if(c1 == " "){
	return "&nbsp;";
      }
      return c1;
    },

    evalCharIcon : function(layout, ctx, parent, text){
      var img =  Tag.start("img", {
	"class": config.className.charIcon,
	"width": text.width + "px",
	"height": text.height + "px",
	"style": Attr.css(cssCharIcon(layout, text)),
	"src": text.src
      });
      return layout.isVertical? img + "<br />" : img;
    },

    evalCharImgVertical : function(layout, ctx, parent, text){
      return Tag.wrap("div",{
	"class": config.className.charImg,
	"style": Attr.css(cssCharImgWrap(layout, text))
      }, Tag.start("img", {
	"src": Char.ofImgSrc(text.img, text.color),
	"style": Attr.css(cssCharImg(layout, text))
      }));
    },

    evalWordVertical : function(layout, ctx, parent, text){
      return Tag.wrap("div", {
	"style": Attr.css(env.isIE? cssWordVertIE(layout, text) : cssWordVert(layout, text))
      }, text.data);
    },

    evalRubyBodyVert : function(layout, ctx, parent, ruby){
      var lbl_text = ruby.data;
      var lbl_height = ruby.data.length * ruby.fontSize;
      var lbl_lexer = new BufferedLexer(lbl_text);
      var lbl_layout = new Layout({
	width:ruby.fontSize,
	height:lbl_height,
	fontSize:ruby.fontSize,
	enableRuby:false,
	disableTailSpace:true
      });
      var lbl_pctx = new ParserContext(lbl_layout);
      var lbl_line = (new DocumentParser(lbl_lexer, lbl_layout)).parseLine(lbl_lexer, lbl_layout, lbl_pctx);
      var lbl_ectx = new EvalContext();
      return this.evalTextLineBody(lbl_layout, lbl_ectx, ruby, lbl_line);
    },

    evalRubyBody : function(layout, ctx, parent, ruby){
      if(/vertical/.test(ruby.direction)){
	return this.evalRubyBodyVert(layout, ctx, parent, ruby)
      }
      return ruby.data;
    },

    evalRuby : function(layout, ctx, parent, ruby){
      return Tag.wrap("div", {
	"class": config.className.rubyText,
	"style": Attr.css(cssRuby(layout, parent, ruby))
      }, this.evalRubyBody(layout, ctx, parent, ruby));
    },

    evalCaption : function(layout, ctx, parent, caption){
      return Tag.wrap("div", {
	"class": [config.className.caption, caption.captionPos].join(" "),
	"style": Attr.css(cssCaption(layout, parent, caption))
      }, Util.escape(caption.data));
    },

    evalStartLineTags : function(layout, ctx, parent, line){
      var self = this;
      return List.fold(ctx.tags, "", function(ret, tag){
	if(tag.name == "font"){
	  return ret + self.evalFontStartBody(layout, ctx, parent, tag)
	} else {
	  return ret + Tag.start(tag.name, tag.attr);
	}
      });
    },

    evalCloseLineTags : function(layout, ctx, parent, line){
      var self = this;
      return List.fold(ctx.tags, "", function(ret, tag){
	if(tag.name == "font"){
	  return ret + self.evalFontEndBody(layout, ctx, parent, tag);
	} else {
	  return ret + Tag.end(tag.name);
	}
      });
    },

    evalRubyLine : function(layout, ctx, parent, line){
      if(line.rubyLineSize.width == 0 || line.rubyLineSize.height == 0){
	return "";
      }
      var self = this;
      var directionClass = [config.className.rubyLine, layout.direction].join("-");
      return Tag.wrap("div", {
	"class": [config.className.rubyLine, directionClass].join(" "),
	"style": Attr.css(cssRubyLine(layout, line))
      }, List.fold(line.rubyList, "", function(ret, element){
	return ret + self.evalRuby(layout, ctx, line, element);
      }));
    },

    evalTextLineBody : function(layout, ctx, parent, line){
      var self = this;
      return this.callOutputHandler("onCompleteTextLineBody", layout, ctx, parent, line, [
	this.evalStartLineTags(layout, ctx, parent, line),
	List.fold(line.childs, "", function(ret, element){
	  return ret + self.evalElement(layout, ctx, line, element);
	}),
	this.evalCloseLineTags(layout, ctx, parent, line)
      ].join(""));
    },

    evalTextLine : function(layout, ctx, parent, line){
      var directionClass = [config.className.textLine, layout.direction].join("-");
      return Tag.wrap("div", {
	"class": [config.className.textLine, directionClass].join(" "),
	"style": Attr.css(cssTextLine(layout, line))
      }, this.evalTextLineBody(layout, ctx, parent, line));
    },

    evalLineSet : function(layout, ctx, parent, line){
      if(layout.enableRuby){
	return [
	  this.evalRubyLine(layout, ctx, parent, line),
	  this.evalTextLine(layout, ctx, parent, line)
	].join("");
      } 
      return this.evalTextLine(layout, ctx, parent, line);
    },

    evalLine : function(layout, ctx, parent, line){
      return Tag.wrap("div", {
	"class": config.className.line,
	"style": Attr.css(cssLine(layout, line))
      }, this.evalLineSet(layout, ctx, parent, line));
    },

    evalLabelLine : function(layout, ctx, parent, line){
      return Tag.wrap("div", {
	"class": config.className.labelLine,
	"style": Attr.css(cssLabelLine(layout, line))
      }, Tag.wrap("div", {
	"class": config.className.labelLineBody,
	"style": Attr.css(cssLabelLineBody(layout, line))
      }, this.evalTextLineBody(layout, ctx, parent, line)));
    },

    evalImgBody : function(layout, ctx, parent, img){
      var link = ctx.findTag("a");
      var body = Tag.start("img", {
	"src":img.src,
	"width":img.width,
	"height":img.height,
	"style": Attr.css(cssImgBody(layout, img))
      });
      return (link != null)? Tag.wrap("a", link.attr, body) : body;
    },

    evalImg : function(layout, ctx, parent, img){
      // in IE, css for img has some trouble.
      // so wrap with div and set css to it.
      return Tag.wrap("div", {
	"class": config.className.img,
	"style": Attr.css(cssImg(layout, img))
      }, this.evalImgBody(layout, ctx, parent, img));
    },

    evalBlock : function(layout, ctx, parent, block){
      if(block.name == "img"){
	return this.evalImg(layout, ctx, parent, block);
      }
      var attr = {
	"class": config.className.blockElement,
	"style": Attr.css(cssBlockElement(layout, block))
      };
      if(block.name == "iframe"){
	attr["src"] = block.src;
	attr["frameborder"] = block.frameborder;
	attr["width"] = block.width;
	attr["height"] = block.height;
      } else if(block.name == "textarea"){
	attr["onclick"] = block.onclick;
      }
      return Tag.wrap(block.name, attr, block.content);
    },

    // ireader output recursive reader(with pager) for given layout size.
    // NOTICE: ireader must be generated by client application.
    evalInlineReader : function(layout, ctx, parent, block){
      var ireaderNo = ctx.pushInlineReader(block);
      return Tag.wrap("div", {
	"class": [config.className.inlineReader, "ireader-" + ireaderNo].join(" "),
	"style": Attr.css(cssBlockElement(layout, block))
      }, "");
    },

    evalLinkStart : function(layout, ctx, parent, tag){
      var attr = tag.attr;
      attr.href = attr.href || "";
      if(attr.href.substring(0,1) == "#"){
	attr["class"] = config.className.tocLink;
      }
      ctx.pushTag(tag);
      return Tag.start(tag.name, tag.attr);
    },

    evalLinkEnd : function(layout, ctx, parent, tag){
      var name = tag.name.substring(1);
      ctx.popTag(name);
      return Tag.end(name);
    },

    evalBoldStart : function(layout, ctx, parent, tag){
      ctx.pushTag(tag);
      return Tag.start(tag.name, tag.attr);
    },

    evalBoldEnd : function(layout, ctx, parent, tag){
      var name = tag.name.substring(1);
      ctx.popTag(name);
      return Tag.end(name);
    },

    evalFontStart : function(layout, ctx, parent, tag){
      ctx.pushTag(tag);
      return this.evalFontStartBody(layout, ctx, parent, tag);
    },

    evalFontStartBody : function(layout, ctx, parent, tag){
      return Tag.start(layout.isVertical? "div" : "span", {
	"style":Attr.css(cssFont(layout, tag.attr))
      });
    },

    evalFontEnd : function(layout, ctx, parent, tag){
      ctx.popTag("font");
      return this.evalFontEndBody(layout, ctx, parent, tag);
    },

    evalFontEndBody : function(layout, ctx, parent, tag){
      return layout.isVertical? Tag.end("div") : Tag.end("span");
    },

    evalTag : function(layout, ctx, parent, element){
      var tag = element.data;
      var name = tag.name;
      switch(name){
      case "a":
	return this.evalLinkStart(layout, ctx, parent, tag);
      case "/a":
	return this.evalLinkEnd(layout, ctx, parent, tag);
      case "b": case "strong":
	return this.evalBoldStart(layout, ctx, parent, tag);
      case "/b": case "/strong":
	return this.evalBoldEnd(layout, ctx, parent, tag);
      case "font":
	return this.evalFontStart(layout, ctx, parent, tag);
      case "/font":
	return this.evalFontEnd(layout, ctx, parent, tag);
      }
      return ""; // ignore if nothing matched.
    },

    evalElement : function(layout, ctx, parent, element){
      switch(element.type){
      case "char":
	return this.evalChar(layout, ctx, parent, element);
      case "rb":
	return this.evalChar(layout, ctx, parent, element);
      case "word":
	return this.evalWord(layout, ctx, parent, element);
      case "tcy":
	return this.evalTcy(layout, ctx, parent, element);
      case "line":
	return this.evalLine(layout, ctx, parent, element);
      case "label-line":
	return this.evalLabelLine(layout, ctx, parent, element);
      case "caption":
	return this.evalCaption(layout, ctx, parent, element);
      case "ruby":
	return this.evalRuby(layout, ctx, parent, element);
      case "block":
	return this.evalBlock(layout, ctx, parent, element);
      case "ireader":
	return this.evalInlineReader(layout, ctx, parent, element);
      case "tag":
	return this.evalTag(layout, ctx, parent, element);
      case "page":
	return (new NehanEvaluator(new Layout({
	  width:element.width,
	  height:element.height,
	  fontSize:layout.fontSize,
	  direction:(element.direction || layout.direction)
	}), ctx)).evalPage(element);
      }
      return "";
    },

    evalPage : function(page, args){
      var self = this;
      var classNames = [];
      Args.copy(page, args || {});

      if(page.forked){
	classNames.push(config.className.forkedPage);
      } else if(page.aligned){
	classNames.push(config.className.alignedPage);
      } else {
	//this.ctx.clearInlineReaders();
	classNames.push(config.className.page);
      }
      if(typeof page["class"] != "undefined"){
	classNames.push(page["class"]);
      }
      if(page.syntax){
	this.setOutputHandler("onCompleteTextLineBody", Syntax[page.syntax].editLine);
      }
      return Tag.wrap("div", {
	"class": classNames.join(" "),
	"style": Attr.css(cssPage(this.layout, page))
      }, List.fold(page.childs, "", function(ret, elm){
	return ret + self.evalElement(self.layout, self.ctx, page, elm);
      }));
    }
  };

  return NehanEvaluator;
})();


// ------------------------------------------------------------------------
// theme
// ------------------------------------------------------------------------
var Syntax = {
  "js":{
    editLine : function(layout, ctx, parent, line, text){
      if(layout.isVertical){
	return text;
      }
      return text
	.replace(/[^:\"\'](\/\/.+)$/, "<span class='kw-cmt'>$1</span>")
	.replace(/(\/\*[^\*]+\*\/)/, "<span class='kw-cmt'>$1</span>")
	.replace(/(\"[^\"]+\")/g, "<span class='kw-string'>$1</span>");
    }
  },

  "html":{
    editLine : function(layout, ctx, parent, line, text){
      if(layout.isVertical){
	return;
      }
      return Syntax["js"].editLine(layout, ctx, parent, line, text);
    }
  }
};


// ------------------------------------------------------------------------
// yield
// ------------------------------------------------------------------------
var PageGenerator = (function PageGeneratorClosure(){
  function PageGenerator(text, layout){
    this.lexer = new BufferedLexer(text);
    this.parser = new DocumentParser(this.lexer, layout);
    this.evaluator = new NehanEvaluator(layout);
  }

  PageGenerator.prototype = {
    hasNext : function(){
      return this.parser.hasNext();
    },

    getParser : function(){
      return this.parser;
    },

    getEvaluator : function(){
      return this.evaluator;
    },

    // yield json layout tree
    parsePage : function(args){
      return this.parser.parsePage(args);
    },

    // eval json layout tree
    evalPage : function(page, args){
      return this.evaluator.evalPage(page, args);
    },

    // yield + eval
    yieldPage : function(args){
      var page = this.parsePage(args);
      return this.evalPage(page, args);
    }
  };
  return PageGenerator;
})();
  


// ------------------------------------------------------------------------
// pagerize
// ------------------------------------------------------------------------
var Pagerize = (function PagerizeClosure(){
  var pgconfig = {
    defDirection:"horizontal",
    defFontSize:20,
    defOuterWidth:600,
    defOuterHeight:400,
    defLeadingRate:1.8,
    screenSpaceTB:20,
    screenSpaceLR:32,
    borderWidth:1,
    maxSearchResult: 10,
    maxSearchExcerptLen: 20,
    className:{
      targetMarkup: "nehan-pagerize",
      screenWrap: "nehan-pagerize-screen-wrap",
      screen: "nehan-pagerize-screen",
      pager: "nehan-pagerize-pager",
      footer: "nehan-pagerize-footer",
      copy: "nehan-pagerize-copyright",
      pagerStatus: "nehan-pagerize-pager-status",
      pagerCurPage: "nehan-pagerize-pager-cur-page",
      pagerTotalPage: "nehan-pagerize-pager-total-page",
      pagerNext: ["nehan-button", "nehan-button-orange", "nehan-pagerize-pager-next"],
      pagerPrev: ["nehan-button", "nehan-button-blue", "nehan-pagerize-pager-prev"],
      loadingText: "nehan-pagerize-loading-text"
    },
    pager:{
      fontSize:16,
      height:30,
      marginVert:5,
      btnWidth:80,
      statusWidth:140,
      curPageInputWidth:30
    },
    footer:{
      height:20,
      marginVert:5
    },
    system:{
      parsingLoop:20,
      parsingLoopIE:10,
      parsingSleepIE:10
    }
  };

  var Pagerize = {
    _findTargetNodes : function(){
      var nodes = document.getElementsByTagName("pre");
      return List.filter(nodes, function(node){
	return (node.className.indexOf(pgconfig.className.targetMarkup) >= 0);
      });
    },

    parseOpt : function(opt){
      var opt = opt || {};
      Args.init(opt, {
	width: pgconfig.defOuterWidth,
	height: pgconfig.defOuterHeight,
	fontSize:pgconfig.defFontSize,
	direction:pgconfig.defDirection
      }, opt);
      return opt;
    },

    map : function(opt){
      var opt = this.parseOpt(opt);
      var nodes = this._findTargetNodes();
      List.iter(nodes, function(dom){
	var klass = dom.className;
	var opt2 = Util.clone(opt);
	opt2.text = dom.innerHTML;
	if(klass.indexOf("lp-horizontal") >= 0){
	  opt2.direction = "horizontal";
	} else if(klass.indexOf("lp-vertical") >= 0){
	  opt2.direction = "vertical";
	}
	(new Reader(opt2)).start(dom);
      });
    },

    createReader : function(opt){
      var opt = this.parseOpt(opt);
      return (new Reader(opt));
    }
  };

  function Screen(width, height){
    this.dom = document.createElement("div");
    this.dom.className = pgconfig.className.screen;
    this.dom_s = this.dom.style;
    this.dom_s.width = width + "px";
    this.dom_s.height = height + "px";
    this.dom_s.margin = [pgconfig.screenSpaceTB + "px", pgconfig.screenSpaceLR + "px"].join(" ");
    this.dom_s.overflow = "hidden";
    this.dom.innerHTML = "<h2 class='" + pgconfig.className.loadingText + "'>LOADING...</h2>";
  };

  Screen.prototype = {
    getDOM : function(){
      return this.dom;
    },

    getInlineReaderDOMs : function(){
      return List.filter(this.dom.getElementsByTagName("div"), function(div){
	if(div.className && div.className.indexOf(config.className.inlineReader) >= 0){
	  return true;
	}
	return false;
      });
    },

    update : function(html){
      this.dom.innerHTML = html;
    }
  };

  function Pager(direction, writePrev, writeNext, onPage){
    var self = this;
    var wrapSpan = function(text){
      return "<span>" + text + "</span>";
    };

    this.dom = document.createElement("div");
    this.dom.className = pgconfig.className.pager;
    this.dom_s = this.dom.style;
    this.dom_s.verticalAlign = "middle";
    this.dom_s.fontSize = pgconfig.pager.fontSize + "px";
    this.dom_s.textAlign = "center";
    this.dom_s.height = pgconfig.pager.height + "px";
    this.dom_s.lineHeight = pgconfig.pager.height + "px";
    this.dom_s.margin = pgconfig.pager.marginVert + "px 0";

    // btn next
    var btnNext = document.createElement("a");
    var btnNext_s = btnNext.style;
    btnNext.href = "#btnNext";
    btnNext.className = pgconfig.className.pagerNext.join(" ");
    btnNext.onclick = function(){ writeNext(); return false; };
    btnNext_s.width = pgconfig.pager.btnWidth + "px";

    // btn prev
    var btnPrev = document.createElement("a");
    var btnPrev_s = btnPrev.style;
    btnPrev.href = "#btnPrev";
    btnPrev.className = pgconfig.className.pagerPrev.join(" ");
    btnPrev.onclick = function(){ writePrev(); return false; };
    btnPrev_s.width = pgconfig.pager.btnWidth + "px";
    //btnPrev_s["float"] = "center"; // raise "Object Error" on IE9.

    // page status
    var pageStatus = document.createElement("span");
    pageStatus.className = pgconfig.className.pagerStatus;
    pageStatus.style.width = pgconfig.pager.statusWidth + "px";

    // current page input
    this.curPage = document.createElement("input");
    this.curPage.className = pgconfig.className.pagerCurPage;
    this.curPage.type = "text";
    this.curPage.value = "0";
    this.curPage.style.width = pgconfig.pager.curPageInputWidth + "px";
    this.curPage.onkeypress = Closure.onkeypress(function(key){
      var pageNo = self.getPageNo();
      if(key==13){
	onPage(pageNo);
      }
    });

    // page slash
    this.pageSlash = document.createElement("span");
    this.pageSlash.innerHTML = "/";
    this.pageSlash.style.margin = "0 10px";

    // total page text
    this.totalPage = document.createElement("span");
    this.totalPage.className = pgconfig.className.pagerTotalPage;

    // (curPage:input) / (totalPage:text)
    pageStatus.appendChild(this.curPage);
    pageStatus.appendChild(this.pageSlash);
    pageStatus.appendChild(this.totalPage);
    
    // btn order(vertical document)
    // NEXT - status - PREV
    if(direction.indexOf("vertical") >= 0){
      btnNext.innerHTML = wrapSpan("&laquo; NEXT");
      btnPrev.innerHTML = wrapSpan("PREV &raquo;");
      btnNext_s.marginRight = "16px";
      btnPrev_s.marginLeft = "16px";

      this.dom.appendChild(btnNext);
      this.dom.appendChild(pageStatus);
      this.dom.appendChild(btnPrev);
    }
    // btn order(horizontal document)
    // PREV - status - NEXT
    else {
      btnNext.innerHTML = wrapSpan("NEXT &raquo;");
      btnPrev.innerHTML = wrapSpan("&laquo; PREV");
      btnPrev_s.marginRight = "16px";
      btnNext_s.marginLeft = "16px";

      this.dom.appendChild(btnPrev);
      this.dom.appendChild(pageStatus);
      this.dom.appendChild(btnNext);
    }
  }

  Pager.prototype = {
    getDOM : function(){
      return this.dom;
    },

    getPageNo : function(){
      return Math.max(0, parseInt(this.curPage.value) - 1);
    },
    
    setPageNo : function(curPage){
      this.curPage.value = curPage;
    },

    setPageCount : function(pageCount){
      this.totalPage.innerHTML = pageCount;
    }
  };

  // footer
  function Footer(){
    this.dom = document.createElement("div");
    this.dom.className = pgconfig.className.footer;
    this.dom_s = this.dom.style;
    this.dom_s.textAlign = "right";
    this.dom_s.marginRight = pgconfig.defFontSize + "px";
    this.dom_s.marginTop = pgconfig.footer.marginVert + "px";
    this.dom_s.height = pgconfig.footer.height + "px";
    this.dom_s.lineHeight = pgconfig.footer.height + "px";

    var copy = document.createElement("div");
    copy.className = pgconfig.className.copy;
    copy.style.fontSize = "0.9em";
    copy.innerHTML = "powered by <a target='_blank' href='https://code.google.com/p/nehan/'>nehan</a> layout engine.";
    this.dom.appendChild(copy);
  }

  Footer.prototype = {
    getDOM : function(){
      return this.dom;
    }
  };

  function SearchResult(reader, keyword){
    this.reader = reader;
    this.offset = 0;
    this.keyword = keyword;
  }

  SearchResult.prototype = {
    hasNext : function(){
      return this.offset >= 0;
    },

    getNext : function(){
      var reader = this.reader;
      var readerText = this.reader.getText();
      var keyword = this.keyword;
      var founds = [];
      for(var i = 0; i < pgconfig.maxSearchResult; i++){
	this.offset = readerText.indexOf(keyword, this.offset + 1);
	if(this.offset < 0){
	  break;
	}
	founds.push(this.offset);
      }
      var makeExcerptText = function(spos, len){
	var len = len || pgconfig.maxSearchExcerptLen;
	return readerText.substring(spos, spos + keyword.length + len);
      };
      var makeHighlightText = function(text){
	var rex = new RegExp("(" + keyword + ")", "g");
	return text.replace(rex, function(all, grp){
	  return "<strong>" + Util.escape(grp) + "</strong>";
	});
      };
      var makePlaneText = function(text){
	var text = text.replace(/<rt>[^<]+<\/rt>/g, "");
	return text.replace(/<[^>]+>/g, "");
      };
      return List.map(founds, function(spos){
	var pageNo = reader.findPageNo(spos);
	var text = reader.getSourceText(pageNo);
	text = makeExcerptText(spos);
	text = makePlaneText(text);
	text = Util.escape(text);
	text = makeHighlightText(text);
	return {spos:spos, pageNo:pageNo, text: text};
      });
    }
  };

  function Reader(opt){
    this.nospace = (typeof opt.nospace != "undefined")? opt.nospace : false;
    this.isinline = (typeof opt.isinline != "undefined")? opt.isinline : false;
    this.nopager = (typeof opt.nopager != "undefined")? opt.nopager : false;
    this.border = (typeof opt.border != "undefined")? opt.border : config.layout.readerBorder;
    this.width = opt.width || pgconfig.defOuterWidth;
    this.height = opt.height || pgconfig.defOuterHeight;
    this.screenWidth = this.width - pgconfig.screenSpaceLR * 2;
    this.screenHeight = this.height - pgconfig.screenSpaceTB * 2;
    if(this.nopager == false){
      this.screenHeight -= pgconfig.pager.height + pgconfig.pager.marginVert * 2;
    }
    if(this.isinline == false){
      this.screenHeight -= pgconfig.footer.height + pgconfig.footer.marginVert;
    }
    this.pages = [];
    this.caches = [];
    this.ireaders = [];
    this.bookmarks = [];
    this.progress = 0;
    this.pageNo = 0;
    this.complete = false;
    this.direction = opt.direction || pgconfig.defDirection;
    this.text = opt.text || "no text";
    this.theme = Theme[opt.theme] || null;
    this.syntax = opt.syntax || "";
    this.className = opt.className;
    this.pageLayout = new Layout({
      direction:this.direction,
      theme:this.theme,
      width:this.screenWidth,
      height:this.screenHeight,
      fontSize:(opt.fontSize || pgconfig.defFontSize),
      leadingRate:(opt.leadingRate || pgconfig.defLeadingRate)
    });
    this.generator = new PageGenerator(this.text, this.pageLayout);
    this.onStart = opt.onStart || function(reader){};
    this.onProgress = opt.onProgress || function(reader, percent, curPageCount){};
    this.onComplete = opt.onComplete || function(reader){};
    this.onWritePageStart = opt.onWritePageStart || function(reader, pageNo){};
    this.onWritePageEnd = opt.onWritePageEnd || function(reader, pageNo){};
  }

  Reader.prototype = {
    start : function(dom){
      this.setupUI(dom);
      this.complete = false;
      this.progress = 0;
      this.onStart(this);
      this.addPage(this.parsePage());
      this.writePage(0);
      if(this.pager){
	this.parsePageBg();
      } else {
	this.onComplete(this);
      }
    },

    setupUI : function(dom){
      var self = this;
      dom.innerHTML = "";
      this.dom = dom;
      this.dom.className = [pgconfig.className.screenWrap, this.dom.className, this.className].join(" ");
      this.dom_s = dom.style;
      this.dom_s.overflow = "hidden";
      this.dom_s.display = "block";
      this.dom_s.width = this.width  + "px";
      this.dom_s.height = this.height  + "px";
      this.dom_s.borderWidth = this.border + "px";

      // create screen object for this reader
      this.screen = new Screen(this.screenWidth, this.screenHeight);
      this.dom.appendChild(this.screen.getDOM());

      // create pager object for this reader
      if(this.nopager == false){
	this.pager = new Pager(
	  this.direction,
	  function(){ self.writePrev() },
	  function(){ self.writeNext() },
	  function(pageNo){ self.writePage(pageNo); }
	);
	this.dom.appendChild(this.pager.getDOM());
      }

      // create footer object for root reader
      if(this.isinline == false){
	this.footer = new Footer();
	this.dom.appendChild(this.footer.getDOM());
      }
    },

    resume : function(dom){
      this.setupUI(dom);
      this.setPageCount(this.pages.length);
      this.writePage(this.pageNo);
    },

    parsePage : function(){
      var page = this.generator.parsePage();
      page.syntax = this.syntax;
      return page;
    },

    getGenerator : function(){
      return this.generator;
    },

    getText : function(){
      return this.text;
    },

    getDirection : function(){
      return this.direction;
    },

    getTocs : function(){
      return this.generator.getParser().getContext().getTocs();
    },

    getPageNo : function(){
      return this.pageNo;
    },

    getTotalPageCount : function(){
      return this.pages.length;
    },

    getDOM : function(){
      return this.dom;
    },

    getPageJson : function(pageNo){
      return (this.pages[pageNo] || null);
    },

    getTopicPath : function(pageNo){
      var json = this.getPageJson(pageNo);
      return (json != null)? json.topicPath : null;
    },

    getTopicPathTitle : function(topicPath){
      return List.map(topicPath, function(toc){ return toc.title; }).join("/");
    },

    makeBookmark : function(pageNo){
      var json = this.getPageJson(pageNo);
      if(json == null){
	return null;
      }
      return this.getTopicPathTitle(json.topicPath);
    },

    setBookmark : function(pageNo){
      var bmark = this.makeBookmark(pageNo);
      this.bookmarks[pageNo] = bmark;
      return bmark;
    },

    deleteBookmark : function(pageNo){
      this.bookmarks[pageNo] = null;
    },

    getBookmarks : function(){
      return this.bookmarks;
    },

    getPageCache : function(pageNo){
      return (this.caches[pageNo] || null);
    },

    setPageCache : function(pageNo, html){
      this.caches[pageNo] = html;
    },

    setPageNo : function(pageNo){
      if(this.pager){
	this.pager.setPageNo(pageNo);
      }
    },

    setPageCount : function(pageCount){
      if(this.pager){
	this.pager.setPageCount(pageCount);
      }
    },

    getSourceText : function(pageNo){
      var from = this.getPageJson(pageNo);
      var to = this.getPageJson(Math.max(pageNo + 1, this.pages.length - 1));
      if(from == null || to == null){
	return "";
      }
      return this.text.substring(from.spos, to.spos);
    },

    findPageNo : function(spos){
      for(var i = 0, len = this.pages.length; i < len; i++){
	var pagepos = this.pages[i].spos;
	if(pagepos > spos){
	  return Math.max(0, i - 1);
	} else if(pagepos == spos){
	  return i;
	}
      }
      return -1;
    },

    searchKeyword : function(keyword){
      return (new SearchResult(this, keyword));
    },

    getSeekPos : function(pageNo){
      if(this.pages[pageNo]){
	var page = this.pages[pageNo];
	return {cpos:page.cpos, spos:page.spos};
      }
      return null;
    },

    addPage : function(page){
      this.pages.push(page);
      return page;
    },

    parsePageBg : function(){
      var latest = null;
      var looplen = env.isIE? pgconfig.system.parsingLoopIE : pgconfig.system.parsingLoop;
      for(var i = 0; i < looplen; i++){
	if(!this.generator.hasNext()){
	  this.setPageCount(this.pages.length);
	  this.complete = true;
	  this.onComplete(this);
	  return;
	}
	latest = this.addPage(this.parsePage());
      }
      if(latest){
	this.progress = Math.floor(100 * (latest.spos || 0) / this.text.length);
	this.setPageCount("(" + this.progress + "%)");
	this.onProgress(this, this.progress, this.pages.length);
      }
      var self = this;
      setTimeout(function(){
	self.parsePageBg();
      }, env.isIE? pgconfig.system.parsingSleepIE : 0); // IE is heavy, so needs some sleep.
    },

    getInlineReaderFromCache : function(pageNo, ireaderNo){
      if(this.ireaders[pageNo] && this.ireaders[pageNo][ireaderNo]){
	return this.ireaders[pageNo][ireaderNo];
      }
      return null;
    },

    cacheInlineReader : function(pageNo, ireaderNo, reader){
      if(this.ireaders[pageNo]){
	this.ireaders[pageNo][ireaderNo] = reader;
      } else {
	this.ireaders[pageNo] = [];
	this.ireaders[pageNo][ireaderNo] = reader;
      }
    },

    setupTocLinks : function(){
      var self = this;
      var links = this.screen.getDOM().getElementsByTagName("a");
      List.iter(links, function(link){
	if(link.className == config.className.tocLink){
	  var parts = link.href.split("#");
	  if(parts.length > 0){
	    var tocId = parts[1];
	    link.onclick = function(){
	      self.writePageByTocId(tocId);
	      return true; // remain # in url
	    };
	  }
	}
      });
    },

    writeInlineReaders : function(pageNo, ireaderDOMs){
      var self = this;
      var ctx = this.generator.getEvaluator().getContext();
      List.iter(ireaderDOMs, function(dom){
	var klass = dom.className;
	if(klass.match(/ireader-([\d]+)/)){
	  var ireaderNo = parseInt(RegExp.$1);
	  var cached_reader = self.getInlineReaderFromCache(pageNo, ireaderNo);
	  if(cached_reader != null){
	    cached_reader.resume(dom);
	  } else {
	    var ir_block = ctx.getInlineReader(ireaderNo);
	    var reader = new Reader({
	      text:ir_block.content,
	      className: ir_block["class"],
	      direction:ir_block.direction,
	      fontSize:ir_block.fontSize,
	      width:ir_block.width,
	      height:ir_block.height,
	      theme:ir_block.theme,
	      syntax:ir_block.syntax,
	      border:ir_block.border,
	      nopager:ir_block.nopager,
	      isinline:true
	    });
	    reader.child = true;
	    reader.start(dom); // CAUTION: must start before cache
	    self.cacheInlineReader(pageNo, ireaderNo, reader);
	  }
	}
      });
    },

    writePageByTocId : function(tocId){
      var toc = List.find(this.getTocs(), function(toc){
	return (toc.id == tocId)
      });
      if(toc != null){
	this.writePage(toc.pageNo);
      }
    },

    writePageWithCache : function(pageNo){
      var json = this.getPageJson(pageNo);
      if(json == null){
	return;
      }
      var cache = this.getPageCache(pageNo);
      if(cache == null){
	var cache = this.generator.evalPage(json);
	this.setPageCache(pageNo, cache);
      }
      this.setPageNo(pageNo + 1);
      this.screen.update(cache);
      this.writeInlineReaders(pageNo, this.screen.getInlineReaderDOMs());
      this.setupTocLinks();
    },

    writePage : function(pageNo){
      if(pageNo >= this.pages.length || pageNo < 0){
	alert("pageNo(" + pageNo + ") is not available for this book");
      }
      this.pageNo = pageNo;
      this.onWritePageStart(this, pageNo);
      this.writePageWithCache(pageNo);
      this.onWritePageEnd(this, pageNo);
    },

    writeNext : function(){
      if(this.pageNo < this.pages.length - 1){
	this.writePage(this.pageNo + 1);
      }
    },

    writePrev : function(){
      if(this.pageNo > 0){
	this.writePage(this.pageNo - 1);
      }
    }
  };

  Pagerize.pgconfig = pgconfig;
  return Pagerize;
})();


// ------------------------------------------------------------------------
// book
// ------------------------------------------------------------------------
var Book = (function BookClosure(){
  var createPageLink = function(pageNo, title, reader){
    var link = document.createElement("a");
    link.href = "#" + pageNo;
    link.innerHTML = title;
    link.onclick = function(){
      reader.writePage(pageNo);
      return true; // remain #pageNo in URL
    };
    return link;
  };

  var setupTocUI = function(dom, reader){
    var tocs = reader.getTocs();
    var root = document.createElement("ul");
    var parent = root;
    var prev = null;

    root.className = "nehan-toc-root";

    var levelNameOf = function(level){
      var map = config.tags.toc;
      return map[level % map.length]
    };

    var createUL = function(level){
      var ul = document.createElement("ul");
      ul.className = "nehan-toc-level-" + levelNameOf(level);
      return ul;
    };

    var createLI = function(toc){
      var li = document.createElement("li");
      var link = createPageLink(toc.pageNo, toc.title || "no title", reader);
      li.appendChild(link);
      return li;
    };

    for(var i = 0, len = tocs.length; i < len; i++)(function(toc){
      var li = createLI(toc);
      if(prev == null){
	parent.appendChild(li);
      } else if(toc.level == prev.level){ // same
	parent.appendChild(li);
      } else if(toc.level > prev.level){ // indent
	ul = createUL(toc.level);
	ul.appendChild(li);
	parent.appendChild(ul);
	parent = ul;
      } else if(toc.level < prev.level){ // unindent
	parent = (toc.level <= 0)? root : parent.parentNode;
	parent.appendChild(li);
      }
      prev = toc;
    })(tocs[i]);
    
    dom.appendChild(root);
  };

  var setupBmarkUI = function(bmarkDom, bmarkBtnDom, reader){
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var trh = document.createElement("tr");
    var th1 = document.createElement("th");
    var th2 = document.createElement("th");
    var th3 = document.createElement("th");
    var tbody = document.createElement("tbody");
    table.className = "nehan-book-bmark-table";
    table.style.borderCollapse = "collapse";
    th1.innerHTML = "topic path";
    th2.innerHTML = "page";
    th3.innerHTML = "delete";
    trh.appendChild(th1);
    trh.appendChild(th2);
    trh.appendChild(th3);
    thead.appendChild(trh);
    table.appendChild(thead);
    table.appendChild(tbody);
    bmarkDom.appendChild(table);

    var makeTR = function(pageNo, title){
      var tr = document.createElement("tr");
      var td1 = document.createElement("td");
      var td2 = document.createElement("td");
      var td3 = document.createElement("td");
      var pageLink = createPageLink(pageNo, title, reader);
      var deleteLink = document.createElement("a");
      deleteLink.href = "#delete";
      deleteLink.innerHTML = "delete";
      deleteLink.onclick = function(){
	reader.deleteBookmark(pageNo);
	tbody.removeChild(tr);
	return false;
      };
      td1.appendChild(pageLink);
      td2.innerHTML = pageNo + 1;
      td3.appendChild(deleteLink);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      return tr
    };

    bmarkBtnDom.onclick = function(){
      var pageNo = reader.getPageNo();
      var title = reader.setBookmark(pageNo);
      if(bmark != null){
	var tr = makeTR(pageNo, title);
	tbody.appendChild(tr);
      }
      return false;
    };
  };

  var setupSearchUI = function(inputDom, btnDom, resultDom, reader){
    var doSearch = function(keyword){
      if(keyword != ""){
	var result = reader.searchKeyword(keyword);
	showSearchResult(resultDom, reader, result);
      }
    };

    inputDom.onkeypress = Closure.onkeypress(function(key){
      if(key==13){
	doSearch(inputDom.value);
      }
    });
    btnDom.onclick = function(){
      doSearch(inputDom.value);
      return false;
    };
  };

  var showSearchResult = function(dom, reader, result){
    dom.innerHTML = "";
    dom.style.overflow = "hidden";
    var results = result.getNext();
    if(results.length == 0){
      dom.innerHTML = "<p>not found</p>";
      return;
    }

    var makeDeleteLink = function(){
      var p = document.createElement("p");
      var link = document.createElement("a");
      link.innerHTML = "clear search result";
      link.href = "#clear";
      link.onclick = function(){
	dom.innerHTML = "";
	return false;
      };
      p.appendChild(link);
      return p;
    };

    var makeNextLink = function(){
      var p = document.createElement("p");
      var link = document.createElement("a");
      link.href = "#more";
      link.innerHTML = "more result";
      link.onclick = function(){
	showSearchResult(dom, reader, result);
	return false;
      };
      p.appendChild(link);
      return p;
    };

    var makeTable = function(){
      var table = document.createElement("table");
      var thead = document.createElement("thead");
      var tr = document.createElement("tr");
      var th1 = document.createElement("th");
      th1.innerHTML = "page";
      var th2 = document.createElement("th");
      th2.innerHTML = "text";
      tr.appendChild(th1);
      tr.appendChild(th2);
      thead.appendChild(tr);
      table.appendChild(thead);
      return table;
    };

    var makeTbody = function(){
      var tbody = document.createElement("tbody");
      return tbody;
    }

    var makeRow = function(ret){
      var tr = document.createElement("tr");
      var td1 = document.createElement("td");
      var link = document.createElement("a");
      link.innerHTML = "p" + (ret.pageNo + 1);
      link.href = "#" + ret.pageNo;
      link.onclick = function(){
	reader.writePage(ret.pageNo);
	return false;
      };
      td1.appendChild(link);
      var td2 = document.createElement("td");
      td2.innerHTML = ret.text;
      tr.appendChild(td1);
      tr.appendChild(td2);
      return tr;
    };

    var table = makeTable();
    var tbody = makeTbody();
    table.appendChild(tbody);

    List.iter(results, function(result){
      tbody.appendChild(makeRow(result));
    });
    var deleteLink = makeDeleteLink();
    dom.appendChild(deleteLink);
    dom.appendChild(table);

    if(result.hasNext()){
      var nextLink = makeNextLink();
      dom.appendChild(nextLink);
    }
  };

  var setupTopicPath = function(dom, reader, pageNo){
    dom.innerHTML = "";
    var path = reader.getTopicPath(pageNo);
    if(path == null){
      return;
    }
    var last_index = Math.max(0, path.length - 1);

    List.iteri(path, function(index, toc){
      var link = document.createElement("a");
      link.innerHTML = toc.title;
      link.href = "#" + toc.pageNo;
      link.onclick = function(){
	reader.writePage(toc.pageNo);
	return false;
      };
      dom.appendChild(link);
      if(index != last_index){
	var span = document.createElement("span");
	span.innerHTML = "/";
	span.style.margin = "0 0.5em";
	dom.appendChild(span);
      }
    });
  };

  var Book = {
    start : function(opt){
      var timeStart = new Date();
      var startPageNo = 0;
      var startPageId = "";
      var topicPathDom = document.getElementById(opt.ui.topicPathId || "topic-path");
      var tocDom = document.getElementById(opt.ui.tocId || "toc");
      var searchInputDom = document.getElementById(opt.ui.searchInputId || "search-input");
      var searchBtnDom = document.getElementById(opt.ui.searchBtnId || "search-btn");
      var searchResultDom = document.getElementById(opt.ui.searchResultId || "search-result");
      var bookBodyDom = document.getElementById(opt.ui.bookBodyId || "book-body");
      var bodyText = opt.text || (bookBodyDom? bookBodyDom.innerHTML : "body text not found");
      var bmarkDom = document.getElementById(opt.ui.bmarkId || "bmark");
      var bmarkBtnDom = document.getElementById(opt.ui.bmarkBtnId || "bmark-btn");

      bookBodyDom.innerHTML = "";

      var reader = Pagerize.createReader({
	text: bodyText,
	direction: opt.direction || "horizontal",
	width: (opt.width || 700),
	height: (opt.height || 600),
	fontSize: (opt.fontSize || 18),

	onStart:function(reader){
	  if(location.href.match("#")){
	    var label = location.href.split("#")[1];
	    if(isNaN(label)){
	      startPageId = label;
	    } else {
	      startPageNo = parseInt(label);
	    }
	  }
	  if(opt.onStart){
	    opt.onStart(reader);
	  }
	},

	onComplete:function(reader){
	  var timeComplete = new Date();
	  var timeElapsed = (timeComplete - timeStart) / 1000;

	  // console.log(timeElapsed);

	  // setup toc UI
	  if(tocDom){
	    setupTocUI(tocDom, reader);
	  }
	  
	  // setup search UI
	  if(searchInputDom && searchBtnDom && searchResultDom){
	    setupSearchUI(searchInputDom, searchBtnDom, searchResultDom, reader);
	  }

	  // setup bookmark UI
	  if(bmarkDom && bmarkBtnDom){
	    setupBmarkUI(bmarkDom, bmarkBtnDom, reader);
	  }

	  if(opt.onComplete){
	    opt.onComplete(reader, timeElapsed);
	  }

	  if(startPageNo > 0){
	    reader.writePage(startPageNo);
	  } else if(startPageId != ""){
	    reader.writePageByTocId(startPageId);
	  }
	},

	onProgress:function(reader, percent, curPageCount){
	},

	onWritePageStart:function(reader, pageNo){
	  window.scroll(0,0);
	},

	onWritePageEnd:function(reader, pageNo){
	  setupTopicPath(topicPathDom, reader, pageNo);
	}
      });

      if(opt.onBeforeStart){
	opt.onBeforeStart(reader);
      }
      reader.start(bookBodyDom);
    }
  };
  return Book;
})();




// ------------------------------------------------------------------------
// export (always)
// ------------------------------------------------------------------------
Nehan3.version = "3.0.0";
Nehan3.env = env;
Nehan3.config = config;
Nehan3.Pagerize = Pagerize;
Nehan3.Book = Book;

// ------------------------------------------------------------------------
// export (optional)
// ------------------------------------------------------------------------
Nehan3.Util = Util;
Nehan3.Closure = Closure;
Nehan3.Args = Args;
Nehan3.List = List;
Nehan3.Attr = Attr;
Nehan3.Tag = Tag;
Nehan3.Token = Token;
Nehan3.Char = Char;
Nehan3.Word = Word;
Nehan3.CharImgColor = CharImgColor;
Nehan3.Lexer = Lexer;
Nehan3.BufferedLexer = BufferedLexer;
Nehan3.Layout = Layout;
Nehan3.Theme = Theme;
Nehan3.ParserContext = ParserContext;
Nehan3.DocumentParser = DocumentParser;
Nehan3.EvalContext = EvalContext;
Nehan3.NehanEvaluator = NehanEvaluator;
Nehan3.PageGenerator = PageGenerator;


})();

