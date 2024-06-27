import { useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";
import Tests from "./Tests";

const TabContent = () => {
    const [updatedWords, setUpdatedWords] = useState([]);

    return (
        <div className="tab-content">
            <Home updatedWords={updatedWords}/>
            <AddWord setUpdatedWords={setUpdatedWords}/>
            <Tests/>
        </div>
    );
}
export default TabContent;