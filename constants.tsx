
import { Era, EraStyle } from './types';

export const ERAS: EraStyle[] = [
  {
    id: Era.CURRENT,
    year: 2024,
    description: "High Dynamic Range, clean digital look, modern fashion.",
    prompt: "A high-quality 2024 modern photograph. Sharp details, professional lighting, modern minimalist clothing, and high dynamic range.",
    color: "from-blue-500 to-cyan-400",
    icon: "fa-solid fa-mobile-screen-button"
  },
  {
    id: Era.ERA_2010,
    year: 2012,
    description: "Early Instagram filters, heavy HDR, hipster vibes.",
    prompt: "Transform this image to look like an early 2010s Instagram photo. Use 'Valencia' or 'Lo-fi' filter aesthetics, slight vignette, higher saturation, and 2010s fashion trends like infinity scarves or flannel.",
    color: "from-purple-500 to-pink-500",
    icon: "fa-brands fa-instagram"
  },
  {
    id: Era.ERA_2000,
    year: 2003,
    description: "Point-and-shoot digital noise, glossy Y2K aesthetic.",
    prompt: "Transform this photo into a 2003 digital camera aesthetic. Low resolution digital noise, harsh direct flash, high contrast, glossy finish, and Y2K era fashion (denim, tracksuits, frosted tips).",
    color: "from-emerald-400 to-teal-500",
    icon: "fa-solid fa-compact-disc"
  },
  {
    id: Era.ERA_1990,
    year: 1994,
    description: "Disposable camera film, muted tones, grunge era.",
    prompt: "A 1994 disposable camera aesthetic. Heavy film grain, slightly desaturated colors, 90s grunge fashion (oversized sweaters, flannels), and a nostalgic, authentic film texture.",
    color: "from-orange-500 to-amber-600",
    icon: "fa-solid fa-cassette-tape"
  },
  {
    id: Era.ERA_1980,
    year: 1985,
    description: "Polaroid warmth, neon glows, big hair energy.",
    prompt: "Transform this into an authentic 1985 Polaroid. Warm color temperature, soft focus, significant film grain, big 80s hairstyles, neon-accented fashion, and a vintage analog feel.",
    color: "from-red-500 to-orange-400",
    icon: "fa-solid fa-radio"
  }
];
