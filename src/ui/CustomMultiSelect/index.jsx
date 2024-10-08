// styled components
import BasicMultiSelect from "./styles";
// hooks
import {useState} from 'react';

// utils
import PropTypes from 'prop-types';
import {components} from 'react-select';
import {memo} from 'react';

const CustomMultiSelect = ({options, value, onChange, variant = 'basic', ...props}) => {
    const [uniqueId] = useState(
        () => 'select_' + Math.random().toFixed(5).slice(2),
    );

    // custom dropdown indicator
    const Control = ({children, ...props}) => {
        return (
            <components.Control className={variant === 'basic' ? 'field-input' : ''} {...props}>
                {children}
                {
                    variant === 'minimal' ?
                        <i className="icon icon-caret-down"/>
                        :
                        <i className="icon icon-chevron-down"/>
                }
            </components.Control>
        );
    }

    // select props
    const selectProps = {
        classNamePrefix: 'select',
        id: props.id || uniqueId,
        isSearchable: true,
        options,
        value,
        onChange,
        placeholder: props.placeholder,
        openMenuOnFocus: true,
        blurInputOnSelect: true,
        ref: props.innerRef,
        defaultValue: props.defaultValue,
        isMulti:true,
        onMenuClose: () => {
            const menuEl = document.querySelector(`#${props.id || uniqueId } .select__menu`);
            const containerEl = menuEl?.parentElement;
            const clonedMenuEl = menuEl?.cloneNode(true);

            if (!clonedMenuEl) return;

            clonedMenuEl.classList.add('close');
            clonedMenuEl.addEventListener('animationend', () => {
                containerEl?.removeChild(clonedMenuEl);
            });

            containerEl?.appendChild(clonedMenuEl);
        },
        components: {
            Control,
        },
    };

    return <BasicMultiSelect {...selectProps} />
}

CustomMultiSelect.propTypes = {
    options: PropTypes.array.isRequired,
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    isMulti: PropTypes.bool,
}

export default memo(CustomMultiSelect);