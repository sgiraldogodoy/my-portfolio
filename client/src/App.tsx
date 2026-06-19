import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import TechStack from "./components/TechStack";
import Projects from "./components/Projects";
import Papers from "./components/Papers";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Papers />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
