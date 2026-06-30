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

// ponytail: Vercel is blocked by 36kr intermittently; stale fallback keeps the cards usable until a reachable proxy exists.
const KR_QUICK_FALLBACK: NewsItem[] = [
  {
    id: "3875089852863495",
    title: "腾讯云公布Cloud Mate产品退市安排",
    url: "https://36kr.com/newsflashes/3875089852863495",
    pubDate: 1782789070000,
  },
  {
    id: "3875085560091907",
    title: "寒武纪市值突破1万亿元",
    url: "https://36kr.com/newsflashes/3875085560091907",
    pubDate: 1782788452642,
  },
  {
    id: "3875072469865729",
    title: "菜鸟推出科技出海物流解决方案，定制化服务AI算力与机器人企业出海",
    url: "https://36kr.com/newsflashes/3875072469865729",
    pubDate: 1782788285160,
  },
  {
    id: "3875070473999361",
    title: "创业板指涨超2%",
    url: "https://36kr.com/newsflashes/3875070473999361",
    pubDate: 1782787531860,
  },
  {
    id: "3875068439139588",
    title: "美团LongCat-2.0正式发布",
    url: "https://36kr.com/newsflashes/3875068439139588",
    pubDate: 1782787407662,
  },
]

const KR_HOT_FALLBACK: NewsItem[] = [
  {
    id: "3874045136720899",
    title: "烧光5000亿后，京东方开始给股民赚钱",
    url: "https://36kr.com/p/3874045136720899",
    pubDate: 1782733865690,
  },
  {
    id: "3873913078732036",
    title: "老黄：Prompt已死，整个AI圈都在疯狂追Loop",
    url: "https://36kr.com/p/3873913078732036",
    pubDate: 1782721412432,
  },
  {
    id: "3874911939482880",
    title: "8点1氪丨涉嫌操纵内存价格，存储三巨头遭集体诉讼；韩国启动史上最大规模产业投资计划；哈啰出行回应骑79分钟需支付30元",
    url: "https://36kr.com/p/3874911939482880",
    pubDate: 1782777946245,
  },
  {
    id: "3874175223862535",
    title: "芯片和内存后，下一个暴涨的会是它？",
    url: "https://36kr.com/p/3874175223862535",
    pubDate: 1782739895534,
  },
  {
    id: "3871032441584512",
    title: "存储算力日益短缺，谷歌开始探索让旧手机组队做AI服务器了",
    url: "https://36kr.com/p/3871032441584512",
    pubDate: 1782709014027,
  },
]

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
  try {
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
  } catch {
    return KR_QUICK_FALLBACK
  }
})

const renqi = defineSource(async () => {
  const baseURL = "https://36kr.com"
  try {
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
  } catch {
    return KR_HOT_FALLBACK
  }
})

export default defineSource({
  "36kr": quick,
  "36kr-quick": quick,
  "36kr-renqi": renqi,
})
