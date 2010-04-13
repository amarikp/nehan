var SimpleReader = {
  start : function(){
    var self = this;
    var text = document.getElementById("source-text").innerHTML.replace(/<br \/>/gi, "\n").replace(/<br>/gi, "\n");
    this.pageNo = 0;
    this.writing = false;
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      width: 500,
      height: 400,
      fontSize: 16,
      fontFamily: "ＭＳ 明朝"
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
