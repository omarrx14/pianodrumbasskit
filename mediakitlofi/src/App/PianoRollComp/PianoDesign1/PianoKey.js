// PianoKey.js
function PianoKey({ note, type }) {
    return <li className={`key ${type} ${note}`}></li>;
}
export default PianoKey;
