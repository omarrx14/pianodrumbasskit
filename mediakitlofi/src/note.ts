export type NoteData = {
    id: string;
    pitch: string; // Por ejemplo, "C4"
    duration: string; // Por ejemplo, "4n"
    startTime: string; // Formato "Bars:Beats:Sixteenths", por ejemplo, "1:2:0"
    note: string;
    units: number;
    velocity: number;
    pan: number;
    selected: boolean;
    name?: string; // Opcional, si notas tienen nombres
    row: number;
    column: number;
};

export type Position = {
    x: number;
    y: number;
};

export type Direction = 'top' | 'bottom' | 'left' | 'right';


export const NOTES: { [key: number]: string } = {
    0: "C4",
    1: "C#4 / Db4",
    2: "D4",
    3: "D#4 / Eb4",
    4: "E4",
    5: "F4",
    6: "F#4 / Gb4",
    7: "G4",
    8: "G#4 / Ab4",
    9: "A4",
    10: "A#4 / Bb4",
    11: "B4"
} as const;


