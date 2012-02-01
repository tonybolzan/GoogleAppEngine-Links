/*
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());
*/

function show(data) {
  var result = '';
  
  if (data.length) {
    for (i in data) {
      result += '<li>';
      result += '<h2>'+data[i].title+' - <i>'+data[i].tags+'</i><span>'+data[i].date+'</span></h2>';
      result += '<div>';
      result += '<a target="_blank" href="'+data[i].url+'">';
      result += '<code>'+data[i].url+'</code>';
      result += '</a>';
      result += '<button class="delete" data-url="'+data[i].url+'">Delete</button>';
      result += '</div>';
      result += '</li>';
    }
  } else {
    result = '<li>';
    result += '<h2><a href="#">Your search did not match any link</a></h2>';
    result += '<div>';
    result += '<code>Make sure all words are spelled correctly or try more general keywords.</code>';
    result += '</div>';
    result += '</li>';
  }

  $("#links").html('<ul>'+result+'</ul>');
}

$(window).load(function() {
	$.post("/last", function(data) {
    show(data);
	}, "json");

});

$(document).ready(function() {
  var addlink_toggle = $("#addlink-open,#addlink-close");
  var addlink_form = $("form#addlink-form");
  var addlink_overlay = $('#addlink-overlay');
  
  var search_form = $("#search-form");
  
  var delete_button = $('.delete');
  var lastmessage_button = $('#last-message');
  var message = $('#message');
  
  addlink_toggle.click(function() {
    addlink_overlay.slideToggle("slow");
  });
  
  message.click(function() {
    $(this).slideUp("slow");
  });

  lastmessage_button.click(function() {
    message.slideToggle("slow");
  });

	addlink_form.submit(function() {
		$.post("/insert", addlink_form.serialize(), function(data) {
		  addlink_overlay.slideToggle('slow', function() {
        message.html('<h2>'+data.msg+'</h2>').slideToggle('slow', function() {
          $(this).delay(1000).slideUp('fast');
          lastmessage_button.show('slow');
          if (data.feedback) {
            addlink_form.find(':input').each(function() {
              $(this).val('');
            });
          }
        });
      });
		}, "json");
		$(window).load();
	  return false;
	});

  search_form.submit(function() {
		$.post("/search", search_form.serialize(), function(data) {
		  show(data);
		}, "json");
	  return false;
	});

  delete_button.click(function() {
    console.log("teste");
		$.post("/delete", { url: delete_button.data('url') }, function(data) {
      alert(data);
		});
  });
});
