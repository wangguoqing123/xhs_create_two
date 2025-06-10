// Next.js API路由 - 处理选题生成请求
// 这个文件是后端API端点，处理来自前端的POST请求

import { NextRequest, NextResponse } from 'next/server'
import { generateTopics, UserInput, GenerationResult } from '@/app/lib/aiService'

// 强制动态渲染，因为我们需要处理POST请求体
export const dynamic = 'force-dynamic'

// 处理POST请求的函数
export async function POST(request: NextRequest) {
  try {
    console.log('📨 收到选题生成请求')
    
    // 1. 解析请求体中的JSON数据，获取用户输入
    const userInput: UserInput = await request.json()
    
    // 验证必需的字段
    if (!userInput.coreTheme || userInput.coreTheme.trim() === '') {
      console.error('❌ 核心主题验证失败');
      return NextResponse.json(
        { error: '核心主题不能为空' }, 
        { status: 400 }  // 400 表示客户端请求错误
      )
    }
    
    console.log('🎯 用户输入:', {
      coreTheme: userInput.coreTheme,
      targetAudience: userInput.targetAudience,
      userPainPoints: userInput.userPainPoints,
      contentGoal: userInput.contentGoal
    })
    
    console.log('🚀 开始调用AI服务生成选题');
    // 2. 调用AI服务生成选题
    const result: GenerationResult = await generateTopics(userInput)
    
    console.log('✅ 选题生成成功，返回结果')
    
    // 3. 返回成功响应，包含生成的选题数据
    return NextResponse.json(result, { 
      status: 200,  // 200 表示请求成功
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    // 错误处理 - 记录错误并返回错误响应
    console.error('❌ 选题生成失败:', error)
    
    // 根据错误类型返回不同的错误信息
    let errorMessage = '选题生成时发生未知错误';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // 处理特定类型的错误
      if (error.message.includes('环境变量') || error.message.includes('OPENROUTER_API_KEY')) {
        statusCode = 503;
        errorMessage = '服务配置错误，请联系管理员';
      } else if (error.message.includes('超时') || error.message.includes('timeout')) {
        statusCode = 504;
        errorMessage = '请求超时，请稍后重试';
      } else if (error.message.includes('网络连接')) {
        statusCode = 502;
        errorMessage = '网络连接失败，请稍后重试';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()  // 添加时间戳便于调试
      }, 
      { status: statusCode }
    )
  }
}

// 处理其他HTTP方法的请求（如GET、PUT等）
export async function GET() {
  return NextResponse.json(
    { 
      message: '选题生成API端点',
      usage: '请使用POST方法发送选题生成请求',
      endpoint: '/api/generate-topics'
    }, 
    { status: 200 }
  )
}