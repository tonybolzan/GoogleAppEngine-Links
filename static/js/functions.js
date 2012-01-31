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

$(window).load(function() {
	$.post("/last", function(data) {
	  var result = '';
	  
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
	  
    $("#links").html('<ul>'+result+'</ul>');
	}, "json");

});

$(document).ready(function() {
  var addlink_toggle = $("#addlink-open,#addlink-close");
  var addlink_form = $("form#addlink-form");
  var addlink_overlay = $('#addlink-overlay');
  var search_button = $("#search-button");
  var search_input = $('#search-input');
  var button_delete = $('.delete');
  var button_lastmessage = $('#last-message');
  var message = $('#message');
  
  addlink_toggle.click(function() {
    addlink_overlay.slideToggle("slow");
  });
  
  message.click(function() {
    $(this).slideUp("slow");
  });

  button_lastmessage.click(function() {
    message.slideToggle("slow");
  });

	addlink_form.submit(function() {
		$.post("/insert", addlink_form.serialize(), function(data) {
		  addlink_overlay.slideToggle('slow', function() {
        message.html('<h2>'+data.msg+'</h2>').slideToggle('slow', function() {
          $(this).delay(1000).slideUp('fast');
          button_lastmessage.show('slow');
          if (data.feedback) {
            addlink_form.find(':input').each(function() {
              $(this).val('')
            });
          }
        });
      });
		}, "json");
		$(window).load();
	  return false;
	});
  
  search_button.click(function() {
		$.post("/search", { search: search_input.attr('value') }, function(data) {
      alert(data);
		});
  });
  
  button_delete.click(function() {
  console.log("teste");
		$.post("/delete", { url: button_delete.data('url') }, function(data) {
      alert(data);
		});
  });
});
