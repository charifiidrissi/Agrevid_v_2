$("input[type=password]").keyup(function(){
    var ucase = new RegExp("[A-Z]+");
    var lcase = new RegExp("[a-z]+");
    var num = new RegExp("[0-9]+");
    var x = document.getElementById("ok");
    var i = 0;

    if($("#password1").val().length >= 8){
        $("#8char").removeClass("glyphicon-remove");
        $("#8char").addClass("glyphicon-ok");
        $("#8char").css("color","#00A41E");
        i++;
    }else{
        $("#8char").removeClass("glyphicon-ok");
        $("#8char").addClass("glyphicon-remove");
        $("#8char").css("color","#FF0004");
        x.disabled= true;
    }

    if(ucase.test($("#password1").val())){
        $("#ucase").removeClass("glyphicon-remove");
        $("#ucase").addClass("glyphicon-ok");
        $("#ucase").css("color","#00A41E");
        i++;
    }else{
        $("#ucase").removeClass("glyphicon-ok");
        $("#ucase").addClass("glyphicon-remove");
        $("#ucase").css("color","#FF0004");
        x.disabled= true;
    }

    if(lcase.test($("#password1").val())){
        $("#lcase").removeClass("glyphicon-remove");
        $("#lcase").addClass("glyphicon-ok");
        $("#lcase").css("color","#00A41E");
        i++;
    }else{
        $("#lcase").removeClass("glyphicon-ok");
        $("#lcase").addClass("glyphicon-remove");
        $("#lcase").css("color","#FF0004");
        x.disabled= true;
    }

    if(num.test($("#password1").val())){
        $("#num").removeClass("glyphicon-remove");
        $("#num").addClass("glyphicon-ok");
        $("#num").css("color","#00A41E");
        i++;
    }else{
        $("#num").removeClass("glyphicon-ok");
        $("#num").addClass("glyphicon-remove");
        $("#num").css("color","#FF0004");
        x.disabled= true;
    }

    if($("#password1").val() == $("#password2").val()){
        if(i===4) {
            $("#pwmatch").removeClass("glyphicon-remove");
            $("#pwmatch").addClass("glyphicon-ok");
            $("#pwmatch").css("color","#00A41E");
            x.disabled= false;

        }

    }else{
        $("#pwmatch").removeClass("glyphicon-ok");
        $("#pwmatch").addClass("glyphicon-remove");
        $("#pwmatch").css("color","#FF0004");
        x.disabled= true;
    }
});



