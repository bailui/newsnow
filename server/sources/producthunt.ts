import { XMLParser } from "fast-xml-parser"
import { load } from "cheerio"
import type { NewsItem } from "@shared/types"

interface ProductHuntEntry {
  id?: string
  title?: string
  updated?: string
  published?: string
  link?: { href?: string } | Array<{ href?: string }>
  content?: { $text?: string } | string
}

interface ProductHuntFeed {
  feed?: {
    entry?: ProductHuntEntry | ProductHuntEntry[]
  }
}

function cleanText(html: string) {
  return load(html).text().replace(/\s+/g, " ").trim()
}

function getEntryUrl(link: ProductHuntEntry["link"]) {
  return Array.isArray(link) ? link[0]?.href : link?.href
}

function getEntryContent(content: ProductHuntEntry["content"]) {
  return typeof content === "string" ? content : content?.$text
}

export default defineSource(async () => {
  const xmlText = await myFetch<string>("https://www.producthunt.com/feed", {
    responseType: "text",
  })
  const result = new XMLParser({
    attributeNamePrefix: "",
    textNodeName: "$text",
    ignoreAttributes: false,
  }).parse(xmlText) as ProductHuntFeed

  const entries = result.feed?.entry
  const list = entries ? (Array.isArray(entries) ? entries : [entries]) : []

  return list
    .map((entry): NewsItem | null => {
      const id = entry.id
      const title = entry.title
      const url = getEntryUrl(entry.link)
      if (!id || !title || !url) return null

      const content = getEntryContent(entry.content)
      return {
        id,
        title,
        url,
        pubDate: entry.updated ?? entry.published,
        extra: {
          hover: content ? cleanText(content).split("|")[0]?.trim() : undefined,
        },
      }
    })
    .filter((item): item is NewsItem => Boolean(item))
})
