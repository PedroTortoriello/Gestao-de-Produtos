import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Loader } from 'lucide-react';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Produtos from './pages/Dashboard/Produtos';


function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Interview T-Alpha" />
              <SignIn />
            </>
          }
        />
        <Route 
          path="/Dashboard/Produtos"
          element={
            <>
              <PageTitle title="Interview T-Alpha" />
              <Produtos />
            </>
          }
        />

        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Interview T-Alpha" />
              <SignIn />
            </>
          }
        />
        
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Interview T-Alpha" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
