import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Linkedin, Twitter, Instagram, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/in/sujitpradhan" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com/sujitpradhan23" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com/sujitpradhan23" },
    { icon: Mail, label: "Email", href: "mailto:hello@sujitpradhan.com" },
  ];

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "adityabarod807@gmail.com" && password === "Aditya7321@") {
      // Always set localStorage first as primary auth method
      localStorage.setItem("admin_token", "authenticated");
      localStorage.setItem("admin_email", "adityabarod807@gmail.com");
      
      // Try Supabase auth in background (optional)
      try {
        await supabase.auth.signInWithPassword({
          email: "adityabarod807@gmail.com",
          password: "Aditya7321@",
        }).catch(async () => {
          // If sign in fails, try sign up
          await supabase.auth.signUp({
            email: "adityabarod807@gmail.com",
            password: "Aditya7321@",
          });
        });
      } catch (error) {
        // Ignore Supabase errors, use localStorage
        console.log("Supabase auth optional, using localStorage");
      }

      setIsAdminOpen(false);
      
      // Ensure localStorage is set before navigation
      localStorage.setItem("admin_token", "authenticated");
      localStorage.setItem("admin_email", "adityabarod807@gmail.com");
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin panel",
      });
      
      // Navigate immediately - localStorage is already set above
      navigate("/admin");
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your email and password",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="section-title text-foreground mb-6">Let's Create Together</h2>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Whether you're looking for a design partner, a mentor, or just want to chat about the future of AI and design—
          I'm always excited to connect with passionate people.
        </p>
        
        <a href="mailto:hello@sujitpradhan.com">
          <Button
            size="lg"
            className="mb-12 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <Mail className="w-5 h-5 mr-2" />
            Say Hello
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </a>

        <div className="flex items-center justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-full bg-secondary hover:bg-primary/20 text-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              title={link.label}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border/50">
          <div className="flex items-center justify-center gap-3">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Aditya Barod. Crafted with chai and conviction.
          </p>
            <button
              onClick={() => setIsAdminOpen(true)}
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-all duration-300"
              title="Admin Login"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Login</DialogTitle>
              <DialogDescription>
                Enter your credentials to access the admin panel
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdminLogin} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ContactSection;
