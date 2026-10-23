"""Export simple code-drawn calendar icons; no generated imagery or modified source logos."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

dest=Path(__file__).resolve().parents[1]/'mobile-preview/v2'
for name,size in [('app-icon-192.png',192),('app-icon-512.png',512),('app-icon-maskable.png',512)]:
    # Essential contents stay inside the maskable safe zone.
    scale=4
    im=Image.new('RGB',(size*scale,size*scale),'#000000');d=ImageDraw.Draw(im)
    def box(coords,**kwargs):
        d.rounded_rectangle(tuple(int(n*size*scale) for n in coords),**kwargs)
    box((.20,.22,.80,.79),radius=int(size*scale*.06),fill='#111111',outline='#ffffff',width=max(2,int(size*scale*.012)))
    d.line([(size*scale*.20,size*scale*.40),(size*scale*.80,size*scale*.40)],fill='#ffffff',width=int(size*scale*.012))
    for x in [.34,.66]:box((x-.012,.16,x+.012,.29),radius=int(size*scale*.012),fill='#ffffff')
    font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',int(size*scale*.20))
    d.text((size*scale*.50,size*scale*.59),'LV',font=font,fill='#ffffff',anchor='mm')
    im.resize((size,size),Image.Resampling.LANCZOS).save(dest/name)
print('App icons exported at 192px and 512px, including a maskable icon.')
