"use client"

import { ImagesBadge } from "@/components/ui/images-badge"

export default function ImagesBadgeWidget() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <ImagesBadge
        images={[
          "https://assets.aceternity.com/pro/agenforce-1.webp",
          "https://assets.aceternity.com/pro/agenforce-2.webp",
          "https://assets.aceternity.com/pro/agenforce-3.webp",
        ]}
        text=""
        folderSize={{ width: 48, height: 36 }}
        teaserImageSize={{ width: 30, height: 20 }}
        hoverImageSize={{ width: 72, height: 48 }}
        hoverTranslateY={-52}
        hoverSpread={30}
        hoverRotation={18}
      />
    </div>
  )
}
