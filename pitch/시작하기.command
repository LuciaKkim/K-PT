#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
echo "피칭 덱을 엽니다 → http://127.0.0.1:${PORT}/index.html"
echo "창을 닫으면 서버가 종료됩니다."
python3 -m http.server "$PORT" &
PID=$!
sleep 0.5
open "http://127.0.0.1:${PORT}/index.html"
trap "kill $PID 2>/dev/null" EXIT
wait $PID
