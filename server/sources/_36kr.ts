import type { NewsItem } from "@shared/types"
import { load } from "cheerio"

interface KrHotRankItem {
  itemId?: string | number
  templateMaterial?: {
    itemId?: string | number
    widgetTitle?: string
    publishTime?: string | number
    authorName?: string
    statFormat?: string
  }
}

interface KrHotRankResponse {
  data?: {
    hotRankList?: KrHotRankItem[]
  }
}

const quick = defineSource(async () => {
  const baseURL = "https://www.36kr.com"
  const url = `${baseURL}/newsflashes`
  const response = await myFetch<string>(url)
  const $ = load(response)
  const news: NewsItem[] = []
  const $items = $(".newsflash-item")
  $items.each((_, el) => {
    const $el = $(el)
    const $a = $el.find("a.item-title")
    const url = $a.attr("href")
    const title = $a.text()
    const relativeDate = $el.find(".time").text()
    if (url && title && relativeDate) {
      news.push({
        url: `${baseURL}${url}`,
        title,
        id: url,
        extra: {
          date: parseRelativeDate(relativeDate, "Asia/Shanghai").valueOf(),
        },
      })
    }
  })

  return news
})

const renqi = defineSource(async () => {
  const baseURL = "https://36kr.com"
  const response = await myFetch<KrHotRankResponse>("https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://36kr.com/",
    },
    body: {
      partner_id: "web",
      param: {
        siteId: 1,
        platformId: 2,
      },
    },
  })

  return (response?.data?.hotRankList ?? []).map((item): NewsItem | null => {
    const material = item.templateMaterial ?? {}
    const sourceId = item.itemId ?? material.itemId
    if (!sourceId || !material.widgetTitle) return null

    const id = String(sourceId)
    return {
      url: `${baseURL}/p/${id}`,
      title: material.widgetTitle,
      id,
      pubDate: material.publishTime,
      extra: {
        info: [material.authorName, material.statFormat].filter(Boolean).join("  |  "),
        hover: material.widgetTitle,
      },
    }
  }).filter((item): item is NewsItem => Boolean(item))
})

export default defineSource({
  "36kr": quick,
  "36kr-quick": quick,
  "36kr-renqi": renqi,
})
