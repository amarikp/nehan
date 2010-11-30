/*
 source : dangumi-reader.js for nehan2
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
  start : function(id, danCount, layoutOpt){
    var self = this;
    this.dst = document.getElementById(id);
    this.text = this.dst.innerHTML.replace(/<br \/>/gi, "").replace(/<br>/gi, "");
    this.danCount = danCount;
    this.pageNo = 0;
    this.pageCount = 0;
    this.writing = false;

    document.getElementById("pager-next").onclick = function(){ self.next(); return false; };
    document.getElementById("pager-prev").onclick = function(){ self.prev(); return false; };

    this.provider = new Nehan.PageProvider(layoutOpt, this.text);
    this.parse(this.pageNo);
  },
  parse : function(pageNo){
    var self = this;
    if(this.provider.hasNextPage()){
      var output = this.provider.outputPage(pageNo);
      document.getElementById("progress").innerHTML = output.percent + "%";
      setTimeout(function(){ self.parse(pageNo + 1); }, 0);
    } else {
      this.pageCount = Math.max(1, pageNo);
      this.danPageCount = Math.floor(this.pageCount / this.danCount) + ((this.pageCount % this.danCount > 0)? 1 : 0);
      document.getElementById("progress").style.display = "none";
      document.getElementById("dan-page-count").innerHTML = this.danPageCount;
      this.dst.style.display = "block";
      this.write(0);
    }
  },
  write : function(pageNo){
    this.writing = true;
    var pages = [];
    for(var i = 0; i < this.danCount; i++){
      if(pageNo + i >= this.pageCount){
	break;
      }
      var klass = ["nehan-page-wrap"];
      if(i == 0){
	klass.push("nehan-page-wrap-header");
      } else if(i == this.danCount - 1){
	klass.push("nehan-page-wrap-footer");
      }
      pages.push("<div class='" + klass.join(" ") + "'>" + this.provider.outputPage(pageNo+i).html + "</div>");
    }
    if(pages.length > 0){
      this.dst.innerHTML = pages.join("<div style='clear:both;'></div>");
    }
    document.getElementById("dan-page-no").innerHTML = Math.floor(this.pageNo / this.danCount) + 1;
    this.writing = false;
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
