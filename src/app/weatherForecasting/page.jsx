import ContactUs from "@/components/contact/ContactUs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Partners from "@/components/Partners";
import CropPlanning from "@/components/cropSowing/CropPlanning";
import Planning from "../../components/cropSowing/Planning";
import HeaderContext from "@/components/contact/HeaderContext";
const cropSowing = () => {
  return (
    <>
      <HeaderContext />
      <Header />
      <CropPlanning />
      {/* <Planning /> */}
      <Partners />
      <ContactUs />
      <Footer />
    </>
  );
};
export default cropSowing;
