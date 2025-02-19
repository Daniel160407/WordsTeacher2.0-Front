import { useEffect, useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";
import Tests from "./Tests";
import Dictionary from "./Dictionary";

const TabContent = ({updatedLanguageWords, languageId}) => {
    const [updatedWords, setUpdatedWords] = useState([]);
    const [updatedDictionaryWords, setUpdatedDictionaryWords] = useState([]);

    useEffect(() => {
        setUpdatedWords(updatedLanguageWords);
    }, [updatedLanguageWords]);

    return (
        <div className="tab-content">
            <Home updatedWords={updatedWords} setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords} languageId={languageId}/>
            <AddWord setUpdatedWords={setUpdatedWords} setUpdatedDictionaryWords={setUpdatedDictionaryWords}/>
            <Tests updatedWords={updatedWords} newLanguageId={languageId}/>
            <Dictionary updatedWords={updatedDictionaryWords} langueageId={languageId}/>
        </div>
    );
}
export default TabContent;