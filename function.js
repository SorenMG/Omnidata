//Definerer variable til statusopdatering til bruger
var smallStatus = 'statusSymbol';
var bigStatus = 'fileStatus';
var spinner = 'fa fa-spinner w3-spin';
var checkmark = 'fa fa-check';
var error = 'fa fa-close';

/*
    Denne funktion er til for at give sit valg om 'sign up' eller 'sign in' på startsiden videre til login.html
    INPUT: state
    OUTPUT: none
*/
function passClick(state) {
    localStorage.setItem('state', state);
    
    window.location.href = "login.html";
}

/*
    Denne funktion er til at sende loginoplysningerne videre til serveren.
    INPUT: email, password, formState
    OUTPUT: none
*/
function sendLogin(email, password, formState) {
    //Sender en AJAX request til serveren
    $.ajax({
        type: "POST",
        url: "http://webhotel.herningsholm.dk/soer9417/login.php",
        data: {"email": email, "password": password, "formState": formState}, //Poster data
        error: function(data) { //Hvis det fejler
            showMessage("Couldn't fetch data", 1);
            console.log(data);
            onlineCheck(); //Tjekker om man stadig er online
        },
        //Alt følgende er vurdering af de tal, som man får tilbage fra serveren.
        success: function(data){ //Hvis man kunne hente filen fra serveren
            //Loginbeskeder
            if (data === '1' && formState === '0') { //Hvis alle loginoplysningerne var ok
                localStorage.setItem('email', email);
                document.cookie = email + " / " + password;
                window.location.href = "data.html";
            }
            else if (data === '0' && formState === '0') { //Hvis koden var forkert
                showMessage("Incorrect password", 1);
            }
            else if (data === '2' && formState === '0') { //Hvis brugeren ikke eksisterer
                showMessage("User doesn't exist", 1);
            }
            
            //Registreringsbeskeder
            else if (data === '1' && formState === '1') { //Hvis registreringsoplsyningerne var ok
                showMessage("User registered", 0);
                
                changeState('0');
            }
            else if (data === '0' && formState === '1') { //Hvis php ikke kunne gennemføre sin query
                showMessage("User registration failed", 1);
            }
            else if (data === '2' && formState === '1') { //Hvis brugeren allerede eksisterede
                showMessage("User already exists", 1);
            }
            else { //Hvis alt andet fejler
                console.log(data);
                
                showMessage("Something went wrong: " + data, 1);
            }
        }
    });
}

/*
    Denne funktion er til for at vælge mellem 'log in' eller 'sign up' ved hjælp af den tidligere beskrevet passClick.
    INPUT: state
    OUTPUT: none
*/

function changeState(state) {
    document.getElementById('formState').value = state;
    
    if (state === '0') {
        var submitText = "Sign in ";
    }
    else {
        var submitText = "Sign up ";
    }
    
    submitText += '<i class="fa fa-arrow-right"></i>';
    
    document.getElementById('submit').innerHTML = submitText;
}

/*
    Denne funktion er til for at vise en besked til brugere på loginsiden - altså login.html.
    INPUT: message, state
    OUTPUT: none
*/
function showMessage(message, state) {
    (state === 0) ? document.getElementById('message-color').style.color = "" : document.getElementById('message-color').style.color = "red";

    document.getElementById('message').innerHTML = message;
}

/*
    Denne funktion er til or at verificere, at man har indtastet en email i formen
    INPUT: email
    OUTPUT: boolean analyseret på email
    http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
*/
function verifyEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*
    Denne funktion er til for at tjekke, om browseren er online.
    INPUT: none
    OUTPUT: none
*/
function onlineCheck() {
    if (navigator.onLine) {
        document.getElementById('internetAlert').style.display = "none";
    } 
    else {
        document.getElementById('internetAlert').style.display = "block";
    }
}

/*
    Denne funktion er til for at tjekke, om en streng ikke er tom
    INPUT: str
    OUTPUT: boolean analyseret på str's længde
*/
function varCheck(str) {
    return str.length > 0;
}

/*
    Denne funktion er til for at vise teksten i tekstboxen i data.html
    INPUT: email
    OUTPUT: none
*/
function showText(email) {
    showStatus(smallStatus, spinner, "", "", 0);
    
    ajaxRequest(email, "", "");
}

/*
    Denne funktion er til for at gemme den tekst, som er blevet skrevet i tekstboksen
    INPUT: email, dataText
    OUTPUT: none
*/
function saveText(email, dataText) {
    
    showStatus(smallStatus, spinner, "", "", 0);
    
    var currentDate = new Date();
    
    var currentHours = currentDate.getHours();
    var currentMinutes = currentDate.getMinutes();
    var currentSeconds = currentDate.getSeconds();
    
    if (currentHours < 10) {
        currentHours = "0" + currentHours;
    }
    if (currentMinutes < 10) {
        currentMinutes = "0" + currentMinutes;
    }
    if (currentSeconds < 10) {
        currentSeconds = "0" + currentSeconds;
    }
    
    var timeStamp = currentHours + ":"
                    + currentMinutes + ":"
                    + currentSeconds;
    
    
    ajaxRequest(email, dataText, timeStamp);
}

/*
    Denne funktion er til for at vise status til brugeren - altså at vise de små roterende hjul ved tekstboksen, samt det store roterende hjul i filoverførslen. Den viser også de potentielle beskeder der er til brugeren.
    INPUT: id, symbol, message, timeStamp, delay
    OUTPUT: none
*/
function showStatus(id, symbol, message, timeStamp, delay) {
    
    //Tjekker om timeStamp er defineret i dette kald. Hvis det er, så printes timestamp ved tekstboksen, ellers gør den intet
    (varCheck(timeStamp)) ? document.getElementById('timeStamp').innerHTML = timeStamp + ' <i style="font-size:15px;" id="statusSymbol"></i>' : 1 === 1;
    
    //Tjekker om der er en fejlbesked til tekstboksen - dette er en kritisk fejl, og lukker derfor for tekstboksen
    if (symbol === error && id === smallStatus){
        document.getElementById('timeStamp').innerHTML = message + ' <i style="font-size:15px;" id="statusSymbol"></i>';
        $('#dataText').attr('contenteditable', 'false'); //Gør tekstboksen ikke-skrivbar
    }
    
    //Tjekker om der er referet til det store filoverførsel i dette kald
    if (id === bigStatus) {
        document.getElementById('fileText').innerHTML = message; //Skriver beskeden til brugeren
        
        //Laver en timeout på filoverlayet, så det kan ses i længere tid af brugeren. Dette afhænger af delay-variablen.
        setTimeout(function() { 
            //Hvis filoverlayet ikke vises, så vises det, ellers så gemmes det
            ($('#fileOverlay').is(":visible")) ? document.getElementById('fileOverlay').style.display = 'none' :                                       document.getElementById('fileOverlay').style.display = 'block';
        }, delay);
    }
    
    //Viser dette kalds symbol
    document.getElementById(id).className = symbol;
}

/*
    Denne funktion er til for at logge brugeren ud
    INPUT: none
    OUTPUT: none
*/
function logOut() {
    //Sletter cookien og localstorage-variablen
    document.cookie = "";
    localStorage.setItem('email',""); 
    window.location.href = "start.html"; //Omdirigerer til startsiden
}

/*
    Denne funktion er til for at vise den potentielt uploadet fil for brugeren.
    INPUT: email
    OUTPUT: none
*/
function showDownload(email) {
    //Sender en AJAX request til serveren
    $.ajax ({
        type: 'POST',
        url: 'http://webhotel.herningsholm.dk/soer9417/dataSend.php',
        data: { "downloadFile": email }, //Sender emailen med over så man ved, hvilken bruger man snakker om
        error: function(data) {
            showStatus(smallStatus, error, "Couldn't fetch data", "", 0);
        },
        success: function(data) {
            document.getElementById('downloadFile').href = data; //Giver filens URL videre til downloadFile's href
            if (varCheck(data.substr(data.lastIndexOf('/') + 1))) { //Hvis brugeren ikke har en fil uploadet, så skal den ikke vise 'Download: [fil]' på siden
                document.getElementById('downloadFile').style.display = "block";
                document.getElementById('downloadFile').innerHTML = 'Download file: ' + data.substr(data.lastIndexOf('/') + 1);
            }
        }
    })
}

/*
    Denne funktion er til for at sende en AJAX request til serveren.
    INPUT: email, dataText, timeStamp
    OUTPUT: none
*/
function ajaxRequest(email, dataText, timeStamp) {
    //Sender en AJAX request til serveren
    $.ajax({
        type: "POST",
        url: "http://webhotel.herningsholm.dk/soer9417/dataSend.php",
        data: {"email": email, "dataText": dataText, "timeStamp": timeStamp},
        error: function(data) { //Hvis det fejler.
            console.log("Failure: " + data);
            showStatus(smallStatus, error, "", "", 0); //Viser fejl på tekstboksen
        },
        success: function(result){ //Hvis det lykkedes
            
            if (!varCheck(dataText) && !varCheck(timeStamp)) { //Hvis man ikke skrev data ind i tekstboksen - altså hvis man kommer fra showDownload() funktionen.
                dataText = result.substring(0, result.indexOf(" / "));
                
                timeStamp = result.substring(result.lastIndexOf(" / ") + 3, result.length);
                
                document.getElementById("dataText").innerHTML = dataText;
            }
            
            showStatus(smallStatus, checkmark, "", timeStamp, 0); //Vis success til brugeren
        }
    });
}

/*
    Denne funktion er til for at gemme filen på serveren
    INPUT: email
    OUTPUT: none
*/
function saveFile(email) {
    //Gemmer filen i et objekt
    var file = document.getElementById('fileInput').files[0];
        
    //Tjekker om det er en tom fil
    if (file.size > 0) {
        showStatus(bigStatus, spinner, "", "", 0);
        if (file.size < 2000000) { //Fordi at serveren er sat til, at den maksimale filstørrelse er 2MB, tjekker vi efter om filen er større end 2MB
            //Laver et nyt objekt
            var formData = new FormData();

            //Tilføjer filen til objektet
            formData.append('file', file);

            //Så man kan sende emailen med til php-siden med $_GET
            var url = 'http://webhotel.herningsholm.dk/soer9417/dataSend.php?email=' + email;

            //Sender filen til serveren som et objekt
            $.ajax ({
                type: 'POST',
                url: url,
                data: formData,
                contentType: false,
                processData: false,
                error: function(data) {
                    console.log(data);
                    showStatus(bigStatus, error, "Couldn't fetch data", "", 3000); //Viser fejl i 3 sekunder
                    onlineCheck(); //Tjekker om man stadig er på nettet
                },
                success: function(data) {
                    switch (data) {
                        case '0': //Hvis uploaden skete fejl
                            showStatus(bigStatus, error, "Upload failed", "", 3000);
                            break;
                        case '1': //Hvis det lykkedes
                            showStatus(bigStatus, checkmark, "Upload Succeeded", "", 2000);
                            showDownload(email);
                            break;
                        case '2': //Hvis det fejlede
                            showStatus(bigStatus, error, "Upload failed", "", 3000);
                            break;
                        default: //Hvis intet af ovenstående
                            showStatus(bigStatus, error, "Something went wrong", "", 3000);
                            break;
                    }
                }
            });
        }
        else { //Hvis filen er over 2MB
            showStatus(bigStatus, error, "Maximum filesize is 2MB", "", 3000);
        }
    }
    else { //Hvis filen ikke eksisterede
        showStatus(bigStatus, error, "You must choose a file", "", 3000);
    }
}