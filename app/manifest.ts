import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Product Decision League",
    short_name: "PDL",
    description:
      "Practice real product decisions and compare your reasoning with experienced product leaders.",
    start_url: "/",
    display: "standalone",
    background_color: "#030814",
    theme_color: "#030814"
  };
}
