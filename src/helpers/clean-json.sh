#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Uso: $0 <arquivo-entrada> <arquivo-saida>"
  echo "Exemplo: $0 shodan_raw.txt limpo.txt"
  exit 1
fi

INPUT="$1"
OUTPUT="$2"

cat "$INPUT" \
  | sed -E "s/'[[:space:]]*\+[[:space:]]*'//g" \
  | sed -E 's/"[[:space:]]*\+[[:space:]]*"//g' \
  | sed -E 's/\+[[:space:]]*$//g' \
  | sed -E 's/\.\.\.//g' \
  | sed -E 's/[[:space:]]+/ /g' \
  > "$OUTPUT"

echo "Arquivo limpo salvo em: $OUTPUT"