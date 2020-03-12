
if (document.cookie.length > 0) { //Tjekker om der er en cookie - altså om man har logget ind før
    console.log("Cookie Detected");

    var string = document.cookie;

    var email = string.substring(0, string.lastIndexOf(" / "));

    var password = string.substring(string.lastIndexOf(" / ") + 3, string.length);

    localStorage.setItem('email', email);

    window.location.href = "data.html";
}

window.onload = function() {
    
    onlineCheck();
    
    /*
        Eventlisteners
    */
    $('#signUp').click(function(){ passClick(1); return false; }); //Hvis man klikker på 'sign up'
    $('#login').click(function(){ passClick(0); return false; }); //Hvis man klikker på 'sign in'
}