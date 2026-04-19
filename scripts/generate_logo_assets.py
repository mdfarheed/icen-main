"""Render ICEN logo SVG + PNG assets for social media use."""
import math
import os
import cairosvg
from pathlib import Path

OUT = Path("/app/icen_logo_assets")
OUT.mkdir(exist_ok=True)


def emblem_svg(variant: str = "dark", size: int = 80, bg: str = "none") -> str:
    ink = "#0A1628" if variant == "dark" else "#FFFFFF"
    accent = "#0057FF"
    subtle = "rgba(10,22,40,0.28)" if variant == "dark" else "rgba(255,255,255,0.32)"

    ticks = []
    for i in range(24):
        a = (i * 360) / 24
        rad = math.radians(a)
        x1 = 40 + math.cos(rad) * 34
        y1 = 40 + math.sin(rad) * 34
        x2 = 40 + math.cos(rad) * 36
        y2 = 40 + math.sin(rad) * 36
        ticks.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    ticks_str = "\n    ".join(ticks)

    bg_rect = ""
    if bg != "none":
        bg_rect = f'<rect width="80" height="80" fill="{bg}"/>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 80 80" fill="none" aria-label="ICEN Emblem">
  {bg_rect}
  <circle cx="40" cy="40" r="38" stroke="{subtle}" stroke-width="0.6"/>
  <g stroke="{ink}" stroke-width="0.9">
    {ticks_str}
  </g>
  <circle cx="40" cy="40" r="30" stroke="{ink}" stroke-width="1.2"/>
  <circle cx="40" cy="40" r="22" stroke="{ink}" stroke-width="1.4" fill="none"/>
  <ellipse cx="40" cy="40" rx="22" ry="8" stroke="{ink}" stroke-width="0.9"/>
  <ellipse cx="40" cy="40" rx="22" ry="15" stroke="{ink}" stroke-width="0.7"/>
  <ellipse cx="40" cy="40" rx="14" ry="22" stroke="{ink}" stroke-width="0.7"/>
  <line x1="40" y1="18" x2="40" y2="62" stroke="{ink}" stroke-width="0.9"/>
  <path d="M 40 18 A 18 22 0 0 1 40 62" stroke="{accent}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M 30 46 L 40 36 L 50 46" stroke="{accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <circle cx="40" cy="18" r="1.8" fill="{accent}"/>
</svg>'''


def wordmark_svg(variant: str = "dark", bg: str = "none") -> str:
    """Full horizontal wordmark: Emblem + 'ICEN' + tagline."""
    ink = "#0A1628" if variant == "dark" else "#FFFFFF"
    accent = "#0057FF" if variant == "dark" else "#4A8BFF"
    muted = "#5B6B7F" if variant == "dark" else "rgba(255,255,255,0.6)"

    subtle = "rgba(10,22,40,0.28)" if variant == "dark" else "rgba(255,255,255,0.32)"

    ticks = []
    for i in range(24):
        a = (i * 360) / 24
        rad = math.radians(a)
        x1 = 40 + math.cos(rad) * 34
        y1 = 40 + math.sin(rad) * 34
        x2 = 40 + math.cos(rad) * 36
        y2 = 40 + math.sin(rad) * 36
        ticks.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    ticks_str = "\n      ".join(ticks)

    bg_rect = ""
    if bg != "none":
        bg_rect = f'<rect width="620" height="160" fill="{bg}"/>'

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="620" height="160" viewBox="0 0 620 160" fill="none" aria-label="ICEN — International Council for Emerging Nations">
  {bg_rect}
  <g transform="translate(20, 40)">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="{subtle}" stroke-width="0.6"/>
      <g stroke="{ink}" stroke-width="0.9">
      {ticks_str}
      </g>
      <circle cx="40" cy="40" r="30" stroke="{ink}" stroke-width="1.2"/>
      <circle cx="40" cy="40" r="22" stroke="{ink}" stroke-width="1.4" fill="none"/>
      <ellipse cx="40" cy="40" rx="22" ry="8" stroke="{ink}" stroke-width="0.9"/>
      <ellipse cx="40" cy="40" rx="22" ry="15" stroke="{ink}" stroke-width="0.7"/>
      <ellipse cx="40" cy="40" rx="14" ry="22" stroke="{ink}" stroke-width="0.7"/>
      <line x1="40" y1="18" x2="40" y2="62" stroke="{ink}" stroke-width="0.9"/>
      <path d="M 40 18 A 18 22 0 0 1 40 62" stroke="{accent}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M 30 46 L 40 36 L 50 46" stroke="{accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="40" cy="18" r="1.8" fill="{accent}"/>
    </svg>
  </g>
  <g transform="translate(125, 0)">
    <text x="0" y="75" font-family="Georgia, 'Times New Roman', serif" font-size="48" font-weight="600" letter-spacing="9" fill="{ink}">ICEN</text>
    <text x="2" y="105" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="{accent}">INTERNATIONAL COUNCIL</text>
    <text x="2" y="125" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="600" letter-spacing="3" fill="{muted}">FOR EMERGING NATIONS</text>
  </g>
</svg>'''


def square_social_svg(variant: str = "dark", bg: str = "#F7F5EF") -> str:
    """Social-media-friendly square composition: emblem centered with ICEN wordmark."""
    ink = "#0A1628" if variant == "dark" else "#FFFFFF"
    accent = "#0057FF" if variant == "dark" else "#4A8BFF"
    muted = "#5B6B7F" if variant == "dark" else "rgba(255,255,255,0.7)"
    subtle = "rgba(10,22,40,0.28)" if variant == "dark" else "rgba(255,255,255,0.32)"

    ticks = []
    for i in range(24):
        a = (i * 360) / 24
        rad = math.radians(a)
        x1 = 40 + math.cos(rad) * 34
        y1 = 40 + math.sin(rad) * 34
        x2 = 40 + math.cos(rad) * 36
        y2 = 40 + math.sin(rad) * 36
        ticks.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>')
    ticks_str = "\n      ".join(ticks)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080" fill="none">
  <rect width="1080" height="1080" fill="{bg}"/>
  <g transform="translate(340, 220) scale(5)">
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="{subtle}" stroke-width="0.6"/>
      <g stroke="{ink}" stroke-width="0.9">
      {ticks_str}
      </g>
      <circle cx="40" cy="40" r="30" stroke="{ink}" stroke-width="1.2"/>
      <circle cx="40" cy="40" r="22" stroke="{ink}" stroke-width="1.4" fill="none"/>
      <ellipse cx="40" cy="40" rx="22" ry="8" stroke="{ink}" stroke-width="0.9"/>
      <ellipse cx="40" cy="40" rx="22" ry="15" stroke="{ink}" stroke-width="0.7"/>
      <ellipse cx="40" cy="40" rx="14" ry="22" stroke="{ink}" stroke-width="0.7"/>
      <line x1="40" y1="18" x2="40" y2="62" stroke="{ink}" stroke-width="0.9"/>
      <path d="M 40 18 A 18 22 0 0 1 40 62" stroke="{accent}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <path d="M 30 46 L 40 36 L 50 46" stroke="{accent}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="40" cy="18" r="1.8" fill="{accent}"/>
    </svg>
  </g>
  <text x="540" y="780" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="120" font-weight="600" letter-spacing="22" fill="{ink}">ICEN</text>
  <text x="540" y="840" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="7" fill="{accent}">INTERNATIONAL COUNCIL</text>
  <text x="540" y="878" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="7" fill="{muted}">FOR EMERGING NATIONS</text>
</svg>'''


def save_svg_png(svg_str: str, name: str, png_size: int = None, transparent: bool = True):
    """Save SVG + PNG at specified size."""
    svg_path = OUT / f"{name}.svg"
    svg_path.write_text(svg_str)
    if png_size:
        png_path = OUT / f"{name}.png"
        cairosvg.svg2png(
            bytestring=svg_str.encode("utf-8"),
            write_to=str(png_path),
            output_width=png_size,
            output_height=png_size if "square" in name or "emblem" in name else None,
            background_color=None if transparent else "#FFFFFF",
        )
        print(f"  ✓ {name}.svg + {name}.png ({png_size}px)")
    else:
        print(f"  ✓ {name}.svg")


def save_wordmark_png(svg_str: str, name: str, width: int = 1600):
    svg_path = OUT / f"{name}.svg"
    svg_path.write_text(svg_str)
    png_path = OUT / f"{name}.png"
    cairosvg.svg2png(
        bytestring=svg_str.encode("utf-8"),
        write_to=str(png_path),
        output_width=width,
    )
    print(f"  ✓ {name}.svg + {name}.png ({width}px wide)")


print("Generating emblem variants …")
# Emblem on transparent bg
save_svg_png(emblem_svg("dark"), "emblem_navy_transparent", 1024)
save_svg_png(emblem_svg("light"), "emblem_white_transparent", 1024)
# Emblem on solid fills
save_svg_png(emblem_svg("dark", bg="#F7F5EF"), "emblem_navy_on_ivory", 1024, transparent=False)
save_svg_png(emblem_svg("light", bg="#0A1628"), "emblem_white_on_navy", 1024, transparent=False)

print("\nGenerating horizontal wordmarks …")
save_wordmark_png(wordmark_svg("dark"), "wordmark_navy_transparent", 1600)
save_wordmark_png(wordmark_svg("light"), "wordmark_white_transparent", 1600)
save_wordmark_png(wordmark_svg("dark", bg="#F7F5EF"), "wordmark_on_ivory", 1600)
save_wordmark_png(wordmark_svg("light", bg="#0A1628"), "wordmark_on_navy", 1600)

print("\nGenerating square social-ready compositions (1080x1080) …")
# Ivory background (light theme)
svg = square_social_svg("dark", bg="#F7F5EF")
(OUT / "social_square_ivory.svg").write_text(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / "social_square_ivory.png"), output_width=1080, output_height=1080)
print("  ✓ social_square_ivory (1080x1080)")

# Navy background
svg = square_social_svg("light", bg="#0A1628")
(OUT / "social_square_navy.svg").write_text(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / "social_square_navy.png"), output_width=1080, output_height=1080)
print("  ✓ social_square_navy (1080x1080)")

# White bg
svg = square_social_svg("dark", bg="#FFFFFF")
(OUT / "social_square_white.svg").write_text(svg)
cairosvg.svg2png(bytestring=svg.encode(), write_to=str(OUT / "social_square_white.png"), output_width=1080, output_height=1080)
print("  ✓ social_square_white (1080x1080)")

print("\nGenerating profile picture variants (512x512) …")
for v in ["dark", "light"]:
    bg = "#F7F5EF" if v == "dark" else "#0A1628"
    name = f"profile_512_{'ivory' if v == 'dark' else 'navy'}"
    svg_str = emblem_svg(v, bg=bg)
    (OUT / f"{name}.svg").write_text(svg_str)
    cairosvg.svg2png(bytestring=svg_str.encode(), write_to=str(OUT / f"{name}.png"), output_width=512, output_height=512)
    print(f"  ✓ {name}.png")

# Favicon-size
svg_str = emblem_svg("dark", bg="#F7F5EF")
cairosvg.svg2png(bytestring=svg_str.encode(), write_to=str(OUT / "favicon_256.png"), output_width=256, output_height=256)
print("  ✓ favicon_256.png")

print(f"\n✅ All assets saved to: {OUT}")
print("\nContents:")
for f in sorted(OUT.iterdir()):
    size_kb = f.stat().st_size / 1024
    print(f"  {f.name:<42} {size_kb:>7.1f} KB")
