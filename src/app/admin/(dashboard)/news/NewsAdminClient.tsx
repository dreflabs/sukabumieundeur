"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Power, Bold, Italic, List, ListOrdered, Quote, Code, Tag, Upload, ImageIcon, Loader2 } from "lucide-react";
import { addNews, deleteNews, toggleNewsStatus } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import toast from "react-hot-toast";

// Tiptap imports
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'

type Article = {
  id: string; // slug
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  excerpt: string;
  status: string;
  tags?: string[];
};

const uploadImageFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/v1/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    throw new Error('Failed to upload image');
  }
  
  const data = await res.json();
  return data.url;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!editor) {
    return null
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 bg-surface border-b border-border p-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded font-outfit font-black text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded font-outfit font-black text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-white/10 mx-1"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-white text-black' : 'text-gray-400 hover:bg-white/10'}`}
      >
        <Code className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-white/10 mx-1"></div>
      
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="p-2 rounded text-gray-400 hover:bg-white/10 font-inter text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
      >
        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        {isUploading ? 'UPLOADING...' : 'IMAGE'}
      </button>
    </div>
  )
}

export default function NewsAdminClient({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isAdding, setIsAdding] = useState(false);
  const [coverInputType, setCoverInputType] = useState<'url' | 'file'>('url');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'NEWS',
    excerpt: '',
    coverImage: '',
    tags: '',
    status: 'PUBLISHED'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage.configure({
        inline: true,
      }),
    ],
    content: '<p>Start writing your article here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose-base focus:outline-none min-h-[300px] p-4 bg-background text-white',
      },
    },
  })

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const url = await uploadImageFile(file);
      setFormData(prev => ({ ...prev, coverImage: url }));
      toast.success("Cover image uploaded!");
    } catch (err) {
      toast.error("Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) coverFileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    setIsSubmitting(true);
    
    const fallbackImage = 'https://images.unsplash.com/photo-1540039155733-4730cb8fd8f1?q=80&w=2940&auto=format&fit=crop';
    
    const htmlContent = editor.getHTML();

    try {
      const res = await addNews({
        ...formData,
        content: htmlContent,
        coverImage: formData.coverImage || fallbackImage
      });

      if (res.success) {
        setIsAdding(false);
        toast.success("Article saved successfully!");
        window.location.reload(); 
      } else {
        toast.error("Failed: " + res.error);
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (slug: string, currentStatus: string) => {
    if (currentStatus === 'PUBLISHED' && !confirm("Are you sure you want to unpublish this news article?")) return;
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setLoadingId(slug);
    setArticles(prev => prev.map(a => a.id === slug ? { ...a, status: newStatus } : a));
    
    try {
      const res = await toggleNewsStatus(slug, currentStatus);
      if (!res.success) {
        setArticles(prev => prev.map(a => a.id === slug ? { ...a, status: currentStatus } : a));
        toast.error("Failed: " + res.error);
      } else {
        toast.success("Status updated!");
      }
    } catch (err) {
      setArticles(prev => prev.map(a => a.id === slug ? { ...a, status: currentStatus } : a));
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setLoadingId(slug);
    setArticles(prev => prev.filter(a => a.id !== slug));
    try {
      const res = await deleteNews(slug);
      if (!res.success) {
        toast.error("Failed to delete article");
        window.location.reload();
      } else {
        toast.success("Article deleted!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      window.location.reload();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? "outline" : "default"}
        >
          {isAdding ? 'CANCEL' : <><Plus className="w-4 h-4 mr-2" /> WRITE NEW ARTICLE</>}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-brand/50 p-6 space-y-4 shadow-brutal">
          <h3 className="text-white font-outfit font-black text-xl uppercase mb-4">Draft New Article</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="article-title" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Headline Title</label>
              <Input id="article-title" required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="font-outfit text-xl" />
            </div>
            <div>
              <label htmlFor="article-slug" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">URL Slug</label>
              <Input id="article-slug" required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} placeholder="eundeur-fest-2025" />
            </div>
            <div>
              <label htmlFor="article-category" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Category</label>
              <select id="article-category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex h-11 w-full bg-card border border-border px-3 py-2 font-inter text-sm text-white focus-visible:outline-none focus-visible:border-brand transition-colors appearance-none uppercase">
                <option value="NEWS">NEWS</option>
                <option value="FESTIVAL">FESTIVAL</option>
                <option value="ARTIST">ARTIST</option>
                <option value="COMMUNITY">COMMUNITY</option>
                <option value="GUIDE">GUIDE</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="article-tags" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Tags (Comma Separated)</label>
              <Input id="article-tags" type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="metal, festival, local gigs" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="article-excerpt" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Short Excerpt (Intro)</label>
              <Textarea id="article-excerpt" required value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={2} />
            </div>
            
            {/* Tiptap Rich Text Editor */}
            <div className="md:col-span-2 flex flex-col border border-border rounded overflow-hidden focus-within:border-brand transition-colors">
              <label className="block text-[10px] text-gray-500 font-inter tracking-widest uppercase bg-[#050505] p-3 border-b border-border">
                Article Body (Rich Text)
              </label>
              <MenuBar editor={editor} />
              <div className="bg-background">
                <EditorContent editor={editor} />
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] text-muted font-inter tracking-widest uppercase">Cover Image</label>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setCoverInputType('url')} className={`text-[10px] tracking-widest font-bold uppercase ${coverInputType === 'url' ? 'text-brand' : 'text-gray-500 hover:text-white'}`}>URL</button>
                  <button type="button" onClick={() => setCoverInputType('file')} className={`text-[10px] tracking-widest font-bold uppercase ${coverInputType === 'file' ? 'text-brand' : 'text-gray-500 hover:text-white'}`}>UPLOAD</button>
                </div>
              </div>
              
              {coverInputType === 'url' ? (
                <Input type="text" placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
              ) : (
                <div className="flex flex-col gap-2">
                  <input type="file" accept="image/*" ref={coverFileInputRef} onChange={handleCoverUpload} className="hidden" />
                  <button type="button" onClick={() => coverFileInputRef.current?.click()} disabled={isUploadingCover} className="w-full bg-card border border-dashed border-border p-4 text-gray-400 hover:text-brand hover:border-brand transition-colors flex flex-col items-center justify-center gap-2">
                    {isUploadingCover ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                    <span className="text-[10px] font-inter font-bold tracking-widest uppercase">
                      {isUploadingCover ? 'UPLOADING...' : 'CLICK TO UPLOAD IMAGE'}
                    </span>
                  </button>
                  {formData.coverImage && (
                    <div className="mt-2 text-[10px] text-gray-400 truncate break-all">
                      Current: {formData.coverImage}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:col-span-2 border-t border-border pt-4 mt-2">
              <label className="block text-[10px] text-gray-500 font-inter tracking-widest uppercase mb-2">Publish Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="PUBLISHED" checked={formData.status === 'PUBLISHED'} onChange={() => setFormData({...formData, status: 'PUBLISHED'})} className="accent-brand" />
                  <span className="text-xs text-white font-inter tracking-widest uppercase">PUBLISH NOW</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" value="DRAFT" checked={formData.status === 'DRAFT'} onChange={() => setFormData({...formData, status: 'DRAFT'})} className="accent-brand" />
                  <span className="text-xs text-gray-400 font-inter tracking-widest uppercase">SAVE AS DRAFT</span>
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" type="button" onClick={() => setIsAdding(false)}>
              CANCEL
            </Button>
            <Button disabled={isSubmitting || !editor} type="submit">
              {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : 'SAVE ARTICLE'}
            </Button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <div key={article.id} className={`bg-card border ${article.status === 'PUBLISHED' ? 'border-border hover:border-brand/50' : 'border-red-900/30 opacity-60'} flex flex-col md:flex-row transition-all group overflow-hidden`}>
            
            <div className="relative w-full md:w-64 aspect-video md:aspect-auto bg-black shrink-0">
              {article.coverImage && (
                <Image src={article.coverImage} alt={article.title} fill className={`object-cover ${article.status === 'PUBLISHED' ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale opacity-30'} transition-all`} />
              )}
              <div className="absolute top-2 left-2 bg-brand px-2 py-0.5">
                <span className="text-[10px] font-inter font-bold text-black tracking-widest uppercase">{article.category}</span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-outfit font-black text-xl text-white uppercase leading-tight mb-2 group-hover:text-brand transition-colors">{article.title}</h3>
                <p className="text-sm font-inter text-muted line-clamp-2">{article.excerpt}</p>
                
                {article.tags && article.tags.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-[10px] border border-white/20 px-2 py-0.5 text-gray-400 flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-[10px] text-muted font-inter tracking-widest uppercase mt-4">
                  Status: {article.status === 'PUBLISHED' ? <span className="text-emerald-400">Live / Published</span> : <span className="text-red-500">Draft / Hidden</span>}
                </p>
              </div>
            </div>

            <div className="flex md:flex-col items-center justify-end p-5 md:border-l border-border gap-3 shrink-0">
               <button disabled={loadingId === article.id} onClick={() => handleToggle(article.id, article.status)} className={`w-10 h-10 flex items-center justify-center rounded-full ${article.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border border-current hover:scale-110 transition-transform disabled:opacity-50`}>
                  {loadingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                </button>
                <Button disabled={loadingId === article.id} variant="ghost" size="icon" onClick={() => handleDelete(article.id)} className="w-10 h-10 text-muted hover:text-red-500 hover:bg-red-500/10">
                  {loadingId === article.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
