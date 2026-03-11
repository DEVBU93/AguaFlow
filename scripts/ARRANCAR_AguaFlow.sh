#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/backend/package.json" ]; then ROOT="$SCRIPT_DIR"
elif [ -f "$SCRIPT_DIR/../backend/package.json" ]; then ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
else echo "ERROR: Proyecto no encontrado"; exit 1; fi

OS="$(uname)"
open_term() {
    if [ "$OS" = "Darwin" ]; then
        osascript << EOF
tell application "Terminal"
    activate
    do script "echo '\033]0;$1\007' && $2"
end tell
EOF
    else
        gnome-terminal --title="$1" -- bash -c "$2; exec bash" 2>/dev/null || xterm -title "$1" -e bash -c "$2; exec bash" &
    fi
}

echo "🌊 Arrancando AguaFlow..."
cd "$ROOT" && docker-compose up -d postgres && sleep 5
cd "$ROOT/backend" && [ ! -d "node_modules" ] && npm install
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init
cd "$ROOT/frontend-web" && [ ! -d "node_modules" ] && npm install

open_term "AguaFlow BACKEND :3002" "cd '$ROOT/backend' && npm run dev"
sleep 3
open_term "AguaFlow FRONTEND :5174" "cd '$ROOT/frontend-web' && npm run dev -- --port 5174"
sleep 8

[ "$OS" = "Darwin" ] && open "http://localhost:5174" || xdg-open "http://localhost:5174" 2>/dev/null

echo "✅ AguaFlow en http://localhost:5174 | API en http://localhost:3002"
