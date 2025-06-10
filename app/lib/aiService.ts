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
        max_tokens: 12000    // 最大生成token数量（增加以支持更复杂的改写任务）
      }
      
      console.log('请求参数:', JSON.stringify(requestBody, null, 2))
  
      // 创建AbortController用于超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时
  
      try {
        // 发送HTTP POST请求到OpenRouter API
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getOpenRouterApiKey()}`,      // API密钥认证
            'HTTP-Referer': 'https://xiaohongshu-topic-generator.com',  // 请求来源
            'X-Title': 'Xiaohongshu Topic Generator',               // 应用标题
            'Content-Type': 'application/json'                      // 请求内容类型
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal // 添加超时信号
        })
  
        clearTimeout(timeoutId); // 清除超时定时器
  
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
          throw new Error(`AI service request failed: ${response.status} ${response.statusText}`)
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
      } catch (fetchError) {
        clearTimeout(timeoutId); // 确保清除超时定时器
        throw fetchError;
      }
    } catch (error) {
      console.error('AI API调用错误:', error)
      
      // 处理超时错误
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试')
      }
      
      // 处理网络连接错误
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('网络连接失败，请检查网络连接')
      }
      
      // 处理其他错误
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
  // 构建用户输入信息部分
  const userInputSection = `
## 1. 用户输入信息（变量模块）
* **改写主题**: ${input.theme || '基于原文主题进行改写'}
* **IP 身份**: ${input.ipIdentity || '从原文中分析并模仿其人设'}
* **改写目的**: ${input.purpose || '纯素人分享'}
${input.seoKeywords ? `* **SEO 关键词**: ${input.seoKeywords}` : ''}
${input.seoPositions && input.seoPositions.length > 0 ? `* **SEO 植入位置**: ${input.seoPositions.join('、')}` : ''}`;

  const originalContentSection = `
## 2. 待分析的范例文案
**原标题**: ${input.originalTitle}

**原正文**: 
${input.originalContent}`;

  return `# 任务：小红书爆款文案仿写与策略再创作

## 0. 核心指令
你的**任务**是扮演一位拥有5年经验的小红书顶流内容策略师，来为我**执行内容创作**。在创作时，你必须**100%沉浸代入**【步骤1】中客户指定的【IP 身份】，用他/她的口吻、视角和情感进行书写。你的策略能力体现在幕后分析和结构设计中，最终的文字不允许出现任何不像【IP 身份】本人说的话。

---
${userInputSection}

---
${originalContentSection}

---

## 3. 内部执行：深度分析（此部分内容无需输出）
请你根据【步骤2】的范例文案，并结合【步骤1】的用户输入，在内部完成以下深度分析。

### 第一阶段：精细化解构范文
请逐项分析范文，并理解其成功要素：

**A. 标题解构 (Title Deconstruction)**
* **爆款公式**: 诊断标题属于哪种类型？（数字盘点、利益驱动、制造悬念、反向提问等）
* **情感抓手**: 标题主要激发了读者的哪种情绪？（好奇、焦虑、共鸣等）
* **词汇特征**: 是否使用了高热度或行业特定词汇？
* **符号运用**: 如何使用 \`|\`、\`❗\`、\`🔥\` 等符号来增强视觉冲击和语气？

**B. 内容解构 (Content Deconstruction)**
* **开篇钩子 (Hook)**: 分析首句的技巧。（是"结果前置"，还是"场景代入"，还是"痛点共鸣"？）
* **结构框架 (Structure)**: 分析文章的宏观逻辑（"总-分-总"等）与微观排版（段落、空行、引导符等）。
* **价值点 (Value Points)**: 文章提供了哪种核心价值？（"信息价值"、"情绪价值"、或"娱乐价值"）

**C. 风格解构 (Style Deconstruction)**
* **人设词库 (Persona Vocabulary)**: 识别并记录能体现作者人设的标志性词语。
* **叙事视角 (Narrative Perspective)**: 是第一人称亲历者，还是第三人称观察者？
* **情绪浓度 (Emotional Intensity)**: 语言情绪是平实客观，还是通过大量程度副词来放大？
* **Emoji策略 (Emoji Strategy)**: **分析Emoji的使用策略（例如：是用作列表项的项目符号、段落分隔、还是情绪放大？），并理解其功能，而非记忆具体符号。**

### 第二阶段：确定创作基调
* **人设**: 优先使用用户在【步骤1】中指定的【IP 身份】。如果用户未提供，则采用你在上一阶段分析出的范文原生人设。
* **目的**: 优先使用用户在【步骤1】中指定的【改写目的】。这将决定最终文案的侧重点和说服逻辑。如果用户未提供，则以"上一阶段分析出的范文原生"的口吻来创作。
* **风格与结构**: 主要模仿你在上一阶段分析出的范文【结构框架】、【微观排版】和【Emoji策略】，这些是需要继承的"爆款骨架"。

---

## 4. 最终任务：创作三个版本的文案
现在，请整合你的所有分析，并严格围绕用户指定的【改写主题】和【改写目的】，创作出以下三个版本。

在撰写完整文案前，你必须先针对【步骤1】中的"改写主题"，进行一次高强度的标题创意风暴。请生成至少5个运用了不同爆款公式的、极具吸引力的标题备选。
**你必须从以下标题公式中进行选择和组合：**
* **数字盘点式**: 公式为"数字 + 结果/方法"，例如："5个方法，让xx效率翻倍"。
* **结果炫耀式**: 公式为"我靠xx，实现了xx惊人结果"，例如："我用1个月，读完了别人1年的书"。
* **反向安利式**: 公式为"求求别用/千万别去xx，我怕你xx"，例如："求求别用这App，我怕你上瘾戒不掉"。
* **痛点共鸣式**: 公式为"你是不是也xx"，直击用户痛点，例如："深夜睡不着，你是不是也和我一样？"。
* **保姆级教程**: 公式为"保姆级/手把手，教你xx"，强调易学性。
* **制造悬念式**: 公式为"xx的秘密，终于被我发现了！"，激发好奇心。

### **【核心创作规则】**
1.  **遵守字数限制**: 这是必须遵守的铁律。
    * **标题**: 总长度要求在 ** 16-20个字符之间**。计算规则：1个Emoji计为2字符，1个汉字/英文/标点计为1字符。
    * **正文**: 总长度要求在 **500-800个字符之间**。计算规则同上。
2.  **执行SEO指令**: ${input.seoKeywords ? `必须在所有三个版本中，**以最自然、最不影响阅读体验的方式，将关键词"${input.seoKeywords}"无痕植入**到${input.seoPositions && input.seoPositions.length > 0 ? input.seoPositions.join('、') : '合适的'}位置。` : '无SEO要求。'}

每个版本都要完整包含【标题】、【正文】、【Emoji】和【5个高度相关的Hashtag】。

### 版本一：精准策略版
* **目标**: 最大程度上忠于你分析出的范文"爆款骨架"（结构、节奏、排版），并根据用户指定的【改写目的】进行内容填充。
* **重要前提**: **当范文的结构与你的创作目的产生明显冲突时，应优先保证创作目的的实现，并对范文结构进行灵活、创造性的调整，而不是生搬硬套。**

### 版本二：角度切换版
* **目标**: 在保持版本一确定的【人设】和【目的】不变的前提下，切换一个核心切入点。例如，如果版本一的核心是介绍产品的"功能A"，此版本可以切换到介绍它的"功能B"或"使用场景"，并为此重新设计一个同样吸引人的标题。

### 版本三：风格突破版
* **目标**: 最大胆的版本。人设、目的、主题不变，但完全抛弃范文的结构，采用另一种在小红书上同样有效的爆款公式进行创作。
* **创作方向参考**: **请从以下风格中选择最适合本次主题的一种："第一人称故事型"、"反向吐槽/安利型"、"保姆级教程型"、或"沉浸式体验Vlog脚本型"。**

**输出格式（必须严格按照此JSON格式）：**
\`\`\`json
{
  "versions": [
    {
      "title": "版本一标题",
      "content": "版本一正文内容（包含Emoji和5个Hashtag）",
      "style": "精准策略版"
    },
    {
      "title": "版本二标题",
      "content": "版本二正文内容（包含Emoji和5个Hashtag）",
      "style": "角度切换版"
    },
    {
      "title": "版本三标题",
      "content": "版本三正文内容（包含Emoji和5个Hashtag）",
      "style": "风格突破版"
    }
  ]
}
\`\`\`

立即开始深度分析并创作三个版本！`;
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