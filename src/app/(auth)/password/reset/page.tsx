// app/auth/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordClient from "./client"; 
export default function ResetPasswordPage() {
  return ( 
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ResetPasswordClient />
    </Suspense>
  );
}
