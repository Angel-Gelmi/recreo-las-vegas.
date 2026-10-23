"""Resize the supplied logo without redrawing it; retain safe Android mask margins."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'assets/images/logo-app.png'
dest = root / 'assets/icons'
dest.mkdir(parents=True, exist_ok=True)
with Image.open(source) as original:
    logo = original.convert('RGBA')
    for name, size, fraction in [
        ('app-icon-192.png', 192, 1.0),
        ('app-icon-512.png', 512, 1.0),
        ('app-icon-maskable.png', 512, 0.8),
    ]:
        scaled = logo.copy()
        scaled.thumbnail((round(size * fraction), round(size * fraction)), Image.Resampling.LANCZOS)
        canvas = Image.new('RGB', (size, size), 'white')
        canvas.paste(scaled, ((size-scaled.width)//2, (size-scaled.height)//2), scaled)
        canvas.save(dest / name, optimize=True)
        with Image.open(dest / name) as result:
            assert result.size == (size, size) and result.mode == 'RGB'
        print(f'{name}: {size}x{size}, original logo preserved')
