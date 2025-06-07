import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片URL参数' },
        { status: 400 }
      );
    }

    // 验证URL是否来自小红书
    if (!imageUrl.includes('xhscdn.com')) {
      return NextResponse.json(
        { error: '只支持小红书图片代理' },
        { status: 400 }
      );
    }

    // 获取图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.xiaohongshu.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`图片获取失败: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // 缓存1天
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('图片代理错误:', error);
    return NextResponse.json(
      { error: '图片代理失败' },
      { status: 500 }
    );
  }
}