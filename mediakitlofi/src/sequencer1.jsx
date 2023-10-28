const Step = ({ isActive, onClick }) => {
    return (
        <div className={`step ${isActive ? 'active' : ''}`} onClick={onClick}></div>
    );
};

const SequencerRow = ({ steps, onStepClick }) => {
    return (
        <div className="sequencer-row">
            {steps.map((isActive, index) => (
                <Step key={index} isActive={isActive} onClick={() => onStepClick(index)} />
            ))}
        </div>
    );
};

const Sequencer = ({ sequence, onStepToggle }) => {
    return (
        <div className="sequencer">
            {sequence.map((row, rowIndex) => (
                <SequencerRow key={rowIndex} steps={row} onStepClick={(stepIndex) => onStepToggle(rowIndex, stepIndex)} />
            ))}
        </div>
    );
};
