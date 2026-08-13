import React from 'react';

interface IconProps {
    className?: string;
    name: string;
    width?: number;
    height?: number;
    fill?: string;
}

const Icon: React.FC<IconProps> = ({ className, name, width, height, fill }) => {
    const classes = `${className ? className : ''}`;
    const iconName = `/icons/icons.svg#${name}`;
    return (
        <svg className={classes} viewBox="0 0 10 10" style={
            {
                width: width ? width : undefined,
                height: height ? height : undefined,
                fill: fill ? 'var(--bs-' + fill + ')' : 'currentColor',
            }
        }>
            <use href={iconName} />
        </svg>

    );
};

export default Icon;
