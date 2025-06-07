'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Lightbulb, Library, Edit3, Users, MessageSquare, TrendingUp, Sparkles, Zap, Target, BarChart3, FileText } from 'lucide-react';
import Link from 'next/link';

const quickAccessItems = [
  {
    title: '智能选题生成',
    description: '基于AI算法快速生成创意选题',
    href: '/topic-generator',
    icon: Lightbulb,
    gradient: 'from-yellow-400 to-orange-500',
    stats: '10K+ 选题已生成'
  },
  {
    title: '选题库管理',
    description: '统一管理和追踪选题状态',
    href: '/topic-library',
    icon: Library,
    gradient: 'from-green-400 to-blue-500',
    stats: '500+ 选题在库'
  },
  {
    title: '爆文智能改写',
    description: 'AI一键生成多个改写版本',
    href: '/rewrite',
    icon: Edit3,
    gradient: 'from-purple-400 to-pink-500',
    stats: '95% 改写成功率'
  },
  {
    title: '实时内容监控',
    description: '追踪目标博主发布动态',
    href: '/monitoring/users',
    icon: Users,
    gradient: 'from-blue-400 to-indigo-500',
    stats: '24/7 实时监控'
  }
];

const features = [
  {
    title: 'AI 智能选题',
    description: '基于深度学习算法，结合用户画像和内容趋势，智能生成高质量创意选题',
    icon: Lightbulb,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    title: '选题库管理',
    description: '可视化管理所有选题内容，支持状态跟踪、标签分类和智能搜索',
    icon: Library,
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    title: '爆文智能改写',
    description: '解析热门笔记链接，AI一键生成多个改写版本，保持原意的同时避免重复',
    icon: Edit3,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    title: '用户动态监控',
    description: '实时追踪目标博主发布动态，第一时间获取行业趋势和热点内容',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    title: '评论数据分析',
    description: '监控重点笔记评论变化，深度分析用户反馈和互动情况',
    icon: MessageSquare,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    title: '数据洞察报告',
    description: '提供详细的数据报表和趋势分析，助力内容策略优化决策',
    icon: BarChart3,
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  }
];

const stats = [
  { label: '内容创作效率提升', value: '300%', icon: TrendingUp },
  { label: '选题生成速度', value: '10x', icon: Zap },
  { label: '监控覆盖博主', value: '1000+', icon: Target },
  { label: '团队使用满意度', value: '98%', icon: Sparkles }
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-24">
        {/* Hero Section */}
        <section className="relative text-center space-y-8 py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 rounded-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">AI 驱动的内容创作平台</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                小红书内容
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                矩阵工具
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-10">
              专为运营团队打造的智能化内容创作平台
              <br />
              <span className="text-lg text-gray-500">提升创作效率，优化运营策略，实现数据驱动的内容营销</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                <Link href="/topic-generator">
                  开始创作 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 hover:bg-gray-50" asChild>
                <Link href="/topic-library">
                  查看选题库
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </section>

        {/* Quick Access */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">核心功能</h2>
            <p className="text-xl text-gray-600">选择您需要的功能，开启高效创作之旅</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {quickAccessItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="group">
                  <Card className="h-full card-hover premium-shadow border-0 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${item.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-lg leading-relaxed">
                            {item.description}
                          </p>
                          <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600">
                            <span>{item.stats}</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">全方位解决方案</h2>
            <p className="text-xl text-gray-600">从创意生成到数据分析，一站式内容运营平台</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="card-hover premium-shadow border-0 overflow-hidden">
                  <CardHeader className="space-y-6 pb-6">
                    <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base leading-relaxed text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative text-center py-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-5"></div>
          <div className="relative space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              准备好提升您的
              <span className="text-gradient"> 内容创作效率 </span>
              了吗？
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              加入我们，体验AI驱动的内容创作新时代
            </p>
            <Button size="lg" className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300" asChild>
              <Link href="/topic-generator">
                立即开始 <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}