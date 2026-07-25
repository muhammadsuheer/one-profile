# Brand assets

Drop the logo artwork here, then flip `BRAND_ASSETS_READY` to `true` in
`src/components/Logo.tsx`. Nothing else needs changing — every surface reads
from that component.

    logo.svg    Full lockup: mark + wordmark. Transparent background.
    mark.svg    Mark only, no wordmark. Transparent background.
                Used for the favicon, OG image, email header and any tight space.

SVG rather than PNG, because the same file then serves a 16px favicon and a
1200px OG image with no separate exports, and stays crisp on any display. A
transparent PNG at 3x will work if SVG isn't available — the artwork must not
carry a white background, since every surface here is dark.
