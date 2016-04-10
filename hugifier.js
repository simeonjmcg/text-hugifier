var charDict      = {},
    frame         = {},
    lineLen       = $("#lineLen"),
    inputTxtarea  = $("#inputTxtarea"),
    outputTxtarea = $("#outputTxtarea"),
    fontinput     = $("#fonts");

function jsonpCallback(data) {
	charHeight = parseInt(data["height"]);
	charDict = data["content"];
}

function totalwidth(str, font, size) {
	var a = $("<span></span>")
	            .text(str)
	            .css({
	            	"display": "none",
	            	"white-space": "pre",
	            	"font-size": size,
	            	"font-family": font
	            });
	$(document.body).append(a);
	var w = a.width();
	a.remove;
	return w;
}

inputTxtarea.on("input", function(e) {
	if(!charHeight) {
		return;
	}
	var maxlinelen = parseInt(lineLen.val()),
	    inputstr   = inputTxtarea.val(),
	    outputstr  = "",
	    font       = fontinput.val(),
	    buildlines = [];
	var i, d,  // index vars
	    _i,    // unused index
	    len,   // buildlines length
	    l,     // tmp strlen
	    ch     // character
	
	// initialize buildlines variable
	for (i=0, l=charHeight; i < l; i++) {
		buildlines[i] = "";
	}
	function pushoutputstr() {
		// move buildlines to outputstr and start new line
		
		// function specific vars
		var _d, _c, // index vars
		    _l, _ll, // length var
		    _ch; // character
		
		for(_d in buildlines) {
			//add new line between lines, but not at beginning
			if(outputstr.length > 0) {
				outputstr += "\n";
			}
			// add line to output
			outputstr += buildlines[_d];
			
			//reset buildlines for next line
			buildlines[_d] = '';
		}
	}
	
	// loop through inputstr
	for (i in inputstr) {
		// check if lineLen input is valid
		if (!isNaN(maxlinelen)) {
			len = buildlines[0].length;
			// if buildlines length is more than lineLen, break line.
			if (len > maxlinelen) {
				// push buildlines to outputstr and reset
				pushoutputstr();
			}
		}
		// switch through characters
		var ch = inputstr.charAt(i);
		
		if (ch == '\n') { // break line
			// push buildlines to outputstr and reset
			pushoutputstr();
		} else if (ch == '\t') { // add tabulation
			var tablen = 16 - (buildlines[0].length % 16); // simulate tabulation
			for (_i=0; _i < tablen; _i++) {
				for (d in buildlines) {
					buildlines[d] += " ";
				}
			}
		} else if(charDict[ch] != undefined) { //add characters from dict, if in dict
			for (d in buildlines) {
				buildlines[d] += " " + charDict[ch][d];
			}
		}
	}
	// push last line onto output
	pushoutputstr();
	
	if(font == "block") {
		$(".txtinout").css("font-family","'Courier New',monospaced");
		outputstr = outputstr.replace(/ /g, "░");
	} else {
		$(".txtinout").css("font-family", font);
		var maxlen,
		    spacelen,
		    spacenum,
		    spaces,
		    remainder,
		    n;
		
		maxlen = totalwidth("─", font);
		spacelen = totalwidth(" ", font);
		spacenum = Math.floor(maxlen/spacelen);
		remainder = maxlen%spacelen;
		spaces = "";
		
		for(n=0; n < spacenum; n++) {
			spaces += " ";
		}
		for(n=0; n < remainder; n++) {
			spaces += " ";
		}
		
		outputstr = outputstr.replace(/ /g, spaces);
	}
	
	// output final result
	outputTxtarea.val(outputstr);
});

fontinput.change(function(e) {
	inputTxtarea.trigger("input");
});

lineLen.on("input", function(e) {
	inputTxtarea.trigger("input");
});

// add ability to type tabs
$(document).delegate('.txtinout', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start)
                + "\t"
                + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart =
    $(this).get(0).selectionEnd = start + 1;
  }
});
