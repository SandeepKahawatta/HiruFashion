'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const router = useRouter();
  async function handleSubmit() {
    const res = await apiFetch('/api/auth/login', {
      method:'POST',
      body: JSON.stringify(form)
    });
    if (res.ok) {
      sessionStorage.setItem('show_welcome_once', '1')
      router.push('/');
    }
    else alert('Login failed');
  }
  return (
    <div className="container py-8">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <div className="space-y-3">
        <input className="border p-2 w-full" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
        <input className="border p-2 w-full" type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
        <button className="px-4 py-2 bg-black text-white rounded" onClick={handleSubmit}>Login</button>
        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push('/register')}
          >
            Create one here
          </button>
        </p>
      </div>
    </div>
  );
}
