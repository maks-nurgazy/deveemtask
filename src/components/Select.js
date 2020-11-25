import { useState, useRef, useEffect } from 'react';
import RSC from "react-scrollbars-custom";
import Chip from './Chip';
import useToggleState from '../hooks/useToggleState';
import useInputState from '../hooks/useInputState';
import './Select.css';


let defOptions = {
    meeting: [
        { content: "Hello", key: "hello" },
        { content: "Welcome", key: "welcome" },
        { content: "Hi", key: "hi" },
    ],
    parting: [
        { content: "Good bye", key: "good-bye" },
        { content: "See you later", key: "see-you-later" },
    ],
    mood: [
        { content: "Don't worry", key: "don$t-worry" },
        { content: "Be happy", key: "be-happy" }
    ],
};


Select.defaultProps = {
    isMultiple: false,
}

function Select({ isMultiple }) {
    const [open, toggleOpen] = useToggleState(false);
    const [input, handleInput, clearInput] = useInputState("");
    const [chips, setChips] = useState({});
    const [single, setSingle] = useState({ group: { content: "hello", key: "hello" } });  // { group : {key:"somekey",content:"somecontent"}}
    const [options, setOptions] = useState(defOptions);

    const ref = useRef(null);

    useEffect(() => {

        let typing = Object.entries(defOptions).map(([key, value]) => {
            if (key.toLowerCase().includes(input)) {
                return [key, value];
            }
            else {
                const e = value.filter(element => {
                    if (element.content.toLowerCase().includes(input)) {
                        return true;
                    }
                    return false;
                });
                if (e.length > 0) {
                    return [key, e];
                }
                return undefined;
            }
        }).filter(Boolean);

        const opt = {};
        for (let i = 0; i < typing.length; i++) {
            let key = typing[i][0];
            let arr = typing[i][1];
            for (let j = 0; j < arr.length; j++) {
                if (opt[key] !== undefined) {
                    opt[key] = [...opt[key], arr[j]];
                } else {
                    opt[key] = [arr[j]];
                }
            }
        }
        setOptions(opt);

    }, [input]);


    const removeOption = (key, option) => {
        if (defOptions[key] !== undefined) {
            defOptions[key] = defOptions[key].filter(opt => {
                return opt.key !== option.key;
            });
            const newOptions = { ...options };
            newOptions[key] = options[key].filter(opt => {
                return opt.key !== option.key;
            });
            setOptions(newOptions);
        }
    }

    const deleteChip = (key, delChip) => {
        const newChip = { ...chips };
        newChip[key] = chips[key].filter(chip => {
            return chip.key !== delChip.key
        });
        setChips(newChip);
        defOptions[key] = [...defOptions[key], delChip];
        const newOptions = { ...options };
        newOptions[key] = [...newOptions[key], delChip];
        setOptions(newOptions);
    }


    const addChip = (key, option) => {
        removeOption(key, option);

        let newChips = { ...chips };
        if (key in newChips) {
            newChips[key] = [...newChips[key], option];
        } else {
            newChips[key] = [option];
        }
        setChips(newChips);
        clearInput();
    }

    const addInput = (group, option) => {    // { group : {key:"somekey",content:"somecontent"}}
        setSingle({ group: option });
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
                    {
                        isMultiple
                            ?
                            <Chip defOptions={chips} deleteChip={deleteChip} />
                            :
                            <div>
                                <p>{single[Object.keys(single)[0]].content}</p>
                            </div>
                    }
                    <input type="text" placeholder={"search"} value={input} onChange={handleInput} />
                    <div className="arrow"></div>
                    {open && <div className="dropdown">
                        <RSC style={{ height: "120px" }}>
                            {
                                Object.entries(options).map(([key, value], i) =>
                                    <div className="group" key={key}>
                                        <p>{key}</p>
                                        {value.map(
                                            (option) => <div className="option" onClick={() => isMultiple ? addChip(key, option) : addInput(key, option)} key={option.key}><span>{option.content}</span></div>
                                        )}
                                    </div>
                                )
                            }
                        </RSC>
                    </div>}
                </form>
            </div >
        </div>
    );
}

export default Select;