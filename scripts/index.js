var result = document.getElementById("result");
var resultCrit = document.getElementById("resultCrit");
var resultOFA = document.getElementById("resultOFA");
var resultOFACrit = document.getElementById("resultOFACrit");
const mobs = ["Normal", "Undead Mobs", "Arthropods Mobs", "Cubic Mobs", "Ender Mobs", "Water Mobs", "Dragon"];

for(let i = 0; i < mobs.length; i++) {
	let opt = document.createElement("option");
	opt.text = mobs[i];
	opt.value = mobs[i];
	get("mobType").add(opt);
}

var data = null;
var itemName = null;

function getJson() {
	let name = get("playerName").value;
	if(name != null && name.length > 0) {
		let request = new XMLHttpRequest();
		request.open('GET', "https://sky.shiiyu.moe/api/v2/profile/" + name);
		try {
			request.send();
			let select = document.getElementById("profile");
			get("reload").textContent = "Loading...";
			get("profiletext").style.color = "#ffffff"
			request.onload = function() {
				data = JSON.parse(request.responseText);
				console.log(data);
				for(let i = select.options.length - 1; i >= 0; i--) select.remove(i);
				
				if(data["error"] == null) {
					let profileList = data["profiles"];
					let keys = Object.keys(profileList);
					let ot = null;
					for(let i = 0; i < keys.length; i++) {
						let opt = document.createElement("option");
						opt.text = profileList[keys[i]]["cute_name"];
						opt.value = keys[i];
						select.add(opt);
						if(profileList[keys[i]]["current"] == true) ot = i;
					}
					if(ot != null) select.selectedIndex = ot;
					get("reload").textContent = "Reload";
					get("profiletext").style.color = "#035918";
					fo();
				}
			}
		} catch (error) {
			get("reload").textContent = error;
		}
	}
}

function fo() {
	let index = get("profile").selectedIndex;
	if(data != null && data["error"] == null) {
		let uuid = get("profile").options[index].value;
		let items = data["profiles"][uuid]["items"];
		let select = document.getElementById("weapon");

		for(let i = select.options.length - 1; i >= 0; i--) select.remove(i);

		console.log(items);

		get("weapontext").style.color = "#ffffff";
		let weapon = items["weapons"];
		for(let i = 0; i < weapon.length; i++) {
			let opt = document.createElement("option");
			opt.text = weapon[i]["display_name"];
			opt.value = weapon[i]["itemId"];
			select.add(opt);
			get("weapontext").style.color = "#035918";
		}

		let rod = items["rods"];
		for(let i = 0; i < rod.length; i++) {
			let opt = document.createElement("option");
			opt.text = rod[i]["display_name"];
			opt.value = rod[i]["itemId"];
			select.add(opt);
			get("weapontext").style.color = "#035918";
		}
	}
}

function reset() {
	let elements = document.getElementsByClassName("data");
	for(let i = 0; i < elements.length; i++) {
		elements[i].value = 0;
	}
}

function define() {
	if(data != null && data["error"] == null) {
		get("reload").textContent = "Loading...";
		reset()
		let profileSelect = document.getElementById("profile");
		let weaponSelect = document.getElementById("weapon");

		get("combatlevel").value = data["profiles"][profileSelect.options[profileSelect.selectedIndex].value]["data"]["levels"]["combat"]["level"];
		
		let hash = data["profiles"][profileSelect.options[profileSelect.selectedIndex].value]["data"]["weapon_stats"][weaponSelect.options[weaponSelect.selectedIndex].value];
		let keys = Object.keys(hash);
		for(let i = 0; i < keys.length; i++) {
			let element;
			if((element = get("def"+keys[i])) != null) {
				element.value = hash[keys[i]];
			}
		}
		
		let hash2 = data["profiles"][profileSelect.options[profileSelect.selectedIndex].value]["items"]["weapons"];
		console.log(weaponSelect.selectedIndex);
		let index;
		if(hash2.length - 1 >= (index = weaponSelect.selectedIndex) && hash2[index]["itemId"] == weaponSelect.options[weaponSelect.selectedIndex].value) {
			itemName = hash2[index]["display_name"];
			console.log(hash2);
			let c;
			if((c = hash2[index]["stats"]) != null) {
				let keys2 = Object.keys(c);
				for(let i = 0; i < keys2.length; i++) {
					let e;
					if((e = get("def"+keys2[i])) != null) {
						e.value = Number(e.value) - c[keys2[i]];
						get(keys2[i]).value = c[keys2[i]];
					}
				}
			}
			if((c = hash2[index]["tag"]["ExtraAttributes"]["enchantments"]) != null) {
				let keys2 = Object.keys(c);
				console.log(keys2);
				for(let i = 0; i < keys2.length; i++) {
					let e;
					if((e = get(keys2[i])) != null) {
						e.value = c[keys2[i]];
					}
				}
			}
		}
		
		let hash3 = data["profiles"][profileSelect.options[profileSelect.selectedIndex].value]["items"]["rods"];
		if(hash3.length - 1 >= (index = weaponSelect.selectedIndex) && hash3[index]["itemId"] == weaponSelect.options[weaponSelect.selectedIndex].value) {
			itemName = hash2[index]["display_name"];
			let c;
			if((c = hash3[index]["stats"]) != null) {
				let keys2 = Object.keys(c);
				for(let i = 0; i < keys2.length; i++) {
					let e;
					if((e = get("def"+keys2[i])) != null) {
						e.value = Number(e.value) - c[keys2[i]];
						get(keys2[i]).value = c[keys2[i]];
						break;
					}
				}
			}
			if((c = hash3[index]["tag"]["ExtraAttributes"]["enchantments"]) != null) {
				let keys2 = Object.keys(c);
				for(let i = 0; i < keys2.length; i++) {
					let e;
					if((e = get(keys2[i])) != null) {
						e.value = c[keys2[i]];
					}
				}
			}
		}
	}
	get("reload").textContent = "Apply";
}

document.getElementById("reload").addEventListener('click', getJson);
document.getElementById("apply").addEventListener('click', define);

function get(v) {
	return document.getElementById(v);
}

const ench1 = [0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1];
const ench2 = [0.05, 0.1, 0.15, 0.2, 0.3, 0.45, 65];
const ench3 = [0.15, 0.3, 0.45, 0.6, 0.8, 1, 1.3];

function done() {
	let sel = document.getElementById("mobType");
	document.getElementById("resultc").style.display = "block";
	document.getElementById("resultc").style.transform = "scale(1.2)";
	let dmg = 5 + Number(get("damage").value) + Number(get("defdamage").value);
	let str = Number(get("strength").value) + Number(get("defstrength").value);
	let cd = Number(get("crit_damage").value) + Number(get("defcrit_damage").value);

	let mobMaxHealth = Number(get("hp").value)
	if(mobMaxHealth == 0) mobMaxHealth = 1;
	let mobHealth = Math.min(Number(get("hpL").value), mobMaxHealth);
	let playerHealth = Number(get("health").value) + Number(get("defhealth").value);
	if(playerHealth == 0) playerHealth = 1;

	let enchMulti = 0;

	let i;

	if(sel.selectedIndex == 2) enchMulti += ((i = Number(get("bane_of_arthropds").value))>0)?ench1[i-1]:0;
	if(sel.selectedIndex == 3) enchMulti += ((i = Number(get("cubism").value))>0)?ench1[i-1]:0;
	if(sel.selectedIndex == 5) enchMulti += Number(get("dragon_hunter").value) * 0.08;
	if(sel.selectedIndex == 4 || sel.selectedIndex == 6) enchMulti += ((i = Number(get("ender_slayer").value))>0)?ench3[i-1]:0;
	enchMulti += ((mobMaxHealth - mobHealth)/mobMaxHealth)*(Number(get("execute").value) * 0.2);
	enchMulti += Number(get("first_strike").value) * 0.25;
	enchMulti += Math.min(((mobHealth-playerHealth)/playerHealth)*Number(get("giant_killer").value) * 0.1, Number(get("giant_killer").value)*0.05);
	if(sel.selectedIndex == 5) enchMulti += Number(get("impaling").value) * 0.25;
	enchMulti += (mobHealth/mobMaxHealth)*Number(get("prosecute").value) * 0.1;
	enchMulti += ((i = Number(get("sharpness").value))>0)?ench2[i-1]:0;
	if(sel.selectedIndex == 1) enchMulti += ((i = Number(get("smite").value))>0)?ench1[i-1]:0;

	let intel = dmg*(1+(str/100));
	let multi = 1+(Number(get("combatlevel").value)*0.04);
	let fin = intel * (multi + enchMulti);
	let finOFA = intel * (multi + 5);

	if(itemName != null && (itemName.startsWith("Fabled") || itemName.startsWith("fabled"))) fin *= 1 + Math.random() * 0.15;
	result.textContent = "Final Damage: " + String(fin);
	resultCrit.textContent = "Final Damage (Crit): " + String(fin * (1+(cd/100)));
	resultOFA.textContent = "Final Damage (One For All): " + String(finOFA);
	resultOFACrit.textContent = "Final Damage (One For All + Crit): " + String(finOFA * (1+(cd/100)));
}

document.getElementById("calc").addEventListener('click', done);
