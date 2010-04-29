/*
 source : scroll-reader.js
 version : 1.0
 site : http://tategakibunko.mydns.jp/
 blog : http://tategakibunko.blog83.fc2.com/

 Copyright (c) 2010, Watanabe Masaki <lambda.watanabe@gmail.com>
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
var ScrollReader = {
  appendPage : function(page){
    var child = document.createElement("div");
    var style = child.style;
    child.innerHTML = page;
    child.className = this.pageClassName; // for firefox and ie
    style.display = "inline";
    style["float"] = "right";
    this.wrapper.appendChild(child);
  },
  calcPage : function(pageNo){
    var self = this;
    if(this.parser.hasNextPage()){
      this.pages.push(this.parser.outputPage(pageNo));
      var percent = this.parser.getSeekPercent(pageNo);
      this.seekMeter.innerHTML = percent + "%";
      this.onSeek(percent);
      this.totalWidth += this.parser.layout.width;
      setTimeout(function(){ self.calcPage(pageNo+1); }, 0);
    } else {
      var s = this.cont.style;
      s.width = this.totalWidth + "px";
      document.body.scrollLeft = this.totalWidth - this.parser.layout.width;
      this.seekMeter.style.display = "none";
      for(var i = 0; i < this.pages.length; i++){
	this.appendPage(this.pages[i]);
      }
      this.onComplete();
    }
  },
  start: function(containerId, option){
    var self = this;
    var defopt = {
      height: 400,
      fontSize: 16,
      fontFamily: "IPA明朝, ＭＳ 明朝, Hiragino Mincho Pro",
      charImgRoot:"/img/char",
      onSeek: function(percent){},
      pageClassName: "nehan-page",
      onComplete: function(){}
    };
    if(!option){
      option = defopt;
    }
    for(var prop in defopt){
      this[prop] = (typeof option[prop] != "undefined")? option[prop] : defopt[prop];
    }
    this.width = Math.floor(this.fontSize * 1.8) * 20;
    this.containerId = containerId;
    this.cont = document.getElementById(this.containerId);
    this.totalWidth = 0;
    var text = this.cont.innerHTML.replace(/<br>/gi, "\n").replace(/<br \/>/gi, "\n");
    var wstream = new Nehan.TextStream(text, text.length, true);
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      width: this.width,
      height: this.height,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      lineHeightRate: 1.8,
      letterSpacingRate: 0.1,
      direction: "vertical",
      charImgRoot: option.charImgRoot
    }), wstream);
    this.cont.innerHTML = "";
    this.wrapper = document.createElement("div");
    this.seekMeter = document.createElement("div");
    this.cont.appendChild(this.seekMeter);
    this.cont.appendChild(this.wrapper);
    this.pages = [];
    this.calcPage(0);
  }
};
