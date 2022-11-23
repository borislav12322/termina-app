import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Wrapper from './components/wrapper';
import { routesPaths } from './constans/routesPathes';
import CardTookAway from './pages/cardTookAway';
import DocumentScan from './pages/documentScan';
import DocumentFields from './pages/documentsFields';
import EmptyBin from './pages/emptyBin';
import EmptyPassportField from './pages/emptyPassportField';
import ErrorPhotoResultPage from './pages/errorPhotoResultPage';
import ErrorPhotoResultRepeatPage from './pages/errorPhotoResultRepeatPage';
import FoundFace from './pages/foundFace';
import IncorrectDataErrorPage from './pages/incorrectDataErrorPage';
import Login from './pages/login';
import PassNotFound from './pages/passNotFound';
import PassSuccess from './pages/passSuccess';
import PhoneError from './pages/phoneError';
import PhoneNumber from './pages/phoneNumber';
import ScanResultErrorPage from './pages/scanResultErrorPage';
import SearchChosen from './pages/searchChosen';
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
          <Route path={routesPaths.passNotFound} element={<PassNotFound />} />
          <Route path={routesPaths.cardTakeAway} element={<CardTookAway />} />
          <Route path={routesPaths.foundFace} element={<FoundFace />} />
          <Route path={routesPaths.searchChosen} element={<SearchChosen />} />
          <Route path={routesPaths.emptyPassport} element={<EmptyPassportField />} />
          <Route path={routesPaths.emptyBin} element={<EmptyBin />} />
          <Route path={routesPaths.phoneError} element={<PhoneError />} />
          <Route path={routesPaths.phoneNumber} element={<PhoneNumber />} />
          <Route path={routesPaths.documentFields} element={<DocumentFields />} />
          <Route path={routesPaths.documentScan} element={<DocumentScan />} />
          <Route path={routesPaths.incorrectData} element={<IncorrectDataErrorPage />} />
          <Route path={routesPaths.errorPhotoResult} element={<ErrorPhotoResultPage />} />
          <Route path={routesPaths.scanError} element={<ScanResultErrorPage />} />
          <Route path={routesPaths.passSuccess} element={<PassSuccess />} />
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
