#!/usr/bin/env bash
# Condicionales + case (slide 8)
set -euo pipefail
RUTA="${1:-}"
if [[ -z "$RUTA" ]]; then
  echo "Uso: $0 <ruta>"
  exit 2
fi
if [[ -d "$RUTA" ]]; then
  echo "Directorio valido"
else
  echo "No existe: $RUTA"
  exit 3
fi
case "${2:-audit}" in
  audit) echo "modo auditoria" ;;
  fix)   echo "modo correccion" ;;
  *)     echo "modo invalido"; exit 4 ;;
esac