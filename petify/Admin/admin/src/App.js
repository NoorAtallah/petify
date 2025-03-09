import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AdminLogin from './components/adminlogin';
import AdminDashboard from './components/dashboard';
function App() {
  return (
    <Router>
      <div className="App">
        
        
        <Routes>
         <Route path="/" element={<AdminLogin />} />
         <Route path="dashboard" element={<AdminDashboard />} />


        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
