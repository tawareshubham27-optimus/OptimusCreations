import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Gift, ArrowRight } from "lucide-react";
import architecturalModel from "@/assets/architectural-model.jpg";
import customGifts from "@/assets/custom-gifts.jpg";

const Services = () => {
  const services = [
    {
      icon: Building,
      title: "Architectural Model Printing",
      description: "Detailed scale models for architects, developers, and designers. Perfect for presentations and planning.",
      image: architecturalModel,
      features: [
        "Scale models from 1:100 to 1:500",
        "Multi-material printing options", 
        "Professional finishing",
        "Fast turnaround times"
      ]
    },
    {
      icon: Gift,
      title: "Customized 3D Gifts",
      description: "Personalized keychains, miniatures, and unique gifts for any occasion. Make every gift special.",
      image: customGifts,
      features: [
        "Personalized designs",
        "Multiple color options",
        "Bulk order discounts",
        "Corporate branding available"
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We specialize in two main areas of 3D printing, delivering exceptional quality and precision in every project.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <Card key={service.title} className="group hover:shadow-card-hover transition-smooth bg-gradient-card border-border/50">
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Button variant="default" className="w-full group">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;