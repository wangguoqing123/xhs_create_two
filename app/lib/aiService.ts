// AI选题生成服务
// 这个文件包含了调用OpenRouter AI API的所有逻辑

// 定义用户输入的数据结构
export interface UserInput {
  coreTheme: string;        // 核心主题
  targetAudience?: string;  // 目标受众
  userPainPoints?: string;  // 用户痛点
  contentGoal?: string;     // 内容目标
}

// 定义单个选题的数据结构
export interface TopicSuggestion {
  id: string;                 // 选题ID
  title: string;              // 选题标题
  coreIssue: string;          // 核心议题
  contentType: string;        // 内容类型
  creativeAngle: string;      // 创作视角
  targetPainPoint: string;    // 目标痛点
}

// 定义AI生成结果的数据结构
export interface GenerationResult {
  topics: TopicSuggestion[];           // 选题列表
  inferredInfo: {                      // AI推断的信息
    targetAudience: string;            // 推断的目标用户
    userPainPoints: string;            // 推断的用户痛点
  };
}

// 定义文案改写的输入数据结构
export interface RewriteInput {
  originalTitle: string;        // 原始标题
  originalContent: string;      // 原始内容
  seoKeywords?: string;         // SEO关键词
  seoPositions?: string[];      // SEO位置
  theme?: string;               // 特定主题
  purpose?: string;             // 改写目的
  ipIdentity?: string;          // IP身份
}

// 定义单个改写版本的数据结构
export interface RewriteVersion {
  id: string;                   // 改写版本ID
  title: string;                // 改写后的标题
  content: string;              // 改写后的内容
  style: string;                // 改写风格
}

// 定义改写结果的数据结构
export interface RewriteResult {
  versions: RewriteVersion[];   // 改写版本列表
}
  
// 从环境变量获取OpenRouter API密钥
function getOpenRouterApiKey(): string {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  // 验证API密钥是否存在且不为空
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      'OPENROUTER_API_KEY 环境变量未设置。请在 .env.local 文件中配置 OPENROUTER_API_KEY=您的实际密钥值'
    );
  }
  
  return apiKey;
}

// OpenRouter API 的请求地址
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// 构建AI提示词 - 告诉AI如何生成选题
function buildPrompt(input: UserInput): string {
    return `你是小红书选题专家，根据用户信息生成20个选题。
  
  **用户信息：**
  - 主题：${input.coreTheme}
  ${input.targetAudience ? `- 用户画像：${input.targetAudience}` : ''}
  ${input.userPainPoints ? `- 用户痛点：${input.userPainPoints}` : ''}
  ${input.contentGoal ? `- 内容目标：${input.contentGoal}` : ''}
  
  **要求：**
  1. 生成20个小红书选题
  2. 标题要吸引人，符合小红书风格
  3. 内容类型选择：干货教程笔记、好物测评分享、避雷经验总结、清单合集整理、对比分析笔记、Vlog式图文记录、OOTD穿搭分享、开箱体验笔记、改造记录分享、挑战打卡日记
  4. 创作视角选择：保姆级教程、亲测有效、真实体验、学生党友好、贫民窟女孩、避坑指南、干货合集、私藏分享、沉浸式体验、新手小白、颠覆认知、深度思考
  
  **输出格式（必须严格按照此JSON格式）：**
  \`\`\`json
  {
    "inference": {
      "targetAudience": "详细用户画像描述",
      "painPoints": "用户核心痛点分析"
    },
    "topics": [
      {
        "title": "小红书标题",
        "coreIssue": "核心议题描述",
        "contentType": "内容类型",
        "creativeAngle": "创作视角",
        "targetPainPoint": "解决的具体痛点"
      }
      // ... 必须包含完整的20个选题
    ]
  }
  \`\`\`
  
  立即生成20个选题！`
  }
  
  // 调用OpenRouter AI API
  async function callOpenRouterAPI(prompt: string): Promise<{
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }> {
    try {
      console.log('准备调用OpenRouter API...')
      
      // 构建API请求参数
      const requestBody = {
        model: 'google/gemini-2.5-flash-preview-05-20',  // 使用的AI模型
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,    // 控制生成内容的随机性
        max_tokens: 8000     // 最大生成token数量
      }
      
      console.log('请求参数:', JSON.stringify(requestBody, null, 2))
  
      // 发送HTTP POST请求到OpenRouter API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getOpenRouterApiKey()}`,      // API密钥认证
          'HTTP-Referer': 'https://xiaohongshu-topic-generator.com',  // 请求来源
          'X-Title': 'Xiaohongshu Topic Generator',               // 应用标题
          'Content-Type': 'application/json'                      // 请求内容类型
        },
        body: JSON.stringify(requestBody)
      })
  
      console.log('API响应状态:', response.status, response.statusText)
  
      // 检查API响应是否成功
      if (!response.ok) {
        const errorText = await response.text()
        // 记录详细错误信息到服务端日志
        console.error('API错误响应:', {
          status: response.status,
          statusText: response.statusText,
          errorDetails: errorText
        })
        // 向调用者返回通用错误信息，不暴露内部细节
        throw new Error('AI service request failed. Please check server logs for details.')
      }
  
      // 解析API响应的JSON数据
      const data = await response.json()
      console.log('API响应数据结构:', {
        hasChoices: !!data.choices,
        choicesLength: data.choices?.length,
        hasContent: !!data.choices?.[0]?.message?.content,
        contentLength: data.choices?.[0]?.message?.content?.length,
        finishReason: data.choices?.[0]?.finish_reason
      })
      
      // 验证响应数据的完整性
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('API响应格式异常：缺少choices或message字段')
      }
  
      // 检查响应是否被截断
      if (data.choices[0].finish_reason === 'length') {
        throw new Error('AI响应被截断，请减少提示词长度或增加max_tokens')
      }
      
      return data
    } catch (error) {
      console.error('AI API调用错误:', error)
      // 处理网络连接错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接')
      }
      throw error
    }
  }
  
  // 解析AI响应并格式化结果
  function parseAIResponse(response: {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }): { topics: TopicSuggestion[], inference: Record<string, string> } {
    try {
      // 获取AI返回的文本内容
      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('AI响应内容为空')
      }
  
      console.log('🔍 AI原始响应长度:', content.length)
      
      // 尝试提取JSON格式的数据
      let jsonStr = content
  
      // 1. 首先尝试提取代码块中的JSON
      const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1]
        console.log('✅ 从代码块中提取JSON')
      } else {
        // 2. 尝试提取完整的JSON对象
        const firstBrace = content.indexOf('{')
        const lastBrace = content.lastIndexOf('}')
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          jsonStr = content.substring(firstBrace, lastBrace + 1)
          console.log('✅ 从文本中提取JSON')
        } else {
          throw new Error('无法在AI响应中找到有效的JSON格式')
        }
      }
  
      // 基本清理JSON字符串
      jsonStr = jsonStr.trim()
      console.log('🔧 JSON长度:', jsonStr.length)
  
      // 解析JSON数据
      const parsedData = JSON.parse(jsonStr)
      console.log('✅ JSON解析成功')
  
      // 验证必需字段是否存在
      if (!parsedData.topics || !Array.isArray(parsedData.topics)) {
        throw new Error('AI响应缺少topics字段或格式错误')
      }
  
      if (!parsedData.inference || typeof parsedData.inference !== 'object') {
        throw new Error('AI响应缺少inference字段或格式错误')
      }
  
      // 格式化选题数据，添加唯一ID
      const formattedTopics: TopicSuggestion[] = parsedData.topics.map((topic: {
        title: string;
        coreIssue: string;
        contentType: string;
        creativeAngle: string;
        targetPainPoint: string;
      }, index: number) => ({
        id: `ai-topic-${index + 1}`,           // 生成唯一ID
        title: topic.title,                    // 选题标题
        coreIssue: topic.coreIssue,           // 核心议题
        contentType: topic.contentType,        // 内容类型
        creativeAngle: topic.creativeAngle,    // 创作视角
        targetPainPoint: topic.targetPainPoint // 目标痛点
      }))
  
      console.log(`✅ 成功解析 ${formattedTopics.length} 个选题`)
  
      // 返回格式化后的数据
      return {
        topics: formattedTopics,
        inference: {
          targetAudience: parsedData.inference.targetAudience,
          painPoints: parsedData.inference.painPoints
        }
      }
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error)
      throw new Error(`AI响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }
  
  // 主要的AI生成函数 - 这是外部调用的入口点
  export async function generateTopics(input: UserInput): Promise<GenerationResult> {
    console.log('🔥 正在使用AI服务生成选题')
    
    try {
      // 1. 构建AI提示词
      const prompt = buildPrompt(input)
      
      // 2. 调用OpenRouter API
      const response = await callOpenRouterAPI(prompt)
      
      // 3. 解析AI响应
      const { topics, inference } = parseAIResponse(response)
      
      // 验证是否成功生成选题
      if (topics.length === 0) {
        throw new Error('AI未能生成有效选题')
      }
  
      // 构建最终结果
      const result: GenerationResult = {
        topics,
        inferredInfo: {
          targetAudience: inference.targetAudience,
          userPainPoints: inference.painPoints
        }
      }
      
      console.log(`✅ 生成完成，选题数量: ${topics.length}`)
  
      return result
    } catch (error) {
      console.error('生成选题失败:', error)
      throw error
    }
  }

// 构建文案改写的AI提示词
function buildRewritePrompt(input: RewriteInput): string {
  const seoInfo = input.seoKeywords ? `
- SEO关键词：${input.seoKeywords}
- SEO位置要求：${input.seoPositions?.join('、') || '无特殊要求'}` : '';

  const contentInfo = input.theme || input.purpose || input.ipIdentity ? `
- 特定主题：${input.theme || '无'}
- 改写目的：${input.purpose || '无'}
- IP身份：${input.ipIdentity || '无'}` : '';

  return `你是小红书文案改写专家，需要根据原文和用户要求生成3个不同风格的改写版本。

**原文信息：**
- 原标题：${input.originalTitle}
- 原正文：${input.originalContent}
${seoInfo}
${contentInfo}

 **改写要求：**
 1. 生成3个不同风格的改写版本，每个版本包含标题和正文
 2. 标题严格不超过20个字符（标点符号算1个字符，Emoji算2个字符）
 3. 正文严格不超过800个字符（标点符号算1个字符，Emoji算2个字符）
 4. 字符限制非常重要，必须严格遵守，超过字符限制的内容会被拒绝
 5. 保持小红书风格，内容要精炼且吸引人
 6. 如果有SEO关键词，请自然地融入到指定位置
 7. 三个版本要有不同的风格：专业干货型、教程指南型、亲和分享型

**输出格式（必须严格按照此JSON格式）：**
\`\`\`json
{
  "versions": [
    {
      "title": "改写后的标题",
      "content": "改写后的正文",
      "style": "专业干货型"
    },
    {
      "title": "改写后的标题",
      "content": "改写后的正文", 
      "style": "教程指南型"
    },
    {
      "title": "改写后的标题",
      "content": "改写后的正文",
      "style": "亲和分享型"
    }
  ]
}
\`\`\`

立即生成3个改写版本！`;
}

// 计算字符数（考虑Emoji占两个字符）
function countCharacters(text: string): number {
  let count = 0;
  for (const char of text) {
    // 检查是否为Emoji（简单判断，使用Unicode范围）
    const codePoint = char.codePointAt(0);
    if (codePoint && codePoint >= 0x1F300 && codePoint <= 0x1F9FF) {
      count += 2; // Emoji算2个字符
    } else {
      count += 1; // 其他字符算1个字符
    }
  }
  return count;
}

// 验证文案长度是否符合要求
function validateContentLength(title: string, content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const titleCount = countCharacters(title);
  const contentCount = countCharacters(content);
  
  if (titleCount > 20) {
    errors.push(`标题超出字符限制：${titleCount}/20字符`);
  }
  
  if (contentCount > 800) {
    errors.push(`正文超出字符限制：${contentCount}/800字符`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 解析文案改写AI响应
function parseRewriteResponse(response: {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}): { versions: RewriteVersion[] } {
  try {
    // 获取AI返回的文本内容
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI响应内容为空');
    }

    console.log('🔍 AI改写响应长度:', content.length);
    
    // 尝试提取JSON格式的数据
    let jsonStr = content;

    // 1. 首先尝试提取代码块中的JSON
    const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1];
      console.log('✅ 从代码块中提取JSON');
    } else {
      // 2. 尝试提取完整的JSON对象
      const firstBrace = content.indexOf('{');
      const lastBrace = content.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonStr = content.substring(firstBrace, lastBrace + 1);
        console.log('✅ 从文本中提取JSON');
      } else {
        throw new Error('无法在AI响应中找到有效的JSON格式');
      }
    }

    // 基本清理JSON字符串
    jsonStr = jsonStr.trim();
    console.log('🔧 JSON长度:', jsonStr.length);

    // 解析JSON数据
    const parsedData = JSON.parse(jsonStr);
    console.log('✅ JSON解析成功');

    // 验证必需字段是否存在
    if (!parsedData.versions || !Array.isArray(parsedData.versions)) {
      throw new Error('AI响应缺少versions字段或格式错误');
    }

    // 格式化改写版本数据，添加唯一ID并验证字符限制
    const formattedVersions: RewriteVersion[] = [];
    const validationErrors: string[] = [];
    
    parsedData.versions.forEach((version: {
      title: string;
      content: string;
      style: string;
    }, index: number) => {
      // 验证字符限制
      const validation = validateContentLength(version.title, version.content);
      
      if (validation.valid) {
        formattedVersions.push({
          id: `rewrite-version-${index + 1}`,
          title: version.title,
          content: version.content,
          style: version.style
        });
      } else {
        // 即使超出限制，也添加到结果中，但在前端显示警告
        formattedVersions.push({
          id: `rewrite-version-${index + 1}`,
          title: version.title,
          content: version.content,
          style: version.style
        });
        validationErrors.push(`版本${index + 1}(${version.style}): ${validation.errors.join(', ')}`);
      }
    });

    // 如果有验证错误，记录警告但不阻止返回
    if (validationErrors.length > 0) {
      console.warn('⚠️ 部分改写版本超出字符限制:', validationErrors);
    }

    console.log(`✅ 成功解析 ${formattedVersions.length} 个改写版本（共${parsedData.versions.length}个，${validationErrors.length}个超出限制）`);

    // 返回格式化后的数据
    return {
      versions: formattedVersions
    };
  } catch (error) {
    console.error('❌ 解析AI改写响应失败:', error);
    throw new Error(`AI响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

// 主要的文案改写函数 - 这是外部调用的入口点
export async function generateRewrite(input: RewriteInput): Promise<RewriteResult> {
  console.log('🔥 正在使用AI服务进行文案改写');
  
  try {
    // 1. 构建AI提示词
    const prompt = buildRewritePrompt(input);
    
    // 2. 调用OpenRouter API
    const response = await callOpenRouterAPI(prompt);
    
    // 3. 解析AI响应
    const { versions } = parseRewriteResponse(response);
    
    // 验证是否成功生成改写版本
    if (versions.length === 0) {
      throw new Error('AI未能生成有效改写版本');
    }

    // 构建最终结果
    const result: RewriteResult = {
      versions
    };
    
    console.log(`✅ 改写完成，版本数量: ${versions.length}`);

    return result;
  } catch (error) {
    console.error('文案改写失败:', error);
    throw error;
  }
}