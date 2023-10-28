import React from "react";

interface IProps {
    onClick: Function;
    active: boolean;
    toggled: boolean;
}

const Square = ({ onClick, active, toggled }: IProps) => (
    <div
        className={`square ${active ? 'active' : toggled ? 'toggled' : ''}`}
        onClick={() => onClick()} >
    </div>
);

export default Square;