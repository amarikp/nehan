(function(){
  // create page provider
  var provider = new Nehan.PageProvider({
    direction:direction,
    width:400,
    height:300,
    fontSize:16
  }, text);


  // <h1>
  provider.setElementHandler("h1", function(proxy, tag){
    proxy.startFont({
      scale:3.0,
      weight:"bold",
      family:"Meiryo"
    });
  });
  
  // </h1>
  provider.setElementHandler("/h1", function(proxy, tag){
    var margin = proxy.getLayout().baseExtraLineSize * 3;
    proxy.endFont();
    proxy.pushLine();
    proxy.skipCRLF();
    proxy.pushSpaceLine(margin);
  });

  // <blockquote>
  provider.setElementHandler("blockquote", function(proxy, tag){
    proxy.startIndent(2, 2); // before indent = 2, after indent = 2
    proxy.startFont({scale:"0.8"}); // make font little small.
  });
  
  // </blockquote>
  provider.setElementHandler("/" + name, function(proxy, tag){
    proxy.endIndent();
    proxy.endFont();
  });
})();
