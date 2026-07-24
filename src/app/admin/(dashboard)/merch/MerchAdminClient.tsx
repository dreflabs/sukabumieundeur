"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Power, Loader2 } from "lucide-react";
import { addMerch, deleteMerch, toggleMerchStatus } from "./actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import toast from "react-hot-toast";

type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  base_price: number;
  category: string;
  stock_quantity: number;
  image: string;
  is_active: boolean;
};

export default function MerchAdminClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'APPAREL',
    description: '',
    base_price: 150000,
    stock_quantity: 50,
    coverImage: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await addMerch(formData);

      if (res.success) {
        setIsAdding(false);
        toast.success("Product added successfully!");
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

  const handleToggle = async (id: string, currentStatus: boolean) => {
    if (currentStatus && !confirm("Are you sure you want to hide this merchandise item?")) return;
    setLoadingId(id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    try {
      const res = await toggleMerchStatus(id, currentStatus);
      if (!res.success) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: currentStatus } : p));
        toast.error("Failed: " + res.error);
      } else {
        toast.success("Status updated");
      }
    } catch (err) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: currentStatus } : p));
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    setLoadingId(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    try {
      const res = await deleteMerch(id);
      if (!res.success) {
        toast.error("Failed to delete product");
        window.location.reload();
      } else {
        toast.success("Product deleted");
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
          {isAdding ? 'CANCEL' : <><Plus className="w-4 h-4 mr-2" /> ADD NEW PRODUCT</>}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-card border border-brand/50 p-6 space-y-4 shadow-brutal">
          <h3 className="text-white font-outfit font-black text-xl uppercase mb-4">Add New Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-title" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Product Name</label>
              <Input id="product-title" required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="font-outfit text-xl" />
            </div>
            <div>
              <label htmlFor="product-slug" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">URL Slug</label>
              <Input id="product-slug" required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} placeholder="t-shirt-eundeur-2026" />
            </div>
            <div>
              <label htmlFor="product-category" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Category</label>
              <select id="product-category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="flex h-11 w-full bg-card border border-border px-3 py-2 font-inter text-sm text-white focus-visible:outline-none focus-visible:border-brand transition-colors appearance-none uppercase">
                <option value="APPAREL">APPAREL</option>
                <option value="OUTERWEAR">OUTERWEAR</option>
                <option value="ACCESSORIES">ACCESSORIES</option>
                <option value="TICKETS">TICKETS</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-price" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Price (IDR)</label>
                <Input id="product-price" required type="number" min="0" value={formData.base_price} onChange={e => setFormData({...formData, base_price: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label htmlFor="product-stock" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Initial Stock</label>
                <Input id="product-stock" required type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})} />
              </div>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="product-desc" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Description</label>
              <Textarea id="product-desc" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="product-image" className="block text-xs text-muted font-inter tracking-widest uppercase mb-1">Image URL</label>
              <Input id="product-image" type="text" placeholder="https://..." value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} />
            </div>
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-4">
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> SAVING...</> : 'SAVE PRODUCT'}
          </Button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div key={product.id} className={`bg-card border ${product.is_active ? 'border-border hover:border-brand/50' : 'border-red-900/30 opacity-60'} flex flex-col md:flex-row transition-all group overflow-hidden`}>
            
            <div className="relative w-full md:w-48 aspect-square md:aspect-auto bg-black shrink-0">
              {product.image ? (
                <Image src={product.image} alt={product.title} fill className={`object-cover ${product.is_active ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : 'grayscale opacity-30'} transition-all`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-gray-600 text-xs">No Image</div>
              )}
              <div className="absolute top-2 left-2 bg-brand px-2 py-0.5">
                <span className="text-[10px] font-inter font-bold text-black tracking-widest uppercase">{product.category}</span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-outfit font-black text-xl text-white uppercase leading-tight mb-2 group-hover:text-brand transition-colors">{product.title}</h3>
                  <span className="font-inter font-bold text-gray-300">IDR {product.base_price.toLocaleString('id-ID')}</span>
                </div>
                <p className="text-sm font-inter text-muted line-clamp-2">{product.description}</p>
                
                <div className="flex gap-6 mt-4 border-t border-white/5 pt-4">
                  <p className="text-[10px] text-muted font-inter tracking-widest uppercase">
                    Stock: <span className={product.stock_quantity <= 5 ? 'text-orange-500 font-bold' : 'text-white'}>{product.stock_quantity}</span>
                  </p>
                  <p className="text-[10px] text-muted font-inter tracking-widest uppercase">
                    Status: {product.is_active ? <span className="text-emerald-400">Active</span> : <span className="text-red-500">Draft</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex md:flex-col items-center justify-end p-5 md:border-l border-white/5 gap-3 shrink-0">
               <button disabled={loadingId === product.id} onClick={() => handleToggle(product.id, product.is_active)} className={`w-10 h-10 flex items-center justify-center rounded-full ${product.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'} border border-current hover:scale-110 transition-transform disabled:opacity-50`}>
                  {loadingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
                </button>
                <Button disabled={loadingId === product.id} variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="w-10 h-10 text-muted hover:text-red-500 hover:bg-red-500/10">
                  {loadingId === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="text-center text-muted py-10 font-inter">No products found. Start adding some!</div>
        )}
      </div>
    </div>
  );
}
