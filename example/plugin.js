if(Nehan){
  Nehan.ParserHook.addTagHook("h2", function(pageNo, isV, tagStr, tagAttr, tagName){
    this.parseFontStart(pageNo, isV, "<font scale='1.4' weight='bold'>", {scale:1.4, weight:"bold"}, "font");
  });
  Nehan.ParserHook.addTagHook("/h2", function(pageNo, isV, tagStr, tagAttr, tagName){
    this.parseFontEnd(pageNo, isV, "</font>", tagAttr, "/font");
  });
  Nehan.ParserHook.addTagHook("alert", function(pageNo, isV, tagStr, tagAttr, tagName){
    var href = "javascript:alert(\"" + tagAttr.msg + "\")";
    this.parseLinkStart(pageNo, isV, "<a href='" + href + "'>", {href:href}, "a");
  });
  Nehan.ParserHook.addTagHook("/alert", function(pageNo, isV, tagStr, tagAttr, tagName){
    this.parseLinkEnd(pageNo, isV, "</a>", tagAttr, "/a");
  });
};
