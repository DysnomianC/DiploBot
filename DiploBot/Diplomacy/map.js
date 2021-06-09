

const ter_types = {
	OCEAN, COASTAL, LANDLOCKED,
}

let territories = new Array(
	{ id:"POR", names: ["POR", "Portugal"], type: ter_types.COASTAL, neighbours: ["SPA", "MAO"]},
	{ id:"SPA", names: ["SPA", "Spain"], type: ter_types.COASTAL, neighbours: ["POR", "MAO", "WES"], coasts: [
		{id:"SPA_SC", names: ["SC", "South Coast"]},
		{id:"SPA_NC", names: ["NC", "North Coast"]}
	]},
	{ id:"MAO", names: ["MAO", "Mid Atlantic", "Mid Atlantic Ocean"], type: ter_types.OCEAN, neighbours: ["POR", "SPA", "WES", "NAF"]},
	{ id:"WES", names: ["WES", "West Mediterranean", "Western Mediterranean"], type: ter_types.OCEAN, neighbours: ["SPA", "NAF", "MAO"]},
	{ id:"NAF", names: ["NAF", "North Africa", "Nothern Africa"], type: ter_types.OCEAN, neighbours: ["MAO", "WES"]},
)

// Need a way to say which coast borders which ocean.
// Also which countries border on the coast, eg Norway and Sweden are adjacent but their coasts are not.