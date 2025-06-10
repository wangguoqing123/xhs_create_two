'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Search, Heart, MessageCircle, Share2, Play, ExternalLink, Sparkles, ChevronDown, Filter, CheckCircle, ChevronLeft, ChevronRight, X, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCookieStorage } from '@/contexts/cookie-context';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface XiaohongshuNote {
  note_id: string;
  note_display_title: string;
  note_cover_url_default: string;
  note_liked_count: number;
  note_card_type: string;
  note_url: string;
  auther_nick_name: string;
  auther_avatar: string;
  auther_user_id: string;
  auther_home_page_url: string;
  note_cover_height: string;
  note_xsec_token: string;
  note_cover_uri_pre: string;
  note_model_type: string;
  note_liked: boolean;
  note_cover_width: string;
}

interface NoteDetail {
  title: string;
  content: string;
  images: string[];
  author: {
    nickname: string;
    avatar: string;
    userId: string;
    homePageUrl: string;
  };
  stats: {
    likedCount: number;
    collectedCount: number;
    commentCount: number;
    shareCount: number;
  };
  noteId: string;
  noteUrl: string;
  createTime: string;
  tags: string[];
}

// 删除mock数据，改用真实API数据

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<XiaohongshuNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<XiaohongshuNote | null>(null);
  const [noteDetail, setNoteDetail] = useState<NoteDetail | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  // 筛选状态
  const [sortRule, setSortRule] = useState<'综合' | '最新' | '最热'>('综合');
  const [queryType, setQueryType] = useState<'全部' | '图文' | '视频'>('全部');
  const [searchCount, setSearchCount] = useState<20 | 40 | 60 | 100>(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Cookie 管理
  const { cookie, hasCookie, isLoaded } = useCookieStorage();
  
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    if (!hasCookie) {
      toast({
        title: "请先配置 Cookie",
        description: "请在导航栏配置小红书 Cookie 后再进行搜索",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setSearchResults([]);
    setHasSearched(true);
    
    try {
      // 映射前端选项到API参数
      const noteTypeMap = { '全部': 0, '图文': 2, '视频': 1 };
      const sortMap = { '综合': 0, '最新': 1, '最热': 2 };
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: searchQuery,
          noteType: noteTypeMap[queryType],
          sort: sortMap[sortRule],
          totalNumber: searchCount,
          cookieStr: cookie
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '搜索失败');
      }

      if (result.success && result.data) {
        const results = Array.isArray(result.data) ? result.data : [];
        setSearchResults(results);
        
        toast({
          title: "搜索成功！",
          description: `找到 ${results.length} 个相关笔记`,
          className: "border-green-200 bg-green-50 text-green-900",
        });
      } else {
        throw new Error('搜索失败：未获取到数据');
      }
    } catch (err) {
      console.error('搜索错误:', err);
      setSearchResults([]);
      
      toast({
        title: "搜索失败",
        description: err instanceof Error ? err.message : '搜索时发生未知错误',
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNoteClick = async (note: XiaohongshuNote) => {
    if (!hasCookie) {
      toast({
        title: "请先配置 Cookie",
        description: "请在导航栏配置小红书 Cookie 后再查看详情",
        variant: "destructive",
      });
      return;
    }

    setSelectedNote(note);
    setNoteDetail(null);
    setCurrentImageIndex(0);
    setIsDialogOpen(true);
    setIsLoadingDetail(true);
    
    try {
      // 调用详情接口获取完整信息
      const response = await fetch('/api/xiaohongshu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteUrl: note.note_url,
          cookieStr: cookie,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '获取详情失败');
      }

      if (result.success && result.data) {
        setNoteDetail(result.data);
      } else {
        throw new Error('获取详情失败：未获取到数据');
      }
    } catch (err) {
      console.error('获取详情错误:', err);
      toast({
        title: "获取详情失败",
        description: err instanceof Error ? err.message : '获取详情时发生未知错误',
        variant: "destructive",
      });
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleTagSearch = (tag: string) => {
    setSearchQuery(tag);
    setIsDialogOpen(false); // 隐藏弹框
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleFilterConfirm = () => {
    setIsFilterOpen(false);
    // 如果已有搜索结果，重新搜索
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  const handlePreviousImage = () => {
    if (noteDetail && noteDetail.images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === 0 ? noteDetail.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (noteDetail && noteDetail.images.length > 1) {
      setCurrentImageIndex(prev => 
        prev === noteDetail.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleImageWheel = (e: React.WheelEvent) => {
    if (noteDetail && noteDetail.images.length > 1) {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleNextImage();
      } else {
        handlePreviousImage();
      }
    }
  };

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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-pink-50/30 px-6 py-15">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 px-8 py-4 rounded-full border border-purple-200 shadow-lg">
              <Search className="h-6 w-6 text-purple-600" />
              <span className="text-lg font-bold text-purple-700">小红书内容搜索</span>
            </div>
            <h1 className="text-7xl lg:text-8xl font-black text-gray-900 tracking-tight">
              小红书
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> 搜索</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
              发现优质内容，获取创作灵感，探索热门话题
            </p>
          </div>

          {/* Parser Section */}
          <Card className="premium-shadow border-0 overflow-hidden bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-15 space-y-12">
              <div className="space-y-8 p-16">
                {/* <div className="flex items-center justify-between">
                  <Label htmlFor="link" className="text-3xl font-bold text-gray-900">搜索关键词</Label>
                </div> */}
                
                <div className="flex gap-8">
                  <Input
                    id="link"
                    placeholder="搜索小红书内容..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-xl h-20 border-4 border-gray-200 focus:border-purple-500 rounded-3xl px-8 shadow-lg"
                  />
                  <Button 
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching || !hasCookie}
                    size="lg"
                    className="px-16 h-20 text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl disabled:opacity-50"
                  >
                    {isSearching ? (
                      <>
                        <Sparkles className="mr-4 h-8 w-8 animate-spin" />
                        搜索中...
                      </>
                    ) : (
                      <>
                        <Search className="mr-4 h-8 w-8" />
                        开始搜索
                      </>
                    )}
                  </Button>
                </div>

                {/* Cookie 配置提示 */}
                {!hasCookie && isLoaded && (
                  <Alert className="text-lg border-orange-200 bg-orange-50">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      请先在导航栏配置小红书 Cookie 才能进行搜索。
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center space-x-6 text-lg text-gray-500">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span>支持搜索小红书笔记的标题、文字内容和图片信息</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {isSearching ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">正在搜索</h3>
                  <p className="text-gray-500">正在为您搜索相关内容，请稍候...</p>
                </div>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-8">
              {/* 搜索结果筛选栏 */}
              <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-3xl border border-green-200 shadow-xl p-8">
                <div className="flex items-center justify-between">
                  {/* 左侧标题信息 */}
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">搜索成功</h2>
                      <p className="text-lg text-gray-600 mt-1">
                        搜索关键词 "<span className="font-semibold text-purple-600">{searchQuery}</span>"，找到 {searchResults.length} 个结果
                      </p>
                    </div>
                  </div>
                  
                                    {/* 右侧筛选按钮 */}
                  <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="px-8 py-4 text-lg bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-2xl shadow-lg transition-all duration-300"
                      >
                        <Filter className="h-5 w-5 mr-3" />
                        {sortRule}
                        <ChevronDown className="h-5 w-5 ml-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-80 p-6 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl"
                    >
                      {/* 排序规则 */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-lg font-bold text-gray-900">排序规则</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {(['综合', '最新', '最热'] as const).map((rule) => (
                            <Button
                              key={rule}
                              variant={sortRule === rule ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSortRule(rule)}
                              className={`rounded-xl transition-all duration-300 ${
                                sortRule === rule 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {rule}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="my-4" />
                      
                      {/* 查询类型 */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-lg font-bold text-gray-900">查询类型</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {(['全部', '图文', '视频'] as const).map((type) => (
                            <Button
                              key={type}
                              variant={queryType === type ? "default" : "outline"}
                              size="sm"
                              onClick={() => setQueryType(type)}
                              className={`rounded-xl transition-all duration-300 ${
                                queryType === type 
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {type}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="my-4" />
                      
                      {/* 搜索数量 */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-lg font-bold text-gray-900">搜索数量</h4>
                        <div className="grid grid-cols-4 gap-2">
                          {([20, 40, 60, 100] as const).map((count) => (
                            <Button
                              key={count}
                              variant={searchCount === count ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSearchCount(count)}
                              className={`rounded-xl transition-all duration-300 ${
                                searchCount === count 
                                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {count}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <DropdownMenuSeparator className="my-4" />
                      
                      {/* 确定按钮 */}
                      <div className="pt-2">
                        <Button
                          onClick={handleFilterConfirm}
                          className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          确定
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {searchResults.map((note) => (
                  <Card
                    key={note.note_id}
                    className="group cursor-pointer overflow-hidden border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white rounded-2xl"
                    onClick={() => handleNoteClick(note)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-[3/4] overflow-hidden rounded-t-2xl">
                          <img
                            src={note.note_cover_url_default}
                            alt={note.note_display_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {note.note_card_type === 'video' && (
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full p-2">
                              <Play className="w-4 h-4 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5 space-y-4">
                          <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                            {note.note_display_title}
                          </h3>
                          
                          <div className="flex items-center space-x-2">
                            <img
                              src={note.auther_avatar}
                              alt={note.auther_nick_name}
                              className="w-7 h-7 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-gray-700 truncate">
                                {note.auther_nick_name}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3.5 h-3.5" />
                                <span>{formatNumber(note.note_liked_count)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-10 h-10 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">未找到相关内容</h3>
                  <p className="text-gray-500">
                    没有找到关键词 "<span className="font-semibold text-purple-600">{searchQuery}</span>" 的相关笔记，请尝试其他关键词
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setHasSearched(false);
                  }}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  重新搜索
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[1200px] w-[90vw] h-[85vh] p-0 overflow-hidden bg-white rounded-2xl">
            {selectedNote && (
              <div className="flex h-full">
                {/* 图片展示区域 - 左侧，严格3:4比例 */}
                <div className="flex-shrink-0 bg-black rounded-l-2xl overflow-hidden relative">
                  <div className="w-[calc(85vh*0.75)] h-[85vh] flex items-center justify-center relative">
                    <div 
                      className="w-full max-h-full relative flex items-center justify-center"
                      onWheel={handleImageWheel}
                    >
                      {isLoadingDetail ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <Loader2 className="w-12 h-12 text-white animate-spin" />
                          <p className="text-white/80 text-lg font-medium">正在加载高清图片...</p>
                        </div>
                      ) : noteDetail ? (
                        <>
                          <div className="aspect-[3/4] w-full max-h-full flex items-center justify-center">
                            <img
                              src={noteDetail.images[currentImageIndex] || selectedNote.note_cover_url_default}
                              alt={noteDetail.title}
                              className="max-w-full max-h-full object-contain shadow-xl transition-all duration-300"
                            />
                          </div>
                          
                          {/* 多图切换控件 */}
                          {noteDetail.images.length > 1 && (
                            <>
                              {/* 左右切换按钮 */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 backdrop-blur-sm"
                                onClick={handlePreviousImage}
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </Button>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 backdrop-blur-sm"
                                onClick={handleNextImage}
                              >
                                <ChevronRight className="w-6 h-6" />
                              </Button>
                              
                              {/* 图片计数 */}
                              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                                {currentImageIndex + 1} / {noteDetail.images.length}
                              </div>
                              
                              {/* 图片指示器 */}
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                                {noteDetail.images.map((_, index) => (
                                  <button
                                    key={index}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                      index === currentImageIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/80 hover:scale-110'
                                    }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="aspect-[3/4] w-full max-h-full flex items-center justify-center">
                          <img
                            src={selectedNote.note_cover_url_default}
                            alt={selectedNote.note_display_title}
                            className="max-w-full max-h-full object-contain shadow-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 右侧详情区域 */}
                <div className="w-[400px] flex flex-col bg-white relative">
                  {/* 用户信息区域 */}
                  <div className="flex-shrink-0 p-4 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <img
                        src={noteDetail?.author.avatar || selectedNote.auther_avatar}
                        alt={noteDetail?.author.nickname || selectedNote.auther_nick_name}
                        className="w-10 h-10 rounded-full border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {noteDetail?.author.nickname || selectedNote.auther_nick_name}
                          </h3>
                        </div>
                        {noteDetail?.createTime && (
                          <p className="text-xs text-gray-500 mt-0.5">{noteDetail.createTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* 正文内容区域 - 可滚动，精确计算高度 */}
                  <div className="overflow-y-auto" style={{height: 'calc(80vh - 300px)'}}>
                    {isLoadingDetail ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                        <span className="ml-3 text-gray-500 text-sm">加载详情中...</span>
                      </div>
                    ) : noteDetail ? (
                      <div className="p-4 space-y-4">
                        {/* 标题 */}
                        <h2 className="text-base font-bold text-gray-900 leading-tight">
                          {noteDetail.title}
                        </h2>
                        
                        {/* 互动数据 */}
                        <div className="flex items-center space-x-4 pb-2">
                          <div className="flex items-center space-x-1.5 text-gray-800">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatNumber(noteDetail.stats.likedCount)}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-gray-800">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatNumber(noteDetail.stats.commentCount)}</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-gray-800">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatNumber(noteDetail.stats.shareCount)}</span>
                          </div>
                        </div>
                        
                        {/* 正文内容 */}
                        <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                          {removeTopicsFromContent(noteDetail.content)}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-4">
                        <h2 className="text-base font-bold text-gray-900 leading-tight">
                          {selectedNote.note_display_title}
                        </h2>
                        
                        <div className="flex items-center space-x-4 pb-2">
                          <div className="flex items-center space-x-1.5 text-gray-800">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">{formatNumber(selectedNote.note_liked_count)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 话题区域 - 固定在正文下方 */}
                  {noteDetail && noteDetail.tags && noteDetail.tags.length > 0 && (
                    <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 font-medium">相关话题</div>
                        <div className="flex flex-wrap gap-1.5">
                          {noteDetail.tags.map((tag, index) => (
                            <button
                              key={index}
                              className="inline-flex items-center px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full hover:bg-red-100 transition-colors duration-200"
                              onClick={() => handleTagSearch(tag)}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 底部按钮区域 - 固定在底部 */}
                  <div className="flex-shrink-0 border-t border-gray-100 p-4">
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg text-sm transition-all duration-200"
                        onClick={() => window.open(selectedNote.note_url, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        查看原文
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-50 font-medium py-2.5 rounded-lg text-sm transition-all duration-200"
                        onClick={() => {
                          const rewriteUrl = `/rewrite?url=${encodeURIComponent(selectedNote.note_url)}`;
                          window.open(rewriteUrl, '_blank');
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI 改写
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
} 