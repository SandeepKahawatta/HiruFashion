// lib/client/uploadImage.ts
export async function uploadImage(file: File): Promise<string> {
  async function realUpload(file: File): Promise<string> {
    // 1️⃣ Fetch a fresh signature (no-cache, just before upload)
    const sigRes = await fetch(`/api/cloudinary-sign?t=${Date.now()}`, {
      method: 'GET',
      cache: 'no-store',
    });
    if (!sigRes.ok) throw new Error('Failed to get Cloudinary signature');
    const { timestamp, signature, apiKey, cloudName, uploadPreset } = await sigRes.json();

    // 2️⃣ Create form data for Cloudinary upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', String(timestamp));
    formData.append('api_key', apiKey);
    formData.append('upload_preset', uploadPreset);
    formData.append('signature', signature);

    // 3️⃣ Upload to Cloudinary
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

  // ✅ Add the retry logic *here*
  try {
    return await realUpload(file);
  } catch (e: any) {
    if (String(e.message).toLowerCase().includes('stale request')) {
      console.warn('⚠️ Stale signature detected, retrying with fresh signature...');
      return await realUpload(file); // retry once
    }
    throw e;
  }
}
