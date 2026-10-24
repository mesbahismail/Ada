import type { Metadata } from "next"

import { ImageEditor } from "@/registry/ada/components/ada/image-editor"

export const metadata: Metadata = {
  title: "Edit image",
}

export default function ImageEditorPage() {
  return <ImageEditor scene="bloom" />
}
