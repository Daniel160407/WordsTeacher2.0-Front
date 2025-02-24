import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Documentation from './components/Documentation';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<App/>} />
                <Route path='/documentation' element={<Documentation/>} />
            </Routes>
        </Router>
    );
}

export default AppRouter;
