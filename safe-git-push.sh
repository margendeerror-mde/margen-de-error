#!/bin/bash
# Script para hacer git push de forma segura cuando el repositorio está en Google Drive.
# Evita cuelgues por archivos bloqueados por la sincronización.

set -e

echo "🚀 Iniciando sincronización segura..."

# Directorio actual y temporal
REPO_DIR="$PWD"
TMP_DIR="/tmp/mde_safe_sync_$$"

# Asegurarse de limpiar al salir
cleanup() {
  echo "🧹 Limpiando directorio temporal..."
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "📁 Copiando repositorio a entorno seguro (fuera de Drive)..."
rsync -a --exclude 'node_modules' --exclude '.next' "$REPO_DIR/" "$TMP_DIR/"

cd "$TMP_DIR"

echo "🔄 Ejecutando git pull && git push..."
git pull
git push

echo "📥 Sincronizando el historial (.git) de vuelta a Drive..."
rsync -a --delete "$TMP_DIR/.git/" "$REPO_DIR/.git/"

echo "✅ Sincronización completa."
