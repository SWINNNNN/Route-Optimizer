import React from 'react';
import clsx from 'clsx';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'btn',
                `btn-${variant}`,
                `btn-${size}`,
                isLoading && 'btn-loading',
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className="btn-spinner"></span> : children}
        </button>
    );
};

export default Button;
