# SESSION_NOTES - Shortcuts Trainer

## 📌 Contexto Actual
* **Proyecto:** PROY_2 - Shortcuts Trainer.
* **Stack Tecnológico:** React 19, Vite, Zustand v5 (con persistencia) y Tailwind CSS v4.
* **Arquitectura:** Feature-First (Regla 1 de `AGENT.md`). Los archivos de dominio se agrupan por *feature* y no por tipo.

## 🚀 Progreso (Desafío D1 Completado)
* **Capa de Datos:** Se definió el modelo estricto de `Shortcut` alineado con `PROY GUIDE.md` (`expectedCombo`, `tool`, `level`).
* **Archivos Reubicados:** `types.ts` y `constants.ts` fueron movidos a la carpeta de la *feature* correspondiente (`src/features/...` o similar) para cumplir con la arquitectura.
* **Estado Global (Zustand):** 
  * Se creó `useShortcutStore.ts` con middleware `persist` (LocalStorage).
  * Integración de `INITIAL_SHORTCUTS`.
  * Manejo de estadísticas (`correctAttempts`, `wrongAttempts`, `streak`).
  * Creación de la acción `nextShortcut` para rotación aleatoria de atajos sin repetir el anterior.

## 💬 Prompts Clave de esta Sesión
1. *"Todo el Proyecto cumple las normas de arquitectura y orden que se especifican en el archivo AGENT.md?"* -> Ayudó a identificar y corregir violaciones en el modelo de datos y la ubicación de archivos.

## 🛤️ Pasos a seguir (Para el Integrante 2 - D2)
1. **Lógica de Detección (D2):** Crear un archivo `utils.ts` (idealmente dentro de la feature de entrenamiento) que exporte una función pura capaz de comparar las teclas presionadas (`KeyboardEvent.key`) con el arreglo `expectedCombo` del store.
2. **Manejo del DOM:** Crear un hook (`useShortcutListener` o similar) o integrar un `useEffect` que escuche el evento `keydown` global y prevenga el comportamiento por defecto (ej. `e.preventDefault()` al hacer `Ctrl+S`).
3. **Conexión:** Al detectar una coincidencia o fallo, despachar la función `recordAttempt(isCorrect)` y luego llamar a `nextShortcut()`.

---
**Nota para el equipo:** La base de datos y los contratos están fijos. ¡No modifiquen `types.ts` para agregar nuevas propiedades sin consultar, ya que esto podría romper los desafíos D4 y D5!