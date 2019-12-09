import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import idgen from './idgen';
import constants from './constants';

const TextInput = ({
  value,
  children,
  s,
  m,
  l,
  xl,
  disabled,
  noLayout,
  placeholder,
  icon,
  label,
  inputClassName,
  success,
  error,
  password,
  email,
  validate,
  defaultValue,
  type,
  ...props
}) => {
  const getNnewId = id => {
    id = id || idgen();

    if (password) {
      id = `password${idgen()}`;
    }

    if (email) {
      id = `email${idgen()}`;
    }
    return id;
  };

  const [newValue, setNewValue] = useState(value);

  const inputRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react/prop-types
    props['data-length'] && M.CharacterCounter.init(inputRef);
  }, [props]);

  useEffect(() => {
    M.updateTextFields();
  }, [value]);

  const sizes = { s, m, l, xl };

  let responsiveClasses;
  if (!noLayout) {
    responsiveClasses = { col: true };
    constants.SIZES.forEach(size => {
      responsiveClasses[size + sizes[size]] = sizes[size];
    });
  }

  const wrapperClasses = cx('input-field', responsiveClasses);

  let computedType;
  if (type) {
    computedType = type;
  } else if (password) {
    computedType = 'password';
  } else if (email) {
    computedType = 'email';
  } else {
    computedType = 'text';
  }

  const inputProps = {
    placeholder,
    type: computedType,
    id: getNnewId(),
    value: newValue,
    defaultValue,
    disabled,
    ...props
  };

  const renderLabel = () =>
    label && (
      <label
        className={cx({
          active: newValue || placeholder,
          'label-icon': typeof label !== 'string'
        })}
        data-success={success}
        data-error={error}
        htmlFor={inputProps.id}
      >
        {label}
      </label>
    );

  const renderHelper = () =>
    (error || success) && (
      <span className="helper-text" data-error={error} data-success={success} />
    );

  const renderIcon = () => {
    if (!icon) return;

    if (typeof icon === 'string') {
      return <i className="material-icons prefix">{icon}</i>;
    }

    return React.cloneElement(icon, { className: 'prefix' });
  };

  if (type === 'file') {
    return (
      <div className={`${wrapperClasses} file-field`}>
        <div className="btn">
          <span>{label}</span>
          <input
            type="file"
            className={cx({ validate }, inputClassName)}
            {...inputProps}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
        {renderHelper()}
        {children}
      </div>
    );
  }

  return (
    <div className={wrapperClasses}>
      {renderIcon()}
      <input
        ref={inputRef}
        className={cx({ validate }, inputClassName)}
        {...inputProps}
      />
      {renderLabel()}
      {renderHelper()}
      {children}
    </div>
  );
};

TextInput.propTypes = {
  children: PropTypes.node,
  /*
   * Strip away all layout classes such as col and sX
   */
  noLayout: PropTypes.bool,
  /*
   * Responsive size for Mobile Devices
   */
  s: PropTypes.number,
  /*
   * Responsive size for Tablet Devices
   */
  m: PropTypes.number,
  /*
   * Responsive size for Desktop Devices
   */
  l: PropTypes.number,
  /**
   *  Responsive size for Large Desktop Devices
   */
  xl: PropTypes.number,
  /*
   * disabled input
   */
  disabled: PropTypes.bool,
  /*
   * Placeholder string
   */
  placeholder: PropTypes.string,
  /*
   * override id
   * @default idgen()
   */
  id: PropTypes.string,
  /*
   * prefix icon, name of the icon or a node
   */
  icon: PropTypes.node,
  /*
   * label text
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /*
   * Input initial value
   */
  defaultValue: PropTypes.string,
  /*
   * Input value
   */
  value: PropTypes.string,
  /*
   * Add validate class to input
   */
  validate: PropTypes.bool,
  /*
   * Custom success message
   */
  success: PropTypes.string,
  /*
   * Custom error message
   */
  error: PropTypes.string,
  /*
   * Additional classes for input
   */
  inputClassName: PropTypes.string,
  /*
   * override type="text"
   */
  type: PropTypes.string,
  /*
   * onChange callback
   */
  onChange: PropTypes.func,
  /*
   * password type
   */
  password: PropTypes.bool,
  /*
   * email type
   */
  email: PropTypes.bool
};

export default TextInput;
