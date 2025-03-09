import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './componants/header';
import Home from './pages/home';
import { Foot } from './componants/footer';
import FootprintsTrail from './componants/FootprintsTrail';
import Login from './componants/login';
import ProductPage from './componants/shop';
import ContactUs from './componants/contactus';
import ProductDetails from './componants/product';
import Signup from './componants/signup';
import Example from './componants/trans';
import VetSignup from './componants/vet-login';
import CatInfo from './componants/CatInfo';
import Profile from './componants/profile';
import Chat from './componants/chat';
import Booking from './componants/schedule';
import PostPet from './componants/postpet';
import ViewPets from './componants/adopt';
import PetDetails from './componants/petdetails';
import VetDashboard from './componants/vetDashboard';
import SubscriptionPayment from './componants/subscription';
import Help from './componants/help';
import AdminLogin from './adminDashboared/adminLogin';
import Blog from './componants/blog';
import BlogDetail from './componants/blogdetails';
import SymptomCheckerForm from './componants/symptom';
import ChatSuppert from './componants/supportchat';
import AboutUs from './componants/aboutus';
import VetList from './componants/vetList';
import PetAdoptionForm from './componants/matchPets';
import ScrollToTop from './componants/scrolltotop';
function AppContent() {
  const location = useLocation();
  const isVetDashboard = location.pathname === '/vet-dashboard';

  return (
    <div className="App">
      {!isVetDashboard && <Header />}
      {/* <ChatSuppert /> */}
      <ScrollToTop />
      <FootprintsTrail />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shop" element={<ProductPage />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/product" element={<ProductDetails />} />
        <Route path="/trans" element={<Example />} />
        <Route path="/vet-login" element={<VetSignup />} />
        <Route path="/CatInfo" element={<CatInfo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/schedule" element={<Booking />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/post" element={<PostPet />} />
        <Route path="/view" element={<ViewPets />} />
        <Route path="/adopt/pet/:id" element={<PetDetails />} />
        <Route path="/vet-dashboard" element={<VetDashboard />} />
        <Route path="/subscription" element={<SubscriptionPayment />} />
        <Route path="/help" element={<Help />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/symptom-checker" element={<SymptomCheckerForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/vets" element={<VetList />} />
        <Route path="/match" element={<PetAdoptionForm />} />
        <Route path="/admin/adminlogin" element={<AdminLogin />} />
      </Routes>
      {!isVetDashboard && <Foot />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;