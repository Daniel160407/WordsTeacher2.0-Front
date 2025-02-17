import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import TabContent from './components/TabContent';
import Cookies from 'js-cookie';
import Login from './components/Login';

const App = () => {
  const [loadLoginForm, setLoadLoginForm] = useState(true);

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
          <TabContent />
        </>
      )}
    </>
  );
};

export default App;