import React from "react";
import { 
  Users, 
  FileText, 
  Layers, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical, 
  Calendar,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

// Mock Data for the dashboard
const stats = [
  {
    title: "Total Blogs",
    value: "1,248",
    trend: "+12.5%",
    isPositive: true,
    icon: FileText,
  },
  {
    title: "Active Categories",
    value: "32",
    trend: "+2.4%",
    isPositive: true,
    icon: Layers,
  },
  {
    title: "Total Visitors",
    value: "45.2K",
    trend: "-1.2%",
    isPositive: false,
    icon: Users,
  },
  {
    title: "Engagement Rate",
    value: "64.8%",
    trend: "+5.1%",
    isPositive: true,
    icon: TrendingUp,
  }
];

const recentBlogs = [
  { id: 1, title: "The Future of Next.js Architecture", category: "Technology", status: "Published", date: "Oct 24, 2026", views: "1.2K" },
  { id: 2, title: "Mastering Tailwind CSS v4", category: "Design", status: "Draft", date: "Oct 22, 2026", views: "-" },
  { id: 3, title: "NestJS vs Express: A Deep Dive", category: "Development", status: "Published", date: "Oct 20, 2026", views: "3.4K" },
  { id: 4, title: "Building Secure Auth Flows", category: "Security", status: "In Review", date: "Oct 18, 2026", views: "-" },
  { id: 5, title: "Understanding React Server Components", category: "Technology", status: "Published", date: "Oct 15, 2026", views: "5.6K" },
];

export default function AdminDashboardPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 lg:p-8 font-geist bg-surface-alt min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-heading">Dashboard Overview</h1>
          <p className="text-muted text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} />
            {currentDate}
          </p>
        </div>
        
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-background rounded-xl p-6 border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-transform hover:-translate-y-1 hover:shadow-lg duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
                  stat.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                }`}>
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-heading mb-1">{stat.value}</h3>
              <p className="text-muted text-sm font-medium">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area - Activity/Table */}
        <div className="lg:col-span-2 bg-background rounded-xl border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-bold text-heading">Recent Blogs</h2>
            <button className="text-primary hover:text-primary-hover text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-alt text-muted text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Views</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {recentBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-surface/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-heading truncate max-w-[200px]">{blog.title}</p>
                      <span className="text-xs text-muted">{blog.date}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-surface-alt border border-border text-body rounded-md text-xs font-medium">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        blog.status === "Published" ? "bg-green-50 border-green-200 text-green-700" :
                        blog.status === "Draft" ? "bg-gray-50 border-gray-200 text-gray-700" :
                        "bg-orange-50 border-orange-200 text-orange-700"
                      }`}>
                        {blog.status === "Published" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                        {blog.status === "In Review" && <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>}
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-heading font-medium">
                      {blog.views}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-muted hover:text-primary hover:bg-primary-light rounded-md transition-colors" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-muted hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Traffic Overview Mock */}
          <div className="bg-background rounded-xl border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-heading">Traffic Overview</h2>
              <button className="text-muted hover:text-heading"><MoreVertical size={18} /></button>
            </div>
            {/* Simple Mock Chart using CSS flex */}
            <div className="h-48 flex items-end gap-2 mb-4">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group">
                  <div 
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      i === 6 ? "bg-primary" : "bg-primary-light group-hover:bg-primary/50"
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted font-medium border-t border-border pt-4">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span className="text-primary font-bold">Sun</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-background rounded-xl border border-border-subtle shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-lg font-bold text-heading mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-sm font-medium text-heading">API Services</span>
                </div>
                <span className="text-xs text-muted">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-sm font-medium text-heading">Database</span>
                </div>
                <span className="text-xs text-muted">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
