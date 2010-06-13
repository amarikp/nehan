/*
 source : dangumi-reader.js
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
var DangumiReader = {
  start : function(opt){
    if(typeof opt == "undefined"){
      opt = {};
    }
    var defopt = {
      direction: "vertical",
      width: 640,
      height: 320,
      fontSize: 16,
      danCount: 2,
      fontFamily: "IPA明朝, ＭＳ 明朝, Hiragino Mincho Pro",
      charImgRoot:"./img",
      onSeek: function(percent){},
      onComplete: function(pageCount){},
      onWrite : function(danPageNo){}
    };
    for(var prop in defopt){
      this[prop] = (opt[prop])? opt[prop] : defopt[prop];
    }
    var text = document.getElementById("source-text").innerHTML.replace(/<br \/>/gi, "\n").replace(/<br>/gi, "\n");
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      direction: this.direction,
      width: this.width,
      height: this.height,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      charImgRoot: this.charImgRoot
    }), new Nehan.TextStream(text, text.length, true));

    var self = this;
    document.getElementById("pager-next").onclick = function(){ self.next(); return false; };
    document.getElementById("pager-prev").onclick = function(){ self.prev(); return false; };

    this.pageNo = 0;
    this.pageCount = 0;
    this.writing = false;

    this.parse(this.pageNo);
  },
  parse : function(pageNo){
    var self = this;
    if(this.parser.hasNextPage()){
      this.parser.parsePage(pageNo);
      this.onSeek(this.parser.getSeekPercent(pageNo));
      setTimeout(function(){ self.parse(pageNo + 1); }, 0);
    } else {
      this.pageCount = Math.max(1, pageNo);
      this.danPageCount = Math.floor(this.pageCount / this.danCount) + ((this.pageCount % this.danCount > 0)? 1 : 0);
      this.onComplete(this.pageCount, this.danPageCount);
      this.parser.setSeekPage(0);
      this.write(0);
    }
  },
  write : function(pageNo){
    this.writing = true;
    var html = "";
    for(var i = 0; i < this.danCount; i++){
      if(pageNo + i >= this.pageCount){
	break;
      }
      html += this.parser.outputPage(pageNo+i);
    }
    if(html != ""){
      document.getElementById("result").innerHTML = html;
    }
    this.writing = false;

    this.onWrite(this.pageNo / this.danCount);
  },
  next : function(){
    if(!this.writing && (this.pageNo + this.danCount) < this.pageCount){
      this.pageNo += this.danCount;
      this.write(this.pageNo);
    }
  },
  prev : function(){
    if(!this.writing && this.pageNo > 0){
      var mod = this.pageNo % this.danCount;
      this.pageNo -= ((mod == 0)? this.danCount : mod);
      this.write(this.pageNo);
    }
  }
}
