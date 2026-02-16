import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VideoEmbed from "@/components/admin/VideoEmbed";

interface ContentItem {
  id: string;
  title: string;
  embed_url: string | null;
  image_url: string | null;
}

const FeaturedProjects = () => {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", "long_form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "long_form")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
  });

  return (
    <section id="work" className="py-32 md:py-40 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-4">
        <h2 className="section-title text-foreground mb-4">My work</h2>
        <p className="text-muted-foreground text-lg font-semibold mb-6">LONG FORM</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 mt-16">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12 mt-16">
          <p className="text-muted-foreground">No content available yet.</p>
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {content.map((item) => (
            <div key={item.id} className="project-card group block">
            <div className="aspect-[4/3] overflow-hidden">
                {item.embed_url ? (
                  <VideoEmbed url={item.embed_url} title={item.title} />
                ) : item.image_url ? (
              <img
                    src={item.image_url}
                    alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">No preview</p>
                  </div>
                )}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-3 font-serif">
                  {item.title}
              </h3>
              </div>
            </div>
        ))}
      </div>
      )}
    </section>
  );
};

export default FeaturedProjects;
