import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Wrapper from './components/wrapper';
import { routesPaths } from './constans/routesPathes';
import Login from './pages/login';
import ShareData from './pages/shareData';
import TakePhoto from './pages/take-photo';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routesPaths.login} element={<Login />} />

        <Route path="/" element={<Navigate to={routesPaths.login} />} />

        <Route path="/" element={<Wrapper />}>
          <Route path={routesPaths.shareData} element={<ShareData />} />

          <Route path={routesPaths.takePhoto} element={<TakePhoto />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
