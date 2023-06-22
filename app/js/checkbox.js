let opt =  ["acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues", "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical", "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco", "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro", "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy", "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm", "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz", "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno", "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop", "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b", "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad", "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul", "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop", "turkish", "work-out", "world-music"];
let opt2 =  ["indie", "pop", "rock", "alternative", "jazz"]; //fetcharli

function initCheckbox(options){
    let container = document.querySelector(".input-box-wrapper");
    for (let option of options){
        container.innerHTML += `
        <div class="box">
            <input type="checkbox" value=${option} class="checkbox" id=${option}>
            <label for=${option}>${capitalize(option)}</label>
        </div>
        `
    }
    //provvisorio per gestire il pulsante
    let button = document.querySelector(".submit");
    button.addEventListener("click", function(){
        registerAnswers();
    })
    
}

function registerAnswers(){ 
    let checkboxes = document.querySelectorAll(".checkbox");
    let resultsArray = [];
    for (let checkbox of checkboxes){
        if(checkbox.checked == true) resultsArray.push(checkbox.value);
        else resultsArray = resultsArray.filter(e =>  e !== checkbox.value);     
    }
    console.log(resultsArray);
}


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

initCheckbox(opt
    );


