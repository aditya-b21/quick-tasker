import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Home } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // IMMEDIATE synchronous check of localStorage (no async needed)
    const adminToken = localStorage.getItem("admin_token");
    const adminEmail = localStorage.getItem("admin_email");
    
    if (adminToken === "authenticated" && adminEmail === "adityabarod807@gmail.com") {
      // Authenticated via localStorage - set immediately
      setIsAdmin(true);
      
      // Optionally try Supabase in background for database features
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user.email === "adityabarod807@gmail.com") {
          // Try to add to admin_users table
          supabase
            .from("admin_users")
            .select("id")
            .eq("user_id", session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (!data) {
                supabase
                  .from("admin_users")
                  .insert([{ user_id: session.user.id }])
                  .catch(() => {});
              }
            });
        }
      });
      return; // Exit early - authenticated
    }

    // If no localStorage, check Supabase
    const checkSupabase = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user.email === "adityabarod807@gmail.com") {
          // Try to add user to admin_users table if not exists
      const { data } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!data) {
            await supabase
              .from("admin_users")
              .insert([{ user_id: session.user.id }])
              .catch(() => {});
      }

      setIsAdmin(true);
          return;
        }
      } catch (error) {
        console.log("Supabase check failed");
      }

      // No valid auth found - redirect to auth page
      setIsAdmin(false);
      navigate("/auth");
    };

    checkSupabase();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    navigate("/auth");
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (isAdmin === false) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              View Site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
