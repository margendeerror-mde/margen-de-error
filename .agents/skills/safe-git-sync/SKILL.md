---
name: safe-git-sync
description: Safely run git push or git pull on a Google Drive synced repository without locking or freezing issues.
---

# Safe Git Sync

Cuando trabajamos en un repositorio de Git que está sincronizado con Google Drive (o Dropbox, OneDrive, etc.), a menudo ocurren problemas graves de concurrencia:
- Drive bloquea los archivos en `.git/objects/` al intentar subirlos.
- Git intenta comprimir archivos (`git pack-objects`) y falla o se queda sin memoria porque los archivos están trabados.
- Se crean archivos duplicados (ej. `archivo 2.tsx`).

Para evitar esto, debes usar este script que clona localmente a `/tmp`, empuja los cambios y los sincroniza de vuelta.

### Instrucciones

En lugar de correr `git push` directamente en el directorio, invoca el script `safe-git-push.sh`.
