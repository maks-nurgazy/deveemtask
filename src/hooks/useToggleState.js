import { useState } from 'react';

function useToggle(initialValue = false) {
    const [state, setState] = useState(initialValue);
    const toggle = (st) => {
        if (st !== undefined) {
            setState(st);
        }
        else {
            setState(!state);
        }
    };
    return [state, toggle];
}

export default useToggle;