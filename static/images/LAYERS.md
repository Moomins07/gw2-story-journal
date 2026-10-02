# Homepage artwork layers

Original preserved: wallpaper.png, 1672 x 941. Previous generated assets are also preserved.

Current assets generated with the built-in image-generation tool:
- charr-ledge-foreground.png: extract both Charr, their entire rocky ledge, grasses, flowers and nearby framing foliage, preserving full canvas and original placement; all distant scenery transparent.
- floating-islands.png: extract only the two small distant floating islands near original coordinates (480,175) and (1165,80), retaining a full transparent canvas. Two clipped views animate these separately.
- wallpaper-distance.png: remove the Charr, near ground and framing foliage, plus the two selected floating islands; reconstruct distant valley and sky while preserving the original composition and painterly palette.

The scene uses a shared 1672/941 cover canvas. Foreground is full-canvas and stationary, with no parallax transform or idle animation. Only the distant landscape receives pointer parallax. Islands hover vertically by 5px and 7px on independent 13s and 19s cycles. Generated island size/placement is adjusted in CSS to match the original composition approximately.

AI-generated extraction/reconstruction can change small painted details. These are not pixel-exact masks. The untouched original is used as a static fallback if any generated layer fails. Reduced-motion preferences disable hovering, parallax and atmosphere motion. Hidden or unfocused pages pause their effects.