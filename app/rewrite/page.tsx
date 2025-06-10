'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Link, Sparkles, Edit3, Zap, CheckCircle, Image as ImageIcon, FileText, Palette, Grid3X3, Copy, Download, RefreshCw, Target, Wand2, AlertCircle } from 'lucide-react';
import { useCookieStorage } from '@/contexts/cookie-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

// 导入AI服务的类型定义
import type { RewriteInput, RewriteResult, RewriteVersion } from '@/app/lib/aiService';

interface OriginalContent {
  title: string;
  content: string;
  images: string[];
}

interface RewriteSettings {
  seoKeywords: string;
  seoPositions: string[];
  theme: string;
  purpose: string;
  ipIdentity: string;
}

interface RewrittenVersion {
  id: string;
  title: string;
  content: string;
  style: string;
}

interface CoverTemplate {
  id: string;
  name: string;
  preview: string;
  style: string;
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
    'https://images.pexels.com/photos/7686297/pexels-photo-7686297.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400'
  ]
};

const mockRewrittenVersions: RewrittenVersion[] = [
  {
    id: '1',
    title: '【护肤秘籍】秋季换季护肤全攻略 | 5步告别干燥敏感',
    content: `姐妹们，秋天来了！作为护肤达人，我必须要和大家分享这个超实用的换季护肤方法✨

最近后台好多小伙伴问我换季护肤的问题，今天就来详细分享我的秋季护肤心得，让你轻松应对换季肌肤问题💕

🌟 第一步：温和清洁是关键
换季时期肌肤屏障脆弱，一定要选择温和的氨基酸洁面，避免过度清洁

🌟 第二步：保湿精华不能少  
秋季干燥，保湿是重中之重！推荐使用含有玻尿酸成分的精华

🌟 第三步：防晒365天不间断
紫外线一年四季都存在，防晒工作绝对不能松懈

🌟 第四步：面膜护理要跟上
每周2-3次的补水面膜，给肌肤充足的水分补给

🌟 第五步：内调外养同步进行
多喝水，保证充足睡眠，配合健康饮食

按照这个方法坚持下去，你的肌肤一定会感谢你的！有任何问题欢迎评论区交流哦～

#护肤 #秋季护肤 #换季护肤`,
    style: '专业干货型'
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

按照这个步骤坚持下去，你的肌肤一定会感谢你的！💕

#护肤攻略 #秋季护肤 #护肤干货`,
    style: '教程指南型'
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

这套方法我用了很多年，真的很有效！试试看吧～🌸

#换季护肤 #护肤心得 #美肌秘籍`,
    style: '亲和分享型'
  }
];

const coverTemplates: CoverTemplate[] = [
  {
    id: '1',
    name: '简约文字',
    preview: 'https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&w=300',
    style: '简约风格，突出文字内容'
  },
  {
    id: '2',
    name: '时尚拼图',
    preview: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=300',
    style: '多图拼接，时尚美观'
  },
  {
    id: '3',
    name: '产品展示',
    preview: 'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=300',
    style: '突出产品，专业展示'
  },
  {
    id: '4',
    name: '生活场景',
    preview: 'https://images.pexels.com/photos/7686297/pexels-photo-7686297.jpeg?auto=compress&cs=tinysrgb&w=300',
    style: '生活化场景，亲和力强'
  }
];

const mockGeneratedCovers = [
  'https://images.pexels.com/photos/6373478/pexels-photo-6373478.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/7686297/pexels-photo-7686297.jpeg?auto=compress&cs=tinysrgb&w=400'
];

const seoPositionOptions = [
  { id: 'title', label: '标题' },
  { id: 'opening', label: '开头' },
  { id: 'content', label: '正文' },
  { id: 'ending', label: '结尾' }
];

export default function RewritePage() {
  const searchParams = useSearchParams();
  const [linkUrl, setLinkUrl] = useState('');
  const [originalContent, setOriginalContent] = useState<OriginalContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('copywriting');
  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [parseError, setParseError] = useState('');
  
  // Cookie 管理
  const { cookie, hasCookie, isLoaded } = useCookieStorage();
  
  // Toast 通知
  const { toast } = useToast();

  // 处理URL参数，自动解析内容
  useEffect(() => {
    const urlParam = searchParams.get('url');
    if (urlParam && isLoaded && hasCookie) {
      setLinkUrl(decodeURIComponent(urlParam));
      // 延迟一点时间确保状态更新完成
      setTimeout(() => {
        handleParseContentFromUrl(decodeURIComponent(urlParam));
      }, 100);
    }
  }, [searchParams, isLoaded, hasCookie]);

  // 从正文中移除话题标签，保持原有换行格式
  const removeTopicsFromContent = (content: string) => {
    if (!content) return '';
    // 移除 #话题名称# 格式的话题标签，但保持换行
    return content
      .replace(/#[^#\s]+#/g, '') // 移除话题标签
      .replace(/\n\s*\n/g, '\n\n') // 规范化多个换行为双换行
      .replace(/[ \t]+/g, ' ') // 将多个空格/制表符替换为单个空格
      .trim(); // 去除首尾空白
  };

  // 从正文中提取话题标签
  const extractTopicsFromContent = (content: string): string[] => {
    if (!content) return [];
    const matches = content.match(/#[^#\s]+#/g);
    if (!matches) return [];
    // 去除#号并去重
    return Array.from(new Set(matches.map(tag => tag.replace(/#/g, ''))));
  };

  // 从URL参数自动解析内容的函数
  const handleParseContentFromUrl = async (url: string) => {
    if (!url.trim()) return;

    if (!isValidUrl(url)) {
      setParseError('请输入有效的小红书笔记链接');
      return;
    }

    if (!hasCookie) {
      setParseError('请先配置 Cookie');
      return;
    }
    
    setIsLoading(true);
    setParseError('');
    setOriginalContent(null);

    try {
      const response = await fetch('/api/xiaohongshu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteUrl: url,
          cookieStr: cookie,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '解析失败');
      }

      if (result.success && result.data) {
        setOriginalContent({
          title: result.data.title,
          content: result.data.content,
          images: result.data.images
        });
        
        toast({
          title: "内容解析成功！",
          description: "已自动解析笔记内容，可以开始改写了",
          className: "border-green-200 bg-green-50 text-green-900",
        });
        
        // 解析完成后自动滚动到成功提示区域
        setTimeout(() => {
          const element = document.getElementById('parse-success');
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      } else {
        throw new Error('解析失败：未获取到数据');
      }
    } catch (err) {
      console.error('解析错误:', err);
      setParseError(err instanceof Error ? err.message : '解析失败，请重试');
      
      toast({
        title: "解析失败",
        description: err instanceof Error ? err.message : '解析失败，请重试',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 计算字符数（考虑Emoji占两个字符）
  const countCharacters = (text: string): number => {
    let count = 0;
    for (const char of text) {
      // 检查是否为Emoji（简单判断，使用Unicode范围）
      const codePoint = char.codePointAt(0);
      if (codePoint && codePoint >= 0x1F300 && codePoint <= 0x1F9FF) {
        count += 2; // Emoji算2个字符
      } else {
        count += 1; // 其他字符算1个字符
      }
    }
    return count;
  };
  
  // 文案仿写相关状态
  const [rewriteSettings, setRewriteSettings] = useState<RewriteSettings>({
    seoKeywords: '',
    seoPositions: [],
    theme: '',
    purpose: '',
    ipIdentity: ''
  });
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenVersions, setRewrittenVersions] = useState<RewrittenVersion[]>([]);
  
  // 封面生成相关状态
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [generatedCovers, setGeneratedCovers] = useState<string[]>([]);
  
  // 内页图生成相关状态
  const [imageGenerationType, setImageGenerationType] = useState<'similar' | 'info'>('similar');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  // 验证链接格式
  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('xiaohongshu.com');
    } catch {
      return false;
    }
  };

  const handleParseContent = async () => {
    if (!linkUrl.trim()) {
      setParseError('请输入小红书笔记链接');
      return;
    }

    if (!isValidUrl(linkUrl)) {
      setParseError('请输入有效的小红书笔记链接');
      return;
    }

    if (!hasCookie) {
      setParseError('请先配置 Cookie');
      return;
    }
    
    setIsLoading(true);
    setParseError('');
    setOriginalContent(null);

    try {

      
      const response = await fetch('/api/xiaohongshu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteUrl: linkUrl,
          cookieStr: cookie,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '解析失败');
      }

      if (result.success && result.data) {
        setOriginalContent({
          title: result.data.title,
          content: result.data.content,
          images: result.data.images
        });
        
        // 解析完成后自动滚动到成功提示区域
        setTimeout(() => {
          const element = document.getElementById('parse-success');
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      } else {
        throw new Error('解析失败：未获取到数据');
      }
    } catch (err) {
      console.error('解析错误:', err);
      setParseError(err instanceof Error ? err.message : '解析失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeoPositionChange = (positionId: string, checked: boolean) => {
    setRewriteSettings(prev => ({
      ...prev,
      seoPositions: checked 
        ? [...prev.seoPositions, positionId]
        : prev.seoPositions.filter((id: string) => id !== positionId)
    }));
  };

  const handleRewrite = async () => {
    if (!originalContent) {
      toast({
        title: "请先解析内容",
        description: "请先粘贴并解析小红书笔记链接",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    setRewrittenVersions([]);

    try {
      console.log('🎯 开始文案改写:', originalContent.title);
      
      // 构建API请求的用户输入数据
      const rewriteInput: RewriteInput = {
        originalTitle: originalContent.title,
        originalContent: originalContent.content,
        seoKeywords: rewriteSettings.seoKeywords || undefined,
        seoPositions: rewriteSettings.seoPositions.length > 0 ? rewriteSettings.seoPositions : undefined,
        theme: rewriteSettings.theme || undefined,
        purpose: rewriteSettings.purpose || undefined,
        ipIdentity: rewriteSettings.ipIdentity || undefined
      };
      
      console.log('📤 发送改写请求数据:', rewriteInput);
      
      // 调用后端API进行文案改写
      const response = await fetch('/api/generate-rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rewriteInput),
      });

      console.log('📥 API响应状态:', response.status);

      // 检查API响应是否成功
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '文案改写失败，请稍后重试');
      }

      // 解析API返回的结果数据
      const result: RewriteResult = await response.json();
      console.log('✅ 文案改写成功，版本数量:', result.versions.length);
      
      // 转换为页面需要的格式
      const convertedVersions: RewrittenVersion[] = result.versions.map((version: RewriteVersion) => ({
        id: version.id,
        title: version.title,
        content: version.content,
        style: version.style
      }));
      
      // 保存改写结果到状态
      setRewrittenVersions(convertedVersions);
      
      // 显示成功提示
      toast({
        title: "文案改写成功！",
        description: `为您生成了 ${result.versions.length} 个高质量改写版本`,
        className: "border-green-200 bg-green-50 text-green-900",
      });
      
    } catch (err) {
      // 错误处理
      console.error('❌ 文案改写失败:', err);
      const errorMessage = err instanceof Error ? err.message : '文案改写时发生未知错误';
      
      // 显示错误提示
      toast({
        title: "改写失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // 无论成功失败都要重置加载状态
      setIsRewriting(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!selectedTemplate) return;
    
    setIsGeneratingCover(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedCovers(mockGeneratedCovers);
      setIsGeneratingCover(false);
    }, 3000);
  };

  const handleImageSelection = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleGenerateImages = async () => {
    setIsGeneratingImages(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedImages(originalContent?.images.slice(1) || []);
      setIsGeneratingImages(false);
    }, 2500);
  };

  return (
    <MainLayout>
      <div className="space-y-16">
        {/* Header */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 px-8 py-4 rounded-full border border-purple-200 shadow-lg">
            <Edit3 className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-bold text-purple-700">AI 智能改写工作台</span>
          </div>
          <h1 className="text-7xl lg:text-8xl font-black text-gray-900 tracking-tight">
            爆文
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> 智能改写</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
            解析热门笔记链接，AI一键生成多维度改写内容，让创作更高效
          </p>
        </div>

        {/* Parser Section */}
        <Card className="premium-shadow border-0 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
          {/* <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-blue-100 py-12">
            <CardTitle className="flex items-center gap-6 text-4xl font-bold">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl">
                <Link className="h-10 w-10 text-white" />
              </div>
              内容解析器
            </CardTitle>
            <CardDescription className="text-2xl mt-6 text-gray-600 font-light">
              粘贴小红书笔记链接，我们将智能解析内容并提供全方位改写服务
            </CardDescription>
          </CardHeader> */}
          <CardContent className="p-16 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Label htmlFor="link" className="text-3xl font-bold text-gray-900">小红书笔记链接</Label>
              </div>
              
              <div className="flex gap-8">
                <Input
                  id="link"
                  placeholder="请粘贴小红书笔记链接，例如：https://www.xiaohongshu.com/explore/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1 text-xl h-20 border-4 border-gray-200 focus:border-purple-500 rounded-3xl px-8 shadow-lg"
                />
                <Button 
                  onClick={handleParseContent}
                  disabled={!linkUrl.trim() || isLoading || !hasCookie}
                  size="lg"
                  className="px-16 h-20 text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="mr-4 h-8 w-8 animate-spin" />
                      解析中...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-4 h-8 w-8" />
                      开始解析
                    </>
                  )}
                </Button>
              </div>

              {/* 错误提示 */}
              {parseError && (
                <Alert variant="destructive" className="text-lg">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              {/* URL 格式验证提示 */}
              {linkUrl && !isValidUrl(linkUrl) && (
                <Alert variant="destructive" className="text-lg">
                  <AlertCircle className="h-5 w-5" />
                  <AlertDescription>
                    请输入有效的小红书笔记链接
                  </AlertDescription>
                </Alert>
              )}

              {/* Cookie 配置提示 */}
              {!hasCookie && isLoaded && (
                <Alert className="text-lg border-orange-200 bg-orange-50">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    请先在导航栏配置小红书 Cookie 才能解析笔记内容。
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex items-center space-x-6 text-lg text-gray-500">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>支持解析小红书笔记的标题、文字内容和图片信息</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workspace - Only show after parsing */}
        {originalContent && (
          <div className="space-y-12">
            {/* Parse Success Notification */}
            <div className="text-center" id="parse-success">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-50 to-emerald-50 px-12 py-6 rounded-3xl border border-green-200 shadow-xl">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-green-700">内容解析完成！开始您的创作之旅</span>
              </div>
            </div>

            {/* Main Workspace */}
            <Card className="premium-shadow border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 py-10">
                <CardTitle className="text-4xl font-bold text-gray-900">AI 创作工作台</CardTitle>
                <CardDescription className="text-xl mt-4 text-gray-600">
                  选择不同的创作模式，让AI为您生成高质量内容
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  {/* 世界级Tab设计 */}
                  <div className="relative bg-gradient-to-r from-slate-50 to-blue-50 p-8">
                    <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-xl p-3 rounded-3xl shadow-2xl border border-white/20">
                      <TabsTrigger 
                        value="copywriting" 
                        className="text-xl py-6 rounded-2xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105"
                      >
                        <FileText className="h-6 w-6 mr-3" />
                        文案仿写
                      </TabsTrigger>
                      <TabsTrigger 
                        value="cover" 
                        className="text-xl py-6 rounded-2xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105"
                      >
                        <Palette className="h-6 w-6 mr-3" />
                        封面生成
                      </TabsTrigger>
                      <TabsTrigger 
                        value="inner-images" 
                        className="text-xl py-6 rounded-2xl font-semibold transition-all duration-500 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-2xl data-[state=active]:scale-105"
                      >
                        <Grid3X3 className="h-6 w-6 mr-3" />
                        内页图生成
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* 文案仿写面板 */}
                  <TabsContent value="copywriting" className="p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      {/* 左栏：原文展示 */}
                      <div className="space-y-10">
                        <div className="space-y-6">
                          <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                            <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                            原文标题
                          </h3>
                          <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-200 shadow-lg">
                            <p className="text-2xl font-bold text-gray-900 leading-relaxed">
                              {originalContent.title}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                            <div className="w-3 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            原文正文
                          </h3>
                          <div className="p-8 bg-gray-50 rounded-3xl border border-gray-200 max-h-[600px] overflow-y-auto shadow-lg">
                            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed text-lg">
                              {removeTopicsFromContent(originalContent.content)}
                            </pre>
                          </div>
                        </div>

                        {/* 话题标签展示 */}
                        {extractTopicsFromContent(originalContent.content).length > 0 && (
                          <div className="space-y-6">
                            <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                              <div className="w-3 h-10 bg-gradient-to-b from-pink-500 to-rose-500 rounded-full"></div>
                              相关话题
                            </h3>
                            <div className="p-8 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl border border-pink-200 shadow-lg">
                              <div className="flex flex-wrap gap-3">
                                {extractTopicsFromContent(originalContent.content).map((tag, index) => (
                                  <div
                                    key={index}
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                                  >
                                    #{tag}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 右栏：仿写设置 */}
                      <div className="space-y-12">
                        {/* SEO 设置模块 */}
                        <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border border-green-200 shadow-xl">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                              <Target className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">SEO 设置</h3>
                          </div>
                          
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <Label className="text-xl font-bold text-gray-900">SEO 关键词</Label>
                              <Input
                                value={rewriteSettings.seoKeywords}
                                onChange={(e) => setRewriteSettings(prev => ({ ...prev, seoKeywords: e.target.value }))}
                                placeholder="输入核心关键词，如：护肤、美妆、穿搭"
                                className="text-lg h-14 border-3 border-green-200 focus:border-green-500 rounded-2xl"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xl font-bold text-gray-900">SEO 位置埋入</Label>
                              <div className="grid grid-cols-2 gap-4">
                                {seoPositionOptions.map((option) => (
                                  <div key={option.id} className="flex items-center space-x-4 p-4 bg-white rounded-2xl shadow-md border border-green-100">
                                    <Checkbox
                                      id={option.id}
                                      checked={rewriteSettings.seoPositions.includes(option.id)}
                                      onCheckedChange={(checked) => handleSeoPositionChange(option.id, checked as boolean)}
                                      className="w-5 h-5"
                                    />
                                    <Label htmlFor={option.id} className="text-lg font-semibold cursor-pointer">
                                      {option.label}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 内容设置模块 */}
                        <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-200 shadow-xl">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
                              <Wand2 className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900">内容设置</h3>
                          </div>
                          
                          <div className="space-y-8">
                            <div className="space-y-4">
                              <Label className="text-xl font-bold text-gray-900">特定主题改写</Label>
                              <Input
                                value={rewriteSettings.theme}
                                onChange={(e) => setRewriteSettings(prev => ({ ...prev, theme: e.target.value }))}
                                placeholder="如：秋季护肤、职场穿搭、健康饮食"
                                className="text-lg h-14 border-3 border-pink-200 focus:border-pink-500 rounded-2xl"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xl font-bold text-gray-900">改写目的</Label>
                              <Input
                                value={rewriteSettings.purpose}
                                onChange={(e) => setRewriteSettings(prev => ({ ...prev, purpose: e.target.value }))}
                                placeholder="如：涨粉引流、产品种草、知识分享"
                                className="text-lg h-14 border-3 border-pink-200 focus:border-pink-500 rounded-2xl"
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-xl font-bold text-gray-900">IP 身份</Label>
                              <Input
                                value={rewriteSettings.ipIdentity}
                                onChange={(e) => setRewriteSettings(prev => ({ ...prev, ipIdentity: e.target.value }))}
                                placeholder="如：护肤达人、时尚博主、健身教练"
                                className="text-lg h-14 border-3 border-pink-200 focus:border-pink-500 rounded-2xl"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 生成按钮 */}
                        <div className="pt-8">
                          <Button
                            onClick={handleRewrite}
                            disabled={isRewriting}
                            size="lg"
                            className="w-full h-20 text-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl"
                          >
                            {isRewriting ? (
                              <>
                                <Sparkles className="mr-4 h-8 w-8 animate-spin" />
                                AI 仿写中...
                              </>
                            ) : (
                              <>
                                <Wand2 className="mr-4 h-8 w-8" />
                                开始仿写
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 三列仿写结果展示 */}
                    {rewrittenVersions.length > 0 && (
                      <div className="mt-16 space-y-12">
                        <div className="text-center">
                          <h2 className="text-5xl font-bold text-gray-900 mb-4">AI 仿写结果</h2>
                          <p className="text-2xl text-gray-600">为您生成了 3 个高质量改写版本</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {rewrittenVersions.map((version, index) => (
                            <Card key={version.id} className="premium-shadow border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50/50 hover:shadow-3xl transition-all duration-500">
                              <CardHeader className="space-y-6 p-8">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                                      {index + 1}
                                    </div>
                                    <Badge className="px-4 py-2 bg-purple-100 text-purple-700 border border-purple-200 text-base font-semibold">
                                      {version.style}
                                    </Badge>
                                  </div>
                                  <div className={`text-sm ${countCharacters(version.title) > 20 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                    标题: {countCharacters(version.title)}/20字
                                  </div>
                                </div>
                                <CardTitle className="text-2xl leading-relaxed font-bold text-gray-900">
                                  {version.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-8 p-8">
                                <div>
                                  <div className="flex items-center justify-between mb-4">
                                    <Label className="text-lg font-bold text-gray-600">文案内容</Label>
                                    <div className={`text-sm ${countCharacters(version.content) > 800 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                                      正文: {countCharacters(version.content)}/800字
                                    </div>
                                  </div>
                                  <Textarea
                                    value={version.content}
                                    readOnly
                                    className="min-h-[400px] text-base border-3 border-gray-200 resize-none rounded-2xl"
                                  />
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                  <Button
                                    onClick={() => navigator.clipboard.writeText(`${version.title}\n\n${version.content}`)}
                                    className="w-full h-14 border-3 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 rounded-2xl text-lg font-semibold"
                                    variant="outline"
                                  >
                                    <Copy className="mr-3 h-5 w-5" />
                                    复制内容
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* 封面生成面板 */}
                  <TabsContent value="cover" className="p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      {/* 左栏：原封面展示 - 3:4比例 */}
                      <div className="space-y-8">
                        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                          <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                          原始封面
                        </h3>
                        <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                          <Image
                            src={originalContent.images[0] && originalContent.images[0].includes('xhscdn.com') 
                              ? `/api/proxy-image?url=${encodeURIComponent(originalContent.images[0])}`
                              : originalContent.images[0] || ''
                            }
                            alt="原始封面"
                            fill
                            className="object-cover"
                            style={{ position: 'absolute' }}
                            unoptimized={originalContent.images[0] ? originalContent.images[0].includes('xhscdn.com') : false}
                          />
                        </div>
                      </div>

                      {/* 右栏：模板选择和生成 */}
                      <div className="space-y-12">
                        <div className="space-y-8">
                          <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                            <div className="w-3 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            选择封面模板
                          </h3>
                          
                          <div className="grid grid-cols-2 gap-6">
                            {coverTemplates.map((template) => (
                              <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`relative cursor-pointer rounded-3xl overflow-hidden border-4 transition-all duration-500 ${
                                  selectedTemplate === template.id
                                    ? 'border-purple-500 shadow-2xl scale-105'
                                    : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
                                }`}
                              >
                                <div className="relative aspect-[3/4]">
                                  <Image
                                    src={template.preview}
                                    alt={template.name}
                                    fill
                                    className="object-cover"
                                    style={{ position: 'absolute' }}
                                  />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                  <h4 className="font-bold text-xl mb-2">{template.name}</h4>
                                  <p className="text-sm opacity-90">{template.style}</p>
                                </div>
                                {selectedTemplate === template.id && (
                                  <div className="absolute top-4 right-4">
                                    <CheckCircle className="h-8 w-8 text-purple-500 bg-white rounded-full" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={handleGenerateCover}
                          disabled={!selectedTemplate || isGeneratingCover}
                          size="lg"
                          className="w-full h-20 text-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl disabled:opacity-50"
                        >
                          {isGeneratingCover ? (
                            <>
                              <Sparkles className="mr-4 h-8 w-8 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <Palette className="mr-4 h-8 w-8" />
                              生成封面
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* 生成结果 - 满宽展示，3:4比例 */}
                    {generatedCovers.length > 0 && (
                      <div className="mt-16 space-y-12">
                        <div className="text-center">
                          <h2 className="text-5xl font-bold text-gray-900 mb-4">生成结果</h2>
                          <p className="text-2xl text-gray-600">为您生成了 4 个高质量封面设计</p>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {generatedCovers.map((cover, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                                <Image
                                  src={cover}
                                  alt={`生成封面 ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  style={{ position: 'absolute' }}
                                />
                              </div>
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white shadow-lg rounded-xl">
                                  <Download className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* 内页图生成面板 */}
                  <TabsContent value="inner-images" className="p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                      {/* 左栏：原图展示 */}
                      <div className="space-y-8">
                        <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                          <div className="w-3 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                          原始内页图
                        </h3>
                        
                        {/* 主图 */}
                        <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                          <Image
                            src={(() => {
                              const imgSrc = originalContent.images[selectedMainImage + 1] || originalContent.images[1] || originalContent.images[0];
                              return imgSrc && imgSrc.includes('xhscdn.com') 
                                ? `/api/proxy-image?url=${encodeURIComponent(imgSrc)}`
                                : imgSrc || '';
                            })()}
                            alt="主要内页图"
                            fill
                            className="object-cover"
                            style={{ position: 'absolute' }}
                            unoptimized={(() => {
                              const imgSrc = originalContent.images[selectedMainImage + 1] || originalContent.images[1] || originalContent.images[0];
                              return imgSrc ? imgSrc.includes('xhscdn.com') : false;
                            })()}
                          />
                        </div>
                        
                        {/* 缩略图 */}
                        {originalContent.images.length > 1 && (
                          <div className="grid grid-cols-3 gap-4">
                            {originalContent.images.slice(1).map((image, index) => (
                              <div
                                key={index}
                                onClick={() => setSelectedMainImage(index)}
                                className={`relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer border-3 transition-all duration-300 ${
                                  selectedMainImage === index
                                    ? 'border-purple-500 shadow-xl scale-105'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                              >
                                <Image
                                  src={image.includes('xhscdn.com') 
                                    ? `/api/proxy-image?url=${encodeURIComponent(image)}`
                                    : image
                                  }
                                  alt={`内页图 ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  style={{ position: 'absolute' }}
                                  unoptimized={image.includes('xhscdn.com')}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 右栏：生成功能 */}
                      <div className="space-y-12">
                        {/* 生成类型选择 */}
                        <div className="space-y-8">
                          <h3 className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                            <div className="w-3 h-10 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                            选择生成类型
                          </h3>
                          
                          <div className="grid grid-cols-1 gap-6">
                            {/* 相似图片生成选项 */}
                            <div
                              onClick={() => setImageGenerationType('similar')}
                              className={`p-8 rounded-3xl border-3 cursor-pointer transition-all duration-500 ${
                                imageGenerationType === 'similar'
                                  ? 'border-green-500 bg-gradient-to-r from-green-50 to-blue-50 shadow-xl'
                                  : 'border-gray-200 bg-gray-50 hover:border-green-300'
                              }`}
                            >
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                                  <ImageIcon className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">相似图片生成</h4>
                                {imageGenerationType === 'similar' && (
                                  <CheckCircle className="h-8 w-8 text-green-500 ml-auto" />
                                )}
                              </div>
                              <p className="text-lg text-gray-700 leading-relaxed">
                                基于原图风格和内容，生成相似的高质量图片
                              </p>
                            </div>

                            {/* 干货图片生成选项 */}
                            <div
                              onClick={() => setImageGenerationType('info')}
                              className={`p-8 rounded-3xl border-3 cursor-pointer transition-all duration-500 ${
                                imageGenerationType === 'info'
                                  ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-rose-50 shadow-xl'
                                  : 'border-gray-200 bg-gray-50 hover:border-pink-300'
                              }`}
                            >
                              <div className="flex items-center space-x-4 mb-4">
                                <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
                                  <Grid3X3 className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">干货图片生成</h4>
                                {imageGenerationType === 'info' && (
                                  <CheckCircle className="h-8 w-8 text-pink-500 ml-auto" />
                                )}
                              </div>
                              <p className="text-lg text-gray-700 leading-relaxed">
                                生成包含知识点、步骤说明的信息图表
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 相似图片生成功能区 */}
                        {imageGenerationType === 'similar' && (
                          <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border border-green-200 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                                <ImageIcon className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">相似图片生成</h3>
                            </div>
                            
                            <div className="space-y-6">
                              <p className="text-lg text-gray-700 font-medium">请选择想要生成相似图片的原图：</p>
                              
                              {/* 选择缩略图 - 支持多选 */}
                              <div className="grid grid-cols-3 gap-4">
                                {originalContent.images.slice(1).map((image, index) => (
                                  <div
                                    key={index}
                                    onClick={() => handleImageSelection(index)}
                                    className={`relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-pointer border-3 transition-all duration-300 ${
                                      selectedImages.includes(index)
                                        ? 'border-green-500 shadow-xl scale-105 ring-4 ring-green-200'
                                        : 'border-gray-200 hover:border-green-300'
                                    }`}
                                  >
                                    <Image
                                      src={image.includes('xhscdn.com') 
                                        ? `/api/proxy-image?url=${encodeURIComponent(image)}`
                                        : image
                                      }
                                      alt={`选择图片 ${index + 1}`}
                                      fill
                                      className="object-cover"
                                      style={{ position: 'absolute' }}
                                      unoptimized={image.includes('xhscdn.com')}
                                    />
                                    {selectedImages.includes(index) && (
                                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle className="h-12 w-12 text-green-600 bg-white rounded-full" />
                                      </div>
                                    )}
                                    {/* 显示选择序号 */}
                                    {selectedImages.includes(index) && (
                                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        {selectedImages.indexOf(index) + 1}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              <div className="space-y-4">
                                {selectedImages.length > 0 && (
                                  <div className="text-center p-4 bg-green-50 rounded-2xl border border-green-200">
                                    <p className="text-green-700 font-medium">
                                      已选择 {selectedImages.length} 张图片，将为每张图片生成 4 个相似版本
                                    </p>
                                  </div>
                                )}
                                
                                <Button
                                  onClick={handleGenerateImages}
                                  disabled={isGeneratingImages || selectedImages.length === 0}
                                  size="lg"
                                  className="w-full h-16 text-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl disabled:opacity-50"
                                >
                                  {isGeneratingImages ? (
                                    <>
                                      <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                                      生成中...
                                    </>
                                  ) : selectedImages.length === 0 ? (
                                    <>
                                      <ImageIcon className="mr-3 h-6 w-6" />
                                      请先选择要生成的图片
                                    </>
                                  ) : (
                                    <>
                                      <ImageIcon className="mr-3 h-6 w-6" />
                                      生成 {selectedImages.length * 4} 张相似图片
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 干货图片生成功能区 */}
                        {imageGenerationType === 'info' && (
                          <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-200 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                              <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl">
                                <Grid3X3 className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="text-2xl font-bold text-gray-900">干货图片生成</h3>
                            </div>
                            
                            <div className="space-y-8">
                              {/* 步骤1：爬取文字 */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                                  <h4 className="text-xl font-bold text-gray-900">爬取图片文字</h4>
                                </div>
                                <Button
                                  onClick={() => {/* 爬取文字逻辑 */}}
                                  variant="outline"
                                  className="w-full h-14 border-2 border-pink-300 text-pink-700 hover:bg-pink-50 rounded-2xl text-lg font-semibold"
                                >
                                  <FileText className="mr-3 h-5 w-5" />
                                  一键爬取图片文字
                                </Button>
                              </div>

                              {/* 步骤2：选择干货封面模板 */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                                  <h4 className="text-xl font-bold text-gray-900">选择干货封面模板</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {['知识卡片', '步骤指南', '要点总结', '图文并茂'].map((template, index) => (
                                    <div
                                      key={index}
                                      className="p-4 border-2 border-pink-200 rounded-2xl hover:border-pink-400 hover:bg-pink-50 transition-all duration-300 cursor-pointer text-center"
                                    >
                                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                        <Grid3X3 className="h-6 w-6 text-white" />
                                      </div>
                                      <p className="font-semibold text-gray-700">{template}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* 步骤3：生成按钮 */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                                  <h4 className="text-xl font-bold text-gray-900">生成干货图片</h4>
                                </div>
                                <Button
                                  onClick={handleGenerateImages}
                                  disabled={isGeneratingImages}
                                  size="lg"
                                  className="w-full h-16 text-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl"
                                >
                                  {isGeneratingImages ? (
                                    <>
                                      <RefreshCw className="mr-3 h-6 w-6 animate-spin" />
                                      生成中...
                                    </>
                                  ) : (
                                    <>
                                      <Grid3X3 className="mr-3 h-6 w-6" />
                                      一键生成干货图片
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 生成结果展示 */}
                    {generatedImages.length > 0 && (
                      <div className="mt-16 space-y-12">
                        <div className="text-center">
                          <h2 className="text-5xl font-bold text-gray-900 mb-4">生成结果</h2>
                          <p className="text-2xl text-gray-600">
                            {imageGenerationType === 'similar' ? '为您生成了相似风格的图片' : '为您生成了干货信息图片'}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {generatedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                                <Image
                                  src={image}
                                  alt={`生成图片 ${index + 1}`}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button size="sm" className="bg-white/90 text-gray-700 hover:bg-white shadow-lg rounded-xl">
                                  <Download className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}


      </div>
    </MainLayout>
  );
} 