'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Home, Lightbulb, Library, Edit3, Users, MessageSquare, Zap, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '智能选题', href: '/topic-generator', icon: Lightbulb },
  { name: '选题库', href: '/topic-library', icon: Library },
  { name: '爆文改写', href: '/rewrite', icon: Edit3 },
  { name: '小红书搜索', href: '/search', icon: Search },
  { name: '用户监控', href: '/monitoring/users', icon: Users },
];

export function TopNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  小红书内容矩阵
                </span>
                <span className="text-xs text-gray-500 font-medium">Content Matrix Pro</span>
              </div>
            </Link>
            
            <div className="hidden lg:flex space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "relative flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 group",
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"></div>
                    )}
                    <div className="relative flex items-center space-x-2">
                      <Icon className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                      )} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-full border border-emerald-200">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">AI 驱动</span>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              v2.0 Pro
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}