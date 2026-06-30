import type { NewsItem } from "@shared/types"

interface FreebufResponse {
  data?: {
    data_list?: Array<{
      ID?: string
      post_title?: string
      post_date?: string
      url?: string
      content?: string
      read_count?: number
      nickname?: string
    }>
  }
}

export default defineSource(async () => {
  const baseUrl = "https://www.freebuf.com"
  const response = await myFetch<FreebufResponse>(`${baseUrl}/fapi/frontend/category/list?name=network&page=1&limit=20&select=0&order=0&type=category`, {
    headers: {
      Referer: baseUrl,
    },
  })

  return (response.data?.data_list ?? []).map((item): NewsItem | null => {
    if (!item.ID || !item.post_title || !item.url) return null

    return {
      id: item.ID,
      title: item.post_title,
      url: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
      pubDate: item.post_date,
      extra: {
        info: [item.nickname, item.read_count ? `${item.read_count} 阅读` : undefined].filter(Boolean).join("  |  "),
        hover: item.content,
      },
    }
  }).filter((item): item is NewsItem => Boolean(item))
})
