import { useEffect, useState } from "react";
import AddWord from "./AddWord";
import Home from "./Home";
import Tests from "./Tests";
import Dictionary from "./Dictionary";
import Statistics from "./Statistics";
import getAxiosInstance from "./util/GetAxiosInstance";
import Cookies from "js-cookie";

const TabContent = ({ updatedLanguageWords, languageId }) => {
  const [updatedWords, setUpdatedWords] = useState([]);
  const [updatedDictionaryWords, setUpdatedDictionaryWords] = useState([]);
  const [updatedStatistics, setUpdatedStatistics] = useState(null);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [advancement, setAdvancement] = useState("");

  useEffect(() => {
    setUpdatedWords(updatedLanguageWords);

    const fetchData = async () => {
      const dictionaryResponse = await getAxiosInstance(
        `/wordsTeacher/dictionary?type=all&userid=${Cookies.get(
          "userId"
        )}&languageid=${Cookies.get("languageId")}&tests=${false}`,
        "get"
      );
      const statisticsResponse = await getAxiosInstance(
        `/statistics?userid=${Cookies.get("userId")}&languageid=${Cookies.get(
          "languageId"
        )}`,
        "get"
      );
      setUpdatedDictionaryWords(dictionaryResponse.data);
      setUpdatedStatistics(statisticsResponse.data);
    };
    fetchData();
  }, [updatedLanguageWords]);

  return (
    <div className="tab-content">
      <Home
        updatedWords={updatedWords}
        setUpdatedWords={setUpdatedWords}
        setUpdatedDictionaryWords={setUpdatedDictionaryWords}
        dayStreakAdvancement={advancement}
        languageId={languageId}
      />
      <AddWord
        setUpdatedWords={setUpdatedWords}
        setUpdatedDictionaryWords={setUpdatedDictionaryWords}
      />
      <Tests updatedWords={updatedWords} newLanguageId={languageId} />
      <Dictionary
        setDictionaryWords={setDictionaryWords}
        updatedWords={updatedDictionaryWords}
        langueageId={languageId}
      />
      <Statistics
        dictionaryWords={dictionaryWords}
        setAdvancement={setAdvancement}
        updatedStatistics={updatedStatistics}
      />
    </div>
  );
};
export default TabContent;
