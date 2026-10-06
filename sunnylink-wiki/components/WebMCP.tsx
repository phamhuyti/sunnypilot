'use client';
import { useEffect } from 'react';

// WebMCP API type — experimental browser API (https://webmachinelearning.github.io/webmcp/)
type WebMCPTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (params: Record<string, string>) => Promise<unknown>;
};

type ModelContextNavigator = Navigator & {
  modelContext?: {
    provideContext: (options: { tools: WebMCPTool[] }) => void;
  };
};

export default function WebMCP() {
  useEffect(() => {
    const nav = navigator as ModelContextNavigator;
    if (!nav.modelContext?.provideContext) return;

    nav.modelContext.provideContext({
      tools: [
        {
          name: 'search_settings',
          description:
            "Tìm cài đặt và công tắc Sunnypilot trên Sunnylink Wiki. Trả về các cài đặt phù hợp kèm mô tả, giá trị mặc định, trường hợp sử dụng và gợi ý cộng đồng.",
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: "Từ khóa tìm kiếm (ví dụ: \"độ lệch camera\", \"MADS\", \"giới hạn tốc độ\", \"chuyển làn\")",
              },
            },
            required: ['query'],
          },
          execute: async ({ query }) => {
            const res = await fetch(`/api/wiki-data?type=settings&search=${encodeURIComponent(query)}`);
            return res.json();
          },
        },
        {
          name: 'browse_models',
          description:
            "Tra cứu mô hình lái Sunnypilot. Lọc theo phong cách (wmi_2026, aggressive, comfort, precision, experimental) hoặc tìm theo tên mô hình.",
          inputSchema: {
            type: 'object',
            properties: {
              vibe: {
                type: 'string',
                description: "Danh mục phong cách: wmi_2026, aggressive, comfort, precision, experimental",
              },
              query: {
                type: 'string',
                description: "Tìm theo tên mô hình (ví dụ: \"WMI V12\", \"Down to Ride\", \"Dark Souls\")",
              },
            },
          },
          execute: async ({ vibe, query }) => {
            const params = new URLSearchParams({ type: 'models' });
            if (vibe) params.set('vibe', vibe);
            if (query) params.set('search', query);
            const res = await fetch(`/api/wiki-data?${params}`);
            return res.json();
          },
        },
        {
          name: 'check_car',
          description:
            "Kiểm tra xe có tương thích Sunnypilot không. Trả về phần cứng cần thiết (thiết bị, dây nối, radar), cài đặt tốt nhất và các cấu hình sẵn.",
          inputSchema: {
            type: 'object',
            properties: {
              make: {
                type: 'string',
                description: "Hãng xe (ví dụ: Toyota, Honda, Hyundai, Kia, Subaru)",
              },
              model: {
                type: 'string',
                description: "Mẫu xe (ví dụ: Camry, Civic, Ioniq 5, Sonata)",
              },
            },
          },
          execute: async ({ make, model }) => {
            const params = new URLSearchParams({ type: 'cars' });
            if (make) params.set('make', make);
            if (model) params.set('model', model);
            const res = await fetch(`/api/wiki-data?${params}`);
            return res.json();
          },
        },
      ],
    });
  }, []);

  return null;
}
