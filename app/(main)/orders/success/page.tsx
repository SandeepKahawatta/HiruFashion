// app/orders/success/page.tsx
import { Suspense } from 'react';
import OrderSuccessClient from './OrderSuccessClient';

export const dynamic = 'force-dynamic'; // avoids prerender errors

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading your order details...</div>}>
      <OrderSuccessClient />
    </Suspense>
  );
}
