import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Tournaments from "@/components/Tournaments";
import Coaching from "@/components/Coaching";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Tournaments />
      <Coaching />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
