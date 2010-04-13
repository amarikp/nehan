var SimpleReader = {
  start : function(opt){
    if(typeof opt == "undefined"){
      opt = {};
    }
    var defopt = {
      direction: "vertical",
      width: 640,
      height: 480,
      fontSize: 16,
      fontFamily: "IPA明朝, ＭＳ 明朝, Hiragino Mincho Pro"
    };
    for(var prop in defopt){
      this[prop] = (opt[prop])? opt[prop] : defopt[prop];
    }
    var self = this;
    var text = document.getElementById("source-text").innerHTML.replace(/<br \/>/gi, "\n").replace(/<br>/gi, "\n");
    this.pageNo = 0;
    this.writing = false;
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      direction: this.direction,
      width: this.width,
      height: this.height,
      fontSize: this.fontSize,
      fontFamily: this.fontFamily
    }), new Nehan.TextStream(text, text.length, true));

    document.getElementById("pager-next").onclick = function(){ self.next(); return false; };
    document.getElementById("pager-prev").onclick = function(){ self.prev(); return false; };

    this.write(0);
  },
  write : function(pageNo){
    this.writing = true;
    var output = this.parser.outputPage(pageNo);
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
