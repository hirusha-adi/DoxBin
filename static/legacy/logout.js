$(document).ready(function(){
    $('.logout-btn').on('click', function(e){
        console.log(1);
        $.post('/logout', {_token: $('input[name=_token]').val()}, function(resp){
            if(resp.status == "done"){
                location.reload();
            }else{
                alert(resp.msg);
            }
        });
        e.preventDefault();
    });
});