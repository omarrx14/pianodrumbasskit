// Definiciones de frecuencias para notas musicales, útil para síntesis de audio o visualizaciones.
export const NOTES: { [key: string]: number } = {
    c: 16,
    "c#": 17.32,
    d: 18.35,
    "d#": 19.45,
    e: 20.6,
    f: 21.83,
    "f#": 23.12,
    g: 24.5,
    "g#": 25.96,
    a: 27.5,
    "a#": 29.14,
    b: 30.87,
} as const;

// Configuraciones generales para la reproducción y visualización
export const DEFAULT_BPM = 120 as const;
export const NOTE_HEIGHT = 32 as const;
export const NOTE_WIDTH = 8 as const;
export const PIANO_WIDTH = 100 as const;
export const DEFAULT_NOTE_LENGTH = 8 as const;
export const DEFAULT_SNAP_VALUE = 2 as const;

// Identificadores para tipos de clic, útiles para manejar eventos de mouse
export const RIGHT_CLICK = 2 as const;
export const LEFT_CLICK = 1 as const;

// Configuración para la gestión de guardado automático
export const DEFAULT_SAVE_TIME = 1000 as const;

// Estilos visuales para la representación de notas
export const NOTE_COLOR = "#60A5FA" as const;
export const NOTE_STROKE_COLOR = "#1e40af" as const;
export const SELECTED_NOTE_COLOR = "#bfdbfe" as const;

// Longitud de una barra en la visualización, útil para calcular el espaciado y la distribución de notas
export const BAR_LENGTH = 32 as const;

// Nuevas constantes que podrías necesitar
export const MAX_TRACKS = 16 as const; // Número máximo de pistas para la secuenciación
export const DEFAULT_INSTRUMENT = "piano" as const; // Instrumento predeterminado para nuevas pistas
export const VOLUME_RANGE = [-12, 12] as const; // Rango de volumen permitido, en decibelios
export const TEMPO_RANGE = [60, 180] as const; // Rango de BPM permitidos para la reproducción
