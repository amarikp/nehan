/*
 source : scroll-reader.js for nehan2
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
  appendPage : function(pageHtml){
    var child = document.createElement("div");
    var style = child.style;
    child.innerHTML = pageHtml;
    child.className = "scroll-frame";
    style.display = "inline";
    style["float"] = "right";
    this.wrapper.appendChild(child);
  },
  processPage : function(pageNo){
    var self = this;
    if(this.provider.hasNextPage()){
      var output = this.provider.outputPage(pageNo);
      this.pages.push(output.html);
      this.seekMeter.innerHTML = output.percent + "%";
      this.totalWidth += this.provider.getLayout().width;
      setTimeout(function(){ self.processPage(pageNo+1); }, 0);
    } else {
      var s = this.wrapper.style;
      s.width = this.totalWidth + "px";
      document.body.scrollLeft = this.totalWidth - this.provider.getLayout().width;
      for(var i = 0; i < this.pages.length; i++){
	this.appendPage(this.pages[i]);
      }
      this.seekMeter.style.display = "none";
    }
  },
  start: function(id, layoutOpt){
    var self = this;
    var text = document.getElementById(id).innerHTML;
    layoutOpt.width = Math.floor(layoutOpt.fontSize * 1.8) * 20;
    this.provider = new Nehan.PageProvider(layoutOpt, text);
    this.wrapper = document.createElement("div");
    this.seekMeter = document.createElement("div");
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(this.seekMeter);
    body.appendChild(this.wrapper);
    this.totalWidth = 0;
    this.pages = [];
    this.processPage(0);
  }
};
