import config from "./config.js";
import { Log } from "./DiscordHelper.js";

const {
	france_id,
	italy_id,
	ah_id,
	turk_id,
	rus_id,
	germ_id,
	eng_id,
} = config.bot;


const nations = [
	{
		name: "France",
		short_name: "france",
		title: "President",
		channel_id: france_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "Italy",
		short_name: "italy",
		title: "Pope",
		channel_id: italy_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "Austria-Hungary",
		short_name: "ah",
		title: "Archduke",
		channel_id: ah_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "Turkey",
		short_name: "turk",
		title: "Sultan",
		channel_id: turk_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "Russia",
		short_name: "rus",
		title: "Tsar",
		channel_id: rus_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "Germany",
		short_name: "germ",
		title: "Kaiser",
		channel_id: germ_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
	{
		name: "England",
		short_name: "eng",
		title: "Prime Minister",
		channel_id: eng_id,
		orders: new Array(),
		done_status: false,
		alive: false,
	},
];


const AreAllAliveNationsDone = () => {
	return GetAliveNations().every((nation) => nation.done_status);
};


const ClearOrders = () => {
	for (const nation of GetAliveNations()) {
		nation.orders = [];
		nation.done_status = false;
	}

	Log("orders cleared");
};

const GetAliveNations = () => nations.filter((nation) => nation.alive);

const PrintNation = (nation) => {
	const msg = `Name: ${nation.name} (${nation.short_name})
	Orders: ${nation.orders.length}, Alive: ${nation.alive ? "true" : "false"}, Done: ${nation.done_status ? "true" : "false"}`;
	Log(msg);
}

const MarkDone = (nation) => {
	const prev_value = nation.done_status;
	nation.done_status = true;

	if (prev_value) {
		Log(nation.name + " is still done.");
	} else {
		Log(nation.name + " is done.");
	}
};

const MarkUndone = function (nation) {
	const prev_value = nation.done_status;
	nation.done_status = false;

	if (prev_value) {
		Log(nation.name + " is undone.");
	} else {
		Log(nation.name + " is still not done.");
	}
};

let state = {
	Nations = nations,
	AreAllAliveNationsDone,
	ClearOrders,
	GetAliveNations,	
	PrintNation,
	MarkDone,
	MarkUndone,
};


const _State = state;
export { _State as State };
