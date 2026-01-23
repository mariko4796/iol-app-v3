import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "眼内レンズ選択サポート",
    short_name: "IOLサポート",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1f3a",
    theme_color: "#0b1f3a",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
