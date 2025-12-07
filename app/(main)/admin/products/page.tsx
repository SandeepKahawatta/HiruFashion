// app/admin/products/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { uploadImage } from '@/lib/client/uploadImage';
import { apiFetch } from '@/lib/api';

type FormState = {
  name: string;
  slug: string;
  category: '' | 'slippers' | 'frocks' | 'blouses' | 'skirts' | 'pants' | 'bags';
  price: number | string;
  description: string;
  images: string[];
  image?: string;
  colors: string[];   // NEW
  sizes: string[];    // NEW
};

const CATEGORIES = ['slippers', 'frocks', 'blouses', 'skirts', 'pants', 'bags'] as const;

const APPAREL = new Set(['frocks', 'blouses', 'skirts', 'pants']);
const APPAREL_SIZES = ['XS','S','M','L','XL','XXL','XXXL'];

const COLOR_SWATCHES = [
  '#000000','#ffffff','#e11d48','#ef4444','#f59e0b','#22c55e','#3b82f6','#a855f7',
  '#6b7280','#9ca3af','#b45309','#0f766e','#1e293b'
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [form, setForm] = useState<FormState>({
    name: '',
    slug: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    image: '',
    colors: [],
    sizes: [],
  });

  async function load() {
    const res = await apiFetch('/api/products', { cache: 'no-store' });
    const data = await res.json();
    setProducts(data);
  }
  useEffect(() => { load(); }, []);

  // Upload multiple files (keeps your retry-safe approach)
  async function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
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
        return { ...f, images: nextImages, image: nextImages[0] || f.image };
      });
    } catch (err: any) {
      alert(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (input) input.value = '';
    }
  }

  function removeImageAt(idx: number) {
    setForm(f => {
      const next = [...f.images];
      next.splice(idx, 1);
      return { ...f, images: next, image: next[0] || '' };
    });
  }

  function moveImage(from: number, to: number) {
    setForm(f => {
      const next = [...f.images];
      const [spliced] = next.splice(from, 1);
      next.splice(to, 0, spliced);
      return { ...f, images: next, image: next[0] || '' };
    });
  }

  const isApparel = useMemo(() => APPAREL.has(form.category), [form.category]);

  function toggleColor(hex: string) {
    setForm(f => {
      const has = f.colors.includes(hex);
      return { ...f, colors: has ? f.colors.filter(c => c !== hex) : [...f.colors, hex] };
    });
  }

  function toggleSizeTag(tag: string) {
    setForm(f => {
      const has = f.sizes.includes(tag);
      return { ...f, sizes: has ? f.sizes.filter(s => s !== tag) : [...f.sizes, tag] };
    });
  }

  function addCustomSize() {
    const s = customSizeInput.trim();
    if (!s) return;
    setForm(f => f.sizes.includes(s) ? f : { ...f, sizes: [...f.sizes, s] });
    setCustomSizeInput('');
  }

  async function createProduct() {
    if (!form.name || !form.slug || !form.category) {
      alert('Please fill name, slug, and category.');
      return;
    }
    if (form.images.length === 0) {
      alert('Please upload at least one image.');
      return;
    }
    const payload = {
      ...form,
      category: form.category.toLowerCase(),
      price: Number(form.price),
      image: form.images[0],
    };
    const res = await apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setForm({
        name: '', slug: '', category: '', price: 0, description: '',
        images: [], image: '', colors: [], sizes: []
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
    <div className="grid md:grid-cols-2 gap-6 px-3 py-4">
      {/* Create form */}
      <div className="bg-white rounded-2xl border shadow-sm p-4">
        <h1 className="text-lg font-semibold mb-4">Create Product</h1>

        <div className="space-y-4">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="border rounded-xl p-3 w-full"
              placeholder="Name"
              value={form.name}
              onChange={e=>setForm(f=>({...f,name:e.target.value}))}
            />
            <input
              className="border rounded-xl p-3 w-full"
              placeholder="Slug"
              value={form.slug}
              onChange={e=>setForm(f=>({...f,slug:e.target.value}))}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="relative">
              <select
                className="border rounded-xl p-3 w-full bg-white"
                value={form.category}
                onChange={e=>setForm(f=>({...f,category: e.target.value as FormState['category'], sizes: []}))}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Apparel (Frocks, Blouses, Skirts, Pants) shows preset sizes. Slippers/Bags use custom sizes.
            </p>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">Price (cents)</label>
            <input
              type="number"
              className="border rounded-xl p-3 w-full"
              placeholder="e.g. 3499"
              value={form.price}
              onChange={e=>setForm(f=>({...f,price:e.target.value}))}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="border rounded-xl p-3 w-full"
              rows={3}
              placeholder="Describe the product"
              value={form.description}
              onChange={e=>setForm(f=>({...f,description:e.target.value}))}
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium mb-2">Colors</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_SWATCHES.map(hex => {
                const selected = form.colors.includes(hex);
                return (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => toggleColor(hex)}
                    className={`w-10 h-10 rounded-full border relative active:scale-95 transition
                      ${selected ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                    style={{ backgroundColor: hex }}
                    title={hex}
                  >
                    {selected ? (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full grid place-content-center">✓</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {form.colors.length > 0 && (
              <div className="text-xs text-gray-600 mt-1">
                Selected: {form.colors.join(', ')}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>

            {isApparel ? (
              <div className="flex flex-wrap gap-2">
                {APPAREL_SIZES.map(s => {
                  const selected = form.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSizeTag(s)}
                      className={`px-3 py-1 rounded-full border text-sm
                        ${selected ? 'bg-black text-white border-black' : 'bg-white text-gray-800'}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    className="border rounded-xl p-3 flex-1"
                    placeholder={form.category === 'slippers' ? 'Add size (e.g. 38, 40)' : 'Add size (e.g. Small, Large)'}
                    value={customSizeInput}
                    onChange={e=>setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSize();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSize}
                    className="px-4 rounded-xl bg-black text-white"
                  >
                    Add
                  </button>
                </div>
                {form.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.sizes.map(s => (
                      <span key={s} className="px-2 py-1 rounded-full bg-gray-100 border text-sm">
                        {s}
                        <button
                          className="ml-2 text-gray-500 hover:text-black"
                          onClick={() => toggleSizeTag(s)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
              {uploading ? <span className="text-sm text-gray-500">Uploading…</span> : null}
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
                {form.images.map((src, idx) => (
                  <div key={src + idx} className="relative rounded-xl overflow-hidden border">
                    <img src={src} alt={`img-${idx}`} className="w-full h-24 object-cover" />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs bg-white border rounded"
                        onClick={() => removeImageAt(idx)}
                        title="Remove"
                      >
                        ✕
                      </button>
                      {idx > 0 && (
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-white border rounded"
                          onClick={() => moveImage(idx, idx - 1)}
                          title="Move left"
                        >
                          ←
                        </button>
                      )}
                      {idx < form.images.length - 1 && (
                        <button
                          type="button"
                          className="px-2 py-1 text-xs bg-white border rounded"
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
          </div>

          <button
            className="w-full py-3 rounded-xl bg-black text-white active:scale-[0.98] transition"
            onClick={createProduct}
          >
            Create
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="border rounded-2xl p-3 flex items-center gap-3">
              <img src={(p.images?.[0] || p.image)} alt={p.name} className="w-16 h-16 object-cover rounded-xl"/>
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-600 capitalize">{p.category}</div>
                <div className="text-sm text-gray-600">
                  ${(p.price / 100).toFixed(2)} · {Array.isArray(p.images) ? `${p.images.length} img` : '1 img'}
                </div>
                {(p.colors?.length || p.sizes?.length) ? (
                  <div className="mt-1 flex items-center gap-2">
                    {p.colors?.slice(0,6).map((c:string) => (
                      <span key={c} className="w-4 h-4 rounded-full border inline-block" style={{backgroundColor:c}} />
                    ))}
                    {p.colors?.length > 6 && <span className="text-xs text-gray-500">+{p.colors.length - 6}</span>}
                    {p.sizes?.length ? (
                      <span className="text-xs text-gray-500 ml-1">· Sizes: {p.sizes.join(', ')}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
              <button className="px-3 py-2 border rounded-xl" onClick={() => remove(p.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
