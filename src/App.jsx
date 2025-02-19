import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import TabContent from './components/TabContent';
import Cookies from 'js-cookie';
import Login from './components/Login';
import Footer from './components/Footer';

const App = () => {
  const [loadLoginForm, setLoadLoginForm] = useState(true);
  const [languageId, setLanguageId] = useState(null);
  const [updatedLanguageWords, setUpdatedLanguageWords] = useState([]);

  useEffect(() => {
    if (Cookies.get('token') !== undefined) {
      setLoadLoginForm(false);
    }
  }, []);

  return (
    <>
      {loadLoginForm ? (
        <Login setLoadLogInForm={setLoadLoginForm}/>
      ) : (
        <>
          <Navbar />
          <TabContent updatedLanguageWords={updatedLanguageWords} languageId={languageId}/>
          <Footer setUpdatedWords={setUpdatedLanguageWords} setLanguageId={setLanguageId}/>
        </>
      )}
    </>
  );
};

export default App;