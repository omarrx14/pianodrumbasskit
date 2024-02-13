document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('pianoRoll');
    const numRows = 12; // Number of notes
    const numCols = 32; // Number of steps

    // Initialize the grid
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', toggleNote);
            grid.appendChild(cell);
        }
    }

    function toggleNote() {
        this.classList.toggle('active');
        // Here, you would also handle the logic to play the note or store its state
        // for playback with Web Audio API and timing with PPQ.
    }
});
