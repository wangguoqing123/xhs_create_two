import { NextRequest, NextResponse } from 'next/server';
import { CozeService } from '@/app/lib/coze-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noteUrl, cookieStr } = body;

    if (!noteUrl || !cookieStr) {
      return NextResponse.json(
        { error: '缺少必要参数：noteUrl 或 cookieStr' },
        { status: 400 }
      );
    }

    // 创建 Coze 服务实例
    const cozeService = CozeService.create();

    // 解析小红书笔记
    const noteData = await cozeService.parseXiaohongshuNote(noteUrl, cookieStr);

    return NextResponse.json({
      success: true,
      data: noteData
    });

  } catch (error) {
    console.error('小红书笔记解析错误:', error);

    return NextResponse.json(
      { error: '服务器内部错误', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 