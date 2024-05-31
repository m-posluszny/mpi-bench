import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainView} from "../Views/Main";
import { AuthProvider } from "../Auth/Auth.hook";
import { LoginView} from "../Views/Login";
import { PrivateRoute } from "../Misc/PrivateRoute.component"
import { Container } from "../Static/Container.component";


function App() {
  return (
    <Container>
      <BrowserRouter>
        <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginView />} />
                <Route
                path="/"
                element={
                  <PrivateRoute>
                    <MainView />
                  </PrivateRoute>
                }
              />
            </Routes>
        </AuthProvider>
    </BrowserRouter>
  </Container>
  );
}

export default App;
