import { StringsAreEqual } from "./StringAssistant.js";

const Locations = [
	// [0] is preferred name, [1] is 3-letter code, [2+] are other names.
	{ names: ["Syria", "SYR"], isControlPoint: false, type: "costal" },
	{ names: ["Armenia", "ARM"], isControlPoint: false, type: "costal" },
	{ names: ["Smyrna", "SMY"], isControlPoint: true, type: "costal" },
	{ names: ["Ankara", "ANK"], isControlPoint: true, type: "costal" },
	{ names: ["Constantinople", "CON"], isControlPoint: true, type: "costal" },
	{ names: ["Black Sea", "BLA"], isControlPoint: false, type: "ocean" },
	{ names: ["Sevastopol", "SEV", "Stevastopol"],isControlPoint: true, type: "costal" },
	{ names: ["Moscow", "MOS", "Moskva"], isControlPoint: true, type: "landlocked" },
	{ names: ["St. Petersburg", "STP", "Saint Petersburg"], isControlPoint: true, type: "costal" },
	{ names: ["Livonia", "LVN"], isControlPoint: false, type: "costal" },
	{ names: ["Ukraina", "UKR", "Ukraine"], isControlPoint: false, type: "landlocked" },
	{ names: ["Rumania", "RUM", "Romania"], isControlPoint: true, type: "costal" },
	{ names: ["Bulgaria", "BUL"], isControlPoint: true, type: "costal" },
	{ names: ["Greece", "GRE"], isControlPoint: true, type: "costal" },
	{ names: ["Albania", "ALB"], isControlPoint: false, type: "costal" },
	{ names: ["Serbia", "SER"], isControlPoint: true, type: "landlocked" },
	{ names: ["Trieste", "TRI"], isControlPoint: true, type: "costal" },
	{ names: ["Budapest", "BUD"], isControlPoint: true, type: "landlocked" },
	{ names: ["Galacia", "GLA"], isControlPoint: false, type: "landlocked" },
	{ names: ["Warsaw", "WAR"], isControlPoint: true, type: "landlocked" },
	{ names: ["Prussia", "PRU"], isControlPoint: false, type: "costal" },
	{ names: ["Silesia", "SIL"], isControlPoint: false, type: "landlocked" },
	{ names: ["Bohemia", "BOH"], isControlPoint: false, type: "landlocked" },
	{ names: ["Vienna", "VIE"], isControlPoint: true,  type: "landlocked" },
	{ names: ["Tyrolia", "TYR"], isControlPoint: false, type: "landlocked" },
	{ names: ["Munich", "MUN"], isControlPoint: true, type: "landLocked" },
	{ names: ["Venice", "VEN", "Venezia"], isControlPoint: true, type: "costal" },
	{ names: ["Apulia", "APU"], isControlPoint: false,type: "costal" },
	{ names: ["Naples", "NAP", "Napoli"], isControlPoint: true, type: "costal" },
	{ names: ["Rome", "ROM", "Roma"], isControlPoint: true, type: "costal" },
	{ names: ["Tuskany", "TUS"], isControlPoint: false, type: "costal" },
	{ names: ["Piedmont", "PIE", "Piemonte", "Piemont"], isControlPoint: false, type: "costal" },
	{ names: ["Marseilles", "MAR"], isControlPoint: true, type: "costal" },
	{ names: ["Burgundy", "BUR"], isControlPoint: false, type: "landlocked" },
	{ names: ["Gascony", "GAS"], isControlPoint: false, type: "costal" },
	{ names: ["Spain", "SPA", "España"], isControlPoint: true, type: "costal" },
	{ names: ["Portugal", "POR"], isControlPoint: true, type: "costal" },
	{ names: ["Tunis", "TUN", "Tunisia"], isControlPoint: true, type: "costal" },
	{ names: ["North Africa", "NAF", "Africa", "Northen Africa"],isControlPoint: false, type: "costal" },
	{ names: ["Brest", "BRE"], isControlPoint: true, type: "costal" },
	{ names: ["Paris", "PAR"], isControlPoint: true, type: "landlocked" },
	{ names: ["Picardy", "PIC"], isControlPoint: false, type: "costal" },
	{ names: ["Belgium", "BEL"], isControlPoint: true, type: "costal" },
	{ names: ["Holland", "HOL", "Netherlands", "Nederland"], isControlPoint: true, type: "costal" },
	{ names: ["Ruhr", "RUH"], isControlPoint: false, type: "landlocked" },
	{ names: ["Kiel", "KIE"], isControlPoint: true, type: "costal" },
	{ names: ["Berlin", "BER"], isControlPoint: true, type: "costal" },
	{ names: ["Denmark", "DEN"], isControlPoint: true, type: "costal" },
	{ names: ["Sweden", "SWE"], isControlPoint: true, type: "costal" },
	{ names: ["Norway", "NWY"], isControlPoint: true, type: "costal" },
	{ names: ["Finland", "FIN"], isControlPoint: true, type: "costal" },
	{ names: ["London", "LON"], isControlPoint: true, type: "costal" },
	{ names: ["Yorkshire", "YOR", "York"], isControlPoint: false, type: "costal" },
	{ names: ["Edinburgh", "EDI"], isControlPoint: true, type: "costal" },
	{ names: ["Clyde", "CLY"], isControlPoint: false, type: "costal" },
	{ names: ["Liverpool", "LIV"], isControlPoint: true, type: "costal" },
	{ names: ["Wales", "WAL"], isControlPoint: false, type: "costal" },
	{ names: ["Eastern Mediterranean", "EAS"], isControlPoint: false, type: "ocean" },
	{ names: ["Aegean Sea", "AEG"], isControlPoint: false, type: "ocean" },
	{ names: ["Ionian Sea", "ION"], isControlPoint: false, type: "ocean" },
	{ names: ["Tyrrhenian Sea", "TYS"], isControlPoint: false, type: "ocean" },
	{ names: ["Gulf of Lyon", "LYO"], isControlPoint: false, type: "ocean" },
	{ names: ["Western Mediterranean", "WES"], isControlPoint: false, type: "ocean" },
	{ names: ["Mid Atlantic Ocean", "MAO"], isControlPoint: false, type: "ocean" },
	{ names: ["English Channel", "ENG"], isControlPoint: false, type: "ocean" },
	{ names: ["Irish Sea", "IRI"], isControlPoint: false, type: "ocean" },
	{ names: ["North Sea", "NTH"], isControlPoint: false, type: "ocean" },
	{ names: ["Helgoland Bight", "HEL"], isControlPoint: false, type: "ocean" },
	{ names: ["North Atlantic Ocean", "NAO"], isControlPoint: false, type: "ocean" },
	{ names: ["Norwegian Sea", "NWG"], isControlPoint: false, type: "ocean" },
	{ names: ["Barents Sea", "BAR"], isControlPoint: false, type: "ocean" },
	{ names: ["Skagerrak", "SKA"], isControlPoint: false, type: "ocean" },
	{ names: ["Baltic Sea", "BAL"], isControlPoint: false, type: "ocean" },
	{ names: ["Gulf of Bothnia", "BOT"], isControlPoint: false, type: "ocean" },
	{ names: ["Adriatic Sea", "ADR", "Adriatic"], isControlPoint: false, type: "ocean" },
	{ names: ["Switzerland", "SWI"], isControlPoint: false, type: "impassable" },
	{ names: ["Ireland", "IRE"], isControlPoint: false, type: "impassable" },
	{ names: ["Iceland", "ICE"], isControlPoint: false, type: "impassable" },
	{ names: ["Siberia", "SIB"], isControlPoint: false, type: "impassable" },
];

const _Locations = Locations;
export { _Locations as Locations };
export default { _Locations };

if (false) {
	let locations = 0;
	let controls = 0;
	let landlocked = 0;
	let coastal = 0;
	let ocean = 0;
	for (location of Locations)
	{
		locations++;
		if (location.isControlPoint)
			controls++;
		if (StringsAreEqual(location.type, "landlocked"))
			landlocked++;
		if (StringsAreEqual(location.type, "coastal"))
			coastal++;
		if (StringsAreEqual(location.type, "ocean"))
			ocean++;
	}

	console.log("locations: " + locations);
	console.log("controls: " + controls);
	console.log("landlocked: " + landlocked);
	console.log("coastal: " + coastal);
	console.log("ocean: " + ocean);
}