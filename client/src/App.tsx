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
import { BackendStatusProvider } from "./lib/backendStatus";

export default function App() {
  return (
    <BackendStatusProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Experience />
          <Papers />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </BackendStatusProvider>
  );
}
