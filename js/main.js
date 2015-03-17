var JDG;
var JDGi = 0;
var JDGt = false;
var defaultTime = 600;

// Créer les délégations et les pointages
function jdgInitData() {
	// Liste des délés en ordre
	var delegations = [
		"McGill",
		"UQAT",
		"UQAC",
		"UQO",
		"Concordia",
		"ETS",
		"Sherbrooke",
		"ITR",
		"Rimouski",
		"Laval",
		"Polytechnique"
	];
	var defaultData = [];
	for(var d in delegations) {
		defaultData.push({
			"name": delegations[d],
			"laps": 0,
			"bags": 0,
			"time": defaultTime
		});
	}
	
	// Créer le local storage
	localStorage["jdg.data"] = JSON.stringify(defaultData);
}

function jdgLoadData() {
	JDG = JSON.parse(localStorage["jdg.data"]);
}
function jdgSaveData() {
	localStorage["jdg.data"] = JSON.stringify(JDG);
}

function jdgDisplay() {
	var delegation = JDG[JDGi];
	
	// Charger les valeurs de la délégation
	$('.delegation .value').text(delegation.name.toLowerCase().replace(/i/g, " i"));
	$('.time .value').text((pad(parseInt(delegation.time/60),2)+":"+pad(delegation.time%60,2)).replace(/1/g, " 1"));
	$('.laps .value').text(pad(delegation.laps, 5).replace(/1/g, " 1"));
	$('.bags .value').text(pad(delegation.bags, 0).replace(/1/g, " 1"));
	
	// Charger les valeurs max
	var lapsmax = 0, bagsmax = 0;
	for (var d in JDG) {
		if (JDG[d].laps > lapsmax) lapsmax = JDG[d].laps;
		if (JDG[d].bags > bagsmax) bagsmax = JDG[d].bags;
	}
	$('.laps-max .value').text(pad(lapsmax, 5).replace(/1/g, " 1"));
	$('.bags-max .value').text(pad(bagsmax, 0).replace(/1/g, " 1"));
}

function jdgTimerStart() {
	if (JDG[JDGi].time < 1) return;
	
	JDGt = setInterval(function() {
		JDG[JDGi].time--;
		if(JDG[JDGi].time == 0) {
			(new Audio('sounds/horn.wav')).play();
			jdgTimerStop();
		}
		jdgDisplay();
	}, 1000);
	$('.time').css("color", "#f52121");
}
function jdgTimerStop() {
	clearInterval(JDGt);
	JDGt = false;
	$('.time').css("color", "");
	jdgSaveData();
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(document).ready(function() {
	// Créer data par défaut (si inexistant)
	if (!localStorage["jdg.data"])
		jdgInitData();
	
	// Loader le data
	jdgLoadData();
	
	// Premier refresh
	jdgDisplay();
	
	// Binder les actions
	$(document).keydown(function(e) {
		e.preventDefault();
		
		if ( e.which == 85 ) {            // U (reset)
			if (confirm("Voulez-vous vraiment réinitialiser les points de toutes les délégations?")) {
				jdgTimerStop();
				jdgInitData();
				jdgLoadData();
				jdgDisplay();
			}
		} else if ( e.which == 73 ) {     // I (info)
			$('.info').fadeToggle(150);
		} else if ( e.which == 37 ) {     // ← (DELE--)
			jdgTimerStop();
			if (JDGi > 0) JDGi--;
			jdgDisplay();
		} else if ( e.which == 39 ) {     // → (DELE++)
			jdgTimerStop();
			if (JDGi < JDG.length-1) JDGi++;
			jdgDisplay();
		} else if ( e.which == 79 ) {     // O (start/stop time)
			if(JDGt !== false) {
				jdgTimerStop();
			} else {
				jdgTimerStart();
			}
		} else if ( e.which == 80 ) {     // S (reset time)
			jdgTimerStop();
			JDG[JDGi].time = defaultTime;
			jdgDisplay();
		} else if ( e.which == 65 ) {     // A (laps--)
			if (JDG[JDGi].laps > 0) JDG[JDGi].laps--;
			jdgSaveData();
			jdgDisplay();
		} else if ( e.which == 83 ) {     // S (laps++)
			JDG[JDGi].laps++;
			(new Audio('sounds/pop.wav')).play();
			jdgSaveData();
			jdgDisplay();
		} else if ( e.which == 90 ) {     // Z (bags--)
			if (JDG[JDGi].bags > 0) JDG[JDGi].bags--;
			jdgSaveData();
			jdgDisplay();
		} else if ( e.which == 88 ) {     // X (bags++)
			JDG[JDGi].bags++;
			(new Audio('sounds/ding.wav')).play();
			jdgSaveData();
			jdgDisplay();
		} else if ( e.which == 66 ) {     // B (BLACK)
			$('body').fadeToggle(150);
		}
	});
	
	console.log(JSON.stringify(JDG, null, 4));
});
