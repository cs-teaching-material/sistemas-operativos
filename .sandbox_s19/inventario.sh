#!/usr/bin/env bash
# Solucion guiada 1 (slide 11)
set -euo pipefail
RUTA="${1:-}"
SALIDA="reporte_inventario.txt"
if [[ -z "$RUTA" || ! -d "$RUTA" ]]; then
  echo "Uso: $0 <directorio_valido>"
  exit 2
fi
contar() { find "$RUTA" -type f -name "$1" | wc -l; }
TOTAL_DIR=$(find "$RUTA" -type d | wc -l)
TOTAL_FILE=$(find "$RUTA" -type f | wc -l)
N_SH=$(contar "*.sh")
N_CONF=$(contar "*.conf")
N_LOG=$(contar "*.log")
{
  echo "Inventario: $RUTA"
  echo "Fecha: $(date -Iseconds)"
  echo "Usuario: $(whoami)"
  echo "Directorios: $TOTAL_DIR"
  echo "Archivos: $TOTAL_FILE"
  echo "*.sh: $N_SH"
  echo "*.conf: $N_CONF"
  echo "*.log: $N_LOG"
} > "$SALIDA"
echo "Reporte generado en $SALIDA"