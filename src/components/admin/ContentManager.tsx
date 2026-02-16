import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus, Video, Image, Edit2, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import VideoEmbed from "@/components/admin/VideoEmbed";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type ContentType = "short_form" | "long_form" | "hero";

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  embed_url: string | null;
  image_url: string | null;
  display_order: number;
}

const ContentManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ContentType>("hero");
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const { data: content = [], isLoading } = useQuery({
    queryKey: ["admin-content", activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content")
        .select("*")
        .eq("type", activeTab)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as ContentItem[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: { type: ContentType; title: string; embed_url?: string; image_url?: string; display_order: number }) => {
      const { error } = await supabase.from("content").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      setNewTitle("");
      setNewUrl("");
      setPreviewUrl("");
      toast({ title: "Content added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error adding content", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentItem> }) => {
      const { error } = await supabase.from("content").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      setEditingId(null);
      setEditTitle("");
      setEditUrl("");
      toast({ title: "Content updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error updating content", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content"] });
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast({ title: "Content deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting content", description: error.message, variant: "destructive" });
    },
  });

  const handleAddContent = () => {
    if (!newTitle.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    if (activeTab === "hero") {
      if (!newUrl.trim() && !previewUrl) {
        toast({ title: "Please upload an image/video or enter a URL", variant: "destructive" });
        return;
      }
    } else {
      if (!newUrl.trim()) {
        toast({ title: "Please enter a video URL", variant: "destructive" });
        return;
      }
    }

    addMutation.mutate({
      type: activeTab,
      title: newTitle,
      embed_url: newUrl || undefined,
      image_url: previewUrl || undefined,
      display_order: content.length,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);
    setPreviewUrl(publicUrl.publicUrl);
    setUploading(false);
    toast({ title: "File uploaded successfully" });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file);

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);
    setNewUrl(publicUrl.publicUrl);
    setUploading(false);
    toast({ title: "Video uploaded successfully" });
  };

  const startEdit = (item: ContentItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.embed_url || item.image_url || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editTitle.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }

    updateMutation.mutate({
      id: editingId,
      data: {
        title: editTitle,
        embed_url: editUrl || null,
        image_url: editUrl || null,
      },
    });
  };

  const detectPlatform = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    if (url.includes("instagram.com")) return "Instagram";
    if (url.includes("drive.google.com")) return "Google Drive";
    return "Unknown";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your portfolio content - changes reflect instantly on the homepage
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ContentType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hero">Hero / Intro</TabsTrigger>
          <TabsTrigger value="short_form">Short-Form Content</TabsTrigger>
          <TabsTrigger value="long_form">Long-Form Content</TabsTrigger>
        </TabsList>

        {/* HERO / INTRO MANAGEMENT */}
        <TabsContent value="hero" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Upload Intro Image or Video
              </CardTitle>
              <CardDescription>
                Upload an image or video for your hero section. Changes reflect instantly on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter title (e.g., 'Intro Video')"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-image">Upload Image</Label>
                  <Input
                    id="hero-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>
                <div>
                  <Label htmlFor="hero-video">Upload Video</Label>
                  <Input
                    id="hero-video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="hero-url">Or Enter URL</Label>
                <Input
                  id="hero-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="YouTube, Instagram, Drive, or direct video URL"
                />
                {newUrl && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Platform: {detectPlatform(newUrl)}
                  </p>
                )}
              </div>

              {previewUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <img src={previewUrl} alt="Preview" className="mt-2 w-full max-w-md rounded-lg" />
                </div>
              )}

              {newUrl && !previewUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-2 max-w-md">
                    <VideoEmbed url={newUrl} title={newTitle || "Preview"} />
                  </div>
                </div>
              )}

              {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}

              <Button onClick={handleAddContent} disabled={addMutation.isPending || uploading}>
                <Plus className="w-4 h-4 mr-2" />
                Add Intro Content
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Current Intro Content</h3>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : content.length === 0 ? (
              <p className="text-muted-foreground">No intro content yet.</p>
            ) : (
              <div className="grid gap-4">
                {content.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      {editingId === item.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="Enter new URL"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" size="sm">
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-64">
                        {item.embed_url ? (
                          <VideoEmbed url={item.embed_url} title={item.title} />
                        ) : item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                                className="w-full aspect-video object-cover rounded-lg"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                            {item.embed_url && (
                              <p className="text-sm text-muted-foreground truncate mb-2">
                                {item.embed_url}
                              </p>
                            )}
                            {item.image_url && (
                              <p className="text-sm text-muted-foreground truncate mb-2">
                                {item.image_url}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(item.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* SHORT-FORM CONTENT MANAGEMENT */}
        <TabsContent value="short_form" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Add Short-Form Content
              </CardTitle>
              <CardDescription>
                Add Instagram Reels, YouTube Shorts, or Google Drive videos. Auto-embed preview on homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="short-title">Title</Label>
                <Input
                  id="short-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter content title..."
                />
              </div>

              <div>
                <Label htmlFor="short-url">Embed Link</Label>
                <Input
                  id="short-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="Instagram Reel / YouTube Shorts / Google Drive link"
                />
                {newUrl && (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      Platform: {detectPlatform(newUrl)}
                    </p>
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 max-w-md">
                        <VideoEmbed url={newUrl} title={newTitle || "Preview"} />
                      </div>
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: Instagram Reels, YouTube Shorts, Google Drive videos
                </p>
              </div>

              <Button onClick={handleAddContent} disabled={addMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Current Short-Form Content</h3>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : content.length === 0 ? (
              <p className="text-muted-foreground">No content yet.</p>
            ) : (
              <div className="grid gap-4">
                {content.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      {editingId === item.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="Enter new URL"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" size="sm">
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-64">
                            {item.embed_url && (
                              <VideoEmbed url={item.embed_url} title={item.title} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                        {item.embed_url && (
                              <p className="text-sm text-muted-foreground truncate mb-2">
                            {item.embed_url}
                          </p>
                        )}
                            <p className="text-xs text-muted-foreground">
                              Platform: {item.embed_url ? detectPlatform(item.embed_url) : "N/A"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(item.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* LONG-FORM CONTENT MANAGEMENT */}
        <TabsContent value="long_form" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Add Long-Form Content
              </CardTitle>
              <CardDescription>
                Add YouTube videos or Google Drive links. Large cinematic preview cards on homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="long-title">Title</Label>
                <Input
                  id="long-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter content title..."
                />
              </div>

              <div>
                <Label htmlFor="long-url">Video Link</Label>
                <Input
                  id="long-url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="YouTube video / Google Drive link"
                />
                {newUrl && (
                  <>
                    <p className="text-xs text-muted-foreground mt-1">
                      Platform: {detectPlatform(newUrl)}
                    </p>
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <div className="mt-2 max-w-2xl">
                        <VideoEmbed url={newUrl} title={newTitle || "Preview"} />
                      </div>
                    </div>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Supported: YouTube videos, Google Drive videos
                </p>
              </div>

              <Button onClick={handleAddContent} disabled={addMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-4">Current Long-Form Content</h3>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : content.length === 0 ? (
              <p className="text-muted-foreground">No content yet.</p>
            ) : (
              <div className="grid gap-4">
                {content.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      {editingId === item.id ? (
                        <div className="space-y-4">
                          <div>
                            <Label>Title</Label>
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={editUrl}
                              onChange={(e) => setEditUrl(e.target.value)}
                              placeholder="Enter new URL"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm">
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button onClick={cancelEdit} variant="outline" size="sm">
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-96">
                            {item.embed_url && (
                              <VideoEmbed url={item.embed_url} title={item.title} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                            {item.embed_url && (
                              <p className="text-sm text-muted-foreground truncate mb-2">
                                {item.embed_url}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Platform: {item.embed_url ? detectPlatform(item.embed_url) : "N/A"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startEdit(item)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
