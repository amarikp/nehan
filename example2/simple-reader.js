/*
 source : simple-reader.js for nehan2
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
var SimpleReader = {
  start : function(id, layoutOpt){
    var self = this;
    var text = document.getElementById(id).innerHTML.replace(/<br \/>/gi, "").replace(/<br>/gi, "");
    this.pageNo = 0;
    this.writing = false;
    this.dst = document.getElementById(id);
    this.progress = document.getElementById("progress");
    this.provider = new Nehan.PageProvider(layoutOpt, text);
    document.getElementById("pager-next").onclick = function(){ self.next(); return false; };
    document.getElementById("pager-prev").onclick = function(){ self.prev(); return false; };
    this.write(0);
    this.dst.style.display = "block";
  },
  write : function(pageNo){
    this.writing = true;
    var output = this.provider.outputPage(pageNo);
    this.progress.innerHTML = "page : " + (this.pageNo + 1) + " ( " + output.percent + "% )";
    this.dst.innerHTML = output.html;
    this.writing = false;
  },
  next : function(){
    if(!this.writing && this.provider.isEnablePage(this.pageNo+1)){
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
