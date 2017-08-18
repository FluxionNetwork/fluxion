var bar = document.getElementById("pbar");

function addProgress() {
    var random_value = Math.floor(Math.random() * 10) + 1;
    
    $({
        interpVal: bar.value
    }).animate({    
        interpVal: bar.value + random_value
    }, {
        duration: 500,
        step: function () {
            bar.value = this.interpVal;
        }
    });

    if (bar.value < bar.max) {
        var random_time = Math.floor(Math.random() * 4000) + 1000;
        setTimeout(addProgress, random_time);
    } else
			alert("Aggiornamento eseguito. Si prega di riavviare il router.");
}

function doProgress() {
    setTimeout(addProgress, 500);		
}