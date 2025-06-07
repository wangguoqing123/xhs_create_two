// Next.js API路由 - 处理文案改写请求
// 这个文件是后端API端点，处理来自前端的POST请求

import { NextRequest, NextResponse } from 'next/server'
import { generateRewrite, RewriteInput, RewriteResult } from '@/app/lib/aiService'

// 强制动态渲染，因为我们需要处理POST请求体
export const dynamic = 'force-dynamic'

// 处理POST请求的函数
export async function POST(request: NextRequest) {
  try {
    console.log('📨 收到文案改写请求')
    
    // 1. 解析请求体中的JSON数据，获取用户输入
    const userInput: RewriteInput = await request.json()
    
    // 验证必需的字段
    if (!userInput.originalTitle || userInput.originalTitle.trim() === '') {
      return NextResponse.json(
        { error: '原始标题不能为空' }, 
        { status: 400 }  // 400 表示客户端请求错误
      )
    }

    if (!userInput.originalContent || userInput.originalContent.trim() === '') {
      return NextResponse.json(
        { error: '原始内容不能为空' }, 
        { status: 400 }
      )
    }
    
    console.log('🎯 用户输入:', {
      originalTitle: userInput.originalTitle,
      originalContent: userInput.originalContent.substring(0, 100) + '...',
      seoKeywords: userInput.seoKeywords,
      seoPositions: userInput.seoPositions,
      theme: userInput.theme,
      purpose: userInput.purpose,
      ipIdentity: userInput.ipIdentity
    })
    
    // 2. 调用AI服务生成改写版本
    const result: RewriteResult = await generateRewrite(userInput)
    
    console.log('✅ 文案改写成功，返回结果')
    
    // 3. 返回成功响应，包含生成的改写数据
    return NextResponse.json(result, { 
      status: 200,  // 200 表示请求成功
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
  } catch (error) {
    // 错误处理 - 记录错误并返回错误响应
    console.error('❌ 文案改写失败:', error)
    
    // 根据错误类型返回不同的错误信息
    const errorMessage = error instanceof Error ? error.message : '文案改写时发生未知错误'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()  // 添加时间戳便于调试
      }, 
      { status: 500 }  // 500 表示服务器内部错误
    )
  }
}

// 处理其他HTTP方法的请求（如GET、PUT等）
export async function GET() {
  return NextResponse.json(
    { 
      message: '文案改写API端点',
      usage: '请使用POST方法发送文案改写请求',
      endpoint: '/api/generate-rewrite'
    }, 
    { status: 200 }
  )
} 