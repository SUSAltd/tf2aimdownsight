"use strict";

$(document).ready(function() {
	var FRAMES = 7;
	var WAIT = 2;
	
	var MAX_FOV = 90;
	var MIN_FOV = 75;
	var D_FOV = (MAX_FOV - MIN_FOV) / FRAMES;

	var VM_DEFAULT = [0, 0, 0];
	var VM_MIN = [0, 0, -5];
	
	var WEAPONS = {
		scout: [
			[
				{
					name: "Backscatter",
					vm: [-15, -6.8, 2.4]
				},
				{
					name: "Baby Face's Blaster",
					vm: [-15, -5.34, 1.1]
				},
				{
					name: "Force-a-Nature",
					vm: [-5, -6, 2]
				},
				{
					name: "Scattergun",
					vm: [-15, -5.35, 2.7]
				},
			],
			[
				{
					name: "Lugermorph",
					vm: [-15, -4.65, .3]
				},
				{
					name: "Pistol",
					// vm: [-15, -5.25, 1.6]
					vm: [-15, -5.25, 0.5]
				},
				{
					name: "Pretty Boy's Pocket Pistol",
					// vm: [-15, -5.25, 1.6]
					vm: [-15, -5.25, 0.5]
				},
			]
		],
		soldier: [
			[
				// {
					// name: "Air Strike",
					// vm: [-5, -10.5, -0.5]
				// },
				// {
					// name: "Liberty Launcher",
					// vm: [-8, -6.15, 2.2]
				// },
				// {
					// name: "Rocket Launcher",
					// vm: [-8, -8.35, -4]
				// },
			],
			[
				{
					name: "Panic Attack",
					vm: [-15, -8.1, 3]
				},
				{
					name: "Reserve Shooter",
					vm: [-15, -8.1, 1.9]
				},
				{
					name: "Shotgun",
					// vm: [-15, -8, 3.1]
					vm: [-15, -8, 2]
				},
			]
		],
		pyro: [
			[
				
			],
			[
				{
					name: "Panic Attack",
					vm: [-15, -8.9, 5]
				},
				{
					name: "Reserve Shooter",
					vm: [-15, -8.85, 4]
				},
				{
					name: "Shotgun",
					vm: [-15, -8.8, 5.2]
				},
			]
		],
		demoman: [
			[
				// {
					// name: "Grenade Launcher",
					// vm: [-15, -6.6, -1.5]
				// },
				// {
					// name: "Iron Bomber",
					// vm: [-15, -6.85, -1.36]
				// },
				// {
					// name: "Loch-n-Load",
					// vm: [-15, -7.4, -2.85]
				// },
				// {
					// name: "Loose Cannon",
					// vm: [-15, -6.85, -0.1]
				// },
			],
			[
			
			]
		],
		heavy: [
			[
				
			],
			[
				{
					name: "Family Business",
					vm: [-15, -7.9, 2.7]
				},
				{
					name: "Panic Attack",
					vm: [-15, -7.9, 2.5]
				},
				{
					name: "Shotgun",
					vm: [-15, -7.8, 3]
				},
			]
		],
		engineer: [
			[
				{
					name: "Frontier Justice",
					vm: [-15, -8, 4]
				},
				{
					name: "Panic Attack",
					vm: [-15, -8.1, 4.2]
				},
				{
					name: "Shotgun",
					vm: [-15, -8, 4.5]
				},
				{
					name: "Widowmaker",
					vm: [-15, -8.1, 2.5]
				},
			],
			[
				{
					name: "Lugermorph",
					vm: [-15, -9, 0.7]
				},
				{
					name: "Pistol",
					vm: [-15, -9.35, 2.2]
				},
			]
		],
		medic: [
			[
				{
					name: "Crusader's Crossbow",
					vm: [-15, -8.15, 2]
				},
			],
			[
			
			]
		],
		sniper: [
			[
			
			],
			[
				{
					name: "SMG",
					vm: [-15, -9.64, 3.5]
				},
			],
		],
		spy: [
			[
				// {
					// name: "Diamondback",
					// vm: [-15, -6, 0.5]
				// },
			],
			[
			
			]
		]
	};
	
	/*
		ACTUAL JAVASCRIPT BEGINS HERE
	*/
	
	var classMenu = $('[name="tf2class"]');
	// var classWeapons = getCurrentClassWeapons();
	// console.log(classWeapons);
	var primaryMenu = $('[name="primarywep"]');
	var secondaryMenu = $('[name="secondarywep"]');
	var primaryWeapons;
	var secondaryWeapons;
	var bothMenus = $(".weaponmenu");
	
	classMenu.change(function() {
		updateWeapons();
	});
	
	$(".updatesscript").change(printScript);
	updateWeapons();
	
	function updateWeapons() {
		var classWeapons = WEAPONS[classMenu.val()];
		
		bothMenus.empty();
		var none = $(document.createElement("option"));
		none.text("None");
		none.val("");
		bothMenus.append(none);
	
		primaryWeapons = classWeapons[0];
		secondaryWeapons = classWeapons[1];
		
		if (primaryWeapons.length == 0) {
			primaryMenu.attr("disabled", "disabled");
		} else {
			primaryMenu.removeAttr("disabled");
			for (var i = 0; i < primaryWeapons.length; i++) {
				var option = $(document.createElement("option"));
				option.text(primaryWeapons[i].name);
				option.attr("value", i);
				primaryMenu.append(option);
			}
		}
		
		if (secondaryWeapons.length == 0) {
			secondaryMenu.attr("disabled", "disabled");
		} else {
			secondaryMenu.removeAttr("disabled");
			for (var i = 0; i < secondaryWeapons.length; i++) {
				var option = $(document.createElement("option"));
				option.text(secondaryWeapons[i].name);
				option.attr("value", i);
				secondaryMenu.append(option);
			}
		}
	}
	
	function printScript() {
		var script = $('[name="script"]');
		
		var priVal = primaryMenu.val();
		var secVal = secondaryMenu.val();
		if (!priVal && !secVal) {
			script.text("// You've got no weapons selected -- no script necessary!");
			return;
		}
			
		var zoomInAnims = new Array(2);
		var zoomOutAnims = new Array(2);
		
		var vmFullZoomed = new Array(2);
		var vmDefault;
		if ($('[name="minvm"]').is(":checked")) {
			vmDefault = VM_MIN;
		} else {
			vmDefault = VM_DEFAULT;
		}
		
		var priCommand = "ads_off";
		if (priVal) {	// if the menu option is not empty (i.e. "None")
			vmFullZoomed[0] = primaryWeapons[priVal]["vm"];
			priCommand = "ads_on";
			zoomInAnims[0] = createZoomAnim(vmFullZoomed[0], MAX_FOV, vmDefault, MIN_FOV);
			zoomOutAnims[0] = createZoomAnim(vmDefault, MIN_FOV, vmFullZoomed[0], MAX_FOV);
		}
		
		var bothWeapons = false;
		var secCommand = "ads_off";
		if (secVal) {	// if the menu option is not empty (i.e. "None")
			if (priVal) {
				bothWeapons = true;
				secCommand = "ads_on2";
				vmFullZoomed[1] = secondaryWeapons[secVal]["vm"];
				zoomInAnims[1] = createZoomAnim(vmFullZoomed[1], MAX_FOV, vmDefault, MIN_FOV);
				zoomOutAnims[1] = createZoomAnim(vmDefault, MIN_FOV, vmFullZoomed[1], MAX_FOV);
			} else {
				secCommand = "ads_on";
				vmFullZoomed[0] = secondaryWeapons[secVal]["vm"];
				zoomInAnims[0] = createZoomAnim(vmFullZoomed[0], MAX_FOV, vmDefault, MIN_FOV);
				zoomOutAnims[0] = createZoomAnim(vmDefault, MIN_FOV, vmFullZoomed[0], MAX_FOV);
			}
		}
		
		var attack2 = $('[name="adskey"]').val();
		
		var scriptText = "bind " + $('[name="primary"]').val() + " \"slot1; " + priCommand + "\" \n\
bind " + $('[name="secondary"]').val() + " \"slot2; " + secCommand + "\" \n";

		if (bothWeapons) {
			scriptText += "bind " + $('[name="melee"]').val() + " \"slot3; ads_never\" \n\
bind " + $('[name="pda"]').val() + " \"slot4; ads_never\" \n";
		} else {
			scriptText += "bind " + $('[name="melee"]').val() + " \"slot3; ads_off\" \n\
bind " + $('[name="pda"]').val() + " \"slot4; ads_off\" \n";
		}
		
		scriptText += "\n\
alias sens_def \"sensitivity " + $('[name="sens"]').val() + "\" \n\
alias sens_zoom \"sensitivity " + $('[name="sens-z"]').val() + "\" \n\
alias checkzoom \"\" \n\
\n\
alias +ads_off_m2 \"+attack2; alias \"checkzoom\" \"+zoom\"\" \n\
alias -ads_off_m2 \"-attack2; alias \"checkzoom\" \"\"\" \n\
\n\
alias ads_on \"checkzoom; bind " + attack2 + " \"+zoom\" \n";
		if (bothWeapons) {
			scriptText += "alias ads_on2 \"checkzoom; bind " + attack2 + " \"+zoom2\" \n";
		}
		
scriptText += "alias ads_off \"sens_def; -attack2; not_down_sights; bind " + attack2 + " \"+ads_off_m2\" \n\
alias ads_never \"sens_def; -attack2; not_down_sights; bind " + attack2 + " \"+attack2\" \n\
\n\
alias +zoom \"sens_zoom; crosshair 1; zoom_in_anim\" \n\
alias -zoom \"sens_def; crosshair 1; alias checkzoom \"\"; zoom_out_anim\" \n\
\n";
		if (bothWeapons) {
			scriptText += "alias +zoom2 \"sens_zoom; crosshair 1; zoom_in_anim2\" \n\
alias -zoom2 \"sens_def; crosshair 1; alias checkzoom \"\"; zoom_out_anim2\" \n\
\n";
		}
		
		scriptText += "alias zoom_in_anim \"" + zoomInAnims[0] + "aim_down_sights\" \n\
alias zoom_out_anim \"" + zoomOutAnims[0] + "not_down_sights\" \n\
\n";
		if (bothWeapons) {
			scriptText += "alias zoom_in_anim2 \"" + zoomInAnims[1] + "aim_down_sights2\" \n\
alias zoom_out_anim2 \"" + zoomOutAnims[1] + "not_down_sights2\" \n\
\n";
		}
		
		scriptText += "alias aim_down_sights \"fov_desired " + MIN_FOV + "; tf_viewmodels_offset_override " + vmFullZoomed[0][0] + " " + vmFullZoomed[0][1] + " " + vmFullZoomed[0][2] + "\" \n";
		if (bothWeapons) {
			scriptText += "alias aim_down_sights2 \"fov_desired " + MIN_FOV + "; tf_viewmodels_offset_override " + vmFullZoomed[1][0] + " " + vmFullZoomed[1][1] + " " + vmFullZoomed[1][2] + "\" \n";
		}
		
		scriptText += "alias not_down_sights \"fov_desired " + MAX_FOV + "; tf_viewmodels_offset_override " + vmDefault[0] + " " + vmDefault[1] + " " + vmDefault[2] + "\" \n\
\n\
alias adsoff \"bind " + $('[name="primary"]').val() + " \"slot1\"; bind " + $('[name="secondary"]').val() + " \"slot2\"; bind " + $('[name="melee"]').val() + " \"slot3\"; bind " + $('[name="pda"]').val() + " \"slot4\"; bind " + attack2 + " \"+attack2\"\"";

		script.text(scriptText);
	}
	
	function createZoomAnim(vm1, fov1, vm2, fov2) {
		var dx = (vm2[0] - vm1[0]) / FRAMES;
		var dy = (vm2[1] - vm1[1]) / FRAMES;
		var dz = (vm2[2] - vm1[2]) / FRAMES;
		var dFov = (fov2 - fov1) / FRAMES;
	
		var zoomAnim = "";
		// var zoomOutAnim = "";
		
		for (var i = 1; i < FRAMES; i++) {
			zoomAnim += "fov_desired " + (round(fov1 + i * dFov, 2)) + "; tf_viewmodels_offset_override " + (round(vm2[0] - i * dx, 2)) + " " + (round(vm2[1] - i * dy, 2)) + " " + (round(vm2[2] - i * dz, 2)) + "; wait " + WAIT + "; ";
			// zoomOutAnim += "fov_desired " + (round(fov2 + i * dFov, 2)) + "; tf_viewmodels_offset_override " + (round(vm2[0] - i * dx, 2)) + " " + (round(vm2[1] - i * dy, 2)) + " " + (round(vm2[2] - i * dz, 2)) + "; wait " + WAIT + "; ";
		}
		
		return zoomAnim;
	}
	
	// console.log(createZoomAnim([0, 0, -5], 90, [-15, -8, 3], 75));
	
	// var x1 = 0;
	// var y1 = 0;
	// var z1 = -5;
	
	
	// var x2 = -15;
	// var y2 = -9.64;
	// var z2 = 3.5;
		
	// var dx = (x2 - x1) / FRAMES;
	// var dy = (y2 - y1) / FRAMES;
	// var dz = (z2 - z1) / FRAMES;
	
	// var zoomInAnim = "";
	// var zoomOutAnim = "";
	
	// for (var i = 1; i < FRAMES; i++) {
		// zoomInAnim += "fov_desired " + (round(MAX_FOV - i * D_FOV, 2)) + "; tf_viewmodels_offset_override " + (round(x1 + i * dx, 2)) + " " + (round(y1 + i * dy, 2)) + " " + (round(z1 + i * dz, 2)) + "; wait " + WAIT + "; ";
		// zoomOutAnim += "fov_desired " + (round(MIN_FOV + i * D_FOV, 2)) + "; tf_viewmodels_offset_override " + (round(x2 - i * dx, 2)) + " " + (round(y2 - i * dy, 2)) + " " + (round(z2 - i * dz, 2)) + "; wait " + WAIT + "; ";
	// }
	
	// var script = $('[name="script"]');
	// script.text(zoomInAnim + "\n\n" + zoomOutAnim);
	
	function round(x, place) {
		return Math.round(x * Math.pow(10, place)) / Math.pow(10, place);
	}
});