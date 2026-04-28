#!/usr/bin/env bash
# Solucion guiada 2 (slide 20)
set -euo pipefail
RUTA="${1:-}"
MODO="${2:-audit}"
LOG="seguridad_webroot.log"
log(){ echo "[$(date -Iseconds)] $*" | tee -a "$LOG" >/dev/null; }
validar(){
  [[ -n "$RUTA" && -d "$RUTA" ]] || { echo "Uso: $0 <ruta> <audit|fix>"; exit 2; }
  [[ "$MODO" == "audit" || "$MODO" == "fix" ]] || { echo "Modo invalido"; exit 3; }
}
auditar(){
  log "Auditoria en $RUTA"
  find "$RUTA" -perm -o+w -print | tee -a "$LOG"
}
corregir(){
  log "Aplicando reglas de permisos"
  find "$RUTA" -type d -path '*/conf' -exec chmod 750 {} \;
  find "$RUTA" -type d -path '*/logs' -exec chmod 750 {} \;
  find "$RUTA" -type d ! -path '*/conf' ! -path '*/logs' -exec chmod 755 {} \;
  find "$RUTA" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) -exec chmod 644 {} \;
  find "$RUTA" -type f \( -name '*.conf' -o -name '*.log' \) -exec chmod 640 {} \;
  log "Correccion finalizada"
}
trap 'echo "Fallo en linea $LINENO"; exit 20' ERR
validar
if [[ "$MODO" == "audit" ]]; then
  auditar
else
  corregir
  auditar
fi
log "Proceso completado"