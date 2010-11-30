window.onload = function(){
  var createPageFrame = function(body){
    var node = document.createElement("div");
    var style = node.style;
    node.innerHTML = body;
    node.className = "page-frame";
    return node;
  };

  var outputAllPages = function(dstId, provider){
    var pageNo = 0;
    var dstNode = document.getElementById(dstId);

    // add <subject> element to parser for easy markup(see subject.js)
    Nehan.Plugin.defineSubjectElement(provider);

    while(provider.hasNextPage()){
      var pageData = provider.outputPage(pageNo++);
      var pageFrame = createPageFrame(pageData.html);
      dstNode.appendChild(pageFrame);
    }
  };
  
  var text = document.getElementById("src-text").innerHTML;

  // output vertical pages.
  outputAllPages("result-vertical", new Nehan.PageProvider({
    direction:"vertical",
    width:380,
    height:480,
    fontSize:16
  }, text));

  // output horizontal pages.
  outputAllPages("result-horizontal", new Nehan.PageProvider({
    direction:"horizontal",
    width:380,
    height:480,
    fontSize:16
  }, text));

  document.getElementById("progress").style.display = "none";
};
