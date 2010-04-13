var SimpleReader = {
  start : function(){
    var text = document.getElementById("source-text").innerHTML.replace(/<br \/>/gi, "\n").replace(/<br>/gi, "\n");
    this.pageNo = 0;
    this.parser = new Nehan.StreamParser(new Nehan.Layout({
      width: 500,
      height: 400,
      fontSize: 16,
      fontFamily: "ＭＳ 明朝"
    }), new Nehan.TextStream(text, text.length, true));

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
      this.write(pageNo);
    }
  },
  prev : function(){
    if(!this.writing && this.pageNo > 0){
      this.pageNo--;
      this.write(pageNo);
    }
  }
}
