var reply = 0;
function openReply(id){
    if(reply != 0){
        $(`#reply${reply}div`).remove();
        $(`#replybtn${reply}`).show();
    }
    $(`#replybtn${id}`).hide();
    $(`#${id} .create-reply-container`).append('<b style="color:#d3d3d3;">Reply to Comment</b>'
        + '<textarea class="reply" id="reply-content" style="margin-top: 2px;width: 100%;max-width: 100%;" placeholder="Your reply"></textarea>'
        + '<a href="#" class="button raw create-reply" id="create-reply" style="cursor: pointer; margin: 5px 0px 10px 0px;">Submit Reply</a>');
    reply = id;
}

function submitComment(token = null){
	if(captcha == 'hcaptcha'){
		var username = "Anonymous";
		var comment = $('#comment').val();
		
		$.post("/comment", {
			doxId: doxid,
			name: username,
			comment: comment,
			_token: $('input[name=_token]').val(),
			hcaptcha_token: $('[name=h-captcha-response]').val()
		}, function(resp){
			if(resp.status == "done"){
				username = htmlspecialchars(username.trim());
				comment = htmlspecialchars(comment.trim());
				if(uName != ""){
					username = htmlspecialchars(uName);
				}
				if(username.length == 0){
					username = "Anonymous";
				}
				$('#paste-comments').prepend('<div class="b-comments b-comment" style="padding-left: 10px;"><b>' + (uName != "" ? '<a ' + (uAdmin != 0 ? 'style="color: red;"' : '') + 'href="/user/' + username + '">' + username + '</a>' : username) + '</b> - <p style="display: inline;">now</p><br><div class="b-content">' + comment + '</div><br></div>');
				$('#comment').val("");
				$('#error-msg').val("");
				cnum += 1;
			}else{
				$('#error-msg').text(resp.msg);
			}
			hcaptcha.reset();
		});
		
	}else if(captcha == 'recaptcha'){
		var username = "Anonymous";
		var comment = $('#comment').val();
		
		$.post("/comment", {
			doxId: doxid,
			name: username,
			comment: comment,
			_token: $('input[name=_token]').val(),
			recaptcha_token: grecaptcha.getResponse()
		}, function(resp){
			if(resp.status == "done"){
				username = htmlspecialchars(username.trim());
				comment = htmlspecialchars(comment.trim());
				if(uName != ""){
					username = htmlspecialchars(uName);
				}
				if(username.length == 0){
					username = "Anonymous";
				}
				$('#paste-comments').prepend('<div class="b-comments b-comment" style="padding-left: 10px;"><b>' + (uName != "" ? '<a ' + (uAdmin != 0 ? 'style="color: red;"' : '') + 'href="/user/' + username + '">' + username + '</a>' : username) + '</b> - <p style="display: inline;">now</p><br><div class="b-content">' + comment + '</div><br></div>');
				$('#comment').val("");
				$('#error-msg').val("");
				cnum += 1;
			}else{
				$('#error-msg').text(resp.msg);
			}
			grecaptcha.reset();
		});
	}
	
}

$(document).ready(function(){
	$('#cancel-edit-request').on('click', function(e){
        $.post('/api/paste/cancel-edit-request', {
            _token: $('input[name=_token]').val(),
            dox_id: doxid
        }, function(resp){
            $('#edit-paste-list').html('<a href="/edit/{{ $link }}" class="button green">Edit Paste</a>' + resp.msg);
        });
        e.preventDefault();
	});
	
	
	$('#create').on('click', function(e){ // create comment
		submitComment();
		e.preventDefault();
	});

	$('#more').on('click', function(e){
		var comments = {};
        $('#more').text('...');
        $.get('/loadcomments', {
            doxId: doxid,
            start: cnum
        }, function(resp){
            if(resp.status != null){
                alert(resp.msg);
            }else{
                comments = resp;

                for(i = 0; i < 10; i++){
                    if(typeof comments[i] !== 'undefined'){
						$('#paste-comments').append('<div class="b-comments b-comment" style="padding-left: 10px; position: relative;' + (chc && comments[i]['hidden'] ? 'background-color: #421414;' : '') + '"" id="' + comments[i]['id'] + '"><b>' + (comments[i]['created_by'] != 0 && comments[i]['name'] != '[deleted]' ? '<a ' + (comments[i]['created_by'] != 0 ? 'style="' + comments[i]['style'] + '"' : '') + 'href="/user/' + htmlspecialchars(comments[i]['name']) + '">' + htmlspecialchars(comments[i]['name']) + '</a>' : htmlspecialchars(comments[i]['name'])) + 
						'</b> - <p title="' + convertDate(new Date(comments[i]['date']).toISOString()) + '" style="display: inline;">' + age(comments[i]['date']) + '</p>' + (chc ? '<a href="javascript:void(0)" onclick="hideComment(this, ' + comments[i]['id'] + ')" class="hidecomment">' + (comments[i]['hidden'] ? 'Show' : 'Hide') + '</a>' : '') + '<br><div class="b-content">' + htmlspecialchars(comments[i]['comment']) + '</div><br></div>');
                    }else{
                        $('#more').hide();
                        break;
                    }
                }
                $('#more').text('Load More Comments');
                $('#more').appendTo($('#paste-comments'));
                cnum += 10;
            }
        });
        
	});
});
function convertDate(date){
	var year = date.substr(0, 4);
	var month = date.substr(5, 2);
	var day = date.substr(8, 2);
	var time = convTime(date.substr(11, 5));
	switch(month){
		case "01":
			month = "Jan";
			break;
		case "02":
			month = "Feb";
			break;
		case "03":
			month = "Mar";
			break;
		case "04":
			month = "Apr";
			break;
		case "05":
			month = "May";
			break;
		case "06":
			month = "Jun";
			break;
		case "07":
			month = "Jul";
			break;
		case "08":
			month = "Aug";
			break;
		case "09":
			month = "Sep";
			break;
		case "10":
			month = "Oct";
			break;
		case "11":
			month = "Nov";
			break;
		case "12":
			month = "Dec";
			break;
		default:
			month = "-";
	}
	if(day.charAt(0) == "0")
		day = day.substr(1, 1);
	switch(day.charAt(day.length - 1)){
		case "1":
			day += "st";
			break;
		case "2":
			day += "nd";
			break;
		case "3":
			day += "rd";
			break;
		default:
			day += "th";
	}
	
	return month + " " + day + ", " + year + " - " + time;
}

function convTime (time) {
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) {
	time = time.slice (1);
	time[5] = +time[0] < 12 ? 'AM' : 'PM';
	time[0] = +time[0] % 12 || 12;
  }
  return time.join ('');
}

function htmlspecialchars(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function age(time){
	time = Math.floor(Date.now()) - time;
	var result = "now";
	if(time > 31557600000)       return Math.floor(time / 31557600000) + " year" + (Math.floor(time / 31557600000) > 1 ? 's ago' : ' ago');
	if(time > 2592000000)        return Math.floor(time / 2592000000) + " month" + (Math.floor(time / 2592000000) > 1 ? 's ago' : ' ago');
	if(time > 604800000)         return Math.floor(time / 604800000) + " week" + (Math.floor(time / 604800000) > 1 ? 's ago' : ' ago');
	if(time > 86400000)          return Math.floor(time / 86400000) + " day" + (Math.floor(time / 86400000) > 1 ? 's ago' : ' ago');
	if(time > 3600000)           return Math.floor(time / 3600000) + " hour" + (Math.floor(time / 3600000) > 1 ? 's ago' : ' ago');
	if(time > 60000)             return Math.floor(time / 60000) + " minute" + (Math.floor(time / 60000) > 1 ? 's ago' : ' ago');
	if(time > 1000)              return Math.floor(time / 1000) + " second" + (Math.floor(time / 1000) > 1 ? 's ago' : ' ago');
	return result;	
}