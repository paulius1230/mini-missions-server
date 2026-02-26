// const WebSocket = require("ws");
// const { v4: uuidv4 } = require("uuid");
// const os = require("os");

// const wss = new WebSocket.Server({ port: 3000 });
// const players = new Map();

// const WIDTH = 50;

// // Set terminal title
// process.title = "MINI-MISSIONS SERVER";
// process.stdout.write("\x1b]0;MINI-MISSIONS SERVER\x07");

// // ANSI Colors
// const pink = "\x1b[95m";
// const cyan = "\x1b[96m";
// const yellow = "\x1b[93m";
// const reset = "\x1b[0m";
// const white = "\x1b[97m";


// function stripAnsi(str) {
//   return str.replace(/\x1B\[[0-9;]*m/g, '');
// }

// function centerText(text) {
//   const visibleLength = stripAnsi(text).length;
//   const padding = Math.max(0, WIDTH - visibleLength);
//   const left = Math.floor(padding / 2);
//   const right = padding - left;
//   return " ".repeat(left) + text + " ".repeat(right);
// }

// function getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (const name of Object.keys(interfaces)) {
//     for (const iface of interfaces[name]) {
//       if (iface.family === "IPv4" && !iface.internal) {
//         return iface.address;
//       }
//     }
//   }
//   return "127.0.0.1"; // fallback
// }

// function renderUI() {
//   console.clear();

//   console.log(
//     pink +
// ` _      _  _      _        _      _  ____  ____  _  ____  _      ____    ____  _____ ____  _     _____ ____ 
// / \\__/|/ \\/ \\  /|/ \\      / \\__/|/ \\/ ___\\/ ___\\/ \\/  _ \\/ \\  /|/ ___\\  / ___\\/  __//  __\\/ \\ |\\/  __//  __\\
// | |\\/||| || |\\ ||| |_____ | |\\/||| ||    \\|    \\| || / \\|| |\\ |||    \\  |    \\|  \\  |  \\/|| | //|  \\  |  \\/|
// | |  ||| || | \\||| |\\____\\| |  ||| |\\___ |\\___ || || \\_/|| | \\||\\___ |  \\___ ||  /_ |    /| \\// |  /_ |    /
// \\_/  \\|\\_/\\_/  \\|\\_/      \\_/  \\|\\_/\\____/\\____/\\_/\\____/\\_/  \\|\\____/  \\____/\\____\\\\_/\\_\\\\__/  \\____\\\\_/\\_\\`
//     + reset
//   );


//   const borderTop = pink + "╔" + "═".repeat(WIDTH) + "╗" + reset;
//   const borderBottom = pink + "╚" + "═".repeat(WIDTH) + "╝" + reset;
//   const divider = pink + "╠" + "═".repeat(WIDTH) + "╣" + reset;

//   console.log('\n');

//   console.log(borderTop);

//   console.log(
//     pink + "║" + reset +
//     yellow + centerText("MINI-MISSIONS SERVER") + reset +
//     pink + "║" + reset
//   );

//   console.log(divider);
//   const ipAddress = getLocalIP();

//   console.log(
//     pink + "║" + reset +
//     centerText(
//       yellow + `Server IP: ${ipAddress}:3000` + reset
//     ) +
//     pink + "║" + reset
//   );

//   console.log(divider);


//   console.log(
//     pink + "║" + reset +
//     centerText(
//       yellow + `Connected Players: ${players.size}` + reset
//     ) +
//     pink + "║" + reset
//   );

//   console.log(borderBottom);
// }

// renderUI();

// function broadcast(senderId, message) {
//   const data = JSON.stringify(message);
//   players.forEach((player, id) => {
//     if (id !== senderId && player.socket.readyState === WebSocket.OPEN) {
//       player.socket.send(data);
//     }
//   });
// }

// function sendToPlayer(playerId, message) {
//   const player = players.get(playerId);
//   if (player && player.socket.readyState === WebSocket.OPEN) {
//     player.socket.send(JSON.stringify(message));
//   }
// }

// wss.on("connection", (socket) => {
//   socket.clientType = "unknown";
//   socket.playerId = null;

//   const handshakeTimeout = setTimeout(() => {
//     if (socket.clientType !== "game") {
//       socket.close();
//     }
//   }, 10000);

//   socket.on("message", (msg) => {
//     let data;
//     try {
//       data = JSON.parse(msg);
//     } catch {
//       return;
//     }

//     if (data.type === "HELLO") {
//       if (data.gameId !== "MiniMissions") {
//         socket.close();
//         return;
//       }

//       clearTimeout(handshakeTimeout);
//       socket.clientType = "game";
//       socket.playerId = uuidv4();

// players.set(socket.playerId, {
//   id: socket.playerId,
//   socket,
//   position: { x: 0, y: 0, z: 0 },
//   rotation: { x: 0, y: 0, z: 0, w: 1 },
//   state: { speed: 0, isJumping: false, isFreeFalling: false }
// });

//       renderUI();

//       // Send WELCOME first so client knows its own ID
//       sendToPlayer(socket.playerId, {
//         type: "WELCOME",
//         playerId: socket.playerId
//       });

//       // Then send existing players
//       const existingPlayers = [];
//       players.forEach((p, id) => {
//         if (id !== socket.playerId) {
// existingPlayers.push({
//   id: p.id,
//   position: p.position || { x: 0, y: 0, z: 0 },
//   rotation: p.rotation || { x: 0, y: 0, z: 0, w: 1 },
//   state: p.state || { speed: 0, isJumping: false, isFreeFalling: false }
// });
//         }
//       });

//       sendToPlayer(socket.playerId, {
//         type: "EXISTING_PLAYERS",
//         players: existingPlayers
//       });

//       // Broadcast to others that new player joined
// broadcast(socket.playerId, {
//   type: "PLAYER_JOINED",
//   player: {
//     id: socket.playerId,
//     position: { x: 0, y: 0, z: 0 },
//     rotation: { x: 0, y: 0, z: 0, w: 1 },
//     state: { speed: 0, isJumping: false, isFreeFalling: false }
//   }
// });

//       return;
//     }

//     if (socket.clientType !== "game") return;

//     if (data.type === "PLAYER_STATE") {
//       const player = players.get(socket.playerId);
//       if (!player) return;

//       // Store latest state
//       player.position = data.position;
//       player.rotation = data.rotation;
//       player.state = data.state;

//       // Broadcast to others
//       broadcast(socket.playerId, {
//         type: "PLAYER_UPDATE",
//         playerId: socket.playerId,
//         position: data.position,
//         rotation: data.rotation,
//         state: data.state
//       });

//       return;
//     }


//   });



//   socket.on("close", () => {
//     if (socket.playerId && players.has(socket.playerId)) {
//       console.log("Player disconnected:", socket.playerId);

//       players.delete(socket.playerId);

//       broadcast(socket.playerId, {
//         type: "PLAYER_LEFT",
//         playerId: socket.playerId
//       });
//     }

//     renderUI();
//   });

//   socket.on("error", () => {});
// });


const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const os = require("os");

const wss = new WebSocket.Server({ port: 3000 });
const players = new Map();

const WIDTH = 50;

process.title = "MINI-MISSIONS SERVER";
process.stdout.write("\x1b]0;MINI-MISSIONS SERVER\x07");

const pink   = "\x1b[95m";
const yellow = "\x1b[93m";
const reset  = "\x1b[0m";

function stripAnsi(str) {
  return str.replace(/\x1B\[[0-9;]*m/g, "");
}

function centerText(text) {
  const visibleLength = stripAnsi(text).length;
  const padding = Math.max(0, WIDTH - visibleLength);
  const left  = Math.floor(padding / 2);
  const right = padding - left;
  return " ".repeat(left) + text + " ".repeat(right);
}

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "127.0.0.1";
}

function renderUI() {
  console.clear();
  console.log(
    pink +
`_      _  _      _        _      _  ____  ____  _  ____  _      ____    ____  _____ ____  _     _____ ____
/ \\__/|/ \\/ \\  /|/ \\      / \\__/|/ \\/ ___\\/ ___\\/ \\/  _ \\/ \\  /|/ ___\\  / ___\\/  __//  __\\/ \\ |\\/  __//  __\\
| |\\/||| || |\\ ||| |_____ | |\\/||| ||    \\|    \\| || / \\|| |\\ |||    \\  |    \\|  \\  |  \\/|| | //|  \\  |  \\/|
| |  ||| || | \\||| |\\____\\| |  ||| |\\___ |\\___ || || \\_/|| | \\||\\___ |  \\___ ||  /_ |    /| \\// |  /_ |    /
\\_/  \\|\\_/\\_/  \\|\\_/      \\_/  \\|\\_/\\____/\\____/\\_/\\____/\\_/  \\|\\____/  \\____/\\____\\\\_/\\_\\\\__/  \\____\\\\_/\\_\\` + reset
  );

  const borderTop    = pink + "╔" + "═".repeat(WIDTH) + "╗" + reset;
  const borderBottom = pink + "╚" + "═".repeat(WIDTH) + "╝" + reset;
  const divider      = pink + "╠" + "═".repeat(WIDTH) + "╣" + reset;

  console.log("\n");
  console.log(borderTop);
  console.log(pink + "║" + reset + yellow + centerText("MINI-MISSIONS SERVER") + reset + pink + "║" + reset);
  console.log(divider);
  console.log(pink + "║" + reset + centerText(yellow + `Server IP: ${getLocalIP()}:3000` + reset) + pink + "║" + reset);
  console.log(divider);
  console.log(pink + "║" + reset + centerText(yellow + `Connected Players: ${players.size}` + reset) + pink + "║" + reset);
  console.log(borderBottom);
}

renderUI();

// ── Helpers ───────────────────────────────────────────────────────────────────

function broadcast(senderId, message) {
  const data = JSON.stringify(message);
  players.forEach((player, id) => {
    if (id !== senderId && player.socket.readyState === WebSocket.OPEN) {
      player.socket.send(data);
    }
  });
}

function sendToPlayer(playerId, message) {
  const player = players.get(playerId);
  if (player && player.socket.readyState === WebSocket.OPEN) {
    player.socket.send(JSON.stringify(message));
  }
}

// ── Connection handling ───────────────────────────────────────────────────────

wss.on("connection", (socket) => {
  socket.clientType = "unknown";
  socket.playerId   = null;

  const handshakeTimeout = setTimeout(() => {
    if (socket.clientType !== "game") socket.close();
  }, 10000);

  socket.on("message", (msg) => {
    let data;
    try { data = JSON.parse(msg); } catch { return; }



    if (data.type === "CHECK_NICKNAME") {
    if (data.gameId !== "MiniMissions") { socket.close(); return; }

    clearTimeout(handshakeTimeout);

    const nickname = (typeof data.nickname === "string" && data.nickname.trim().length > 0)
      ? data.nickname.trim().substring(0, 20)
      : null;

    const nicknameTaken = [...players.values()].some(p =>
      p.nickname && nickname && p.nickname.toLowerCase() === nickname.toLowerCase()
    );

    // Just send result and close — never added to players Map
    socket.send(JSON.stringify({ 
      type: nicknameTaken ? "NICKNAME_TAKEN" : "NICKNAME_OK" 
    }));
    socket.close();
    return;
  }


    // ── Handshake ────────────────────────────────────────────────────────────
    if (data.type === "HELLO") {
      if (data.gameId !== "MiniMissions") { socket.close(); return; }

      clearTimeout(handshakeTimeout);
      socket.clientType = "game";

      const nickname = (typeof data.nickname === "string" && data.nickname.trim().length > 0)
    ? data.nickname.trim().substring(0, 20)
    : null;

      const nicknameTaken = [...players.values()].some(p => 
        p.nickname && nickname && p.nickname.toLowerCase() === nickname.toLowerCase()
      );

      if (nicknameTaken) {
        socket.send(JSON.stringify({ type: "NICKNAME_TAKEN" }));
        socket.close();
        return;
      }

      socket.playerId = uuidv4()

      players.set(socket.playerId, {
        id:       socket.playerId,
        nickname, 
        socket,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        state:    { speed: 0, isJumping: false, isFreeFalling: false }
      });

      renderUI();

      sendToPlayer(socket.playerId, { type: "WELCOME", playerId: socket.playerId });

      const existingPlayers = [];
      players.forEach((p, id) => {
        if (id !== socket.playerId) {
          existingPlayers.push({
            id:       p.id,
            nickname: p.nickname,
            position: p.position,
            rotation: p.rotation,
            state:    p.state
          });
        }
      });

      sendToPlayer(socket.playerId, { type: "EXISTING_PLAYERS", players: existingPlayers });

      broadcast(socket.playerId, {
        type:   "PLAYER_JOINED",
        player: {
          id:       socket.playerId,
          nickname,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0, w: 1 },
          state:    { speed: 0, isJumping: false, isFreeFalling: false }
        }
      });

      return;
    }

    if (socket.clientType !== "game") return;

    // ── Player state ─────────────────────────────────────────────────────────
    if (data.type === "PLAYER_STATE") {
      const player = players.get(socket.playerId);
      if (!player) return;

      player.position = data.position;
      player.rotation = data.rotation;
      player.state    = data.state;

      broadcast(socket.playerId, {
        type:     "PLAYER_UPDATE",
        playerId: socket.playerId,
        position: data.position,
        rotation: data.rotation,
        state:    data.state
      });

      return;
    }

    // ── Chat relay ────────────────────────────────────────────────────────────
    if (data.type === "CHAT_SEND") {
      if (!data.text || typeof data.text !== "string") return;

      // Sanitise: trim and cap at 128 chars
      const text = data.text.trim().substring(0, 128);
      if (text.length === 0) return;

      const sender = players.get(socket.playerId);
      broadcast(socket.playerId, {
        type:     "CHAT_RECEIVE",
        senderId: socket.playerId,
        nickname: sender?.nickname ?? null,  // ← add this
        text
      });

      return;
    }
  });

  socket.on("close", () => {
    if (socket.playerId && players.has(socket.playerId)) {
      const leaving = players.get(socket.playerId);
      players.delete(socket.playerId);
      broadcast(socket.playerId, { 
        type:     "PLAYER_LEFT", 
        playerId: socket.playerId,
        nickname: leaving.nickname ?? null  // ← add
      });
    }
    renderUI();
  });

  socket.on("error", () => {});
});