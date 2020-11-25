import { useState } from 'react';

function useToggle(initialValue = false) {
    const [state, setState] = useState(initialValue);
    const handleChange = (event) => {
        setState(event.target.value);
    };
    const clearState = () => {
        setState("");
    }
    return [state, handleChange, clearState, setState];
}

export default useToggle;