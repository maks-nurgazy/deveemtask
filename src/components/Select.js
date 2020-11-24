import { useState, useRef, useEffect } from 'react';
import RSC from "react-scrollbars-custom";
import Chip from './Chip';
import useToggleState from '../hooks/useToggleState';
import useInputState from '../hooks/useInputState';
import './Select.css';


let defOptions = [
    { content: "Hello", key: "hello", group: "" },
    { content: "Welcome", key: "welcome", group: "" },
    { content: "Hi", key: "hi", group: "" },
    { content: "Good bye", key: "good-bye", group: "" },
    { content: "See you later", key: "see-you-later", group: "" },
    { content: "Don't worry", key: "don$t-worry", group: "" },
    { content: "Be happy", key: "be-happy", group: "" }
]

Select.defaultProps = {
    isMultiple: false,
}

function Select({ isMultiple }) {
    const [open, toggleOpen] = useToggleState(false);
    const [input, handleInput, clearInput] = useInputState("");
    const [chips, setChips] = useState([]);
    const [options, setOptions] = useState(defOptions);

    const ref = useRef(null);

    useEffect(() => {

        const opt = defOptions.filter(option => {
            return option.content.includes(input) && option;
        });
        setOptions(opt);

    }, [input]);


    const removeOption = option => {
        defOptions = defOptions.filter(opt => {
            return opt.key !== option.key;
        });
        const newOptions = options.filter(opt => {
            return opt.key !== option.key;
        });
        setOptions(newOptions);
    }

    const deleteChip = delChip => {
        const newChip = chips.filter(chip => {
            return chip.key !== delChip.key
        });
        setChips(newChip);
        defOptions = [...defOptions, delChip];
        setOptions([...options, delChip]);
    }


    const addChip = (chip) => {
        removeOption(chip);
        setChips([...chips, chip]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const chip = options.find(option => option.content.includes(input));
        addChip(chip);
        clearInput("");
    }

    const handleClickOutside = (e) => {
        if (ref.current && ref.current.contains(e.target)) {
            toggleOpen(true);
        }
        else if (ref.current && !ref.current.contains(e.target)) {
            toggleOpen(false);
        }
    }


    return (
        <div className="page-container" onClick={handleClickOutside}>
            <div className="dropdown-container">
                <form className="search" ref={ref} onSubmit={handleSubmit} style={{}}>
                    <Chip chips={chips} deleteChip={deleteChip} />
                    <input type="text" placeholder={options.length > 0 ? "search" : "empty"} value={input} onChange={handleInput} />
                    <div className="arrow"></div>
                    {open && <div className="dropdown">
                        <RSC style={{ height: "120px" }}>
                            {options.map((option) => <div className="option" onClick={() => addChip(option)} key={option.key}><span>{option.content}</span></div>)}
                        </RSC>
                    </div>}
                </form>
            </div >
        </div>
    );
}

export default Select;