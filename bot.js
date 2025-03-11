const mineflayer = require('mineflayer');

// Create the bot
const bot = mineflayer.createBot({
    host: 'your-server-ip',    // Replace with your server IP
    port: 25565,               // Default Minecraft port
    username: 'AFKBot',        // Bot's username
    auth: 'offline'            // Use 'offline' for cracked servers
});

// Handle bot spawning and basic movement
bot.on('spawn', () => {
    console.log('Bot has spawned!');
    startMovement();  // Start movement when bot spawns
    jumpPeriodically();  // Start jumping periodically
});

// Random movement to avoid AFK kick
function startMovement() {
    setInterval(() => {
        // Randomly choose to move forward, backward, left, or right
        const actions = ['forward', 'back', 'left', 'right'];
        const action = actions[Math.floor(Math.random() * actions.length)];
        bot.setControlState(action, true);

        // Stop the movement after a short time (2 seconds)
        setTimeout(() => bot.setControlState(action, false), 2000);
    }, 5000);  // Repeat every 5 seconds
}

// Make the bot jump periodically to avoid AFK kick
function jumpPeriodically() {
    setInterval(() => {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 300); // Jump for 300ms
    }, 10000);  // Jump every 10 seconds
}

// Function to follow a specific player (e.g., OP player)
function followPlayer(playerName) {
    const targetPlayer = bot.players[playerName];

    if (targetPlayer && targetPlayer.entity) {
        // Move towards the player
        moveTowardsPlayer(targetPlayer.entity.position);
    } else {
        console.log('Player not found.');
    }
}

// Function to move towards a player (without pathfinding)
function moveTowardsPlayer(position) {
    const botPosition = bot.entity.position;

    const xDiff = position.x - botPosition.x;
    const zDiff = position.z - botPosition.z;

    const moveDirection = Math.atan2(zDiff, xDiff); // Calculate the angle to the player

    bot.setControlState('forward', true); // Move forward
    bot.look(moveDirection, 0); // Look at the player
    setTimeout(() => bot.setControlState('forward', false), 1000); // Move for 1 second
}

// Make the bot start jumping and moving after spawning
bot.on('spawn', () => {
    jumpPeriodically();
    startMovement();
});

// Follow an OP player every 5 seconds
setInterval(() => {
    followPlayer('OPPlayer');  // Replace 'OPPlayer' with the OP player’s name
}, 5000);

// Error and disconnection handling
bot.on('error', (err) => {
    console.log('Error:', err);
});

bot.on('end', () => {
    console.log('Bot has disconnected');
});
