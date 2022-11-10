import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Wrapper from './components/wrapper';
import { routesPaths } from './constans/routesPathes';
import DocumentScan from './pages/documentScan';
import DocumentFields from './pages/documentsFields';
import ErrorPhotoResultPage from './pages/errorPhotoResultPage';
import ErrorPhotoResultRepeatPage from './pages/errorPhotoResultRepeatPage';
import IncorrectDataErrorPage from './pages/incorrectDataErrorPage';
import Login from './pages/login';
import ScanResultErrorPage from './pages/scanResultErrorPage';
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
          <Route path={routesPaths.documentFields} element={<DocumentFields />} />
          <Route path={routesPaths.documentScan} element={<DocumentScan />} />
          <Route path={routesPaths.incorrectData} element={<IncorrectDataErrorPage />} />
          <Route path={routesPaths.errorPhotoResult} element={<ErrorPhotoResultPage />} />
          <Route path={routesPaths.scanError} element={<ScanResultErrorPage />} />
          <Route
            path={routesPaths.repeatErrorPhotoResult}
            element={<ErrorPhotoResultRepeatPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
