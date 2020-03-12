window.onload = function() { //Venter på, at vinduet er fuldt kørt igennem
    
    onlineCheck(); //Tjekker om man er på nettet
    
    changeState(localStorage.getItem('state')); //Får om man trykkede på 'sign up' eller 'log in' 
    
    /*
        Eventlisteners
    */
    document.getElementById('loginForm').onsubmit = function(event) {
        event.preventDefault(); //Forhindrer form i at submitte
        
        //Variabler fra inputfelterne
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var formState = document.getElementById('formState').value;
        
        //Tjekker om variablerne ikke er tomme
        if (varCheck(email) && varCheck(password)) {
            if ((!verifyEmail(email)) && formState === "1") { //Hvis man er på registreringsside og man ikke har indtastet en email
                showMessage("Email not valid", 1);
            }
            else {
                sendLogin(email, password, formState); //Tjek om loginoplysningerne stemmer overens
            }
        }
        else {
            //Ellers bliver der printet fejlbesked
            showMessage("Fill in all the fields", 1);
        }
    }
};