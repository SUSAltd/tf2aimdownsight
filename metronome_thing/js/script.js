// References used
// http://modernweb.com/2013/10/28/audio-synthesis-in-javascript/
// http://stackoverflow.com/questions/1280263/changing-the-interval-of-setinterval-while-its-running

"use strict";

$(document).ready(function() {
	var BEEP_FREQ_HIGH = 1800;
	var BEEP_FREQ_MID = 1350;
	var BEEP_FREQ_LOW = 900;
	var BEEP_LENGTH = 75;
	var TICK_TYPE = "sawtooth";
	
	var isTicking = false;
	var isTuning = false;
	var timer;
	var accentMap;
	// var ping = document.createElement("AUDIO");
	// ping.src = "resources/ping3.ogg";
	// ping.preload = "auto";
	
	var bpmElement = $("#bpm");
	var numElement = $("#num");
	var bpm = bpmElement.val();
	var num = numElement.val();
	
	updateAccentMap();
	
	bpmElement.change(function() {
		if (bpmElement.val() < 1) {
			bpmElement.val(1);
		}
		bpm = bpmElement.val();
	});
	numElement.change(function() {
		if (numElement.val() < 1) {
			numElement.val(1);
		}
		num = numElement.val();
		
		updateAccentMap();
	});
	
	var ac = new AudioContext();
	var osc;

	var tickButton = $("#tickbutton");
	tickButton.click(function() {
		if (isTicking) {
			stopTicking();
		} else {
			if (isTuning) {
				stopTuning();
			}
			
			isTicking = true;
			
			// the initial beep
			playNote(BEEP_FREQ_HIGH, TICK_TYPE);
			setTimeout(unplayNote, BEEP_LENGTH);
			
			// all the other beeps
			timer = setTimeout(function() { beep(1) }, 1000 / (bpm / 60));
			tickButton.text("STOP NOW");
		}
	});

	var tuneButton = $("#tunebutton");
	tuneButton.click(function() {
		if (isTuning) {
			stopTuning();
		} else {
			if (isTicking) {
				stopTicking();
			}
		
			playNote(440, "triangle");
			isTuning = true;
		}
	});
	
	function playNote(freq, type) {
		osc = ac.createOscillator();
		osc.frequency.value = freq;
		osc.type = type;
		osc.connect(ac.destination);
		osc.start();
	}
	
	function unplayNote() {
		osc.stop();
		osc.disconnect(ac.destination);
	}
			
	function beep(i) {
		if (!isTicking) {
			return;
		}
		
		switch (accentMap[i]) {
			case 2:
				playNote(BEEP_FREQ_HIGH, TICK_TYPE);
				break;
			case 1:
				playNote(BEEP_FREQ_MID, TICK_TYPE);
				break;
			case 0:
			default:
				playNote(BEEP_FREQ_LOW, TICK_TYPE);
				break;
			
		}
		setTimeout(unplayNote, BEEP_LENGTH);
		
		// do it again
		if (i + 1 == num) {
			timer = setTimeout(function() { beep(0) }, 1000 / (bpm / 60)); 
		} else {
			timer = setTimeout(function() { beep(i + 1) }, 1000 / (bpm / 60)); 
		}
		
		return;
	}
	
	function stopTicking() {
		clearInterval(timer);
		tickButton.text("Start beeping eternally");
		isTicking = false;
	}
	
	function stopTuning() {
		unplayNote();
		isTuning = false;
	}
	
	function updateAccentMap() {
		accentMap = new Array(num);
		accentMap.fill(0);
		accentMap[0] = 2;
		
		if (num / 2 > 2) {
			accentMap[Math.round(num / 2)] = 1;
		}
	}
});