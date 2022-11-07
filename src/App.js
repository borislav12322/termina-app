import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {routesPaths} from "./constans/routesPathes";
import Wrapper from "./components/wrapper";
import Login from "./pages/login";
import ShareData from "./pages/shareData";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path={routesPaths.login}
                       element={
                           <Login/>
                       }
                />


                <Route path="/"
                       element={
                           <Navigate to={routesPaths.login}/>
                       }
                />

                <Route path="/" element={<Wrapper/>}>

                    <Route
                        path={routesPaths.shareData}
                        element={
                            <ShareData/>
                        }
                    />


                </Route>

            </Routes>
        </BrowserRouter>

    );
}

export default App;
