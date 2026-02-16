import { Home, Monitor, BookOpen, Instagram, User, Zap, FileText } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { icon: Home, href: "#home", label: "Home" },
    { icon: Monitor, href: "#work", label: "Work" },
    { icon: BookOpen, href: "#projects", label: "Projects" },
    { icon: Instagram, href: "https://instagram.com/sujitpradhan23", label: "Instagram" },
    { icon: User, href: "#journey", label: "About" },
    { icon: Zap, href: "#journey", label: "Journey" },
    { icon: FileText, href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="nav-pill">
        <div className="flex items-center gap-2 pr-4 border-r border-border/50">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-primary-foreground" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-foreground">Aditya Barod</span>
        </div>
        <div className="h-5 w-px bg-border/50" />
        <div className="flex items-center gap-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
