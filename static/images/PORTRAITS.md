# Character-select portraits

Created with the built-in image generator from David's supplied in-game screenshots.
The original PNG portraits are retained. The site uses 384px WebP versions at
quality 86 (about 90 KB combined), loaded lazily for cards and nametags.

## Kihto prompt
Square arcade character-select portrait of male Charr Kihto Pyrewalker, preserving
his dark feline muzzle, yellow eyes, brown braided mane, pale chin beard, curved
horns with gold bands, black hat and violet/black spiked armour. Close head and
shoulders, looking slightly left. Bold 1990s fighting-game cartoon ink outlines,
clean cel shading and readable shapes, charcoal/violet graphic backdrop. No text,
UI frame, logos or extra characters. Readable as an avatar or portrait card.

## Thya prompt
Matching square arcade character-select portrait of female Charr Thya Pyrewatcher,
preserving her pale tan/grey feline face, amber eyes, fangs, swept golden mane,
thin braids, dark curved horns and green metal armour with bronze trim. Close head
and shoulders, looking slightly right. Bold cartoon outlines and cel shading,
charcoal/emerald graphic backdrop. No text, UI frame, logos or extra characters.

## Integration
`templates/index.html` contains portraits, player badges and name labels.
`static/css/input.css` styles the frames, subtle zoom and selection entrance.
Only these UI portraits animate; the wallpaper characters remain stationary.
Existing `homepage.js` handles click, keyboard and Escape interactions.