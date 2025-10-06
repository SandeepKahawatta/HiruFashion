'use client';

export async function uploadImage(file: File): Promise<string> {
  // 1) ask server for a signature
  const sigRes = await fetch('/api/cloudinary-sign', { method: 'GET' });
  if (!sigRes.ok) throw new Error('Failed to get Cloudinary signature');
  const { timestamp, signature, apiKey, cloudName, uploadPreset } = await sigRes.json();

  // 2) upload to Cloudinary with the signature
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('upload_preset', uploadPreset);
  formData.append('signature', signature);
  // (optional) formData.append('folder', 'hirufashion/products');

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }
  return data.secure_url as string;
}
