# Proyecto: Entrenador de Atajos de Teclado (Idea 12)

## Objetivo
[cite_start]Desarrollar una Single Page Application (SPA) para practicar atajos de teclado de diversas herramientas, con detección en tiempo real, registro de métricas y niveles de dificultad[cite: 480, 482].

## Stack Tecnológico
* [cite_start]**Framework:** React 19 + TypeScript + Vite[cite: 54, 484].
* [cite_start]**Estado:** Zustand v5 con middleware `persist`[cite: 54, 484].
* [cite_start]**Eventos:** `keydown` nativo (con `preventDefault`).
* [cite_start]**Utilidades:** `date-fns` (tiempos/fechas)[cite: 484].

## Estructura de Datos (Catálogo)
Cada desafío debe seguir el siguiente modelo:
* [cite_start]`id`: string (uuid)[cite: 60].
* [cite_start]`description`: string[cite: 487].
* [cite_start]`expectedCombo`: string[] (ej: ["Ctrl", "Shift", "P"])[cite: 487].
* [cite_start]`tool`: string (ej: "VS Code", "Chrome")[cite: 487].
* [cite_start]`level`: number[cite: 487].

## División de Desafíos (D1 - D5)

### D1 - Base (Integrante 1)
* [cite_start]**Tareas:** Scaffold del proyecto, definición del modelo en `types.ts`, creación del catálogo JSON inicial y renderizado básico del componente que muestra el atajo objetivo[cite: 490, 503].
* [cite_start]**Prioridad:** Desbloquea a todo el equipo[cite: 37].

### D2 - Detector de Atajos (Integrante 2)
* **Tareas:** Implementar el listener de `keydown`. [cite_start]Lógica para capturar y reconstruir la combinación de teclas presionada y comparar contra el `expectedCombo`[cite: 491, 504].
* **Nota:** Acordar interfaz con D3 para registrar resultados.

### D3 - Motor de Métricas (Integrante 3)
* [cite_start]**Tareas:** Registro de aciertos, errores y cálculo del tiempo de respuesta mediante `date-fns`[cite: 492, 505].

### D4 - Organización y Filtros (Integrante 4)
* [cite_start]**Tareas:** Desarrollar la navegación/filtros para organizar los desafíos según la herramienta y el nivel de dificultad[cite: 494, 506].

### D5 - Feedback y Progreso (Integrante 5)
* [cite_start]**Tareas:** Implementar récords personales persistidos, visualización del progreso general y feedback visual inmediato (verde/rojo) cuando el usuario acierta o falla[cite: 498, 507].

## Reglas de Arquitectura y Calidad
1. [cite_start]**Feature-first:** Agrupar por dominio (ej: `features/training/`)[cite: 65, 99].
2. [cite_start]**Lógica Pura:** Toda la matemática y validación en `utils.ts`[cite: 102].
3. [cite_start]**Persistencia:** Usar Zustand `persist` exclusivamente para los récords[cite: 54, 103].
4. [cite_start]**Git:** Conventional Commits y Pull Requests pequeños por cada feature[cite: 755, 757].
5. [cite_start]**Accesibilidad:** Priorizar etiquetas claras y contraste legible[cite: 772, 773].

## Recomendación de Trabajo
* [cite_start]Antes de empezar, los 5 integrantes deben acordar los tipos de TypeScript y las interfaces de los datos para trabajar en paralelo contra mocks[cite: 111, 487].