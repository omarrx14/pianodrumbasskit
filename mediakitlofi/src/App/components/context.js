import React, { createContext, useContext, useState } from 'react';

// Creación de contextos
const NotesContext = createContext();
const SnapValueContext = createContext();
const PlayingContext = createContext();
const DarkModeContext = createContext(); // Sin valor predeterminado

// Hooks personalizados para usar los contextos
export const useNotes = () => useContext(NotesContext);
export const useSnapValue = () => useContext(SnapValueContext);
export const usePlaying = () => useContext(PlayingContext);
export const useDarkMode = () => useContext(DarkModeContext); // Hook personalizado para DarkModeContext

// Proveedores de contextos
export const NotesProvider = ({ children }) => {
    const [notes1, setNotes1] = useState([]);
    return <NotesContext.Provider value={{ notes1, setNotes1 }}>{children}</NotesContext.Provider>;
};

export const SnapValueProvider = ({ children }) => {
    const [snapValue, setSnapValue] = useState(1);
    return <SnapValueContext.Provider value={{ snapValue, setSnapValue }}>{children}</SnapValueContext.Provider>;
};

export const PlayingProvider = ({ children }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    return <PlayingContext.Provider value={{ isPlaying, setIsPlaying }}>{children}</PlayingContext.Provider>;
};

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false); // Estado inicial falso, indicando modo claro por defecto
    return <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>{children}</DarkModeContext.Provider>;
};
