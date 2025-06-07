import { CozeAPI } from '@coze/api';

interface CozeConfig {
  token: string;
  baseURL?: string;
}

interface WorkflowParameters {
  [key: string]: string | number | boolean;
}

interface CozeResponse {
  code: number;
  data: string;
  msg: string;
  token: number;
  debug_url?: string;
}

export class CozeService {
  private apiClient: CozeAPI;

  constructor(config: CozeConfig) {
    this.apiClient = new CozeAPI({
      token: config.token,
      baseURL: config.baseURL || 'https://api.coze.cn'
    });
  }

  /**
   * 调用 Coze 工作流
   * @param workflowId 工作流 ID
   * @param parameters 工作流参数
   * @returns 解析后的响应数据
   */
  async runWorkflow(workflowId: string, parameters: WorkflowParameters): Promise<any> {
    try {
      // 使用非流式方式调用工作流
      const response = await this.apiClient.workflows.runs.create({
        workflow_id: workflowId,
        parameters
      });



      // 直接返回响应
      return response;

    } catch (error) {
      console.error('Coze 工作流调用失败:', error);
      throw new Error(`Coze 工作流调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 解析小红书笔记内容
   * @param noteUrl 笔记链接
   * @param cookieStr Cookie 字符串
   * @returns 解析后的笔记数据
   */
  async parseXiaohongshuNote(noteUrl: string, cookieStr: string) {
    const workflowId = process.env.COZE_WORKFLOW_ID || '7511959723135762472';
    
    try {
      // 清理Cookie字符串，移除可能导致问题的字符
      const cleanedCookie = cookieStr
        .replace(/\n/g, '') // 移除换行符
        .replace(/\r/g, '') // 移除回车符
        .replace(/\t/g, '') // 移除制表符
        .trim(); // 移除首尾空格
      

      
      const response = await this.runWorkflow(workflowId, {
        noteUrl,
        cookieStr: cleanedCookie
      });



      // 根据实际的响应结构进行解析
      let noteData;
      
      // 如果响应有 data 字段，尝试解析它
      if (response.data) {
        try {
          noteData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
        } catch (e) {
          console.error('解析 response.data 失败:', e);
          throw new Error('响应数据格式错误');
        }
      } else if (response.code !== undefined) {
        // 如果响应本身就包含 code，直接使用
        noteData = response;
      } else {
        throw new Error('未找到有效的响应数据');
      }

      // 检查是否有错误
      if (noteData.code !== 0) {
        throw new Error(`API 调用失败：${noteData.msg || noteData.message || '未知错误'}`);
      }

      // 解析嵌套的数据
      let parsedData;
      if (noteData.data) {
        if (typeof noteData.data === 'string') {
          try {
            parsedData = JSON.parse(noteData.data);
          } catch (e) {
            console.error('解析嵌套数据失败:', e);
            throw new Error('嵌套数据格式错误');
          }
        } else {
          parsedData = noteData.data;
        }
      } else {
        throw new Error('响应中没有找到数据字段');
      }



      // 检查数据结构 - 根据实际返回的数据结构进行判断
      let note;
      if (parsedData.data && parsedData.data.note) {
        // 如果数据结构是 { code: 0, data: { note: {...} } }
        if (parsedData.code !== 0) {
          throw new Error('解析失败：API 返回错误');
        }
        note = parsedData.data.note;
      } else if (parsedData.note) {
        // 如果数据结构直接是 { note: {...} }
        note = parsedData.note;
      } else {
        console.error('未识别的数据结构:', JSON.stringify(parsedData, null, 2));
        throw new Error('解析失败：数据格式错误或没有笔记数据');
      }
      
      return {
        title: note.note_display_title,
        content: note.note_desc,
        images: note.note_image_list || [],
        author: {
          nickname: note.auther_nick_name,
          avatar: note.auther_avatar,
          userId: note.auther_user_id,
          homePageUrl: note.auther_home_page_url
        },
        stats: {
          likedCount: note.note_liked_count,
          collectedCount: note.collected_count,
          commentCount: note.comment_count,
          shareCount: note.share_count
        },
        noteId: note.note_id,
        noteUrl: note.note_url,
        createTime: note.note_create_time,
        tags: note.note_tags || [],
        debugUrl: response.debug_url || noteData.debug_url
      };

    } catch (error) {
      console.error('小红书笔记解析失败:', error);
      throw error;
    }
  }

  /**
   * 创建 Coze 服务实例的静态方法
   * @returns CozeService 实例
   */
  static create(): CozeService {
    const token = process.env.COZE_API_TOKEN;
    
    if (!token) {
      throw new Error('缺少 COZE_API_TOKEN 环境变量');
    }

    return new CozeService({ token });
  }
} 