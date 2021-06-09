class Action {
	constructor(actionType, unitType, fromLocation, targetLocation, otherAction) {
		this.actionType = actionType;
		this.unitType = unitType;
		this.fromLocation = fromLocation;
		this.targetLocation = targetLocation;
		this.otherAction = otherAction;
	}

	GetDisplayString(shortmode, preferred_index) {
		// Why can't I use ?? and ?. operators in this function?

		preferred_index = preferred_index == undefined ? 0 : preferred_index;
		let display = null;

		const unit = this.unitType.names[preferred_index];
		const fromLocation = this.fromLocation.names[preferred_index];
		const targetLocation = (this.targetLocation == null ? null : this.targetLocation.names[preferred_index]);

		switch (this.actionType) {
			case ActionType.Move:
				display = `${unit} ${fromLocation} ${shortmode ? "->" : "move to"} ${targetLocation}.`;
				break;

			case ActionType.Hold:
				display = `${unit} ${fromLocation} hold.`;
				break;

			case ActionType.Support:
				display = `${unit} ${fromLocation} support `;

				// otherAction fromLocation should match this action's targetLocation.
				display += this.otherAction.GetDisplayString(shortmode, preferred_index);

				// if (this.otherAction.actionType == ActionType.Move) {
				// 	display += `${this.otherAction.unitType.names[preferred_index]} ${this.otherAction.fromLocation.names[preferred_index]} ${shortmode ? "->" : "move to"} ${this.otherAction.targetLocation.names[preferred_index]}.`;
				// } else if (this.otherAction.ActionType == ActionType.Hold) {
				// 	display += `${this.otherAction.unitType.names[preferred_index]} ${this.otherAction.fromLocation.names[preferred_index]} hold.`;
				// }
				break;

			case ActionType.Convoy:
				display = `${unit} ${fromLocation} convoy ` + this.otherAction.GetDisplayString(shortmode, preferred_index);
				// + `${
				// 	this.otherAction.unitType.names[preferred_index]
				// } ${this.otherAction.fromLocation.names[preferred_index]} ${shortmode ? "->" : "to"} ${
				// 	this.otherAction.targetLocation.names[preferred_index]
				// }.`;
				break;
		}
		return display;
	}
}

const ActionType = Object.freeze({
	Move: {
		syntax: ["__unit__ __LOCATION__ __VERB__ __LOCATION__"],
		verbs: ["Moves", "Move", "To", "->", "=>"],
	},
	Hold: {
		syntax: ["__unit__ __LOCATION__ __VERB__"],
		verbs: ["Holds", "Hold", "Stands", "Stand"],
	},
	Support: {
		syntax: ["__unit__ __LOCATION__ __VERB__ __action__"],
		verbs: ["Supports", "Assists", "Helps", "Sup"],
	},
	Convoy: {
		syntax: ["__unit__ __LOCATION__ __VERB__ __action__"],
		verbs: ["Convoys"],
	},

	GetAllVebrs: () => {
		const verbs_list = new Array();
		for (const type in this.GetAllActionTypes()) verbs_list.push(...type.verbs);
		return verbs_list;
	},
	GetAllActionTypes: () => [ActionType.Move, ActionType.Hold, ActionType.Support, ActionType.Convoy],
});

const _Action = Action;
export { _Action as Action };
export default { _Action };
const _ActionType = ActionType;
export { _ActionType as ActionType };
