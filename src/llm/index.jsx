/** chat 聊天 **/
const KIMI_CHAT_API_URL = "https://api.moonshot.cn/v1/chat/completions";
const DEEPSEEK_CHAT_API_URL = "https://api.deepseek.com/chat/completions";
const Image_CHAT_API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"

export const chat = async (
  messages,
  api_url = KIMI_CHAT_API_URL,
  api_key = import.meta.env.VITE_KIMI_API_KEY,
  model = "moonshot-v1-auto",
  onStream = null 
) => {
  try {
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        stream: onStream ? true : false, // 根据是否有回调决定是否流式
      }),
    });

    if (onStream) {
      // 流式处理
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.replace('data: ', '');
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              fullText += content;
              onStream(fullText); // 调用回调函数
            } catch {
              console.error('解析流数据错误');
            }
          }
        }
      }

      return {
        code: 0,
        data: {
          role: "assistant",
          content: fullText,
        },
      };
    } else {
      // 非流式处理
      const data = await response.json();
      return {
        code: 0,
        data: {
          role: "assistant",
          content: data.choices[0].message.content,
        },
      };
    }
  } catch {
    return {
      code: 0,
      msg: "出错了...",
    };
  }
};

export const deepseekChat = async (messages) => {
  const res = await chat(
    messages,
    DEEPSEEK_CHAT_API_URL,
    import.meta.env.VITE_DEEPSEEK_API_KEY,
    "deepseek-chat"
  );
  return res;
};

export const getImageChat = async (prompt) => {
  try {
    // 调试信息：检查环境变量
    const apiKey = import.meta.env.VITE_ARK_API_KEY;
    console.log("API Key状态:", apiKey ? "已配置" : "未配置");
    console.log("请求prompt:", prompt);

    if (!apiKey) {
      throw new Error("VITE_ARK_API_KEY环境变量未配置");
    }

    const requestBody = {
      model: "doubao-seedream-3-0-t2i-250415",
      prompt,
      response_format: "url",
      size: "1024x1024",
      guidance_scale: 2.5,
      watermark: false,
    };

    console.log("请求体:", JSON.stringify(requestBody, null, 2));
    console.log("请求URL:", "/api/doubao/images/generations");

    const response = await fetch("/api/doubao/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log("响应状态:", response.status, response.statusText);
    console.log("响应头:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API错误响应:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("API响应数据:", JSON.stringify(data, null, 2));

    // 检查响应结构并处理不同的可能格式
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log("使用data.data[0].url格式");
      return data.data[0].url;
    } else if (data && data.url) {
      console.log("使用data.url格式");
      return data.url;
    } else if (data && data.images && Array.isArray(data.images) && data.images.length > 0) {
      console.log("使用data.images[0].url格式");
      return data.images[0].url;
    } else {
      console.error("意外的API响应格式:", data);
      throw new Error(`API响应格式不正确，无法获取图片URL。响应数据: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error("生成图片失败 - 详细错误:", err);
    console.error("错误堆栈:", err.stack);
    throw err;
  }
}

export const generateAvatar = async (text) => {
  const prompt = `
        你是一位漫画设计师，需要为用户设计头像，主打治愈的风格。
        用户的信息是：${text}
        要求有个性，有设计感。
    `;
  const res = await getImageChat(prompt);
  return res;
};

// 测试API连通性的函数
export const testApiConnection = async () => {
  try {
    console.log("开始测试API连通性...");
    const testPrompt = "一个简单的笑脸图标";
    const result = await getImageChat(testPrompt);
    console.log("API测试成功:", result);
    return { success: true, result };
  } catch (error) {
    console.error("API测试失败:", error);
    return { success: false, error: error.message };
  }
};
