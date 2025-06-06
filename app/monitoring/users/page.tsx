'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Clock, TrendingUp, Eye, Heart, MessageSquare, Share, Zap } from 'lucide-react';
import Image from 'next/image';

interface ContentItem {
  id: string;
  timestamp: string;
  authorName: string;
  authorAvatar: string;
  authorFollowers: string;
  noteTitle: string;
  noteCover: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  isNew: boolean;
  category: string;
}

const mockContentFeed: ContentItem[] = [
  {
    id: '1',
    timestamp: '2024-01-15 14:30',
    authorName: '小美护肤日记',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    authorFollowers: '158.2K',
    noteTitle: '冬季护肤必备 | 这5款面霜真的好用到哭',
    noteCover: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 2841,
    comments: 287,
    views: 15420,
    shares: 156,
    isNew: true,
    category: '护肤'
  },
  {
    id: '2',
    timestamp: '2024-01-15 12:45',
    authorName: '时尚达人YUKI',
    authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    authorFollowers: '89.7K',
    noteTitle: '职场穿搭 | 今年最流行的通勤look分享',
    noteCover: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 1567,
    comments: 156,
    views: 8934,
    shares: 89,
    isNew: true,
    category: '穿搭'
  },
  {
    id: '3',
    timestamp: '2024-01-15 10:20',
    authorName: '美食探店王',
    authorAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    authorFollowers: '234.5K',
    noteTitle: '上海网红餐厅 | 这家日料真的太绝了！',
    noteCover: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 3421,
    comments: 445,
    views: 21367,
    shares: 234,
    isNew: false,
    category: '美食'
  },
  {
    id: '4',
    timestamp: '2024-01-15 09:15',
    authorName: '健身小达人',
    authorAvatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100',
    authorFollowers: '67.3K',
    noteTitle: '居家健身 | 15分钟瘦腰瘦腿操',
    noteCover: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 892,
    comments: 78,
    views: 5621,
    shares: 45,
    isNew: false,
    category: '健身'
  },
  {
    id: '5',
    timestamp: '2024-01-14 18:30',
    authorName: '居家收纳师',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    authorFollowers: '125.8K',
    noteTitle: '小户型收纳 | 让家瞬间大一倍的神器',
    noteCover: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300',
    likes: 1876,
    comments: 203,
    views: 12454,
    shares: 98,
    isNew: false,
    category: '居家'
  }
];

export default function UserMonitoringPage() {
  const [contentFeed, setContentFeed] = useState<ContentItem[]>(mockContentFeed);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBlogger, setNewBlogger] = useState({
    name: '',
    profileUrl: ''
  });

  const handleAddBlogger = () => {
    if (!newBlogger.name.trim() || !newBlogger.profileUrl.trim()) return;

    // Mock add functionality
    console.log('Adding blogger:', newBlogger);
    setNewBlogger({ name: '', profileUrl: '' });
    setIsAddDialogOpen(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const totalViews = contentFeed.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = contentFeed.reduce((sum, item) => sum + item.likes, 0);
  const newContentToday = contentFeed.filter(item => item.isNew).length;

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-full border border-blue-200">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">用户内容监控</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
            用户内容
            <span className="text-gradient"> 实时监控</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            实时监控目标博主的内容发布动态，第一时间获取行业趋势和热点内容
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
              <div className="text-sm text-gray-600 font-medium">监控博主</div>
            </CardContent>
          </Card>
          
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4 mx-auto">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{newContentToday}</div>
              <div className="text-sm text-gray-600 font-medium">今日新增</div>
            </CardContent>
          </Card>
          
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4 mx-auto">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{formatNumber(totalViews)}</div>
              <div className="text-sm text-gray-600 font-medium">总浏览量</div>
            </CardContent>
          </Card>
          
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4 mx-auto">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">14:30</div>
              <div className="text-sm text-gray-600 font-medium">最后更新</div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="premium-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              控制面板
            </CardTitle>
            <CardDescription className="text-lg">
              添加新的监控博主，系统将自动追踪其内容动态
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  添加监控博主
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">添加监控博主</DialogTitle>
                  <DialogDescription className="text-base">
                    填写博主信息，系统将开始监控其内容发布动态
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="blogger-name" className="text-base font-medium">博主昵称</Label>
                    <Input
                      id="blogger-name"
                      value={newBlogger.name}
                      onChange={(e) => setNewBlogger({ ...newBlogger, name: e.target.value })}
                      placeholder="输入博主昵称"
                      className="text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-url" className="text-base font-medium">主页链接</Label>
                    <Input
                      id="profile-url"
                      value={newBlogger.profileUrl}
                      onChange={(e) => setNewBlogger({ ...newBlogger, profileUrl: e.target.value })}
                      placeholder="粘贴博主主页链接"
                      className="text-base"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddBlogger} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    开始监控
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Content Timeline */}
        <Card className="premium-shadow border-0">
          <CardHeader>
            <CardTitle className="text-2xl">内容动态时间线</CardTitle>
            <CardDescription className="text-lg">
              实时展示所有监控博主的最新内容发布动态
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {contentFeed.map((item) => (
                <div key={item.id} className="group p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl hover:from-blue-50 hover:to-purple-50/30 transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                        <AvatarImage src={item.authorAvatar} />
                        <AvatarFallback>{item.authorName[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-gray-900 text-lg">{item.authorName}</span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                          {item.authorFollowers} 粉丝
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          {item.category}
                        </Badge>
                        {item.isNew && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
                            <Zap className="h-3 w-3 mr-1" />
                            新发布
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 ml-auto">{item.timestamp}</span>
                      </div>

                      <div className="flex gap-6 items-start">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gray-200 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <Image
                              src={item.noteCover}
                              alt="笔记封面"
                              width={96}
                              height={96}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 space-y-4">
                          <p className="font-semibold text-gray-900 text-lg leading-relaxed group-hover:text-blue-600 transition-colors duration-300">
                            发布了新内容：{item.noteTitle}
                          </p>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-gray-700">{formatNumber(item.likes)}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">{formatNumber(item.comments)}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                              <Eye className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700">{formatNumber(item.views)}</span>
                            </div>
                            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                              <Share className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">{formatNumber(item.shares)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50">
                加载更多内容
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}