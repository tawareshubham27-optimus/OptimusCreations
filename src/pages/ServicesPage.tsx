import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Gift, 
  Clock, 
  Shield, 
  Palette, 
  Layers,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      category: "Architectural Models",
      icon: Building,
      description: "Professional architectural scale models for presentations and planning",
      features: [
        "Residential building models",
        "Commercial complex models", 
        "Landscape architectural models",
        "Interior design models",
        "Urban planning models"
      ],
      specifications: [
        "Scale: 1:100 to 1:500",
        "Materials: PLA, ABS, PETG",
        "Layer height: 0.1-0.3mm",
        "Post-processing available"
      ],
      pricing: "Starting at Rs 3000"
    },
    {
      category: "Custom Gifts & Keychains",
      icon: Gift,
      description: "Personalized 3D printed items perfect for any occasion",
      features: [
        "Personalized keychains",
        "Miniature figurines",
        "Corporate branded items",
        "Event commemoratives",
        "Educational models"
      ],
      specifications: [
        "Multiple color options",
        "Custom engraving available",
        "Bulk order discounts",
        "Fast turnaround times"
      ],
      pricing: "Starting at Rs 50"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Submit Request",
      description: "Upload your files or describe your project requirements"
    },
    {
      step: 2,
      title: "Quote & Timeline", 
      description: "Receive detailed quote with delivery timeline within 24 hours"
    },
    {
      step: 3,
      title: "Production",
      description: "Your item is printed with precision using state-of-the-art equipment"
    },
    {
      step: 4,
      title: "Quality Check",
      description: "Thorough quality inspection and finishing touches applied"
    },
    {
      step: 5,
      title: "Delivery",
      description: "Fast and secure delivery to your doorstep"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our 3D Printing
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Services</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            From architectural models to personalized gifts, we deliver precision 3D printing services 
            with exceptional quality and fast turnaround times.
          </p>
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => navigate("/contact")}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-1 gap-12">
            {services.map((service) => (
              <Card key={service.category} className="p-8 hover:shadow-card-hover transition-smooth">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-4 bg-primary/10 rounded-xl">
                        <service.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold">{service.category}</h3>
                        <p className="text-muted-foreground">{service.description}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4" />
                          What We Offer
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {service.features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-lg font-bold px-4 py-2">
                          {service.pricing}
                        </Badge>
                        <Button 
                          variant="default"
                          onClick={() => navigate("/contact")}
                        >
                          Request Quote
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Specifications
                      </h4>
                      <div className="space-y-2">
                        {service.specifications.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                      <div className="text-center">
                        <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">24h Quote</div>
                      </div>
                      <div className="text-center">
                        <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">Quality Assured</div>
                      </div>
                      <div className="text-center">
                        <Palette className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="text-sm font-medium">Custom Colors</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and efficient. Here's how we bring your ideas to life.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            {processSteps.map((item, index) => (
              <div key={item.step} className="text-center relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-primary to-accent transform translate-x-4"></div>
                )}
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default ServicesPage;
