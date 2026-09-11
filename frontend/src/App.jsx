import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Notes />
                </>
              </ProtectedRoute>
            }
          />

          
          <Route path="/" element={<Navigate to="/notes" replace />} />

          
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
