'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Heart, Sparkles, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// 导入AI服务的类型定义
import type { UserInput, GenerationResult, TopicSuggestion } from '@/app/lib/aiService';

export default function TopicGeneratorPage() {
  // 表单输入状态
  const [keyword, setKeyword] = useState('');               // 核心关键词
  const [targetUser, setTargetUser] = useState('');         // 目标用户
  const [userPain, setUserPain] = useState('');             // 用户痛点
  const [contentGoal, setContentGoal] = useState('');       // 内容目标
  
  // 生成结果状态
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);  // 是否正在生成
  const [error, setError] = useState<string | null>(null);  // 错误信息
  
  // 收藏功能状态
  const [savedTopics, setSavedTopics] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // 处理生成选题的主要函数
  const handleGenerate = async () => {
    // 验证必填字段
    if (!keyword.trim()) {
      toast({
        title: "请输入核心关键词",
        description: "核心关键词是生成选题的基础，不能为空",
        variant: "destructive",
      });
      return;
    }
    
    // 设置加载状态，清除之前的错误和结果
    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);
    
    try {
      console.log('🎯 开始生成选题:', keyword);
      
      // 构建API请求的用户输入数据
      const userInput: UserInput = {
        coreTheme: keyword.trim(),                    // 核心主题（必填）
        targetAudience: targetUser || undefined,      // 目标受众（可选）
        userPainPoints: userPain || undefined,        // 用户痛点（可选）
        contentGoal: contentGoal || undefined         // 内容目标（可选）
      };
      
      console.log('📤 发送请求数据:', userInput);
      
      // 调用后端API生成选题
      const response = await fetch('/api/generate-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });

      console.log('📥 API响应状态:', response.status);

      // 检查API响应是否成功
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成选题失败，请稍后重试');
      }

      // 解析API返回的结果数据
      const result: GenerationResult = await response.json();
      console.log('✅ 选题生成成功，数量:', result.topics.length);
      
      // 保存生成结果到状态
      setGenerationResult(result);
      
      // 显示成功提示
      toast({
        title: "选题生成成功！",
        description: `为您生成了 ${result.topics.length} 个创意选题`,
        className: "border-green-200 bg-green-50 text-green-900",
      });
      
    } catch (err) {
      // 错误处理
      console.error('❌ 生成选题失败:', err);
      const errorMessage = err instanceof Error ? err.message : '生成选题时发生未知错误';
      setError(errorMessage);
      
      // 显示错误提示
      toast({
        title: "生成失败",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      // 无论成功失败都要重置加载状态
      setIsGenerating(false);
    }
  };

  // 处理开始新的生成（重置所有状态）
  const handleGenerateNew = () => {
    setGenerationResult(null);  // 清除之前的结果
    setError(null);             // 清除错误信息
    setIsGenerating(false);     // 重置加载状态
  };

  const handleSaveToLibrary = (topicId: string) => {
    const newSavedTopics = new Set(savedTopics);
    if (newSavedTopics.has(topicId)) {
      newSavedTopics.delete(topicId);
      setSavedTopics(newSavedTopics);
      // 显示取消收藏提示
      toast({
        title: "取消收藏成功",
        description: (
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-orange-600" />
            <span>已从选题库中移除该创意选题</span>
          </div>
        ),
        className: "border-orange-200 bg-orange-50 text-orange-900",
      });
    } else {
      newSavedTopics.add(topicId);
      setSavedTopics(newSavedTopics);
      // 显示收藏成功提示
      toast({
        title: "收藏成功",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>创意选题已保存到您的选题库</span>
          </div>
        ),
        className: "border-emerald-200 bg-emerald-50 text-emerald-900",
      });
    }
  };

  const handleSearchRelatedNotes = (topicId: string) => {
    // Mock search functionality
    console.log('Searching related notes for topic:', topicId);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
            <Lightbulb className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">AI 智能选题生成</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
            创意选题
            <span className="text-gradient"> 智能生成</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            输入关键词和参数，AI为您生成个性化创意选题，让内容创作更加高效
          </p>
        </div>

        {/* Input Section */}
        <Card className="premium-shadow border-0 overflow-hidden">
          <CardContent className="p-12 space-y-10">
            {/* Keyword Input - 放大输入框 */}
            <div className="space-y-4">
              <Label htmlFor="keyword" className="text-2xl font-bold text-gray-900">核心关键词</Label>
              <Textarea
                id="keyword"
                placeholder="请输入您想要创作的核心关键词，例如：护肤、穿搭、美食、健身..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="min-h-[200px] text-xl border-2 focus:border-blue-500 transition-colors duration-300 p-6 rounded-xl"
              />
            </div>

            {/* Parameters and Button Row */}
            <div className="flex items-end gap-6">
              {/* Parameters - 缩小并并列 */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Select value={targetUser} onValueChange={setTargetUser}>
                    <SelectTrigger className="text-sm h-10 border-2 focus:border-blue-500">
                      <SelectValue placeholder="选择用户画像" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Z世代 (95-05年)">Z世代 (95-05年)</SelectItem>
                      <SelectItem value="都市白领">都市白领</SelectItem>
                      <SelectItem value="宝妈群体">宝妈群体</SelectItem>
                      <SelectItem value="大学生">大学生</SelectItem>
                      <SelectItem value="中年群体">中年群体</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={userPain} onValueChange={setUserPain}>
                    <SelectTrigger className="text-sm h-10 border-2 focus:border-blue-500">
                      <SelectValue placeholder="选择用户痛点" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="时间不够用">时间不够用</SelectItem>
                      <SelectItem value="预算有限">预算有限</SelectItem>
                      <SelectItem value="技能不足">技能不足</SelectItem>
                      <SelectItem value="选择困难">选择困难</SelectItem>
                      <SelectItem value="效率低下">效率低下</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Select value={contentGoal} onValueChange={setContentGoal}>
                    <SelectTrigger className="text-sm h-10 border-2 focus:border-blue-500">
                      <SelectValue placeholder="选择内容目标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="涨粉引流">涨粉引流</SelectItem>
                      <SelectItem value="产品种草">产品种草</SelectItem>
                      <SelectItem value="品牌宣传">品牌宣传</SelectItem>
                      <SelectItem value="知识分享">知识分享</SelectItem>
                      <SelectItem value="提升互动">提升互动</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button - 右对齐 */}
              <div className="flex-shrink-0">
                <Button 
                  onClick={handleGenerate}
                  disabled={!keyword.trim() || isGenerating}
                  size="lg"
                  className="px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 h-10"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      生成创意选题
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Section - 错误显示区域 */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900">生成失败</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <Button 
                onClick={handleGenerateNew}
                variant="outline"
                className="mt-4 border-red-200 text-red-700 hover:bg-red-100"
              >
                重新尝试
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Section - 生成结果展示区域 */}
        {generationResult && generationResult.topics.length > 0 && (
          <div className="space-y-8">
            {/* Results Header - 结果标题 */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">生成结果</h2>
              <p className="text-xl text-gray-600">
                为您生成了 {generationResult.topics.length} 个高质量创意选题
              </p>
              
              {/* AI推断信息展示 */}
              {generationResult.inferredInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
                  <h3 className="font-semibold text-blue-900 mb-2">AI 分析结果</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">目标用户:</span>
                      <span className="text-blue-700 ml-2">{generationResult.inferredInfo.targetAudience}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">核心痛点:</span>
                      <span className="text-blue-700 ml-2">{generationResult.inferredInfo.userPainPoints}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Topics Grid - 选题卡片网格 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {generationResult.topics.map((topic: TopicSuggestion, index: number) => (
                <Card key={topic.id} className="card-hover premium-shadow border-0 overflow-hidden">
                  <CardHeader className="space-y-4">
                    <CardTitle className="text-xl leading-relaxed text-gray-900 flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="flex-1">{topic.title}</span>
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed text-gray-600 ml-11">
                      {topic.coreIssue}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* 选题详细信息 */}
                    <div className="ml-11 space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-600">内容类型:</span>
                        <span className="text-sm text-gray-700">{topic.contentType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-purple-600">创作视角:</span>
                        <span className="text-sm text-gray-700">{topic.creativeAngle}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-medium text-green-600">解决痛点:</span>
                        <span className="text-sm text-gray-700 flex-1">{topic.targetPainPoint}</span>
                      </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => handleSearchRelatedNotes(topic.id)}
                        variant="outline"
                        size="sm"
                        className="border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        搜索相关笔记
                      </Button>
                      <Button
                        onClick={() => handleSaveToLibrary(topic.id)}
                        variant="outline"
                        size="sm"
                        className={`border-2 transition-all duration-300 ${
                          savedTopics.has(topic.id)
                            ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400'
                            : 'border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <Heart className={`mr-2 h-4 w-4 ${savedTopics.has(topic.id) ? 'fill-current' : ''}`} />
                        {savedTopics.has(topic.id) ? '已收藏' : '收藏到选题库'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Generate New Button - 生成新选题按钮 */}
            <div className="text-center">
              <Button 
                onClick={handleGenerateNew}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-base border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                生成新的选题
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}