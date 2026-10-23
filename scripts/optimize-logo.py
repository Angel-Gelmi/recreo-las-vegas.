"""Export a web-sized logo without changing the original brand asset."""
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
source=root/'assets/images/logo-gras-blanco.png'
with Image.open(source) as original:
    image=original.copy()
    image.thumbnail((528,528),Image.Resampling.LANCZOS)
    for directory in [root/'assets/images']:
        image.save(directory/'logo-gras-app.webp','WEBP',lossless=True,method=6)
print(f'Logo: {source.stat().st_size} -> {(root/"assets/images/logo-gras-app.webp").stat().st_size} bytes. Original unchanged.')
