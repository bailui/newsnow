import { defineConfig, presetIcons, presetWind3, transformerDirectives, transformerVariantGroup } from "unocss"
import { hex2rgba } from "@unocss/rule-utils"
import { sources } from "./shared/sources"

export default defineConfig({
  mergeSelectors: false,
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  rules: [
    [/^sprinkle-(.+)$/, ([_, d], { theme }) => {
      const hex: any = theme.colors?.[d]?.[400]
      if (hex) {
        return {
          "background-image": `radial-gradient(ellipse 80% 80% at 50% -30%,
         rgba(${hex2rgba(hex)?.join(", ")}, 0.15), rgba(255, 255, 255, 0));`,
        }
      }
    }],
    [
      "font-brand",
      {
        "font-family": `"Poppins", "Noto Sans SC", "Microsoft YaHei", sans-serif`,
      },
    ],
  ],
  shortcuts: {
    "color-base": "color-[var(--ink)]",
    "bg-base": "bg-[var(--surface)]",
    "bg-card": "bg-[var(--surface-card)]",
    "btn": "op60 hover:op100 cursor-pointer transition-all",
  },
  safelist: [
    ...["pink", "orange", ...new Set(Object.values(sources).map(k => k.color))].map(k =>
      `bg-${k} color-${k} border-${k} border-t-${k} sprinkle-${k} shadow-${k}
       bg-${k}-500 color-${k}-500 border-t-${k}-500
       dark:bg-${k} dark:color-${k}`.trim().split(/\s+/)).flat(),
  ],
  extendTheme: (theme) => {
    theme.colors.primary = theme.colors.pink
    return theme
  },
})
