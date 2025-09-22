import { useState } from "react";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  Upload,
  MessageCircle,
  CheckCircle
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    projectType: "",
    timeline: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 9730299386",
      description: "Mon-Sun 9AM-9PM EST"
    },
    {
      icon: Mail,
      title: "Email", 
      details: "support@optimuscreations.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Pune - 413102",
      description: "Pune, Maharastra, India"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon-Sun: 9AM-9PM",
      description: "24*7 Support Available"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
        projectType: "",
        timeline: ""
      });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Ready to start your 3D printing project? We'd love to hear from you. 
            Get a free quote or ask any questions about our services.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours with a detailed quote.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectType">Project Type</Label>
                      <Input
                        id="projectType"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        placeholder="e.g., Architectural Model, Custom Gift"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        placeholder="When do you need this?"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project Details *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your project in detail. Include dimensions, materials, quantity, and any special requirements."
                      rows={6}
                      required
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label>Upload Files (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-smooth cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        <span className="text-primary">Click to upload</span> or drag and drop
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        STL, OBJ, PDF, JPG, PNG (Max 10MB)
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to reach us. Choose what works best for you.
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0 pb-0 space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{info.title}</div>
                      <div className="text-sm font-medium text-primary">{info.details}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>

              <CardContent className="px-0 pb-0 space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://wa.me/9730299386', '_blank')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Chat
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('support@optimuscreations.com', '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('tel:+91 9730299386', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <CardTitle className="text-lg">Quick Response Guarantee</CardTitle>
                </div>
                <CardDescription>
                  We typically respond to all inquiries within 2-4 hours during business hours. 
                  For urgent requests, please call us directly or use WhatsApp.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about our 3D printing services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">What file formats do you accept?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We accept STL, OBJ, 3MF, and most CAD file formats. If you're unsure, 
                just send us your files and we'll let you know.
              </p>

              <h3 className="font-semibold mb-2">How long does printing take?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Most projects are completed within 2-5 business days, depending on complexity 
                and size. Rush orders are available for an additional fee.
              </p>

              <h3 className="font-semibold mb-2">Do you offer design services?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Our team can help create 3D models from sketches, images, or detailed 
                specifications. Design services are quoted separately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">What materials do you use?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We offer PLA, ABS, PETG, and specialty materials including wood-fill, 
                metal-fill, and flexible filaments.
              </p>

              <h3 className="font-semibold mb-2">How much does it cost?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pricing depends on size, complexity, material, and quantity. Most small items 
                start at $5, architectural models typically range from $50-500.
              </p>

              <h3 className="font-semibold mb-2">Do you ship nationwide?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we ship anywhere in the US. Local pickup is also available at our facility. 
                Shipping costs are calculated based on size and destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default ContactPage;