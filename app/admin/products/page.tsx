'use client';

import { useEffect, useState } from 'react';
import { uploadImage } from '@/lib/client/uploadImage';
import { apiFetch } from '@/lib/api';

type FormState = {
  name: string;
  slug: string;
  category: string;
  price: number | string;
  description: string;

  // NEW: multi-images
  images: string[];     // preferred going forward
  image?: string;       // legacy single cover (we’ll derive from images[0])
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<FormState>({
    name: '',
    slug: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    image: '',
  });
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await apiFetch('/api/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
  }
  useEffect(() => { load(); }, []);

  // Upload multiple files
  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
  const input = e.currentTarget; // ✅ capture before await
  const files = input.files;
  if (!files || files.length === 0) return;

  try {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      urls.push(url);
    }
    setForm(f => {
      const nextImages = [...f.images, ...urls];
      return {
        ...f,
        images: nextImages,
        image: nextImages[0] || f.image,
      };
    });
  } catch (err: any) {
    alert(err?.message || 'Upload failed');
  } finally {
    setUploading(false);
    if (input) input.value = ''; // ✅ use saved reference
  }
}


  function removeImageAt(idx: number) {
    setForm(f => {
      const next = [...f.images];
      next.splice(idx, 1);
      return {
        ...f,
        images: next,
        image: next[0] || '', // keep cover in sync
      };
    });
  }

  function moveImage(from: number, to: number) {
    setForm(f => {
      const next = [...f.images];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return {
        ...f,
        images: next,
        image: next[0] || '',
      };
    });
  }

  async function createProduct() {
    if (form.images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    const payload = {
      ...form,
      price: Number(form.price),
      image: form.images[0], // keep legacy `image` in DB for existing components
    };
    const res = await apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({
        name: '',
        slug: '',
        category: '',
        price: 0,
        description: '',
        images: [],
        image: '',
      });
      load();
    } else {
      const err = await res.json().catch(() => null);
      alert(err?.error || 'Create failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete product?')) return;
    const res = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) load();
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Create form */}
      <div>
        <h1 className="text-xl font-semibold mb-4">Create Product</h1>
        <div className="space-y-3">
          <input className="border p-2 w-full" placeholder="Name"
                 value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          <input className="border p-2 w-full" placeholder="Slug"
                 value={form.slug} onChange={e=>setForm(f=>({...f,slug:e.target.value}))}/>
          <input className="border p-2 w-full" placeholder="Category"
                 value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}/>
          <input className="border p-2 w-full" placeholder="Price (cents)" type="number"
                 value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
          <textarea className="border p-2 w-full" placeholder="Description"
                    value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>

          {/* Multi-file input for signed upload */}
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
            {uploading ? <span className="text-sm text-gray-500">Uploading…</span> : null}
          </div>

          {/* Image previews with remove/reorder */}
          {form.images.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {form.images.map((src, idx) => (
                <div key={src + idx} className="relative">
                  <img src={src} alt={`img-${idx}`} className="w-full h-24 object-cover rounded border" />
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button
                      type="button"
                      className="px-1 py-0.5 text-xs bg-white border rounded"
                      onClick={() => removeImageAt(idx)}
                      title="Remove"
                    >
                      ✕
                    </button>
                    {idx > 0 && (
                      <button
                        type="button"
                        className="px-1 py-0.5 text-xs bg-white border rounded"
                        onClick={() => moveImage(idx, idx - 1)}
                        title="Move left"
                      >
                        ←
                      </button>
                    )}
                    {idx < form.images.length - 1 && (
                      <button
                        type="button"
                        className="px-1 py-0.5 text-xs bg-white border rounded"
                        onClick={() => moveImage(idx, idx + 1)}
                        title="Move right"
                      >
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="px-4 py-2 bg-black text-white rounded" onClick={createProduct}>
            Create
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="border p-3 rounded flex items-center gap-3">
              <img src={(p.images?.[0] || p.image)} alt={p.name} className="w-16 h-16 object-cover rounded"/>
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-600">
                  {p.slug} · ${(p.price / 100).toFixed(2)} · {Array.isArray(p.images) ? `${p.images.length} img` : '1 img'}
                </div>
              </div>
              <button className="px-3 py-2 border rounded" onClick={() => remove(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
