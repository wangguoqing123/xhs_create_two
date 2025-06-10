import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        hasCozeToken: !!process.env.COZE_API_TOKEN,
        hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
        hasWorkflowId: !!process.env.COZE_WORKFLOW_DETAIL_ID,
      },
      services: {
        coze: process.env.COZE_API_TOKEN ? 'configured' : 'missing',
        openrouter: process.env.OPENROUTER_API_KEY ? 'configured' : 'missing',
        workflow: process.env.COZE_WORKFLOW_DETAIL_ID ? 'configured' : 'default'
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { message: '健康检查端点，请使用GET方法' },
    { status: 405 }
  );
} 