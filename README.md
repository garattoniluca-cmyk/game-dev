# Game Studio
Local game development environment on Android.

## Structure
game-dev/
├── index.html
├── src/
│   ├── main.js
│   ├── style.css
│   ├── config.js
│   ├── assets/
│   ├── scenes/
│   └── utils/
└── README.md

## Quick Start
1. code-server --bind-addr 127.0.0.1:8443 .
2. http-server -p 8080 --cors
3. http://localhost:8443 (editor)
4. http://localhost:8080 (preview)
