import { useRef } from 'react';
import './App.css';
import Select from './components/Select';

let defOptions = {
  meeting: [
    { content: "Hello world", key: "hello" },
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


function App() {

  return (
    <div className="App" >
      <h1>I didn't have time for [css and optimization] because of my exams</h1>
      <Select isMultiple={true} selections={defOptions} height="240px" />
    </div>
  );
}

export default App;
