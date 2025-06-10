import { NextRequest, NextResponse } from 'next/server';
import { CozeService } from '@/app/lib/coze-service';

export async function POST(request: NextRequest) {
  try {
    console.log('收到小红书解析请求');
    
    const body = await request.json();
    const { noteUrl, cookieStr } = body;

    console.log('请求参数:', { 
      noteUrl: noteUrl ? '已提供' : '未提供', 
      cookieStr: cookieStr ? '已提供' : '未提供' 
    });

    if (!noteUrl || !cookieStr) {
      console.error('参数验证失败:', { noteUrl: !!noteUrl, cookieStr: !!cookieStr });
      return NextResponse.json(
        { error: '缺少必要参数：noteUrl 或 cookieStr' },
        { status: 400 }
      );
    }

    console.log('开始创建Coze服务实例');
    // 创建 Coze 服务实例
    const cozeService = CozeService.create();

    console.log('开始解析小红书笔记');
    // 解析小红书笔记
    const noteData = await cozeService.parseXiaohongshuNote(noteUrl, cookieStr);

    console.log('小红书笔记解析成功');
    return NextResponse.json({
      success: true,
      data: noteData
    });

  } catch (error) {
    console.error('小红书笔记解析错误:', error);

    // 根据错误类型返回不同的错误信息
    let errorMessage = '服务器内部错误';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 如果是环境变量相关错误，返回503
      if (error.message.includes('环境变量') || error.message.includes('COZE_API_TOKEN')) {
        statusCode = 503;
        errorMessage = '服务配置错误，请联系管理员';
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
} 