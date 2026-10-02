"""Create web-sized copies without changing the original artwork.
Run with a Python environment containing Pillow: python scripts/optimize_images.py
"""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / 'static' / 'images'


def optimize():
    # Keep full dimensions so all foreground/island coordinates remain aligned.
    names = ['wallpaper', 'wallpaper-distance', 'charr-ledge-foreground',
             'floating-islands', 'pyre-emblem-colour']
    original_total = optimized_total = 0
    for name in names:
        source = IMAGES / f'{name}.png'
        target = IMAGES / f'{name}.webp'
        with Image.open(source) as image:
            # WebP stores alpha losslessly even when the colour channels are lossy.
            # The flat emblem stays entirely lossless to keep its three colours exact.
            image.save(target, 'WEBP', quality=85, method=6,
                       lossless=name == 'pyre-emblem-colour', exact=True)
            with Image.open(target) as result:
                assert result.size == image.size
                if 'A' in image.getbands():
                    assert ImageChops.difference(image.getchannel('A'),
                                                 result.convert('RGBA').getchannel('A')).getbbox() is None
        original_total += source.stat().st_size
        optimized_total += target.stat().st_size
        print(f'{name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes')
    # A separate tiny PNG is widely supported as a browser tab icon.
    with Image.open(IMAGES / 'pyre-emblem-colour.png') as image:
        image.convert('RGBA').resize((32, 32), Image.Resampling.LANCZOS).save(
            IMAGES / 'favicon.png', optimize=True)
    print(f'Total image reduction: {100 * (1 - optimized_total / original_total):.1f}%')


if __name__ == '__main__':
    optimize()