import { useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";
import Tests from "./Tests";
import Dictionary from "./Dictionary";

const TabContent = () => {
    const [updatedWords, setUpdatedWords] = useState([]);
    const [updatedDictionaryWords, setUpdatedDictionaryWords] = useState([]);

    return (
        <div className="tab-content">
            <Home updatedWords={updatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords}/>
            <AddWord setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords}/>
            <Tests/>
            <Dictionary updatedWords={updatedDictionaryWords}/>
        </div>
    );
}
export default TabContent;