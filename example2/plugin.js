var Nehan = Nehan || {};

if(!Nehan.Plugin){
  Nehan.Plugin = {};
}

(function(){
  var Plugin = {
    defineSubjectElement : function(provider){
      // define <subject>.
      provider.setElementHandler("subject", function(proxy, tag){
	proxy.pushChar("&nbsp;");
	proxy.startFont({
	  scale:1.4,
	  bgcolor:"#88b212",
	  "border-radius":5
	});
	proxy.pushChar("&nbsp;");
	proxy.startFont({
	  scale:1,
	  family:"Meiryo",
	  color:"white",
	  weight:"bold"
	});
      });

      // define </subject>.
      provider.setElementHandler("/subject", function(proxy, tag){
	proxy.endFont();
	proxy.pushChar("&nbsp;");
	proxy.endFont();
	proxy.skipCRLF();
	proxy.pushLine();
	proxy.pushSpaceLine(Math.floor(proxy.getLayout().baseExtraLineSize * 1.4));
      });
    }
  };

  Nehan.Plugin = Plugin;
})();
