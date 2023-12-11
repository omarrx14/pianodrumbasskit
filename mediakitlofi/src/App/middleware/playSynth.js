import { MainSynth } from './synth';

const playSynth = store => next => action => {
    let state = store.getState().matrix
    if (state.isPlaying) {
        let column = state.currentStep === state.matrix[0].length - 1 ? 0 : state.currentStep + 1;
        for (let row = 0; row < state.matrix.length; row++) {
            console.log(column)

            if (state.matrix[row][column] === 1) {
                MainSynth.triggerAttackRelease(MainSynth.pentatonic[row], "4n");

            }
        }
    }
    next(action);
}

export default playSynth;