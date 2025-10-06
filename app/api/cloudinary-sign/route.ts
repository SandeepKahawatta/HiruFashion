export const runtime = 'nodejs';

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Change to your signed preset name
const UPLOAD_PRESET = 'secure_products';

export async function GET() {
  const timestamp = Math.round(Date.now() / 1000);

  // Anything you include here must match what you'll send in the upload formData
  const paramsToSign: Record<string, string | number> = {
    timestamp,
    upload_preset: UPLOAD_PRESET,
    // (optional) folder: 'hirufashion/products',
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    timestamp,
    signature,
    uploadPreset: UPLOAD_PRESET,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  });
}
