/*
 source : simple-reader.js
 version : 1.1
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
var SimpleReader = {
  start : function(id, opt){
    if(typeof opt == "undefined"){
      opt = {};
    }
    var defopt = {
      direction: "vertical",
      width: 640,
      height: 480,
      fontSize: 16,
      fontFamily: "IPA明朝, ＭＳ 明朝, Hiragino Mincho Pro",
      charImgRoot:"./img"
    };
    for(var prop in defopt){
      this[prop] = (opt[prop])? opt[prop] : defopt[prop];
    }
    var self = this;
    var text = document.getElementById(id).innerHTML.replace(/<br \/>/gi, "").replace(/<br>/gi, "");
    this.pageNo = 0;
    this.writing = false;
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      direction: this.direction,
      width: this.width,
      height: this.height,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily,
      charImgRoot: this.charImgRoot
    }), new Nehan.TextStream(text, text.length, true));

    document.getElementById("pager-next").onclick = function(){ self.next(); return false; };
    document.getElementById("pager-prev").onclick = function(){ self.prev(); return false; };

    this.write(0);
  },
  write : function(pageNo){
    this.writing = true;
    var output = this.parser.outputPage(pageNo);
    document.getElementById("pager-percent").innerHTML = this.parser.getSeekPercent(pageNo) + "%";
    if(output != ""){
      document.getElementById("result").innerHTML = output;
    }
    this.writing = false;
  },
  next : function(){
    if(!this.writing && this.parser.hasNextPage()){
      this.pageNo++;
      this.write(this.pageNo);
    }
  },
  prev : function(){
    if(!this.writing && this.pageNo > 0){
      this.pageNo--;
      this.write(this.pageNo);
    }
  }
}
