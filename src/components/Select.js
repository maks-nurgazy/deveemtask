import { useState, useRef, useEffect } from 'react';
import RSC from "react-scrollbars-custom";
import Chip from './Chip';
import useToggleState from '../hooks/useToggleState';
import useInputState from '../hooks/useInputState';
import './Select.css';


let defOptions;

Select.defaultProps = {
    isMultiple: false,
}

function Select({ isMultiple, selections, height }) {
    const [open, toggleOpen] = useToggleState(false);
    const [toggleclass, setToggleclass] = useToggleState(false);
    const [input, handleInput, clearInput] = useInputState("");
    const [chips, setChips] = useState({});
    const [single, setSingle] = useState({ group: { content: "", key: "" } });
    const [options, setOptions] = useState(selections);
    defOptions = selections;

    const ref = useRef(null);

    useEffect(() => {
        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        }
    }, []);

    useEffect(() => {

        let typing = Object.entries(defOptions).map(([key, value]) => {
            if (key.toLowerCase().includes(input.toLowerCase())) {
                return [key, value];
            }
            else {
                const e = value.filter(element => {
                    if (element.content.toLowerCase().includes(input.toLowerCase())) {
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
        if (newOptions[key] === undefined) {
            newOptions[key] = [];
            newOptions[key] = [...newOptions[key], delChip];
        } else {
            newOptions[key] = [...newOptions[key], delChip];
        }
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

        const size = Object.keys(options).length;
        if (size === 1) {
            const key = Object.keys(options)[0];
            const option = options[key][0];

            isMultiple ? addChip(key, option) : addInput(key, option);
            clearInput("");
        }

    }

    const handleClickOutside = (e) => {
        if (ref.current && ref.current.contains(e.target)) {
            toggleOpen(true);
        }
        else if (ref.current && !ref.current.contains(e.target)) {
            toggleOpen(false);
            setToggleclass(false);
        }
    }


    return (
        <div className="page-container">
            <div className="dropdown-container">
                <form className="search" ref={ref} onSubmit={handleSubmit} onClick={() => setToggleclass(true)}>
                    {
                        isMultiple
                            ?
                            <>
                                <Chip defOptions={chips} deleteChip={deleteChip} />
                                <input className="search-input" type="text" placeholder={"search"} value={input} onChange={handleInput} />
                            </>
                            :
                            <div className="single">
                                <p>{(single[Object.keys(single)[0]].content) ? single[Object.keys(single)[0]].content : "select"}</p>
                                <input className={`single-input ${toggleclass ? "show" : "hide"}`} type="text" placeholder={"search"} value={input} onChange={handleInput} />
                            </div>
                    }
                    <div className="arrow"></div>
                    {open && <div className="dropdown">
                        <RSC style={{ height: height }}>
                            {
                                Object.entries(options).map(([key, value], i) =>
                                    <div className="some" key={key}>
                                        <div className="group"><p>{key}</p></div>
                                        {value.map(
                                            (option) => <div className="option" onClick={() => isMultiple ? addChip(key, option) : addInput(key, option)} key={option.key}><span>{option.content}</span></div>
                                        )}
                                    </div>
                                )
                            }
                        </RSC>
                    </div>
                    }
                </form>
            </div>
        </div>
    );
}

export default Select;