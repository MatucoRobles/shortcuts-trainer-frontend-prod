import type { ComponentType } from 'react';
import {
  Keyboard,
  Code,
  Globe,
  MonitorSmartphone,
  FileText,
  Table,
  Terminal,
  Play,
  MessageCircle,
  HardDrive,
} from 'lucide-react';

export interface ToolDef {
  /** Clave canónica usada en los shortcuts (`shortcut.tool`). */
  key: string;
  title: string;
  description: string;
  /** Ruta con barra inicial, p.ej. '/general'. */
  path: string;
  icon: ComponentType<{ className?: string }>;
  /** Color de texto del acento (con variante light). */
  accent: string;
  /** Color de fondo para el glow (ToolGlow). */
  glow: string;
  /** Color de la barra de precisión en Progreso. */
  bar: string;
  /** true = se entrena sin teclado (el SO intercepta las teclas). */
  visual?: boolean;
}

/**
 * Registro único de herramientas. Todo lo que dependa de "qué tools
 * existen" (landing, rutas, filtros, glow, colores de progreso) se deriva
 * de acá: agregar una app = agregar una entrada + sus atajos en constants.
 */
export const TOOLS: ReadonlyArray<ToolDef> = [
  {
    key: 'General',
    title: 'Atajos generales',
    description: 'Copia, pega, deshacer y guardar. La base de cualquier editor.',
    path: '/general',
    icon: Keyboard,
    accent: 'text-sky-400 light:text-sky-600',
    glow: 'bg-sky-500',
    bar: 'bg-sky-400',
  },
  {
    key: 'VS Code',
    title: 'Visual Studio Code',
    description: 'Paleta de comandos, formateo, multi-cursor y navegación.',
    path: '/vscode',
    icon: Code,
    accent: 'text-indigo-400 light:text-indigo-600',
    glow: 'bg-indigo-500',
    bar: 'bg-indigo-400',
  },
  {
    key: 'Chrome',
    title: 'Google Chrome',
    description: 'Pestañas, historial, descargas y modo incógnito.',
    path: '/chrome',
    icon: Globe,
    accent: 'text-emerald-400 light:text-emerald-600',
    glow: 'bg-emerald-500',
    bar: 'bg-emerald-400',
  },
  {
    key: 'Word',
    title: 'Microsoft Word',
    description: 'Formato de texto, estilos y navegación del documento.',
    path: '/word',
    icon: FileText,
    accent: 'text-blue-400 light:text-blue-600',
    glow: 'bg-blue-500',
    bar: 'bg-blue-400',
  },
  {
    key: 'Excel',
    title: 'Microsoft Excel',
    description: 'Celdas, fórmulas, selección y navegación de hojas.',
    path: '/excel',
    icon: Table,
    accent: 'text-green-400 light:text-green-600',
    glow: 'bg-green-500',
    bar: 'bg-green-400',
  },
  {
    key: 'Terminal',
    title: 'Terminal',
    description: 'Línea de comandos: cancelar, limpiar e historial.',
    path: '/terminal',
    icon: Terminal,
    accent: 'text-zinc-300 light:text-zinc-600',
    glow: 'bg-zinc-500',
    bar: 'bg-zinc-400',
  },
  {
    key: 'YouTube',
    title: 'YouTube',
    description: 'Reproducción, volumen y navegación del video.',
    path: '/youtube',
    icon: Play,
    accent: 'text-red-400 light:text-red-600',
    glow: 'bg-red-500',
    bar: 'bg-red-400',
  },
  {
    key: 'Discord',
    title: 'Discord',
    description: 'Canales, micrófono, búsqueda y marcar como leído.',
    path: '/discord',
    icon: MessageCircle,
    accent: 'text-violet-400 light:text-violet-600',
    glow: 'bg-violet-500',
    bar: 'bg-violet-400',
  },
  {
    key: 'Drive',
    title: 'Google Drive',
    description: 'Crear, navegar y organizar tus archivos.',
    path: '/drive',
    icon: HardDrive,
    accent: 'text-cyan-400 light:text-cyan-600',
    glow: 'bg-cyan-500',
    bar: 'bg-cyan-400',
  },
  {
    key: 'Windows',
    title: 'Windows',
    description: 'Escritorio virtual, bloqueo, captura y administrador de tareas.',
    path: '/windows',
    icon: MonitorSmartphone,
    accent: 'text-amber-400 light:text-amber-600',
    glow: 'bg-amber-500',
    bar: 'bg-amber-400',
    visual: true,
  },
];

export const TOOL_PATHS = TOOLS.map((t) => t.path);

export function getTool(key: string): ToolDef | undefined {
  return TOOLS.find((t) => t.key === key);
}
