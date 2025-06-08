import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keywords, noteType = 0, sort = 0, totalNumber = 20 } = body;

    if (!keywords) {
      return NextResponse.json(
        { error: '缺少必要参数：keywords' },
        { status: 400 }
      );
    }

    // 固定的Cookie字符串和workflow_id
    const cookieStr = "abRequestId=bcc474b6-9535-53b3-8729-0faddc44a244; a1=196e7ea0582vo9ozc2czk9jvzze7yh7oo6uww2zk430000847149; webId=910ade238051bf5af6c011ab7b0b4910; gid=yjKdWd08dDlSyjKdWd082KJuYJhljluSJSuT7T4jVhuudEq8WvxWlE888Y4Wy4j8SJyyqf0K; x-user-id-ad.xiaohongshu.com=61b6a28f0000000021025318; customerClientId=360864754824591; web_session=040069b0c2e1c7d4034e52a91e3a4b7fb1ab5f; x-user-id-pgy.xiaohongshu.com=61b6a28f0000000021025318; x-user-id-creator.xiaohongshu.com=61b6a28f0000000021025318; access-token-creator.xiaohongshu.com=customer.creator.AT-68c517510000847120470270uh9udvkh04phcbmz; galaxy_creator_session_id=H7TTUX041pvgznp76CLWjWtkOwmYqaW2nthE; galaxy.creator.beaker.session.id=1748558331898042783807; webBuild=4.67.0; customer-sso-sid=68c517511534326540764320d04m37ksgwnnegew; ares.beaker.session.id=1748915372816045956759; access-token-ad.xiaohongshu.com=customer.leona.AT-68c5175115343265384312680itruyti0boyrenv; xsecappid=xhs-pc-web; unread={%22ub%22:%22683165bc000000002301f923%22%2C%22ue%22:%226829599e000000002001cd70%22%2C%22uc%22:25}; websectiga=f47eda31ec99545da40c2f731f0630efd2b0959e1dd10d5fedac3dce0bd1e04d; sec_poison_id=4e5d39fc-d2a6-4a93-8c99-2bd695525505; loadts=1748940087133";
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