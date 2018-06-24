# Minecraft Bot
This bot is a helper for ingame task, such as mining.

## Setup
Copy the `config.example.json` to `config.json` and fill in the config parameters.

## Plugins
You can see the plugin in the ./src/plugins folder.

### Chat.js
Monitors the ingame chat and reports it to the console.

### Info.js
Monitors important events, such as spawning, respawning and reports it to the console.

There are also a few commands to get some information about the bot. To ask about the health of the player, use the command `hp` (aliases: `health` or `food`). To ask about the current location and position of the bot, use the command `pos` (aliases: `position`, `loc` or `location`)

### Sleep.js
Controls the sleep and wake actions of the bot. Uses command `sleep` to sleep in the nearest bed. And wake (alias `wakeup`) to wake up.

### Come.js
Navigate the bot around.

To let the bot comes to your current location, use the command `come`. If you want to sent the bot to another player's location use the command `come <playername>`. Or, if you want to sent the bot to specific location, you can tuse `come <x> <y> <z>` to move the bot around.

<!-- # Minecraft Bot
This bot is an helper ingame to give him repetitve tasks, like stripmining.

## Setup
Copy the `config.example.json` to `config.json` and fill in the config parameters.

## Commands
Replace `botname` with the ingame username.

|command|plugin|description|
|---|---|---|
|`botname come`|come.js|The bot will come's to your location|
|`botname come <playername>`|come.js|The bot will come's to the given player's location|
|`botname come <x> <y> <z>`|come.js|The bot will come's to the given X Y Z coordinates|
|`botname echo <message>`|echo.js|Example script, the bot will echo's what you give as params|
|`botname hp`|info.js|The bot will reply with how many hearts it has|
|`botname pos`|info.js|The bot will reply with his current location and dimension|
|`botname follow`|follow.js|The bot will follow you|
|`botname follow stop`|follow.js|The bot will stops following|
|`botname follow <playername>`|follow.js|The bot will follos the given player|
|`botname sleep`|sleep.js|Find the nearest bed and sleep in it|
|`botname wake`|sleep.js|Wake up from sleeping|
|`botname jump`|jump.js|Starts jumping like an idiot|
|`botname jump stop`|jump.js|Stops the jumping|
|`botname excavate`|excavate.js|Starts the excavating process|
|`botname excavate stop`|excavate.js|Stops the excavating process|
|`botname inventory`|inventory.js|Display's all the items in the bot's inventory|
|`botname inventory toss`|inventory.js|Tosses all items from the inventory's bot|
|`botname inventory deposit`|inventory.js|Deposits the the inventory into the nearest chest| -->
