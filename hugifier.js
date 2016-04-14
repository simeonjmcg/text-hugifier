var charDict      = {},
    frame         = {},
    lineLen       = $('#lineLen'),
    inputTxtarea  = $('#inputTxtarea'),
    outputTxtarea = $('#outputTxtarea'),
    fontInput     = $('#fonts');

function jsonpCallback(data) {
  charHeight = parseInt(data['height']);
  charDict = data['content'];
}

function totalwidth(str, font, size) {
  var a = $('<span></span>')
      .text(str)
        .css({
          'display': 'none',
          'white-space': 'pre',
          'font-size': size,
          'font-family': font
        });
  $(document.body).append(a);
  var w = a.width();
  a.remove();
  return w;
}

inputTxtarea.on('input', function(e) {
  if(!charHeight) {
    return;
  }
  var maxLine   = parseInt(lineLen.val()),
      inputStr  = inputTxtarea.val(),
      outputStr = '',
      font      = fontInput.val(),
      build     = [];
  
  // initialize build variable
  var l = charHeight;
  for (var i=0; i < l; i++) {
    build[i] = '';
  }
  /** Move build to outputStr and start new line */
  function pushoutputstr() {
    var l = build.length;
    for(var i=0; i<l; i++) {
      if(outputStr.length > 0) {
        outputStr += '\n';
      }
      outputStr += build[i];
      
      build[i] = '';
    }
  }
  
  var l = inputStr.length;
  for (var i=0; i < l; i++) {
    if (!isNaN(maxLine)) {
      var len = build[0].length;
      if (len > maxLine) {
        pushoutputstr();
      }
    }
    var ch = inputStr.charAt(i);
    switch(ch) {
    case '\n':
      pushoutputstr();
      break;
    case '\t':
      var tablen = 16 - (build[0].length % 16); // simulate tabulation
      for (var _i=0; _i < tablen; _i++) {
        var ll = build.length;
        for (var d=0; d<ll; d++) {
          build[d] += ' ';
        }
      }
      break;
    default:
      if(charDict[ch]) {        
        var ll = build.length;
        for (var d=0; d<ll; d++) {
          build[d] += charDict[ch][d];
        }
      }
      break;
    }
  }
  // push last line onto output
  pushoutputstr();
  
  if(font == 'block') {
    $('.txtinout').css('font-family','"Courier New",monospaced');
    outputStr = outputStr.replace(/ /g, '░');
  } else {
    $('.txtinout').css('font-family', font);
    var maxlen,
        spacelen,
        spacenum,
        spaces,
        remainder;
    
    maxlen = totalwidth('─', font);
    spacelen = totalwidth(' ', font);
    spacenum = Math.floor(maxlen/spacelen);
    remainder = maxlen%spacelen;
    spaces = '';
    
    for(var n=0; n<spacenum; n++) {
      spaces += ' ';
    }
    for(var n=0; n<remainder; n++) {
      spaces += ' ';
    }
    
    outputStr = outputStr.replace(/ /g, spaces);
  }
  outputTxtarea.val(outputStr);
});

fontInput.change(function(e) {
  inputTxtarea.trigger('input');
});

lineLen.on('input', function(e) {
  inputTxtarea.trigger('input');
});

// add ability to type tabs
$(document).delegate('.txtinout', 'keydown', function(e) {
  var keyCode = e.keyCode || e.which;

  if (keyCode == 9) {
    e.preventDefault();
    var start = $(this).get(0).selectionStart;
    var end = $(this).get(0).selectionEnd;

    // set textarea value to: text before caret + tab + text after caret
    $(this).val($(this).val().substring(0, start) + 
        '\t' + $(this).val().substring(end));

    // put caret at right position again
    $(this).get(0).selectionStart =
        $(this).get(0).selectionEnd = start + 1;
  }
});
