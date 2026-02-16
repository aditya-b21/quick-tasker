import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import VideoEmbed from "@/components/admin/VideoEmbed";

interface ContentItem {
  id: string;
  title: string;
  embed_url: string | null;
  image_url: string | null;
}

const ExtendedProjects = () => {
  const { data: content = [], isLoading } = useQuery({
    queryKey: ["content", "short_form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", "short_form")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
  });

  return (
    <section id="projects" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title text-foreground mb-4">My work</h2>
        <p className="text-muted-foreground text-lg font-semibold mb-6">SHORT FORM CONTENT</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading content...</p>
        </div>
      ) : content.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No content available yet.</p>
        </div>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.map((item) => (
            <div key={item.id} className="project-card group block">
            <div className="aspect-square overflow-hidden">
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
            <div className="p-5">
              <h3 className="text-lg font-bold text-foreground mb-2 font-serif">
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

export default ExtendedProjects;
