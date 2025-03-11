import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BlockedFeature from "../uiComponents/BlockedFeature";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddLanguage = ({ isBlocked, blockMessage, fetchLanguages }) => {
    const [newLanguage, setNewLanguage] = useState("");

    const addLanguage = () => {
        if (isBlocked || !newLanguage.trim()) return;

        axios
            .post(
                `${API_BASE_URL}/language`,
                { language: newLanguage, userId: Cookies.get("userId") },
                {
                    headers: { Authorization: `${Cookies.get("token") || ""}` },
                }
            )
            .then(() => {
                setNewLanguage("");
                fetchLanguages();
            })
            .catch((error) => console.error("Failed to add language:", error));
    };

    return (
        <div className={`add-language ${isBlocked ? "blocked" : ""}`}>
            {isBlocked && <BlockedFeature blockMessage={blockMessage} />}
            <h3>Add new language</h3>
            <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                placeholder="Enter language"
                disabled={isBlocked}
            />
            <button onClick={addLanguage} className="add-button" disabled={isBlocked}>
                Add
            </button>
        </div>
    );
};

export default AddLanguage;
