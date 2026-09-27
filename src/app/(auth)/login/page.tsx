import { Metadata } from 'next';
import AdminLoginClient from './client'; 

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Apearix account to access the dashboard and manage your resources.",
}
export default function AdminLogin() {
  return <AdminLoginClient />;
}  
