import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Award, 
  Clock, 
  Shield,
  CheckCircle,
  Quote
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();
  const stats = [
    { number: "500+", label: "Projects Completed", icon: Award },
    { number: "5+", label: "Years Experience", icon: Clock },
    { number: "98%", label: "Client Satisfaction", icon: Users },
    { number: "24h", label: "Response Time", icon: Shield }
  ];

  const values = [
    {
      title: "Precision & Quality",
      description: "Every print meets the highest standards with 0.1mm precision and rigorous quality control.",
      icon: Award
    },
    {
      title: "Customer Focus",
      description: "Your satisfaction is our priority. We work closely with you from concept to completion.",
      icon: Users
    },
    {
      title: "Innovation",
      description: "Using cutting-edge technology and materials to bring your most complex ideas to life.",
      icon: Shield
    },
    {
      title: "Reliability",
      description: "Consistent delivery times and dependable service you can count on for every project.",
      icon: Clock
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Architect",
      content: "Print3D Pro helped us create stunning architectural models for our client presentations. The attention to detail and quality is exceptional.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      content: "Fast turnaround and excellent communication throughout the process. Our prototypes were perfect for investor presentations.",
      rating: 5
    },
    {
      name: "Emily Davis", 
      role: "Event Planner",
      content: "The custom keychains for our corporate event were a huge hit! Professional service from start to finish.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About 
              <span className="bg-gradient-primary bg-clip-text text-transparent"> OptimusCreations</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're passionate about transforming digital designs into precise physical objects. 
              With years of experience and state-of-the-art technology, we deliver exceptional 
              3D printing services for professionals and businesses.
            </p>
            <Button 
              variant="hero" 
              size="lg" 
              onClick={() => {
                navigate("/contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            > 
              Start Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2025, OptimusCreations emerged from a simple vision: to make high-quality 
                  3D printing accessible to architects, designers, and businesses who demand precision 
                  and reliability.
                </p>
                <p>
                  What started as a small workshop has grown into a trusted partner for hundreds of 
                  clients across various industries. We've printed everything from detailed architectural 
                  scale models for major developments to personalized gifts that create lasting memories.
                </p>
                <p>
                  Today, we continue to invest in the latest printing technology and materials, 
                  ensuring that every project we undertake meets the highest standards of quality 
                  and precision.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge variant="secondary">ISO 9001 Certified</Badge>
                <Badge variant="secondary">Eco-Friendly Materials</Badge>
                <Badge variant="secondary">24/7 Support</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg"></div>
                <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg"></div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-video bg-gradient-to-br from-tech-purple/20 to-tech-cyan/20 rounded-lg"></div>
                <div className="aspect-square bg-gradient-to-br from-warm-orange/20 to-primary/20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do and ensure exceptional results for every client.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-card-hover transition-smooth">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-card-hover transition-smooth">
                <CardContent className="pt-0">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Bring Your Ideas to Life?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trust Print3D Pro for their 3D printing needs. 
            Get your quote today and experience the difference quality makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => {
                navigate("/contact");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Get Free Quote
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              onClick={() => {
                navigate("/catalog");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              View Our Work
            </Button>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default AboutPage;