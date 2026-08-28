# ⌨️ Shortcuts Trainer

Entrenador interactivo de **atajos de teclado**. Mostramos una acción y vos
ejecutás (o adivinás) el atajo en tu propio teclado, con feedback inmediato,
sonidos, animaciones y seguimiento de tu progreso.

**Segundo Proyecto Integrador · Módulo de React (SPA) · IntegrarTEC 2026 · Grupo 9**
**Idea 12 — Entrenador de Atajos de Teclado**

---

## 🎯 Objetivo

Resolver una necesidad concreta con una SPA en React: **practicar y memorizar
atajos de teclado** de distintas herramientas, detectando las combinaciones
reales que el usuario presiona, con feedback inmediato y seguimiento del
progreso. El proyecto vive 100% en el cliente —sin API ni base de datos— con
estado global (Zustand) y persistencia en `localStorage`.

Los 5 desafíos de la consigna (D1–D5):

| # | Desafío |
|---|---------|
| D1 | Base: scaffold + catálogo de atajos + mostrar la combinación objetivo |
| D2 | Detección de la combinación real (`keydown`) y comparación con la esperada |
| D3 | Registro de aciertos, errores y tiempo de respuesta |
| D4 | Organización de atajos por herramienta y nivel |
| D5 | Récord personal, progreso general y feedback inmediato |

## 👥 Equipo (Grupo 9)

| Integrante | GitHub |
|------------|--------|
| Jonatan Luque | [@jluque-venturing](https://github.com/jluque-venturing) |
| Alex Sanchez | [@Alex-Elian-Sanchez](https://github.com/Alex-Elian-Sanchez) |
| Santy | [@blue28lnx](https://github.com/blue28lnx) |
| Marilyn T. | [@MariTufi505](https://github.com/MariTufi505) |
| MatucoRobles | [@MatucoRobles](https://github.com/MatucoRobles) |

## 🔗 Enlaces

- **Repositorio:** <https://github.com/MatucoRobles/PROY_2-SHROTCUTS-TRAINER>
- **Deploy:** <https://matucorobles.github.io/PROY_2-SHROTCUTS-TRAINER/>

---

## ✨ Características

- **10 herramientas:** General, VS Code, Chrome, Word, Excel, Terminal, YouTube,
  Discord, Google Drive y Windows. ~145 atajos repartidos en 4 niveles.
- **4 modos de juego:**
  - **Aprender** — muestra la descripción y las teclas; las presionás.
  - **Adivinar** — solo la descripción; tenés que recordar y tocar el atajo.
  - **Opción múltiple** — muestra el atajo y elegís qué hace (sirve en móvil,
    sin teclado).
  - **Contrarreloj** — 60 s, cuántos aciertos podés hacer.
- **Detección real de teclas** vía `keydown`/`keyup` global, con normalización de
  combinaciones (modificadores + tecla) y manejo de teclas interceptadas.
- **Keycaps vivos:** al presionar, el borde de la tecla se ilumina con halo y
  partículas (Motion), más un sonido sintetizado (Web Audio API, sin archivos).
- **Tema claro/oscuro** con transición suave (View Transitions API).
- **Bilingüe ES/EN** con toggle (idioma por defecto: inglés).
- **Progreso persistente:** precisión, racha, mejor tiempo y atajos dominados por
  herramienta (localStorage).
- **Celebración** con confeti al llegar a una racha de 10.
- **Responsive** y **PWA instalable** (manifest + íconos + Open Graph).

---

## 🧱 Stack

| Área | Tecnología |
|------|------------|
| UI | React 19 + TypeScript |
| Build | Vite |
| Estilos | Tailwind CSS v4 (dark base, `light:` como override) |
| Routing | react-router (HashRouter, para GitHub Pages) |
| Estado | Zustand (con `persist`) |
| Animación | Motion v12 (`motion/react`) |
| Toasts | sonner |
| Confeti | canvas-confetti |
| Íconos | lucide-react |

---

## 🚀 Empezar

Requisitos: Node.js y **pnpm**.

```bash
pnpm install      # instalar dependencias
pnpm dev          # desarrollo → http://localhost:5173/PROY_2-SHROTCUTS-TRAINER/
pnpm build        # build de producción (tsc + vite) → dist/
pnpm preview      # servir el build de producción
pnpm lint         # ESLint
```

> La app se sirve bajo el subpath `/PROY_2-SHROTCUTS-TRAINER/` (config en
> `vite.config.ts`), pensado para GitHub Pages.

---

## 🎮 Cómo usar

1. **Elegí la herramienta** — VS Code, Chrome, Terminal, etc.
2. **Elegí el modo de juego** — Aprender, Adivinar, Opción múltiple o Contrarreloj.
3. **Ejecutá el atajo** — leés la descripción y presionás la combinación en tu teclado; el feedback es inmediato.
4. **Seguí tu progreso** — en la sección Progreso ves precisión, racha y atajos dominados por herramienta.

---

## 📁 Estructura

```
src/
├── app/                      # router, layout raíz, providers
│   ├── router.tsx            # rutas (se generan desde el registro de tools)
│   ├── RootLayout.tsx        # top bar de ajustes (fuera de las pantallas de training)
│   └── providers.tsx         # Toaster (sonner)
├── features/
│   ├── training/
│   │   ├── tools.ts          # ⭐ REGISTRO de herramientas (fuente de verdad)
│   │   ├── constants.ts      # catálogo de atajos (INITIAL_SHORTCUTS)
│   │   ├── modeStore.ts      # modo de juego activo
│   │   ├── useShortcutStore.ts  # atajo actual + métricas de sesión
│   │   ├── utils.ts          # matching de combos, normalización, helpers
│   │   ├── hooks/            # useGlobalKeydown, useFeedback
│   │   └── components/       # boards de cada modo, ShortcutCard, FilterBar, etc.
│   ├── theme/                # tema claro/oscuro
│   ├── translation/          # i18n ES/EN (idioms/en.ts)
│   └── progress/             # página y store de progreso
├── shared/                   # KeyCap, utils (cn, sound, confetti)
└── index.css                 # Tailwind + variante light + View Transitions
```

---

## 🧩 Cómo funciona

- **Registro de tools (`tools.ts`):** define cada herramienta (nombre, ícono,
  color, ruta, modo visual). La landing, las rutas, los filtros, el glow de
  acento y los colores del progreso se derivan de ahí.
- **Catálogo (`constants.ts`):** cada atajo es `{ description, expectedCombo,
  tool, level }`. `expectedCombo` usa valores de `KeyboardEvent.key`
  (`['Control','c']`, `['Shift','Alt','ArrowDown']`, `['k']`...).
- **Detección:** `useGlobalKeydown` + `utils.isMatchingCombo` comparan lo
  presionado contra el combo esperado (sin importar el orden). Una sola tecla no
  cuenta como error; sí 2+ que no coinciden.
- **Windows** es **modo visual** (el SO intercepta las teclas con `Win`): se
  navega con botones/flechas u opción múltiple.

### ➕ Agregar una herramienta nueva

1. Agregá una entrada en `src/features/training/tools.ts`.
2. Cargá sus atajos en `src/features/training/constants.ts`.
3. Agregá las traducciones EN en `src/features/translation/idioms/en.ts`.

No hace falta tocar rutas, filtros ni la landing: se generan solas.

---

## 🌐 Despliegue (GitHub Pages)

- `vite.config.ts` define `base: '/PROY_2-SHROTCUTS-TRAINER/'`.
- Se usa **HashRouter** para que recargar cualquier ruta funcione sin config de
  servidor (las URLs llevan `#`).
- `pnpm build` genera `dist/`, que es lo que se publica.

---

## 📝 Notas

- **Office (Word/Excel)** usa atajos **internacionales** (Ctrl+B/I/U). Si tu
  Office está en español, algunos cambian (Negrita = Ctrl+N, etc.).
- Los atajos de apps web (YouTube `k`/`m`/`f`, Drive `/`, etc.) se capturan en el
  navegador y funcionan en todos los modos.
- El sonido se genera por código (Web Audio API): no hay archivos de audio.
