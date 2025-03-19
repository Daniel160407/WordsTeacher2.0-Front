import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import "../style/Footer.scss";
import PricingTable from "./freemius/PricingTable";
import DangerZone from "./DangerZone";
import LanguageList from "./model/LanguageList";
import AddLanguage from "./forms/AddLanguage";
import getAxiosInstance from "./util/GetAxiosInstance";

const Footer = ({ setUpdatedWords, setLanguageId }) => {
  const [languages, setLanguages] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  useEffect(() => {
    setIsBlocked(Cookies.get("plan") === "free");
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await getAxiosInstance(
        `/language?userid=${Cookies.get("userId")}`,
        "get"
      );
      setLanguages(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response?.status === 403) {
      setIsBlocked(true);
      setBlockMessage(
        error.response.data.message ||
          "This feature requires a premium subscription"
      );

      if (!Cookies.get('plan')){
        Cookies.set("plan", "free", { expires: 7 });
      }
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
      <AddLanguage
        isBlocked={isBlocked}
        blockMessage={blockMessage}
        fetchLanguages={fetchLanguages}
      />
      <DangerZone />
      {Cookies.get("plan") === "free" && <PricingTable />}
    </div>
  );
};

export default Footer;
