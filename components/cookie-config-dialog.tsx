'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { useCookieStorage } from '@/contexts/cookie-context';

interface CookieConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookieConfigDialog({ open, onOpenChange }: CookieConfigDialogProps) {
  const { cookie, saveCookie, clearCookie, validateCookie, hasCookie } = useCookieStorage();
  const [tempCookie, setTempCookie] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 当对话框打开时，初始化临时 cookie 值
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempCookie(cookie);
      setError('');
      setSuccess('');
    }
    onOpenChange(newOpen);
  };

  // 保存 cookie
  const handleSave = () => {
    setError('');
    setSuccess('');

    if (!tempCookie.trim()) {
      setError('Cookie 不能为空');
      return;
    }

    // 清理Cookie字符串
    const cleanedCookie = tempCookie
      .replace(/\n/g, '') // 移除换行符
      .replace(/\r/g, '') // 移除回车符
      .replace(/\t/g, '') // 移除制表符
      .trim(); // 移除首尾空格

    if (!validateCookie(cleanedCookie)) {
      setError('Cookie 格式不正确，请检查格式');
      return;
    }

    const saved = saveCookie(cleanedCookie);
    if (saved) {
      setSuccess('Cookie 配置保存成功！');
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } else {
      setError('保存失败，请重试');
    }
  };

  // 清除 cookie
  const handleClear = () => {
    const cleared = clearCookie();
    if (cleared) {
      setTempCookie('');
      setSuccess('Cookie 已清除');
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } else {
      setError('清除失败，请重试');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            小红书 Cookie 配置
          </DialogTitle>
          <DialogDescription>
            配置小红书 Cookie 以获取笔记内容。Cookie 将安全地存储在本地浏览器中。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cookie">Cookie 字符串</Label>
            <Textarea
              id="cookie"
              placeholder="请粘贴从浏览器复制的 Cookie 字符串..."
              value={tempCookie}
              onChange={(e) => setTempCookie(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          {/* 状态提示 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* 使用说明 */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>如何获取 Cookie：</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>打开浏览器，访问小红书网站并登录</li>
                  <li>按 F12 打开开发者工具</li>
                  <li>在 Network 选项卡中刷新页面</li>
                  <li>找到任意请求，在 Headers 中复制 Cookie 值</li>
                  <li>将完整的 Cookie 字符串粘贴到上方文本框中</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          {/* 当前状态 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">
              当前状态: {hasCookie ? '已配置 Cookie' : '未配置 Cookie'}
            </span>
            {hasCookie && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                清除
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!tempCookie.trim()}>
            保存配置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 