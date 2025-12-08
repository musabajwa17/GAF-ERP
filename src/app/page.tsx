import Header from "../components/Header";
import HeaderContext from "../components/contact/HeaderContext";
import HeroSection from "../components/HeroSection";
import Solutions from "../components/Solutions";
import Working from "../components/work/Working";
import AboutErp from "../components/AboutErp";
import ContactUs from "../components/contact/ContactUs";
import Footer from "../components/Footer";
import EmpoweringFarmsCards from "../components/cards/EmpoweringFarmCards";
import Partners from "../components/Partners";
import ProtectedPage from "@/components/contact/ProtectedPage/AuthorizedPage";
import GuestRoute from "@/components/contact/ProtectedPage/GuestRoute";
export default function Home() {
  return (
    <div>
      <GuestRoute>
        
      <HeaderContext />
      <Header />
      <HeroSection />
      <Solutions />
      <Partners />
      <EmpoweringFarmsCards />
      <Working />
      <AboutErp />
      <ContactUs />
      <Footer />
      </GuestRoute>
    </div>
  );
}
