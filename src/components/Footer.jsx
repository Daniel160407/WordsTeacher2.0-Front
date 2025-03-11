import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "../style/Footer.scss";
import PricingTable from "./freemius/PricingTable";
import DangerZone from "./DangerZone";
import LanguageList from "./model/LanguageList";
import AddLanguage from "./forms/AddLanguage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Footer = ({ setUpdatedWords, setLanguageId }) => {
    const [languages, setLanguages] = useState([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockMessage, setBlockMessage] = useState("");

    useEffect(() => {
        setIsBlocked(Cookies.get("plan") === "free");
        fetchLanguages();
    }, []);

    const fetchLanguages = () => {
        axios
            .get(`${API_BASE_URL}/language?userid=${Cookies.get("userId")}`, {
                headers: { Authorization: `${Cookies.get("token") || ""}` },
            })
            .then((response) => setLanguages(response.data))
            .catch(handleApiError);
    };

    const handleApiError = (error) => {
        if (error.response?.status === 403) {
            setIsBlocked(true);
            setBlockMessage(error.response.data.message || "This feature requires a premium subscription");
            Cookies.set("plan", "free", { expires: 365 });
        }
        console.error("API Error:", error);
    };

    return (
        <div className="footer">
            <h3 className="footer-heading">Your languages</h3>
            <LanguageList
                languages={languages}
                isBlocked={isBlocked}
                setUpdatedWords={setUpdatedWords}
                setLanguageId={setLanguageId}
                fetchLanguages={fetchLanguages}
            />
            <AddLanguage isBlocked={isBlocked} blockMessage={blockMessage} fetchLanguages={fetchLanguages} />
            <DangerZone />
            {Cookies.get("plan") === "free" && <PricingTable />}
        </div>
    );
};

export default Footer;
