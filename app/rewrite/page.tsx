'use client';

import { useState, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, Sparkles, Copy, Image as ImageIcon, Edit3, Zap, CheckCircle, Star, ChevronLeft, ChevronRight, FileText, Camera, Target, User, Search, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface OriginalContent {
  title: string;
  content: string;
  images: string[];
}

interface RewrittenVersion {
  id: string;
  title: string;
  content: string;
  style: string;
  engagement: string;
}

interface RewriteConfig {
  purpose: string;
  identity: string;
  keywords: string;
  seoPositions: string[];
}

const mockOriginalContent: OriginalContent = {
  title: '秋季护肤攻略 | 换季必备的5个护肤步骤',
  content: `姐妹们！秋天来了，皮肤又开始闹脾气了😭
  
最近好多人问我换季护肤怎么办，今天就来分享一下我的秋季护肤心得💝

🔸 第一步：温和清洁
换季千万不要用清洁力太强的洗面奶，推荐氨基酸洁面

🔸 第二步：充分保湿
秋天最重要的就是保湿！我现在在用的这款精华真的很好用

🔸 第三步：防晒不能停
虽然没有夏天那么晒，但防晒还是要坚持的

🔸 第四步：定期敷面膜
一周2-3次补水面膜是必须的

🔸 第五步：注意饮食
多喝水，少吃辛辣刺激的食物

希望对大家有帮助哦～有问题可以评论区问我💕`,
  images: [
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/7686297/pexels-photo-7686297.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]
};

const mockRewrittenVersions: RewrittenVersion[] = [
  {
    id: '1',
    title: '入秋护肤指南 | 5步解决换季肌肤困扰',
    content: `秋天到了，你的肌肤准备好了吗？🍂

换季时节，肌肤最容易出现各种问题。作为一个护肤博主，我总结了5个关键步骤，帮你轻松应对秋季护肤挑战！

✨ 温和清洁是基础
选择温和的氨基酸洁面，避免过度清洁导致的屏障受损

✨ 加强保湿是重点  
秋季空气干燥，保湿工作要比夏天更加用心

✨ 防晒仍是必修课
紫外线一年四季都存在，防晒工作不能松懈

✨ 面膜护理要跟上
每周2-3次的补水面膜，给肌肤充足的水分补给

✨ 内调外养同步进行
配合充足的水分摄入和均衡饮食

这套护肤流程我已经坚持了3年，效果真的很明显！✨`,
    style: '专业干货型',
    engagement: '预计互动率 8.2%'
  },
  {
    id: '2',
    title: '换季护肤干货 | 告别秋季肌肤问题的完整攻略',
    content: `换季肌肤问题频发？这份攻略收好了！📝

每到换季，后台都有很多姐妹问护肤问题。今天就来系统地讲讲秋季护肤的正确打开方式：

🌟 清洁环节：温和至上
推荐使用弱酸性或氨基酸类洁面产品，保护肌肤天然屏障

🌟 保湿环节：层层递进
爽肤水→精华→乳液→面霜，一层层为肌肤锁住水分

🌟 防护环节：365天不间断
选择SPF30+的防晒产品，室内室外都要记得涂抹

🌟 修护环节：定期深度护理
一周2-3次面膜护理，选择保湿修护类型

🌟 生活环节：内外兼修
保证充足睡眠，多喝水，少熬夜

按照这个步骤坚持下去，你的肌肤一定会感谢你的！💕`,
    style: '教程指南型',
    engagement: '预计互动率 7.8%'
  },
  {
    id: '3',
    title: '秋季护肤5步曲 | 从夏到秋的完美过渡',
    content: `夏秋换季，肌肤也要"换季"！🔄

最近温差变大，很多小伙伴的肌肤开始出现敏感、干燥等问题。别慌！我来教你如何让肌肤平稳过渡：

💧 Step1: 清洁力度要调整
夏天的深层清洁产品该收起来了，换成温和的氨基酸洁面

💧 Step2: 保湿强度要升级
从夏天的清爽保湿升级到滋润保湿，给肌肤更多呵护

💧 Step3: 防晒习惯要保持
秋天的阳光看似温和，其实紫外线依然不能小觑

💧 Step4: 面膜频率要增加
夏天一周1-2次，秋天建议增加到2-3次

💧 Step5: 作息调理要重视
早睡早起，多喝温水，给肌肤创造最佳修护环境

这套方法我用了很多年，真的很有效！试试看吧～🌸`,
    style: '亲和分享型',
    engagement: '预计互动率 9.1%'
  }
];

const purposeOptions = [
  { value: 'brand', label: '品牌推广' },
  { value: 'product', label: '产品种草' },
  { value: 'education', label: '知识科普' },
  { value: 'lifestyle', label: '生活分享' },
  { value: 'review', label: '测评体验' },
  { value: 'tutorial', label: '教程指南' }
];

const identityOptions = [
  { value: 'blogger', label: '美妆博主' },
  { value: 'expert', label: '护肤专家' },
  { value: 'user', label: '普通用户' },
  { value: 'kol', label: 'KOL达人' },
  { value: 'brand', label: '品牌方' },
  { value: 'editor', label: '时尚编辑' }
];

const seoPositionOptions = [
  { id: 'title', label: '标题' },
  { id: 'opening', label: '开头' },
  { id: 'content', label: '正文' },
  { id: 'ending', label: '结尾' }
];

export default function RewritePage() {
  const [linkUrl, setLinkUrl] = useState('');
  const [originalContent, setOriginalContent] = useState<OriginalContent | null>(null);
  const [rewrittenVersions, setRewrittenVersions] = useState<RewrittenVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [rewriteConfig, setRewriteConfig] = useState<RewriteConfig>({
    purpose: '',
    identity: '',
    keywords: '',
    seoPositions: []
  });
  const { toast } = useToast();
  const rewrittenSectionRef = useRef<HTMLDivElement>(null);

  const handleParseContent = async () => {
    if (!linkUrl.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOriginalContent(mockOriginalContent);
      setCurrentImageIndex(0);
      setIsLoading(false);
    }, 2000);
  };

  const handleRewrite = async () => {
    if (!originalContent) return;
    
    setIsRewriting(true);
    // Simulate API call
    setTimeout(() => {
      setRewrittenVersions(mockRewrittenVersions);
      setIsRewriting(false);
      // 滚动到改写结果部分
      setTimeout(() => {
        rewrittenSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }, 3000);
  };

  const handleCopyContent = (title: string, content: string) => {
    const fullContent = `${title}\n\n${content}`;
    navigator.clipboard.writeText(fullContent);
    toast({
      title: "复制成功",
      description: "内容已复制到剪贴板",
    });
  };

  const handlePrevImage = () => {
    if (!originalContent) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? originalContent.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!originalContent) return;
    setCurrentImageIndex((prev) => 
      prev === originalContent.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSeoPositionChange = (positionId: string, checked: boolean) => {
    setRewriteConfig(prev => ({
      ...prev,
      seoPositions: checked 
        ? [...prev.seoPositions, positionId]
        : prev.seoPositions.filter(id => id !== positionId)
    }));
  };

  return (
    <MainLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-full border border-purple-200/50 shadow-sm">
            <Edit3 className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700 tracking-wide">AI 智能改写</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight">
            爆文
            <span className="text-gradient bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent"> 智能改写</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            解析热门笔记链接，AI一键生成多个改写版本，保持原意的同时避免重复
          </p>
        </div>

        {/* Link Input Section */}
        <Card className="premium-shadow border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Input
                    id="link"
                    placeholder="请粘贴小红书笔记链接，例如：https://www.xiaohongshu.com/explore/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 text-base h-14 border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 bg-white/90 backdrop-blur-sm transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
                <Button 
                  onClick={handleParseContent}
                  disabled={!linkUrl.trim() || isLoading}
                  className="px-10 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-3 h-5 w-5 animate-spin" />
                      解析中...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-5 w-5" />
                      解析内容
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Content Display */}
        {originalContent && (
          <div className="relative">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 rounded-3xl -z-10"></div>
            <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl -z-10"></div>
            
            <Card className="premium-shadow border-0 overflow-hidden bg-white/90 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-emerald-50/80 to-blue-50/80 border-b border-emerald-100/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg">
                      <CheckCircle className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-3xl font-bold text-gray-900 mb-1">原文内容</CardTitle>
                      <p className="text-emerald-700 font-medium">解析完成，内容已成功提取</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 bg-emerald-100/80 px-4 py-2 rounded-full border border-emerald-200/50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-emerald-700">已解析</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-10">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                  {/* 图片区域 - 左侧，占1列 */}
                  <div className="xl:col-span-1 space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">图片内容</h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    
                    {/* 主图片 - 3:4 比例 */}
                    <div className="relative w-full max-w-sm mx-auto">
                      <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
                        <Image
                          src={originalContent.images[currentImageIndex]}
                          alt={`原文图片 ${currentImageIndex + 1}`}
                          fill
                          className="object-cover transition-all duration-500"
                        />
                        {/* 图片遮罩渐变 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                        
                        {/* 左右切换按钮 */}
                        {originalContent.images.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={handleNextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        {/* 图片指示器 */}
                        {originalContent.images.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {originalContent.images.map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex 
                                    ? 'bg-white shadow-lg' 
                                    : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 缩略图 - 3:4 比例 */}
                    {originalContent.images.length > 1 && (
                      <div className="flex gap-3 justify-center overflow-x-auto pb-2">
                        {originalContent.images.map((imageUrl, index) => (
                          <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative flex-shrink-0 transition-all duration-300 transform hover:scale-105 ${
                              index === currentImageIndex 
                                ? 'ring-3 ring-purple-500 ring-offset-2 shadow-xl' 
                                : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 shadow-md hover:shadow-lg'
                            }`}
                          >
                            <div className="relative aspect-[3/4] w-16 bg-gray-100 rounded-xl overflow-hidden">
                              <Image
                                src={imageUrl}
                                alt={`缩略图 ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {index === currentImageIndex && (
                                <div className="absolute inset-0 bg-purple-500/20"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 文字内容区域 - 右侧，占2列 */}
                  <div className="xl:col-span-2 space-y-8">
                    {/* 标题部分 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">标题</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative p-8 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl border border-blue-200/50 backdrop-blur-sm shadow-lg min-h-[120px] flex items-center">
                          <p className="text-gray-900 font-semibold text-xl leading-relaxed w-full">
                            {originalContent.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 内容部分 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                          <Edit3 className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">正文内容</h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative p-8 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 rounded-2xl border border-emerald-200/50 backdrop-blur-sm shadow-lg min-h-[400px] overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-gray-700 font-medium leading-relaxed text-lg">
                            {originalContent.content}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI改写配置 */}
                <div className="mt-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* 左侧：SEO优化色块 */}
                    <div className="relative group">
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                      
                      <div className="relative bg-gradient-to-br from-violet-50/95 to-purple-50/95 rounded-3xl border border-violet-200/60 backdrop-blur-xl shadow-2xl p-8 space-y-8 h-full">
                        {/* 标题 */}
                        <div className="flex items-center gap-4 pb-4 border-b border-violet-200/50">
                          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                            <Search className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">SEO 优化</h3>
                        </div>
                        
                        {/* 关键词输入 */}
                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-violet-500 rounded-full shadow-sm"></div>
                            关键词
                          </Label>
                          <Input
                            placeholder="请输入关键词，多个关键词用逗号分隔"
                            value={rewriteConfig.keywords}
                            onChange={(e) => setRewriteConfig(prev => ({ ...prev, keywords: e.target.value }))}
                            className="h-14 border-2 border-violet-200/80 rounded-xl bg-white/90 backdrop-blur-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-300 text-base px-6 shadow-lg hover:shadow-xl"
                          />
                        </div>

                        {/* 植入位置 */}
                        <div className="space-y-6">
                          <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full shadow-sm"></div>
                            植入位置
                          </Label>
                          <div className="grid grid-cols-2 gap-4">
                            {seoPositionOptions.map((option) => (
                              <div key={option.id} className="group/item">
                                <div className="flex items-center space-x-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-violet-200/60 hover:border-violet-400 hover:bg-violet-50/50 transition-all duration-300 shadow-md hover:shadow-lg h-14 cursor-pointer">
                                  <Checkbox
                                    id={option.id}
                                    checked={rewriteConfig.seoPositions.includes(option.id)}
                                    onCheckedChange={(checked) => handleSeoPositionChange(option.id, checked as boolean)}
                                    className="border-2 border-violet-300 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500 w-5 h-5 shadow-sm"
                                  />
                                  <Label htmlFor={option.id} className="text-base font-semibold text-gray-700 cursor-pointer group-hover/item:text-violet-700 transition-colors duration-300">
                                    {option.label}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 右侧：内容雕琢色块 */}
                    <div className="relative group">
                      {/* 背景装饰 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
                      
                      <div className="relative bg-gradient-to-br from-emerald-50/95 to-teal-50/95 rounded-3xl border border-emerald-200/60 backdrop-blur-xl shadow-2xl p-8 space-y-8 h-full">
                        {/* 标题 */}
                        <div className="flex items-center gap-4 pb-4 border-b border-emerald-200/50">
                          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                            <Edit3 className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">内容雕琢</h3>
                        </div>
                        
                        {/* 笔记目的 */}
                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full shadow-sm"></div>
                            笔记目的
                          </Label>
                          <Select value={rewriteConfig.purpose} onValueChange={(value) => setRewriteConfig(prev => ({ ...prev, purpose: value }))}>
                            <SelectTrigger className="h-14 border-2 border-emerald-200/80 rounded-xl bg-white/90 backdrop-blur-sm hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl text-base">
                              <SelectValue placeholder="选择笔记目的" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto border-emerald-200">
                              {purposeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-base py-3 hover:bg-emerald-50">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* IP身份 */}
                        <div className="space-y-4">
                          <Label className="text-lg font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-3 h-3 bg-cyan-500 rounded-full shadow-sm"></div>
                            IP 身份
                          </Label>
                          <Select value={rewriteConfig.identity} onValueChange={(value) => setRewriteConfig(prev => ({ ...prev, identity: value }))}>
                            <SelectTrigger className="h-14 border-2 border-emerald-200/80 rounded-xl bg-white/90 backdrop-blur-sm hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 shadow-lg hover:shadow-xl text-base">
                              <SelectValue placeholder="选择IP身份" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto border-emerald-200">
                              {identityOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-base py-3 hover:bg-emerald-50">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI改写按钮 */}
                  <div className="mt-12 flex justify-center">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-red-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <Button 
                        onClick={handleRewrite}
                        disabled={isRewriting}
                        size="lg"
                        className="relative w-80 h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-0"
                      >
                        {isRewriting ? (
                          <>
                            <Sparkles className="mr-4 h-7 w-7 animate-spin" />
                            AI 改写中...
                          </>
                        ) : (
                          <>
                            <Edit3 className="mr-4 h-7 w-7" />
                            AI 一键改写
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Rewritten Versions */}
        {rewrittenVersions.length > 0 && (
          <div ref={rewrittenSectionRef} className="space-y-12">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-bold text-gray-900 tracking-tight">AI 改写结果</h2>
              <p className="text-xl text-gray-600 leading-relaxed">为您生成了 {rewrittenVersions.length} 个高质量改写版本</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {rewrittenVersions.map((version, index) => (
                <Card key={version.id} className="card-hover premium-shadow border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
                  <CardHeader className="space-y-4 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                        <div className="px-4 py-2 bg-purple-100/80 text-purple-700 rounded-full text-sm font-semibold border border-purple-200/50 backdrop-blur-sm">
                          {version.style}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleCopyContent(version.title, version.content)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg leading-relaxed font-semibold text-gray-900">
                      {version.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600 mb-3 block">文案内容</Label>
                      <Textarea
                        value={version.content}
                        readOnly
                        className="min-h-[400px] text-sm border-2 border-gray-200 rounded-xl resize-none bg-gray-50/50 backdrop-blur-sm focus:border-purple-300 transition-all duration-300"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}