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

// ponytail: Vercel gets 405 from Freebuf; stale fallback keeps the card usable until a reachable proxy exists.
const FREEBUF_FALLBACK: NewsItem[] = [
  {
    id: "487821",
    title: "新型Linux pedit COW漏洞：通过污染缓存二进制文件获取Root权限",
    url: "https://www.freebuf.com/articles/network/487821.html",
    pubDate: "2026-06-26 19:27:55",
  },
  {
    id: "487692",
    title: "Curl发布史上最大规模漏洞修复更新，包含一个存在25年的历史性漏洞",
    url: "https://www.freebuf.com/articles/network/487692.html",
    pubDate: "2026-06-25 19:20:27",
  },
  {
    id: "487270",
    title: "高危FFmpeg漏洞可使攻击者将媒体文件武器化",
    url: "https://www.freebuf.com/articles/network/487270.html",
    pubDate: "2026-06-23 08:30:58",
  },
  {
    id: "487207",
    title: "Claude Mythos Preview发现潜藏29年的\"Squidbleed\"漏洞",
    url: "https://www.freebuf.com/articles/network/487207.html",
    pubDate: "2026-06-22 15:35:22",
  },
  {
    id: "486818",
    title: "F5修复NGINX开源组件两处高危漏洞 可导致远程代码执行",
    url: "https://www.freebuf.com/articles/network/486818.html",
    pubDate: "2026-06-18 23:02:14",
  },
]

export default defineSource(async () => {
  const baseUrl = "https://www.freebuf.com"
  try {
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
  } catch {
    return FREEBUF_FALLBACK
  }
})
