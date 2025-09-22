import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const phoneNumber = "+1234567890"; // Replace with actual WhatsApp number
  const message = "Hi! I'm interested in your 3D printing services. Could you please provide more information?";
  
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant="cta"
      size="lg"
      className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-glow hover:scale-110 transition-spring"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};

export default WhatsAppButton;