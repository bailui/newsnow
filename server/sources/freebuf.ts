import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim()
}

function formatUrl(path: string, baseUrl: string) {
  return path.startsWith("http") ? path : `${baseUrl}${path}`
}

export default defineSource(async () => {
  const baseUrl = "https://www.freebuf.com"
  const html = await myFetch<string>(baseUrl, {
    headers: {
      Referer: baseUrl,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  })
  const $ = cheerio.load(html)
  const seen = new Set<string>()
  const news: NewsItem[] = []

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") ?? ""
    if (!/^\/(?:articles|news|consult)\/.+\.html$/.test(href) || seen.has(href)) return

    const title = cleanText($(el).text()) || cleanText($(el).find("img").attr("alt") ?? "")
    if (!title || title.length < 6) return

    seen.add(href)
    news.push({
      id: href,
      title,
      url: formatUrl(href, baseUrl),
    })
  })

  return news
})
