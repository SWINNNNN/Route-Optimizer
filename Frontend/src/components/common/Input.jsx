import React from 'react';
import clsx from 'clsx';
import './Input.css';

const Input = ({
    label,
    error,
    id,
    className,
    ...props
}) => {
    return (
        <div className={clsx('input-group', className)}>
            {label && <label htmlFor={id} className="input-label">{label}</label>}
            <input
                id={id}
                className={clsx(
                    'input-field',
                    error && 'input-error'
                )}
                {...props}
            />
            {error && <span className="input-error-msg">{error}</span>}
        </div>
    );
};

export default Input;
