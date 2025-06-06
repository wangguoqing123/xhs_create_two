'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Library, Filter, Calendar, Tag } from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

const mockTopics: Topic[] = [
  {
    id: '1',
    title: '秋季护肤必备 | 换季肌肤问题全解析',
    description: '分享秋季护肤的关键步骤，包括保湿、防敏感等实用技巧',
    status: 'completed',
    createdAt: '2024-01-15',
    tags: ['护肤', '秋季'],
    priority: 'high'
  },
  {
    id: '2',
    title: '职场新人穿搭指南 | 低预算也能穿出高级感',
    description: '推荐适合职场新人的平价穿搭单品和搭配技巧',
    status: 'in-progress',
    createdAt: '2024-01-14',
    tags: ['穿搭', '职场'],
    priority: 'high'
  },
  {
    id: '3',
    title: '居家收纳神器 | 小空间大容量的秘密',
    description: '分享实用的收纳技巧和好用的收纳工具推荐',
    status: 'pending',
    createdAt: '2024-01-13',
    tags: ['收纳', '居家'],
    priority: 'medium'
  },
  {
    id: '4',
    title: '健康轻食制作 | 上班族的营养午餐',
    description: '简单易做的健康轻食recipes，适合忙碌的上班族',
    status: 'pending',
    createdAt: '2024-01-12',
    tags: ['美食', '健康'],
    priority: 'medium'
  }
];

const statusConfig = {
  pending: { label: '待办', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'in-progress': { label: '进行中', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-800 border-green-200' }
};

const priorityConfig = {
  high: { label: '高优先级', color: 'bg-red-100 text-red-800 border-red-200' },
  medium: { label: '中优先级', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  low: { label: '低优先级', color: 'bg-gray-100 text-gray-800 border-gray-200' }
};

export default function TopicLibraryPage() {
  const [topics, setTopics] = useState<Topic[]>(mockTopics);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    status: 'pending' as Topic['status'],
    tags: '',
    priority: 'medium' as Topic['priority']
  });

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || topic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddTopic = () => {
    if (!newTopic.title.trim()) return;

    const topic: Topic = {
      id: Date.now().toString(),
      title: newTopic.title,
      description: newTopic.description,
      status: newTopic.status,
      createdAt: new Date().toISOString().split('T')[0],
      tags: newTopic.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      priority: newTopic.priority
    };

    setTopics([topic, ...topics]);
    setNewTopic({ title: '', description: '', status: 'pending', tags: '', priority: 'medium' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const handleStatusChange = (id: string, newStatus: Topic['status']) => {
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, status: newStatus } : topic
    ));
  };

  const getStatusCounts = () => {
    return {
      total: topics.length,
      pending: topics.filter(t => t.status === 'pending').length,
      inProgress: topics.filter(t => t.status === 'in-progress').length,
      completed: topics.filter(t => t.status === 'completed').length
    };
  };

  const counts = getStatusCounts();

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-full border border-green-200">
            <Library className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">选题库管理</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
            选题库
            <span className="text-gradient"> 管理中心</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            统一管理所有创意选题，跟踪执行状态，提升内容创作效率
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{counts.total}</div>
              <div className="text-sm text-gray-600 font-medium">总选题数</div>
            </CardContent>
          </Card>
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{counts.pending}</div>
              <div className="text-sm text-gray-600 font-medium">待办选题</div>
            </CardContent>
          </Card>
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{counts.inProgress}</div>
              <div className="text-sm text-gray-600 font-medium">进行中</div>
            </CardContent>
          </Card>
          <Card className="premium-shadow border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{counts.completed}</div>
              <div className="text-sm text-gray-600 font-medium">已完成</div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="premium-shadow border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Library className="h-6 w-6 text-white" />
              </div>
              控制面板
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                      <Plus className="h-4 w-4 mr-2" />
                      添加新选题
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">添加新选题</DialogTitle>
                      <DialogDescription className="text-base">
                        填写选题信息，添加到您的选题库中
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-base font-medium">选题标题</Label>
                        <Input
                          id="title"
                          value={newTopic.title}
                          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                          placeholder="输入选题标题"
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-base font-medium">选题描述</Label>
                        <Textarea
                          id="description"
                          value={newTopic.description}
                          onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                          placeholder="详细描述选题内容和要点"
                          className="min-h-[100px] text-base"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-base font-medium">状态</Label>
                          <Select value={newTopic.status} onValueChange={(value: Topic['status']) => setNewTopic({ ...newTopic, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">待办</SelectItem>
                              <SelectItem value="in-progress">进行中</SelectItem>
                              <SelectItem value="completed">已完成</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-base font-medium">优先级</Label>
                          <Select value={newTopic.priority} onValueChange={(value: Topic['priority']) => setNewTopic({ ...newTopic, priority: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">高优先级</SelectItem>
                              <SelectItem value="medium">中优先级</SelectItem>
                              <SelectItem value="low">低优先级</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tags" className="text-base font-medium">标签</Label>
                          <Input
                            id="tags"
                            value={newTopic.tags}
                            onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                            placeholder="用逗号分隔"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTopic} className="bg-gradient-to-r from-blue-600 to-purple-600">
                        添加选题
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="搜索选题..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 focus:border-blue-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-2 focus:border-blue-500">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="pending">待办</SelectItem>
                    <SelectItem value="in-progress">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topics Table */}
        <Card className="premium-shadow border-0">
          <CardHeader>
            <CardTitle className="text-2xl">选题列表 ({filteredTopics.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead className="w-[45%] text-base font-semibold">选题信息</TableHead>
                    <TableHead className="w-[15%] text-base font-semibold">状态</TableHead>
                    <TableHead className="w-[15%] text-base font-semibold">优先级</TableHead>
                    <TableHead className="w-[15%] text-base font-semibold">创建日期</TableHead>
                    <TableHead className="w-[10%] text-base font-semibold">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTopics.map((topic) => (
                    <TableRow key={topic.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                      <TableCell className="py-6">
                        <div className="space-y-3">
                          <div className="font-semibold text-gray-900 text-lg leading-relaxed">
                            {topic.title}
                          </div>
                          <div className="text-gray-600 leading-relaxed">
                            {topic.description}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {topic.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={topic.status}
                          onValueChange={(value: Topic['status']) => handleStatusChange(topic.id, value)}
                        >
                          <SelectTrigger className="w-full border-0 bg-transparent">
                            <Badge className={`${statusConfig[topic.status].color} border`}>
                              {statusConfig[topic.status].label}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <Badge className={statusConfig.pending.color}>
                                {statusConfig.pending.label}
                              </Badge>
                            </SelectItem>
                            <SelectItem value="in-progress">
                              <Badge className={statusConfig['in-progress'].color}>
                                {statusConfig['in-progress'].label}
                              </Badge>
                            </SelectItem>
                            <SelectItem value="completed">
                              <Badge className={statusConfig.completed.color}>
                                {statusConfig.completed.label}
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${priorityConfig[topic.priority].color} border`}>
                          {priorityConfig[topic.priority].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{topic.createdAt}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}