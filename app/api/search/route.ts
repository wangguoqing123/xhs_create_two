import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, noteType = 0, sort = 0, totalNumber = 20, cookieStr } = body;

    if (!keywords) {
      return NextResponse.json(
        { error: '缺少必要参数：keywords' },
        { status: 400 }
      );
    }

    if (!cookieStr) {
      return NextResponse.json(
        { error: '缺少必要参数：cookieStr，请先配置小红书 Cookie' },
        { status: 400 }
      );
    }

    // 使用用户提供的Cookie字符串
    const workflowId = "7511639630044119067";

    const token = process.env.COZE_API_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: '缺少 COZE_API_TOKEN 环境变量' },
        { status: 500 }
      );
    }

    // 调用Coze API
    const response = await fetch('https://api.coze.cn/v1/workflow/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parameters: {
          cookieStr,
          keywords,
          noteType,
          sort,
          totalNumber
        },
        workflow_id: workflowId
      })
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // 解析返回数据
    let searchData;
    if (result.data) {
      try {
        searchData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      } catch (e) {
        console.error('解析 response.data 失败:', e);
        throw new Error('响应数据格式错误');
      }
    } else {
      throw new Error('未找到有效的响应数据');
    }

    // 检查返回状态
    if (searchData.code !== 0) {
      throw new Error(`搜索失败：${searchData.msg || '未知错误'}`);
    }

    // 处理嵌套数据
    let parsedData;
    if (searchData.data) {
      if (typeof searchData.data === 'string') {
        try {
          parsedData = JSON.parse(searchData.data);
        } catch (e) {
          console.error('解析嵌套数据失败:', e);
          throw new Error('嵌套数据格式错误');
        }
      } else {
        parsedData = searchData.data;
      }
    } else {
      throw new Error('响应中没有找到数据字段');
    }

    // 返回格式化的数据
    return NextResponse.json({
      success: true,
      data: parsedData,
      total: Array.isArray(parsedData) ? parsedData.length : 0
    });

  } catch (error) {
    console.error('搜索API错误:', error);

    return NextResponse.json(
      { error: '搜索失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
} 