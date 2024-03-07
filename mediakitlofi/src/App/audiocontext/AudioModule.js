import * as Tone from 'tone';

class AudioModule {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.part = null; // Para secuenciación
        this.isPlaying = false;
        this.effects = {};
        this.volume = new Tone.Volume(0).toDestination();
        this.synth.connect(this.volume);
    }

    async startAudio() {
        await Tone.start();
        console.log('Audio is ready');
    }


    // playChord(notes, duration = '4n', time = Tone.now()) {
    //     this.synth.triggerAttackRelease(notes, duration, time);
    // }

    changeInstrument(instrumentType, options = {}) {
        this.synth.dispose(); // Dispose the current synth
        switch (instrumentType) {
            case 'synth':
                this.synth = new Tone.PolySynth(Tone.Synth).connect(this.volume);
                break;
            case 'fmSynth':
                this.synth = new Tone.PolySynth(Tone.FMSynth).connect(this.volume);
                break;
            case 'sampler':
                const { samples, baseUrl } = options;
                this.synth = new Tone.Sampler(samples, { baseUrl }).connect(this.volume);
                break;
            // Agregar más casos según sea necesario
        }
    }


    // applyEffect(effectType) {
    //     if (this.effects[effectType]) {
    //         this.effects[effectType].dispose(); // Dispose the current effect if it exists
    //     }
    //     switch (effectType) {
    //         case 'reverb':
    //             this.effects[effectType] = new Tone.Reverb(4).connect(this.volume);
    //             break;
    //         case 'delay':
    //             // this.effects[effectType] = new Tone.FeedbackDelay("8n", 2).connect(this.volume);
    //             break;
    //         // Aquí se pueden añadir más casos para otros efectos
    //     }
    //     this.synth.connect(this.effects[effectType]);
    // }

    // setVolume(db) {
    //     this.volume.volume.value = db;
    // }

    startSequence(notes) {

        if (this.part) {
            this.part.dispose(); // Dispose the current part if it exists
        }
        this.part = new Tone.Part((time, note) => {
            this.synth.triggerAttackRelease(note.note, note.duration, time, note.velocity);
            console.log("nota tocada en el tiempo ", time, note.velocity, note.note, note.duration);
        }, notes).start(0);

        if (!this.isPlaying) {
            Tone.Transport.bpm.value = 120;
            console.log(Tone.Transport.bpm.value)
            Tone.Transport.start();
            this.isPlaying = true;
        }
    }

    stopSequence() {
        if (this.isPlaying) {
            Tone.Transport.stop();
            this.isPlaying = false;
        }
    }
}

export const audioModule = new AudioModule();
