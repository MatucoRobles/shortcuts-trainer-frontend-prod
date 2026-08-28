export interface Shortcut {
  id: string;
  description: string;
  /**
   * Arreglo con las teclas exactas que componen el atajo.
   * Usaremos los valores estándar del evento KeyboardEvent.key
   * Ejemplos: ['Control', 'c'], ['Shift', 'ArrowUp'], ['Meta', 'k']
   */
  expectedCombo: string[];
  tool: string;
  level: number;
}