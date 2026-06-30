import type { NewsItem } from "@shared/types"
import { load } from "cheerio"

interface KrHotRankItem {
  itemId?: string | number
  templateMaterial?: {
    itemId?: string | number
    widgetTitle?: string
    widgetContent?: string
    publishTime?: string | number
    authorName?: string
    statFormat?: string
  }
}

interface KrInitialState {
  newsflashCatalogData?: {
    data?: {
      newsflashList?: {
        data?: {
          itemList?: KrHotRankItem[]
        }
      }
      hotlist?: {
        data?: KrHotRankItem[]
      }
    }
  }
}

async function getNewsflashesState() {
  const response = await myFetch<string>("https://36kr.com/newsflashes", {
    responseType: "text",
  })
  const $ = load(response)
  const script = $("script").toArray().map(el => $(el).html() ?? "").find(text => text.includes("window.initialState="))
  const json = script?.match(/window\.initialState=(\{.*\})$/s)?.[1]
  if (!json) throw new Error("Cannot parse 36kr initialState")
  return JSON.parse(json) as KrInitialState
}

const quick = defineSource(async () => {
  const baseURL = "https://36kr.com"
  const state = await getNewsflashesState()
  return (state.newsflashCatalogData?.data?.newsflashList?.data?.itemList ?? [])
    .map((item): NewsItem | null => {
      const material = item.templateMaterial ?? {}
      const id = item.itemId ?? material.itemId
      if (!id || !material.widgetTitle) return null

      return {
        url: `${baseURL}/newsflashes/${id}`,
        title: material.widgetTitle,
        id,
        pubDate: material.publishTime,
        extra: {
          hover: material.widgetContent,
        },
      }
    })
    .filter((item): item is NewsItem => Boolean(item))
})

const renqi = defineSource(async () => {
  const baseURL = "https://36kr.com"
  const state = await getNewsflashesState()

  return (state.newsflashCatalogData?.data?.hotlist?.data ?? []).map((item): NewsItem | null => {
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
