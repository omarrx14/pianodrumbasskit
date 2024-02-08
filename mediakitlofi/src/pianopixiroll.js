const PLAY_TOGGLE = 'pianoRoll/playback/toggle';
const PLAY = 'pianoRoll/playback/play';
const PAUSE = 'pianoRoll/playback/pause';
const SEEK = 'pianoRoll/playback/seek';
const SET_BPM = 'pianoRoll/bpm/set';
const SET_ZOOM = 'pianoRoll/zoom/set';
const SET_RESOLUTION = 'pianoRoll/resolution/set';
const SET_NOTE_DATA = 'pianoRoll/noteData/set';

const playToggle = () => ({ type: PLAY_TOGGLE });
const play = (time) => ({ type: PLAY, payload: time });
const pause = () => ({ type: PAUSE });
const seek = (time) => ({ type: SEEK, payload: time });
const setBpm = (bpm) => ({ type: SET_BPM, payload: bpm });
const setZoom = (zoom) => ({ type: SET_ZOOM, payload: zoom });
const setResolution = (resolution) => ({ type: SET_RESOLUTION, payload: resolution });
const setNoteData = (noteData) => ({ type: SET_NOTE_DATA, payload: noteData });


const initialState = {
    playing: false,
    time: '0:0:0',
    bpm: 140,
    zoom: 4,
    resolution: 1,
    noteData: [],
    // ... other initial state properties
};

const pianoRollReducer = (state = initialState, action) => {
    switch (action.type) {
        case PLAY_TOGGLE:
            return { ...state, playing: !state.playing };
        case PLAY:
            return { ...state, playing: true, time: action.payload };
        case PAUSE:
            return { ...state, playing: false };
        case SEEK:
            return { ...state, time: action.payload };
        case SET_BPM:
            return { ...state, bpm: action.payload };
        case SET_ZOOM:
            return { ...state, zoom: action.payload };
        case SET_RESOLUTION:
            return { ...state, resolution: action.payload };
        case SET_NOTE_DATA:
            return { ...state, noteData: action.payload };
        default:
            return state;
    }
};
