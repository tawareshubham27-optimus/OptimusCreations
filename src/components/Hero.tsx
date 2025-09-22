import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, X } from "lucide-react";
import heroImage from "@/assets/hero-3d-printer.jpg";

import { useState } from "react";

const DEMO_VIDEO_URL = "http://drive.google.com/file/d/1fUNqfeD8yZhgRv8XeTr_z8bnjQ3zhwQc/view?usp=drivesdk"; // Example video URL

const Hero = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Precision 
            <span className="bg-gradient-to-r from-tech-cyan to-tech-purple bg-clip-text text-transparent">
              {" "}3D Printing{" "}
            </span>
            Services
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            From architectural models to custom gifts, we bring your ideas to life with 
            cutting-edge 3D printing technology and exceptional precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="group"
              onClick={() => navigate("/contact")}
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => setShowDemo(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
      {/* Demo Video Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full p-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowDemo(false)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="315"
                src={DEMO_VIDEO_URL}
                title="Demo Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/20">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80 text-sm">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">0.1mm</div>
              <div className="text-white/80 text-sm">Precision Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">24h</div>
              <div className="text-white/80 text-sm">Turnaround Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80 text-sm">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-tech-purple/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-tech-cyan/20 rounded-full blur-xl"></div>
    </section>
  );
};

export default Hero;