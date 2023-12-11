import { useDrop } from 'react-dnd';

const DropArea = ({ onDrop }) => {
    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'chord',
        drop: (item, monitor) => onDrop(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Agrega la clase 'is-over' si isOver es true
    const className = `drop-area ${isOver ? 'is-over' : ''}`;

    return (
        <div ref={dropRef} className={className}>
            {/* Contenido de la zona de soltado */}
        </div>
    );
};

export default DropArea;
