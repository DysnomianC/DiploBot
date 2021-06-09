import Discord from "discord.js";

import config from "./config.js";
import { ParseOrder } from "./DiscordParser.js";
import { Log, SendWithId } from "./DiscordHelper.js";
import { StringsAreEqual } from "./StringAssistant.js";
import { State } from "./state.js";

const commandLineArgs = process.argv[0] == "node" ? process.argv.slice(2) : process.argv; // ignore the first 2 as they are automatically generated by node.
let is_debug = null;
for (const arg of commandLineArgs) {
    if (StringsAreEqual(arg, "debug")) {
        is_debug = true;
        break;
    }
}
if (is_debug == null) {
    is_debug = config.is_debug;
}

const {
    bot_secret,
    pastorders_channel_id: orders_channel_id,
    bot_commands_channel_id: bot_commands_channel_id,
    done_string,
    undone_string,
} = config.bot;

// Initialize Discord Bot
const client = new Discord.Client();

let timeout_id_do_the_thing = null;

client.on("ready", (evt) => {
    Log("Connected");
    Log("Logged in as: " + client.user.tag);
});

client.on("message", (receivedMessage) => {
    // Prevent bot from responding to its own messages
    if (receivedMessage.author === client.user) {
        return;
    }
    ProcessMessage(receivedMessage);
});

client.on("messageUpdate", ProcessMessageEdit);

Log("Started running" + (is_debug ? " in debug mode" : ""));
client.login(bot_secret);


function ProcessMessage(receivedMessage) {
    if (receivedMessage.channel.id === orders_channel_id) {
        if (receivedMessage.content.toLowerCase().startsWith("go")) {
            DoTheThing();
        } else if (receivedMessage.content.toLowerCase().startsWith("clear")) {
            ClearOrders();
        }
        return;
    }

    if (receivedMessage.channel.id === bot_commands_channel_id) {
        ProcessCommand(receivedMessage);
    }

    for (const nation of State.Nations) {
        if (receivedMessage.channel.id === nation.channel_id) {
            if (message.content.toLowerCase().startsWith(done_string)) {
                ProcessMarkDone(nation);
            } else if (message.content.toLowerCase().startsWith(undone_string)) {
                ProcessMarkUndone(nation);
            } else {
                ProcessAddOrder(nation, receivedMessage);
            }
        }
    }
}

function ProcessMessageEdit(oldMessage, newMessage) {
    const all_orders = State.Nations.reduce((accumulator, nation) => {
        accumulator.push(...nation.orders); // `...` is the spread operator
    }, new Array());

    // Take first element that matches, if falsey then use null.
    const message_to_edit = all_orders.filter((order) => order.id === newMessage.id)[0] || null;
    if (message_to_edit != null) {
        message_to_edit.content = newMessage.content;

        let msg = "A message from " + message_to_edit.nation.name + " was edited";
        if (is_debug)
            msg += " from \"" + oldMessage.content + "\" to \"" + newMessage.content + "\"";
        Log(msg);
    } else {
        let messageForNation = State.Nations.filter(nation => nation.channel_id === receivedMessage.channel.id)[0] || null;
        if (messageForNation != null) {
            let msg = "A message for " +
                nation.name +
                " was edited but it wasn't stored in our list of orders so nothing happened.";
            if (is_debug) {
                msg +=
                    "\r\nThe message was edited from \"" +
                    oldMessage.content +
                    "\" to \"" +
                    newMessage.content +
                    "\"";
            }
            Log(msg);
            return;
        }
    }
}


function ProcessAddOrder(nation, message) {
    // TODO allow for attachments?

    const my_order_object = {
        name: nation.name,
        id: message.id,
        content: message.content,
    };
    nation.orders.push(my_order_object);

    // TODO Should only do the parsing once user types done.
    //ParseOrder(message);

    let msg = "added message for " + nation.name;
    if (is_debug)
        msg += ` saying "${message.content}"`;
    Log(msg);
    PrintNation(nation);
}

function ProcessCommand(message) {
    // TODO
}

function ProcessMarkDone(nation) {
    State.MarkDone(nation);

    if (State.AreAllAliveNationsDone()) {
        const delay = 3000 + Math.random() * 7000;
        timeout_id_do_the_thing = setInterval(function () {
            if (AreAllDone()) {
                DoTheThing();
                timeout_id_do_the_thing = null;
            } else {
                Log("Not doing the thing since not all are done.");
            }
        }, delay);
    }
}

function ProcessMarkUndone(nation) {
    State.MarkUndone(nation);

    if (!State.AreAllAliveNationsDone()) {
        clearInterval(timeout_id_do_the_thing);
    } else {
        Log(nation.name + " undone themselves but somehow everyone was still done :shrug:");
    }
}

function DoTheThing() {
    let messageText = "";
    for (const nation of State.GetAliveNations()) {
        State.PrintNation(nation);
        for (const order of nation.orders) {
            if (order !== undefined && order.content.length > 0) {
                if (messageText.length > 0) {
                    messageText += "\r\n";
                }
                messageText += nation.name + ': "' + order.content + '"';
            }
        }
        if (messageText.length > 0) {
            messageText += "\r\n";
        }
        messageText += "------";
    }

    Log("Did the thing:\r\n" + messageText);

    SendWithId(client, orders_channel_id, messageText);

    State.ClearOrders();
}