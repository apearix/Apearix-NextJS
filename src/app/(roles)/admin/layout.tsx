import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Roles', href: '/admin/roles' },
    { name: 'Category Types', href: '/admin/category-types' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Blogs', href: '/admin/blogs' },
    { name: 'Pages', href: '/admin/pages' },
    { name: 'FAQs', href: '/admin/faqs' },
    { name: 'Products', href: '/admin/products' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Secondary Admin Navigation */}
      <div className="bg-background border-b border-border-subtle overflow-x-auto">
        <div className="px-6 flex gap-1 whitespace-nowrap">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-sm font-medium text-muted hover:text-primary hover:bg-surface-alt transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
