/*
 source : nehan.js
 version : 1.1.1
 site : http://tategakibunko.mydns.jp/
 blog : http://tategakibunko.blog83.fc2.com/

 Copyright (c) 2010, Watanabe Masaki <lambda.watanabe[at]gmail.com>
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


var Nehan;if(!Nehan){Nehan={}}if(!Nehan.Layout){Nehan.Layout={}}if(!Nehan.TextStream){Nehan.TextStream={}}if(!Nehan.StreamParser){Nehan.StreamParser={}}if(!Nehan.LayoutMapper){Nehan.LayoutMapper={}}if(!Nehan.Env){Nehan.Env={}}if(!Nehan.ParserHook){Nehan.ParserHook={}}(function(){var n={concat:function(r,q){r=(r=="")?"":(r.slice(-1)=="/")?r:r+"/";q=(q=="")?"":(q[0]=="/")?q.substring(1,q.length):q;return r+q}};var k={read:function(s,r,q){for(prop in r){s[prop]=(typeof q[prop]=="undefined")?r[prop]:q[prop]}}};var l={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(t){for(var q=0;q<t.length;q++){var r=t[q].string;var s=t[q].prop;this.versionSearchString=t[q].versionSearch||t[q].identity;if(r){if(r.indexOf(t[q].subString)!=-1){return t[q].identity}}else{if(s){return t[q].identity}}}},searchVersion:function(r){var q=r.indexOf(this.versionSearchString);if(q==-1){return}return parseFloat(r.substring(q+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};l.init();var f={init:function(){var r=l.browser.toLowerCase();var q=l.version;var s=l.OS;this.isIE=(r=="explorer");this.isWin=(s=="Windows");this.isMac=(s=="Mac");this.isVistaOrWin7=(navigator.userAgent.toLowerCase().indexOf("windows nt 6")>=0);if(r=="chrome"){this.canTransform=true}else{if(r=="safari"){this.canTransform=true}else{if(r=="firefox"&&q>=3.5){this.canTransform=true}else{if(this.isIE&&q>=6){this.canTransform=true}else{this.canTransform=false}}}}}};f.init();var b=function(q){var r="";for(prop in q){if(q[prop]!=""){r+=prop+"='"+q[prop]+"' "}}return r};var p=function(q){var r="";for(prop in q){r+=prop+":"+q[prop]+";"}return r};var c=function(r,q,s){return"<"+r+" "+b(q)+(s?" />":" >")};function m(q){k.read(this,{width:700,height:480,fontSize:16,lineHeightRate:1.8,letterSpacingRate:0.1,direction:"vertical",textLayerClassName:"text-layer",charImgRoot:"/img/char",charImgMap:[],charImgColor:"black",kinsokuCharCount:2,plusCss:{}},q);if(typeof q.fontFamily!="undefined"){this.fontFamily=q.fontFamily}this.initialize()}m.prototype.initialize=function(){this.direction=this.direction.toLowerCase();this.directionH=(this.direction=="horizontal"||this.direction=="vertical-lr")?"lr":"rl";this.isV=(this.direction=="vertical"||this.direction=="vertical-lr"||this.direction=="vertical-rl");this.baseLineHeight=Math.floor(this.lineHeightRate*this.fontSize);this.baseLetterSpacing=Math.floor(this.letterSpacingRate*this.fontSize);var q=this.baseLineHeight;var r=this.fontSize+this.baseLetterSpacing;this.width=Math.max(q,this.width);this.height=Math.max(r,this.height);this.yohakuHeight=this.baseLineHeight-this.fontSize;this.letterHeight=(this.isV)?this.fontSize+this.baseLetterSpacing:1;this.wrapTag=(this.isV)?"table":"div";this.rubyFontSize=Math.floor(this.fontSize/2);if(this.isV){this.lineCount=Math.floor(this.height/this.letterHeight)-this.kinsokuCharCount}else{this.lineCount=Math.floor(this.width/this.fontSize)-this.kinsokuCharCount}this.wrapCss="";this.wrapCss+="text-align:left;";this.wrapCss+="padding:0;";this.wrapCss+="font-size:"+this.fontSize+"px;";this.wrapCss+="width:"+this.width+"px;";this.wrapCss+="height:"+this.height+"px;";this.wrapCss+="overflow:hidden;";this.wrapCss+="white-space:nowrap;";if(this.isV){this.wrapCss+="border-collapse:collapse;"}else{this.wrapCss+="line-height:1.8em;";this.wrapCss+="letter-spacing:0;"}if(typeof this.fontFamily=="undefined"){this.wrapCss+="font-family:monospace;"}else{if(this.fontFamily==""){this.wrapCss+="font-family:monospace;"}else{this.wrapCss+="font-family:"+this.fontFamily+", monospace;"}}this.wrapCss+=p(this.plusCss)};m.prototype.setHeight=function(q){this.height=q};m.prototype.setWidth=function(q){this.width=q};m.prototype.setCharImgRoot=function(q){this.charImgRoot=q};m.prototype.setCharImgColor=function(q){var r=q.toLowerCase().replace(/#/g,"");if(r=="white"||r=="fff"||r=="ffffff"){this.charImgColor="white"}else{this.charImgColor="black"}};m.prototype.setDirection=function(q){this.direction=q};m.prototype.getDirection=function(){return this.direction};m.prototype.setFontFamily=function(q){this.fontFamily=q};m.prototype.setFontSize=function(q){this.fontSize=q};m.prototype.setLineHeightRate=function(q){this.lineHeightRate=q};m.prototype.setLetterSpacingRate=function(q){this.letterSpacingRate=q};function e(q,r,s){this.buffer=q;this.length=r;this.isEOF=s;this.seekPos=0}e.prototype.getchar=function(){if(this.seekPos<this.buffer.length){var q=this.buffer.substring(this.seekPos,this.seekPos+1);this.seekPos++;return q}else{throw"BufferEnd"}};e.prototype.lookNextChar=function(){if(this.seekPos<this.buffer.length){return this.buffer.substring(this.seekPos,this.seekPos+1)}return""};e.prototype.stepSeekPos=function(){if(this.seekPos<this.buffer.length){this.seekPos++}};e.prototype.getTag=function(){var q="<";while(true){var r=this.getchar();q+=r;if(r==">"){return q}}return""};e.prototype.skipCRLF=function(){var s=this.seekPos;var r=this.lookNextChar();if(r=="\n"){this.seekPos++;return this.seekPos}else{if(r=="\r"){this.seekPos++;var q=this.lookNextChar();if(q=="\n"){this.seekPos++;return this.seekPos}}}return s};e.prototype.getBuffer=function(){return this.buffer};e.prototype.setBuffer=function(r,q){this.buffer=r;this.length=(typeof q!="undefined")?q:r.length;this.isEOF=true};e.prototype.addBuffer=function(q){if(!this.isEOF){this.buffer+=q;if(this.buffer.length>=this.length){this.isEOF=true}}};e.prototype.setEOF=function(q){this.isEOF=q};e.prototype.getEOF=function(){return this.isEOF};function d(q){this.kanji="";this.yomi="";this.seekPos=0;this.rubyStartPos=q;this.ready=false}d.prototype.addKanji=function(q){this.kanji+=q};d.prototype.addYomi=function(q){this.yomi+=q};d.prototype.setReady=function(){this.ready=true};d.prototype.isReady=function(){return this.ready};d.prototype.getchar=function(){if(this.seekPos<this.kanji.length){var q=this.kanji.substring(this.seekPos,this.seekPos+1);this.seekPos++;return q}else{throw"RubyBufferEnd"}};var o={tagHook:{},enableTagHook:function(q){return(typeof this.tagHook[q]!="undefined")},addTagHook:function(q,r){this.tagHook[q]=r},getTagHook:function(q){return this.tagHook[q]}};function h(q,r){this.layout=q;this.seekCharCount=0;this.seekTable=[{spos:0,cpos:0}];this.seekWidth=0;this.seekHeight=0;this.seekLineCharCount=0;this.lineBuff="";this.lineSave="";this.resumePos=-1;this.blockBuff="";this.tagStack=[];this.rubyStack=[];this.pageCache=[];this.boutenStack=[];this.boutenCount=0;this.bouten=false;this.indentCount=0;this.rubyStream=null;this.packStr="";this.textStream=r;this.isResuming=false;this.cacheAble=true;this.fontScale=1;this.lineScale=1;this.bgColor="";this.fontStyle="";this.isImgChar=false;this.isHankaku=false;this.imgBuff=[];this.curImgWidth=0;this.imgIndentCount=0;this.blockIndentCount=0;this.halfWordBreak=false}h.prototype.activateTag=function(q,r){var t=["ruby","rp","rb","rt","pack","script","object"];for(var s=0;s<t.length;s++){if(q==t[s]){this[q]=r;return}}};h.prototype.isActiveTag=function(q){if(typeof this[q]=="undefined"){return false}return this[q]};h.prototype.getTextStream=function(){return this.textStream};h.prototype.charToImg=function(q){switch(q){case"「":case"｢":q="kakko1.gif";break;case"」":case"｣":q="kakko2.gif";break;case"『":q="kakko3.gif";break;case"』":q="kakko4.gif";break;case"（":case"(":case"{":q="kakko5.gif";break;case"）":case"}":case")":q="kakko6.gif";break;case"＜":case"<":case"〈":q="kakko7.gif";break;case"＞":case">":case"〉":q="kakko8.gif";break;case"《":case"≪":q="kakko9.gif";break;case"》":case"≫":q="kakko10.gif";break;case"［":case"[":case"〔":q="kakko13.gif";break;case"］":case"]":case"〕":q="kakko14.gif";break;case"【":q="kakko17.gif";break;case"】":q="kakko18.gif";break;case"｡":case"。":q="kuten.gif";break;case"．":case".":q="kuten2.gif";break;case"､":case"、":case",":case"，":q="touten.gif";break;case"～":case"〜":q="kara.gif";break;case"…":q="mmm.gif";break;case"：":case":":q="tenten.gif";break;case"‥":q="mm.gif";break;case"＝":case"=":q="equal.gif";break;case"―":q="dash.gif";break;case"ー":case"－":case"━":q="｜";break;case"—":case"-":case"‐":case"─":case"−":case"_":case"ｰ":q="｜";break;case"→":case"⇒":q="↓";break;case"←":q="↑";break;case"!":q="！";break;case"?":q="？";break;case"･":q="・";break;case"+":q="＋";break;case"@":q="＠";break;case"#":q="＃";break;case"\\":q="￥";break;default:break}return q};h.prototype.makeCharInner=function(s){var r=this.charToImg(s);if(r.match(/\.gif/)){this.isImgChar=true;var q=(this.layout.charImgColor=="white")?"w@"+r:r;if(typeof this.layout.charImgMap[q]!="undefined"){return this.makeCharImgTag(this.layout.charImgMap[q])}}if(r==s||r.length==1){this.isImgChar=false;return r}this.isImgChar=true;if(this.layout.charImgColor=="white"){r="w_"+r}return this.makeCharImgTag(n.concat(this.layout.charImgRoot,r))};h.prototype.makeCharImgTag=function(u){var t=Math.floor(this.layout.fontSize*this.fontScale);var r=t;var s={"vertical-align":"top",width:t+"px",height:r+"px","line-height":r+"px",margin:"0",padding:"0","border-width":"0"};var q={src:u,style:p(s)};return c("img",q,true)};h.prototype.getBoutenStr=function(q){switch(q){case"bt-disc":return"・";case"bt-accent":return"ヽ";case"bt-circle":return"。";case"bt-dot":return"・"}return"・"};h.prototype.parseAttr=function(u){var t=u.split(/[\s\t　]+/);var r={};var q=this;for(var s=0;s<t.length;s++){(function(w,y){if(w.match(/([^=]+)=(.+)/)){var x=RegExp.$1;var z=q.cutQuote(RegExp.$2);r[x]=z}})(t[s],s)}return r};h.prototype.cutQuote=function(q){return q.replace(/\"/g,"").replace(/\'/g,"")};h.prototype.startBgColor=function(){if(this.layout.isV){var t=Math.floor(this.layout.yohakuHeight*this.lineScale);var s=Math.floor(t/3);var r=Math.floor(this.layout.baseLineHeight*this.lineScale);var q={"text-align":"center",padding:s+"px 0",width:r+"px","background-color":this.bgColor};return c("div",{style:p(q)},false)}else{var q={"padding-top":"0.3em","padding-left":"0.3em","vertical-align":"middle","background-color":this.bgColor};return c("span",{style:p(q)},false)}};h.prototype.endBgColor=function(){if(this.layout.isV){return"</div>"}return"</span>"};h.prototype.makeLineTd=function(){if(this.boutenCount>0){this.boutenStack.push({startPos:this.boutenStartPos,count:this.boutenCount,str:this.boutenStr});this.boutenCount=0;this.boutenStartPos=0}var u=Math.floor(this.layout.fontSize*this.lineScale);var t=Math.floor(this.layout.yohakuHeight*this.lineScale);var q=u+t;var r={"font-size":this.layout.fontSize+"px",margin:"0",padding:"0","text-align":(this.lineScale>1)?"center":"left","line-height":this.layout.letterHeight+"px","vertical-align":"top",width:u+"px"};var s={margin:"0",padding:"0","text-align":"left",width:t+"px","vertical-align":"top"};return(c("td",{style:p(r)},false)+this.lineBuff+"</td>"+c("td",{style:p(s)},false)+this.makeRubyLine()+this.makeBoutenLine()+"</td>")};h.prototype.makeRubyLine=function(){var B="";var F=this;var A=Math.floor(this.layout.rubyFontSize*this.lineScale);var z={position:"absolute","font-size":A+"px","line-height":"1.14em"};var s=p(z);var D=this.indentCount*this.layout.letterHeight;var C=[];var v=this.layout.height-Math.floor(this.fontScale*this.layout.letterHeight*2);for(var w=0;w<this.rubyStack.length;w++){var u=this.rubyStack[w];var r=Math.floor(D+u.startPos);var q=s+"margin-top:"+r+"px;";var x=r;B+=c("div",{style:q},false);for(var t=0;t<u.yomi.length;t++){var E=u.yomi.substring(t,t+1);B+=F.makeCharInner(E)+"<br />";x+=A;if(x>=v){C.push({yomi:u.yomi.slice(t+1),startPos:0});break}}B+="</div>"}this.rubyStack=C;return B};h.prototype.makeLineH=function(){var q="";if(this.rubyStack.length>0){q+=this.makeRubyLineH()}q+="<div>";q+=this.lineBuff+"<br />";if(this.fontStyle!=""){q+="</span>"}if(this.bgColor!=""){q+=this.endBgColor()}q+="</div>";return q};h.prototype.makeRubyLineH=function(){var r="";var q=this;var u=this.indentCount*this.layout.letterHeight;var v=Math.floor(this.layout.rubyFontSize*this.lineScale);var t={"font-size":v+"px",margin:"0",padding:"0","line-height":v+"px"};r+=c("div",{style:p(t)},false);for(var s=0;s<this.rubyStack.length;s++){(function(y,w){var z="position:absolute; margin-top:-0.3em; margin-left:"+Math.floor(u+w.startPos)+"px;";r+=c("span",{style:z},false);for(var x=0;x<w.yomi.length;x++){(function(A,B){r+=B})(x,w.yomi.substring(x,x+1))}r+="</span>"})(s,this.rubyStack[s])}this.rubyStack=[];r+="</div>";return r};h.prototype.makeBoutenLine=function(){var s="";var r=this;var u={position:"absolute","margin-left":"-0.35em"};var q=p(u);for(var t=0;t<this.boutenStack.length;t++){(function(w){while(w.count>0){if(w.str=="・"){var v=r.layout.fontSize}else{if(w.str=="ヽ"){var v=Math.floor(r.layout.fontSize*70/100)}}var x=q+"; font-size:"+v+"px; margin-top:"+w.startPos+"px;";s+=c("div",{style:x},false);s+=w.str;s+="</div>";w.startPos+=r.layout.letterHeight;w.count--}})(this.boutenStack[t])}this.boutenStack=[];return s};h.prototype.normalIndent=function(r){this.isHankaku=false;this.isSmall=false;if(this.lineScale<=1){if(r.match(/[a-z0-9]+/i)){this.isHankaku=true;var q=(r.length>1)?"line-height:1em":"line-height:1em; margin-left:0.25em";return c("span",{style:q},false)+r+"</span><br />"}}if(r.match(/[ぁァぃィぅゥぇェぉォヵヶっッゃャゅュょョゎヮ]/)){this.isSmall=true;var q="overflow:visible;position:relative;top:-0.15em;right:-0.08em;line-height:1em;";return c("span",{style:q},false)+r+"</span><br />"}return this.makeCharInner(r)+"<br />"};h.prototype.toBold=function(q){return("<b>"+q+"</b>")};h.prototype.toStyle=function(q){return(function(r){return("<span style='"+q+"'>"+r+"</span>")})};h.prototype.toLink=function(q){return(function(r){return("<a "+b(q)+">"+r+"</a>")})};h.prototype.isHeadNg=function(r){var q=["？","】","，",",","》","。","、","・","｣","」","』","）","＞","〉","≫","]","〕","]","］","！","!",") ","々","ゝ","ー","－"];for(i=0;i<q.length;i++){if(r==q[i]){return true}}return false};h.prototype.isTailNg=function(r){var q=["【","《","「","『","（","［","[","〔","＜","≪","(","〈"];for(i=0;i<q.length;i++){if(r==q[i]){return true}}return false};h.prototype.applyTagStack=function(t,s){var q=s?this.normalIndent(t):t;for(i=this.tagStack.length-1;i>=0;i--){var r=this.tagStack[i];q=r(q)}return q};h.prototype.isValidPageRange=function(q){return(0<=q&&q<this.seekTable.length)};h.prototype.setSeekPage=function(q){if(this.isValidPageRange(q)){this.textStream.seekPos=this.seekTable[q].spos;this.seekWidth=0;this.seekHeight=0;this.seekLineCharCount=0;if(q==0){this.tagStack=[]}}};h.prototype.getPageSeekPos=function(q){if(this.isValidPageRange(q)){return this.seekTable[q]}return 0};h.prototype.getSeekPercent=function(q){if(q<this.seekTable.length-1){return Math.floor(100*this.seekTable[q+1].spos/this.textStream.length)}return 100};h.prototype.getPageSourceText=function(q){if(q<this.seekTable.length){var s=this.seekTable[q].spos;if(q+1<this.seekTable.length){var r=this.seekTable[q+1].spos;return this.textStream.buffer.substring(s,r)}}return""};h.prototype.getPageNoFromSeekPos=function(r){for(var q=0;q<this.seekTable.length-1;q++){if(this.seekTable[q].spos<=r&&r<this.seekTable[q+1].spos){return q}}if(this.seekTable[q].spos<=r&&r<=this.textStream.buffer.length){return q}return -1};h.prototype.makeRestSpaceTd=function(){var r=this.layout.width-this.seekWidth;var q="";if(r>0){q="<td style='display:block; width:"+r+"px; height:"+this.layout.height+"'></td>\n"}return q};h.prototype.getPageSeekPos=function(q){if(this.isValidPageRange(q)){return this.seekTable[q]}return{spos:0,cpos:0}};h.prototype.saveSeekState=function(q,r){if(this.isValidPageRange(q)){this.seekTable[q]=r}else{this.seekTable.push(r)}};h.prototype.fixH=function(q){if(q=="―"){return"<span style='margin-top:-0.2em; float:right'>"+q+"</span>"}return q};h.prototype.fixW=function(q){if(q=="―"||q=="…"){return"<span style='margin-left:-0.24em'>"+q+"</span>"}return q};h.prototype.hasNextPage=function(){return(this.textStream.seekPos<this.textStream.length)};h.prototype.addCache=function(r,q){this.pageCache[r]=q};h.prototype.getCache=function(q){return this.pageCache[q]};h.prototype.clearCache=function(){this.pageCache=[];this.tagStack=[]};h.prototype.reset=function(){this.clearCache();this.textStream.seekPos=0};h.prototype.getLetterCount=function(q){if(escape(q).charAt(1)=="u"){return 1}else{if(!this.layout.isV){return 0.5}else{return(q==" ")?1:f.canTransform?0.5:1}}};h.prototype.addIndent=function(r){var s=(this.layout.isV)?"　<br />":"　";for(var q=0;q<r;q++){this.lineBuff+=s}};h.prototype.getLayout=function(){return this.layout};h.prototype.setLayout=function(q){this.layout=q;this.layout.initialize()};h.prototype.getPageLayout=function(s,q){var u="<"+this.layout.wrapTag+" class='"+this.layout.textLayerClassName+"' style='"+this.layout.wrapCss+"'>";var t="</"+this.layout.wrapTag+">";var r=(q!="")?u+q+t:"";this.addCache(s,r);return r};h.prototype.outputPage=function(q){if(this.isResuming){this.isResuming=false;return this.parsePage(q)}else{if(typeof this.pageCache[q]!="undefined"){this.setSeekPage(q+1);return this.pageCache[q]}else{this.setSeekPage(q);return this.parsePage(q)}}};h.prototype.onOverFlowPage=function(q,s){if(s){if(this.layout.directionH=="rl"){this.blockBuff=this.makeRestSpaceTd()+this.blockBuff}else{this.blockBuff=this.blockBuff+this.makeRestSpaceTd()}}var r=(s)?"<tr>"+this.blockBuff+"</tr>":this.blockBuff;this.saveSeekState(q+1,{spos:this.textStream.seekPos,cpos:this.seekCharCount});this.blockBuff="";this.lineBuff="";if(this.bgColor!=""){this.lineBuff+=this.startBgColor()}this.lineScale=this.fontScale;if(s){this.seekWidth=0}else{this.seekHeight=0}this.seekLineCharCount=0;return this.getPageLayout(q,r)};h.prototype.onBufferEnd=function(q,r){if(this.textStream.isEOF){if(this.lineBuff!=""){this.pushLine(q,r)}return this.onOverFlowPage(q,r)}else{this.isResuming=true;if(this.resumePos>=0){this.textStream.seekPos=this.resumePos;this.lineBuff=this.lineSave}throw"BufferEnd"}};h.prototype.onRubyBufferEnd=function(q,r){delete this.rubyStream;this.rubyStream=null};h.prototype.pushLineToBlockV=function(q){if(this.layout.directionH=="rl"){this.blockBuff=q+this.blockBuff}else{this.blockBuff+=q}};h.prototype.pushLine=function(q,r){if(this.blockBuff!=""||this.lineBuff!=""){if(r){if(this.halfBuff){this.lineBuff+=this.outputHalfWord();if(this.getLetterCount(this.textStream.lookNextChar())<1){this.halfWordBreak=true}}this.pushLineToBlockV(this.makeLineTd())}else{this.blockBuff+=this.makeLineH()}this.lineBuff="";if(this.fontStyle!=""){this.lineBuff+=fontStyle}if(this.bgColor!=""){this.lineBuff=this.startBgColor()}if(r){this.seekWidth+=Math.floor(this.layout.baseLineHeight*this.lineScale);this.seekHeight=0}else{this.seekHeight+=Math.floor(this.layout.baseLineHeight*this.lineScale);this.seekWidth=0}this.seekLineCharCount=0;this.lineScale=this.fontScale}};h.prototype.checkOverflow=function(q){if(q){return(this.seekWidth+Math.floor(this.layout.fontSize*this.lineScale)>this.layout.width)}return(this.seekHeight+Math.floor((this.layout.fontSize+this.layout.rubyFontSize)*this.lineScale)>this.layout.height)};h.prototype.parseEndPage=function(r,t,u,q,s){if(this.lineBuff!=""){this.pushLine(r,t)}if(this.recursiveParser){this.textStream.seekPos=this.resumePos}throw"OverflowPage"};h.prototype.adjustSize=function(s,v,u,q){var r=s;var t=v;if(s>u){r=u;t-=Math.floor((v/s)*(s-u))}if(v>q){t=q;r-=Math.floor((s/v)*(v-q))}return{width:r,height:t}};h.prototype.parseObjectStart=function(s,v,x,r,t){var u=parseInt(r.width);var q=parseInt(r.height);var w=(typeof r.align!="undefined")?r.align:"none";this.objFigure={src:x,align:w,width:u,height:q,drawWidth:u,drawHeight:q}};h.prototype.parseObjectBody=function(r,t,u,q,s){if(this.objFigure){this.objFigure.src+=u}};h.prototype.parseObjectEnd=function(r,t,u,q,s){this.objFigure.src+=u;this.pushFigure(r,t,"object",this.objFigure)};h.prototype.parseImg=function(r,s,B,y,v){var q=y.src;var t=(typeof y.width!="undefined")?parseInt(y.width):200;var A=(typeof y.height!="undefined")?parseInt(y.height):300;var x=(typeof y.align!="undefined")?y.align:"none";var u=this.layout.width-this.seekWidth;var z=this.layout.height-this.seekHeight;var w=this.adjustSize(t,A,u,z);this.pushFigure(r,s,"img",{src:q,align:x,width:t,height:A,drawWidth:w.width,drawHeight:w.height})};h.prototype.pushFigure=function(q,r,v,t){if(this.lineBuff!=""){this.pushLine(q,r);if(this.checkOverflow(r)){this.textStream.seekPos=this.resumePos;throw"OverflowPage"}}if(this.recursiveParser){if(this.lineBuff!=""){this.pushLine(q,r)}this.textStream.seekPos=this.resumePos;throw"OverflowPage"}if((r&&t.width>this.layout.width)||(!r&&t.height>this.layout.height)){return}if((r&&this.seekWidth+t.drawWidth+this.layout.yohakuHeight>this.layout.width)||(!r&&this.seekHeight+t.drawHeight+this.layout.yohakuHeight>this.layout.height)){this.textStream.seekPos=this.resumePos;throw"OverflowPage"}if((t.drawWidth!=t.width||t.drawHeight!=t.height)&&(t.drawWidth*2<t.width||t.drawHeight*2<t.height)){this.textStream.seekPos=this.resumePos;throw"OverflowPage"}if(r){var B=this.layout.height-t.drawHeight-this.layout.fontSize}else{var B=this.layout.width-t.drawWidth-this.layout.fontSize}var w="";if(r){if(!this.textStream.isEOF||t.align=="none"||B<=0||B*2<this.layout.height){if(v=="img"){var x=c("img",{src:t.src,width:t.drawWidth,height:t.drawHeight},true)}else{var x=t.src}}else{if(t.align=="top"||t.align=="left"){var s="padding:0; margin-bottom:"+this.layout.fontSize+"px;"}else{if(t.align=="bottom"||t.align=="right"){var s="padding:0; margin-top:0;"}}if(v=="img"){var x=c("img",{src:t.src,width:t.drawWidth,height:t.drawHeight,style:s},true)}else{var x=c("div",{style:s},false)+t.src+"</div>"}var u=new h(new m({width:t.drawWidth,height:B,fontSize:this.layout.fontSize,direction:this.layout.direction,charImgRoot:this.layout.charImgRoot,charImgMap:this.layout.charImgMap,charImgColor:this.layout.charImgColor,kinsokuCharCount:1}),this.textStream);u.recursiveParser=true;if(this.layout.fontFamily){u.layout.fontFamily=this.layout.fontFamily;u.layout.initialize()}w=u.parsePage(0);delete u}var y={"vertical-align":"top","padding-right":this.layout.yohakuHeight+"px"};var A=(t.align=="top"||t.align=="left")?x+w:w+x;this.blockBuff=c("td",{style:p(y)},false)+A+"</td>"+this.blockBuff;this.seekWidth+=t.drawWidth+this.layout.yohakuHeight}else{if(!this.textStream.isEOF||t.align=="none"||B<=0||B*2<this.layout.width){if(v=="img"){var x=c("img",{src:t.src,width:t.drawWidth,height:t.drawHeight},true)}else{var x=t.src}this.blockBuff+=x+"<br />";this.seekHeight+=t.drawHeight+this.layout.yohakuHeight}else{if(v=="img"){var x=c("img",{src:t.src,width:t.drawWidth,height:t.drawHeight},true)}else{var x=t.src}var u=new h(new m({width:B,height:t.drawHeight,fontSize:this.layout.fontSize,direction:"horizontal",charImgRoot:this.layout.charImgRoot,charImgMap:this.layout.charImgMap,charImgColor:this.layout.charImgColor,kinsokuCharCount:1}),this.textStream);u.recursiveParser=true;if(this.layout.fontFamily){u.layout.fontFamily=this.layout.fontFamily;u.layout.initialize()}w=u.parsePage(0);delete u;if(t.align=="top"||t.align=="left"){var z="<div style='float:left; width:"+(t.drawWidth+this.layout.fontSize)+"px;'>"+x+"</div>";var C="<div style='float:left; width:"+B+"px;'>"+w+"</div>"}else{if(t.align=="bottom"||t.align=="right"){var z="<div style='float:left; width:"+B+"px;'>"+w+"</div>";var C="<div style='float:left; width:"+(t.drawWidth+this.layout.fontSize)+"px;'>"+x+"</div>"}}this.blockBuff+=("<div style='width:"+this.layout.width+"px;'>"+z+C+"<div style='clear:left;line-height:0px;font-size:0px;'></div></div>");this.seekHeight+=t.drawHeight+this.layout.yohakuHeight}}};h.prototype.parseLinkStart=function(r,t,u,q,s){if(s=="a2"){q.target="_blank"}if(t){this.tagStack.push(this.toLink(q))}else{this.lineBuff+="<a "+b(q)+">"}};h.prototype.parseLinkEnd=function(r,t,u,q,s){if(t){this.tagStack.pop()}else{if(s=="/a2"){this.lineBuff+="</a>"}else{this.lineBuff+=u}}};h.prototype.parseBoldStart=function(r,t,u,q,s){if(t){this.tagStack.push(this.toBold)}else{this.lineBuff+=u}};h.prototype.parseBoldEnd=function(r,t,u,q,s){if(t){this.tagStack.pop()}else{this.lineBuff+=u}};h.prototype.parseFontStart=function(r,v,w,q,t){var s={};this.fontScale=(typeof q.scale!="undefined")?parseFloat(q.scale):1;if(this.fontScale<1||this.fontScale>1){s["font-size"]=this.fontScale+"em";if(v){s["line-height"]="1.1em"}}if(this.fontScale>this.lineScale){this.lineScale=this.fontScale}if(typeof q.color!="undefined"){s.color=q.color}if(typeof q.family!="undefined"){s["font-family"]=q.family}if(typeof q.weight!="undefined"){s["font-weight"]=q.weight}this.bgColor=(typeof q.bgcolor!="undefined")?q.bgcolor:"";if(this.bgColor!=""){this.lineBuff+=this.startBgColor()}var u=p(s);if(u!=""){u+="vertical-align:baseline;";if(v){this.tagStack.push(this.toStyle(u))}else{this.fontStyle=c("span",{style:u},false);this.lineBuff+=this.fontStyle}}};h.prototype.parseFontEnd=function(r,t,u,q,s){this.fontScale=1;if(this.seekLineCharCount==0){this.lineScale=1}if(t){if(this.bgColor!=""){this.lineBuff+=this.endBgColor();this.bgColor=""}this.tagStack.pop()}else{this.fontStyle="";this.lineBuff+="</span>";if(this.bgColor!=""){this.lineBuff+=this.endBgColor();this.bgColor=""}}};h.prototype.parseBoutenStart=function(r,t,u,q,s){this.bouten=true;this.boutenStartPos=this.seekHeight;if(f.isIE){this.boutenStartPos+=Math.floor(this.layout.baseLetterSpacing*this.fontScale)}this.boutenStr=this.getBoutenStr(s)};h.prototype.parseBoutenEnd=function(r,t,u,q,s){this.bouten=false;this.boutenStack.push({startPos:this.boutenStartPos,count:this.boutenCount,str:this.boutenStr});this.boutenCount=0};h.prototype.parsePackStart=function(r,t,u,q,s){if(t){this.packStr=""}};h.prototype.parseRubyStart=function(r,t,u,q,s){if(t){this.rubyStream=new d(this.seekHeight)}else{this.rubyStream=new d(this.seekWidth)}};h.prototype.parseRubyEnd=function(r,t,u,q,s){this.rubyStack.push({yomi:this.rubyStream.yomi,startPos:this.rubyStream.rubyStartPos});this.rubyStream.setReady()};h.prototype.parseBlockquoteStart=function(r,t,u,q,s){this.blockIndentCount=(typeof q.indent!="undefined")?parseInt(q.indent):2;this.indentCount+=this.blockIndentCount;if(this.lineCount<=this.indentCount*2){this.activateTag("blockquote",false)}this.layout.lineCount-=this.blockIndentCount*2};h.prototype.parseBlockquoteEnd=function(r,t,u,q,s){this.indentCount-=this.blockIndentCount;this.layout.lineCount+=this.blockIndentCount*2;this.blockIndentCount=0};h.prototype.parseTagHook=function(s,u,v,r,t,q){if(o.enableTagHook(t)){o.getTagHook(t).apply(this,[s,u,v,r,t])}};h.prototype.parseTag=function(r,v){var w=this.textStream.getTag();var t=w.replace("<","").replace(">","").replace("/>","");var q=this.parseAttr(t);var s=t.split(/[\s\t]+/)[0].toLowerCase();var u=(s.substring(0,1)=="/");this.activateTag(s.replace("/",""),!u);switch(s){case"end-page":this.parseEndPage(r,v,w,q,s);break;case"img":this.parseImg(r,v,w,q,s);break;case"a":case"a2":this.parseLinkStart(r,v,w,q,s);break;case"/a":case"/a2":this.parseLinkEnd(r,v,w,q,s);break;case"b":case"strong":this.parseBoldStart(r,v,w,q,s);break;case"/b":case"/strong":this.parseBoldEnd(r,v,w,q,s);break;case"font":this.parseFontStart(r,v,w,q,s);break;case"/font":this.parseFontEnd(r,v,w,q,s);break;case"bt-disc":case"bt-accent":case"bt-circle":case"bt-dot":this.parseBoutenStart(r,v,w,q,s);break;case"/bt-disc":case"/bt-accent":case"/bt-circle":case"/bt-dot":this.parseBoutenEnd(r,v,w,q,s);break;case"pack":this.parsePackStart(r,v,w,q,s);break;case"ruby":this.parseRubyStart(r,v,w,q,s);break;case"/ruby":this.parseRubyEnd(r,v,w,q,s);break;case"blockquote":this.parseBlockquoteStart(r,v,w,q,s);break;case"/blockquote":this.parseBlockquoteEnd(r,v,w,q,s);break;case"object":this.parseObjectStart(r,v,w,q,s);break;case"/object":this.parseObjectEnd(r,v,w,q,s);break;case"embed":case"/embed":case"param":case"/param":this.parseObjectBody(r,v,w,q,s);break;default:this.parseTagHook(r,v,w,q,s);break}};h.prototype.checkTailNg=function(q,s){var r=this.textStream.lookNextChar();if(this.isTailNg(r)){this.pushLine(q,s);this.textStream.skipCRLF()}};h.prototype.checkHeadNg=function(q,t){var s=this.textStream.lookNextChar();if(this.isHeadNg(s)){this.textStream.stepSeekPos();this.seekCharCount++;if(this.bouten){this.boutenCount++}if(t){this.lineBuff+=this.applyTagStack(s,true)}else{this.lineBuff+=this.fixW(s)}var r=this.textStream.lookNextChar();if(this.isHeadNg(r)){this.textStream.stepSeekPos();this.seekCharCount++;if(this.bouten){this.boutenCount++}this.lineBuff+=this.applyTagStack(r,true)}}this.pushLine(q,t);this.textStream.skipCRLF()};h.prototype.outputHalfWord=function(){if(this.halfBuff.length==1){var q=this.applyTagStack(this.halfBuff,true)}else{if(this.halfBuff.length==2&&!this.halfWordBreak&&(this.halfBuff.match(/\d+/)||this.halfBuff.match(/[!\?]+/))){var q=this.applyTagStack(this.halfBuff,true)}else{if(f.isIE){var s=p({"writing-mode":"tb-rl",width:this.layout.fontSize+"px"});var q="<div class='hw-tbrl' style='"+s+"'>"+this.applyTagStack(this.halfBuff,false)+"</div>"}else{var r=this.fontScale*this.layout.fontSize/2;var t=Math.max(0,Math.floor((this.halfBuff.length-2)*r));var s=p({"-webkit-transform":"rotate(90deg)","-webkit-transform-origin":"50% 50%","-moz-transform":"rotate(90deg)","-moz-transform-origin":"50% 50%","margin-bottom":t+"px",width:this.layout.fontSize+"px"});var q="<div class='hw-trans' style='"+s+"'>"+this.applyTagStack(this.halfBuff,false)+"</div>"}}}delete this.halfBuff;this.halfBuff=null;this.halfWordBreak=false;return q};h.prototype.pushHalfChar=function(r){if(this.halfBuff){this.halfBuff+=r}else{this.halfBuff=r}var q=this.textStream.lookNextChar();if(this.getLetterCount(q)>=1||q=="<"||q==" "||q=="　"||q=="\t"||q=="\r"||q=="\n"){this.lineBuff+=this.outputHalfWord()}};h.prototype.pushChar=function(r,u,s){var v=this.getLetterCount(s);var t=v*this.fontScale;if(this.seekLineCharCount==0&&this.indentCount>0){this.addIndent(this.indentCount)}if(u){if(v<1&&f.canTransform){this.pushHalfChar(s)}else{this.lineBuff+=this.applyTagStack(s,true)}if(this.isImgChar){this.seekHeight+=Math.floor(t*this.layout.fontSize)}else{if(this.isHankaku||this.isSmall){this.seekHeight+=Math.floor(t*this.layout.fontSize)}else{this.seekHeight+=Math.floor(t*this.layout.letterHeight)}}}else{this.lineBuff+=this.fixW(s);this.seekWidth+=Math.floor(t*this.layout.fontSize)}this.seekLineCharCount+=t;this.seekCharCount++;if(this.bouten){this.boutenCount++}var q=this.layout.lineCount-this.seekLineCharCount;if(1<=q&&q<=1.5){this.checkTailNg(r,u)}else{if(q<1){this.checkHeadNg(r,u)}}};h.prototype.parsePage=function(q){var u=this.layout.isV;this.lineSave="";while(true){try{this.resumePos=-1;var t=this.textStream.seekPos;if(!this.pack&&this.packStr!=""){var r=this.packStr;this.packStr=""}else{if(this.rubyStream&&this.rubyStream.isReady()){var r=this.rubyStream.getchar()}else{var r=this.textStream.getchar()}}if(r=="\r"){}else{if(r=="\n"){this.pushLine(q,u)}else{if(r=="<"){this.lineSave=this.lineBuff;this.resumePos=t;this.parseTag(q,u)}else{if(this.isActiveTag("pack")){this.packStr+=r}else{if(this.isActiveTag("ruby")){if(this.isActiveTag("rt")){this.rubyStream.addYomi(r)}else{if(this.isActiveTag("rb")){this.rubyStream.addKanji(r)}}}else{if(this.isActiveTag("script")){}else{this.pushChar(q,u,r)}}}}}}if(this.checkOverflow(u)){throw"OverflowPage"}}catch(s){if(s=="RubyBufferEnd"){this.onRubyBufferEnd(q,u)}else{if(s=="OverflowPage"){return this.onOverFlowPage(q,u)}else{if(s=="BufferEnd"){return this.onBufferEnd(q,u)}}}}}};var j={parse:function(u){var t=u.split(/[\s\t]/);var r={direction:"vertical",fontSize:16,width:400,height:300,order:0,charImgColor:"black",isSinglePaging:false};for(var s=0;s<t.length;s++){var q=t[s];if(q=="lp-vertical"||q=="lp-vertical-rl"){r.direction="vertical"}else{if(q=="lp-vertical-lr"){r.direction="vertical-lr"}else{if(q=="lp-horizontal"){r.direction="horizontal"}else{if(q.match(/span-([0-9]+)/)){r.width=parseInt(RegExp.$1)*40-10}else{if(q.match(/lp-width-([0-9]+)/)){r.width=parseInt(RegExp.$1)}else{if(q.match(/lp-height-([0-9]+)/)){r.height=parseInt(RegExp.$1)}else{if(q.match(/lp-font-size-([0-9]+)/)){r.fontSize=parseInt(RegExp.$1)}else{if(q.match(/lp-order-([0-9]+)/)){r.order=parseInt(RegExp.$1)}else{if(q.match(/lp-char-img-white/)){r.charImgColor="white"}else{if(q.match(/lp-single-paging/)){r.isSinglePaging=true}}}}}}}}}}}return r}};function a(y,r,s){this.grids=r.sort(function(B,A){return(B.order-A.order)});this.head=this.grids[0];var x=this.head.node.innerHTML;if(f.isIE||!s.noBR){x=x.replace(/<br \/>/gi,"\n").replace(/<br>/gi,"\n")}this.head.node.innerHTML="";this.fontFamily=s.fontFamily;this.onSeek=s.onSeek;this.onComplete=s.onComplete;this.charImgRoot=s.charImgRoot;this.groupName=y;this.gridIndex=0;this.parser=new h(new m({direction:this.head.direction,width:this.head.width,height:this.head.height,fontSize:this.head.fontSize,fontFamily:this.fontFamily,kinsokuCharCount:1,letterSpacingRate:0.1,charImgRoot:this.charImgRoot,charImgColor:this.head.charImgColor}),new e(x,x.length,true));if(this.head.isSinglePaging){var z=this;this.pager=document.createElement("div");var v=document.createElement("a");var t=document.createElement("a");this.pager.className="nehan-pager";v.href="/next";v.className="nehan-pager-link";t.innerHTML="PREV &gt;";t.href="/prev";t.className="nehan-pager-link";v.onclick=function(){if(z.parser.hasNextPage()){z.gridIndex++;z.render(z.gridIndex)}return false};t.onclick=function(){if(z.gridIndex>0){z.gridIndex--;z.render(z.gridIndex)}return false};if(this.head.direction.match("vertical")){v.innerHTML="&lt; NEXT";t.innerHTML="PREV &gt;";this.pager.appendChild(v);this.pager.appendChild(t)}else{v.innerHTML="NEXT &gt;";t.innerHTML="&lt; PREV";this.pager.appendChild(t);this.pager.appendChild(v)}this.seekBar=document.createElement("div");this.seekBar.className="nehan-seek-bar-wrapper";var w=this.seekBar.style;w.width=this.head.width+"px";w.height="12px";w.lineHeight="12px";var q=document.createElement("div");var u=q.style;q.className="nehan-seek-bar";u.width="0%";u["float"]="right";u["text-align"]="right";u["font-size"]="10px";q.innerHTML="0%";this.seekBar.appendChild(q)}}a.prototype.setGridLayout=function(r){var q=this.parser.layout;q.setDirection(r.direction);q.setWidth(r.width);q.setHeight(r.height);q.setFontSize(r.fontSize);q.setFontFamily(this.fontFamily);q.setCharImgColor(r.charImgColor);q.setCharImgRoot(this.charImgRoot);q.initialize()};a.prototype.getGrid=function(q){return(q<this.grids.length)?this.grids[q]:this.grids[this.grids.length-1]};a.prototype.render=function(q){this.gridIndex=q;var r=(this.head.isSinglePaging)?this.head:this.getGrid(q);this.setGridLayout(r);var t=this.parser.outputPage(q);var s=!this.parser.hasNextPage();var v=this.parser.getSeekPercent(q);this.onSeek(this.groupName,v);var u=function(){var z=document.createElement("div");z.className=w;z.innerHTML=t;return z};if(t!=""){var w="text-layer-wrapper";if(q==0){w+=" text-layer-header"}if(s){w+=" text-layer-footer"}if(this.head.isSinglePaging){if(typeof this.pagerInit=="undefined"){this.pagerInit=true;this.textLayer=u();this.textLayer.style.height=this.head.height+"px";r.node.appendChild(this.pager);r.node.appendChild(this.textLayer);r.node.appendChild(this.seekBar)}else{this.textLayer.innerHTML=t}var x=this.seekBar.firstChild;x.style.width=Math.max(20,Math.floor(v))+"%";x.innerHTML=v+"%"}else{if(q<this.grids.length){r.node.innerHTML="<div class='"+w+"'>"+t+"</div>"}else{r.node.appendChild(u())}}}if(s){g.setFinish(this.groupName);this.onComplete(this.groupName,g.getSeekPercent());g.checkFinish()}else{if(!this.head.isSinglePaging){var y=this;setTimeout(function(){y.render(q+1)},0)}}};var g={setFinish:function(q){this.gridMappedCount++},getSeekPercent:function(){return Math.floor(100*this.gridMappedCount/this.gridCount)},checkFinish:function(){if(this.gridMappedCount>=this.gridCount){this.onCompleteAll()}},start:function(C,y){var w={filter:"direction",noBR:false,charImgRoot:"/img/char",fontFamily:"IPA明朝, ＭＳ 明朝, Osaka-Mono, Hiragino Mincho Pro",onSeek:function(E,D){},onComplete:function(E,D){},onCompleteAll:function(){}};if(typeof y=="undefined"){y={}}for(var q in w){if(q=="onCompleteAll"){this[q]=(typeof y[q]!="undefined")?y[q]:w[q]}else{y[q]=(typeof y[q]!="undefined")?y[q]:w[q]}}var r=document.getElementsByTagName(C);var v=function(F,G,D){var E=j.parse(D);E.node=F;E.tagGroup=C;return E};var u={};this.gridCount=0;this.gridMappedCount=0;for(var x=0;x<r.length;x++){var t=r[x];var s=false;if(y.filter=="group"){if(t.className.match(/lp-group-([a-zA-Z0-9\-_]+)/)){var B=RegExp.$1;s=true}}else{if(y.filter=="direction"){if(t.className.match(/lp-vertical/)){var B="group-v"+x;s=true}else{if(t.className.match(/lp-horizontal/)){var B="group-h"+x;s=true}}}}if(s){this.gridCount++;var A=t.className;var z=v(t,B,A);if(typeof u[B]=="undefined"){u[B]=[z]}else{u[B].push(z)}}}for(var B in u){(new a(B,u[B],y)).render(0)}}};Nehan.Env=f;Nehan.Layout=m;Nehan.TextStream=e;Nehan.StreamParser=h;Nehan.LayoutMapper=g;Nehan.ParserHook=o})();
