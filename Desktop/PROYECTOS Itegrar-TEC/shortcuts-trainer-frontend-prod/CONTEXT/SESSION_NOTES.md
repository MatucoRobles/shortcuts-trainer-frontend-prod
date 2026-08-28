# 🧠 Memoria de Sesión - Proyecto 2: Entrenador de Atajos de Teclado

## 📌 Estado Actual (Desafío D1: La Base)

Hemos inicializado la configuración base del repositorio preparando el terreno para un equipo de 6 personas bajo la arquitectura **Feature-First**.

### ✅ Lo que logramos hoy:
1. **Estructura del Proyecto:** Definida la división de responsabilidades en `src/features/` y `src/shared/`.
2. **Stack Configurado:** Vite, React 19, Tailwind CSS v4 (con directiva en `index.css`), utilidades de clases base (`cn.ts`).
3. **Estado Global:** Creado el store de estadísticas (`useShortcutStore.ts`) con Zustand v5 + `persist`.
4. **Contratos de Datos:** 
   - `types.ts`: Definida la interfaz estricta `Shortcut`.
   - `constants.ts`: Creada la lista `INITIAL_SHORTCUTS` usando `crypto.randomUUID()`.

### 🚧 Pendientes para la próxima sesión:
**1. Estandarización de Código (Prioridad Alta antes de programar):**
- [ ] Configurar Prettier, ESLint y Husky (pre-commit) para evitar conflictos de formato y estilos de código entre los integrantes del equipo.

**2. Tareas por Equipos (Paralelizables gracias al contrato `types.ts`):**
- **Equipo UI:** 
  - [ ] Maquetar el componente `<KeyCap />` para las teclas.
  - [ ] Maquetar la lista interactiva de atajos usando la constante inicial.
- **Equipo Lógica:**
  - [ ] Crear la función pura o hook en `utils.ts` que capture `window.addEventListener('keydown')`.
  - [ ] Crear la lógica para evaluar si las teclas presionadas coinciden con el arreglo `keys` de un atajo activo.

---
*Nota del Tech Lead: Al hacer commit de estos primeros cambios, asegúrense de usar Conventional Commits, por ejemplo: `feat: setup base de arquitectura y contratos para shortcuts`.*