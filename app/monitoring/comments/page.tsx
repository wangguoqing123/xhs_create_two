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
import { Plus, MessageSquare, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface CommentItem {
  id: string;
  timestamp: string;
  noteTitle: string;
  noteCover: string;
  noteAuthor: string;
  commenterName: string;
  commenterAvatar: string;
  commentContent: string;
  likes: number;
  isHighlighted: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const mockCommentsFeed: CommentItem[] = [
  {
    id: '1',
    timestamp: '2024-01-15 15:45',
    noteTitle: '冬季护肤必备 | 这5款面霜真的好用到哭',
    noteCover: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=300',
    noteAuthor: '小美护肤日记',
    commenterName: '爱美小仙女',
    commenterAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    commentContent: '第三款面霜我也在用！确实很好用，特别是换季的时候，一点都不会干燥。博主推荐的都很靠谱👍',
    likes: 23,
    isHighlighted: true,
    sentiment: 'positive'
  },
  {
    id: '2',
    timestamp: '2024-01-15 15:20',
    noteTitle: '职场穿搭 | 今年最流行的通勤look分享',
    noteCover: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    noteAuthor: '时尚达人YUKI',
    commenterName: '职场小白领',
    commenterAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    commentContent: '这套搭配太适合我了！请问那件外套是什么牌子的呀？大概多少钱？',
    likes: 15,
    isHighlighted: false,
    sentiment: 'positive'
  },
  {
    id: '3',
    timestamp: '2024-01-15 14:55',
    noteTitle: '上海网红餐厅 | 这家日料真的太绝了！',
    noteCover: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=300',
    noteAuthor: '美食探店王',
    commenterName: '吃货小达人',
    commenterAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    commentContent: '看起来确实不错，但是价格有点贵吧？人均消费大概多少呀？',
    likes: 8,
    isHighlighted: false,
    sentiment: 'neutral'
  },
  {
    id: '4',
    timestamp: '2024-01-15 14:30',
    noteTitle: '居家健身 | 15分钟瘦腰瘦腿操',
    noteCover: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=300',
    noteAuthor: '健身小达人',
    commenterName: '减肥中的胖子',
    commenterAvatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=100',
    commentContent: '动作太难了，我这个初学者完全跟不上节奏😭 有没有更简单一点的版本？',
    likes: 12,
    isHighlighted: true,
    sentiment: 'negative'
  },
  {
    id: '5',
    timestamp: '2024-01-15 13:15',
    noteTitle: '小户型收纳 | 让家瞬间大一倍的神器',
    noteCover: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300',
    noteAuthor: '居家收纳师',
    commenterName: '整理控',
    commenterAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    commentContent: '太实用了！我已经下单了第二个收纳盒，确实很能装。谢谢博主的分享✨',
    likes: 34,
    isHighlighted: true,
    sentiment: 'positive'
  }
];

const sentimentConfig = {
  positive: { label: '正面', color: 'bg-green-100 text-green-800', icon: '😊' },
  negative: { label: '负面', color: 'bg-red-100 text-red-800', icon: '😟' },
  neutral: { label: '中性', color: 'bg-gray-100 text-gray-800', icon: '😐' }
};

export default function CommentMonitoringPage() {
  const [commentsFeed, setCommentsFeed] = useState<CommentItem[]>(mockCommentsFeed);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    url: ''
  });

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.url.trim()) return;

    // Mock add functionality
    console.log('Adding note for monitoring:', newNote);
    setNewNote({ title: '', url: '' });
    setIsAddDialogOpen(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const positiveComments = commentsFeed.filter(c => c.sentiment === 'positive').length;
  const negativeComments = commentsFeed.filter(c => c.sentiment === 'negative').length;
  const highlightedComments = commentsFeed.filter(c => c.isHighlighted).length;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">评论监控</h1>
          <p className="text-lg text-gray-600">实时监控重点笔记的评论动态和用户反馈</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">监控笔记</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">正面评论</p>
                  <p className="text-2xl font-bold text-green-600">{positiveComments}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">重点关注</p>
                  <p className="text-2xl font-bold text-orange-600">{highlightedComments}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">最后更新</p>
                  <p className="text-2xl font-bold text-purple-600">15:45</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              控制面板
            </CardTitle>
            <CardDescription>
              添加需要监控评论的笔记链接，系统将实时追踪评论变化
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  添加监控笔记
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>添加监控笔记</DialogTitle>
                  <DialogDescription>
                    填写笔记信息，系统将开始监控该笔记的评论动态
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="note-title">笔记标题</Label>
                    <Input
                      id="note-title"
                      value={newNote.title}
                      onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                      placeholder="输入笔记标题"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="note-url">笔记链接</Label>
                    <Input
                      id="note-url"
                      value={newNote.url}
                      onChange={(e) => setNewNote({ ...newNote, url: e.target.value })}
                      placeholder="粘贴小红书笔记链接"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddNote}>开始监控</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Comments Timeline */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>评论动态时间线</CardTitle>
            <CardDescription>
              实时展示所有监控笔记的最新评论动态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {commentsFeed.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg transition-colors duration-200 ${
                  item.isHighlighted ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.commenterAvatar} />
                        <AvatarFallback>{item.commenterName[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{item.commenterName}</span>
                        <Badge className={sentimentConfig[item.sentiment].color}>
                          {sentimentConfig[item.sentiment].icon} {sentimentConfig[item.sentiment].label}
                        </Badge>
                        {item.isHighlighted && (
                          <Badge className="bg-orange-100 text-orange-700">重点关注</Badge>
                        )}
                        <span className="text-sm text-gray-500 ml-auto">{item.timestamp}</span>
                      </div>

                      <div className="flex gap-4 items-start mb-3">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={item.noteCover}
                              alt="笔记封面"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-600 mb-1">
                            在笔记《<span className="font-medium text-gray-900">{item.noteTitle}</span>》中评论：
                          </p>
                          <p className="text-gray-900 leading-relaxed">
                            "{item.commentContent}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          👍 {item.likes}
                        </span>
                        <span>作者：{item.noteAuthor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">
                加载更多评论
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}