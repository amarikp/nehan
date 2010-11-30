/*
 source : subject.js
 about : add <subject> element to nehan parser.
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
