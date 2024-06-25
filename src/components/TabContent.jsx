import { useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";

const TabContent = () => {
    const [updatedWords, setUpdatedWords] = useState([]);

    return (
        <div className="tab-content">
            <Home updatedWords={updatedWords}/>
            <AddWord setUpdatedWords={setUpdatedWords}/>
        </div>
    );
}
export default TabContent;