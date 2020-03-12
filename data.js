window.onload = function() { //Venter på, at vinduet er fuldt kørt igennem
    
    onlineCheck(); //Tjekker om browseren er koblet til nettet
    
    var email = localStorage.getItem('email');
    
    if (email === null) { //Hvis email ikke er sat i localstorage
        window.location.href = "start.html";
    }
    
    showDownload(email); //Viser den potentielt uploadet fil

    /*
        Eventlisteners
    */
    document.addEventListener('load', showText(email)); //Ser efter, om dokumentet er loadet færdigt, viser derefter teksten i tekstboksen ved at kalde showText()
    
    //Tjekker efter 'input' i tekstboksen - altså hver gang, man skriver i den
    jQuery('#dataText').on('input', function() {
        var dataText = document.getElementById("dataText").innerHTML; //Definerer den tekst som man har skrevet i en variable
        
        saveText(email, dataText); //Kalder på funktionen saveText(), som gemmer teksten på databasen
    });
    
    //Hvis der bliver trykket på log ud
    $('#logOut').click(function(){ logOut(); return false; });
    
    document.getElementById('fileInput').onchange = function(event) { //Hvis man finder en fil
        document.getElementById('fileSubmit').click(); //Tryk på submit i formen automatisk
    }
    
    document.getElementById('fileForm').onsubmit = function(event) { //Når formen bliver indsendt
        event.preventDefault(); //Stop form fra at genindlæse siden
        
        saveFile(email); //Kalder funktionen saveFile(), som gemmer filen oppe på serveren
    }
};