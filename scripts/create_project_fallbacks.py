from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
data_dir = root / 'data' / 'projects'
created = 0

for file in sorted(data_dir.glob('*.json')):
    project = json.loads(file.read_text(encoding='utf-8'))
    title = project.get('title', 'Surya.ai System')
    initials = ''.join(part[0] for part in title.split()[:2]).upper()
    for index, shot in enumerate(project.get('screenshots', []), start=1):
        src = shot.get('src', '')
        if not src.startswith('/'):
            continue
        target = root / 'public' / src.lstrip('/')
        if target.exists():
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        width, height = 1440, 900
        image = Image.new('RGB', (width, height), '#080b0d')
        draw = ImageDraw.Draw(image)
        for y in range(height):
            mix = y / height
            color = (8 + int(8 * mix), 11 + int(20 * mix), 13 + int(20 * mix))
            draw.line((0, y, width, y), fill=color)
        for x in range(0, width, 72):
            draw.line((x, 0, x, height), fill='#172026', width=1)
        for y in range(0, height, 72):
            draw.line((0, y, width, y), fill='#172026', width=1)
        draw.ellipse((810, -180, 1510, 520), outline='#244b42', width=3)
        draw.ellipse((980, 160, 1520, 700), outline='#6b9131', width=2)
        draw.rounded_rectangle((90, 110, 760, 600), radius=24, fill='#0d1317', outline='#29343a', width=2)
        draw.rounded_rectangle((125, 160, 725, 205), radius=8, fill='#131b20')
        draw.ellipse((145, 176, 157, 188), fill='#b8ff3d')
        draw.ellipse((166, 176, 178, 188), fill='#4b5b61')
        draw.ellipse((187, 176, 199, 188), fill='#4b5b61')
        for row in range(3):
            top = 250 + row * 90
            draw.rounded_rectangle((145, top, 705, top + 58), radius=8, outline='#2a363b', width=2)
            draw.rectangle((165, top + 18, 285 + row * 45, top + 22), fill='#63852f')
        font_large = ImageFont.load_default(size=150)
        font_small = ImageFont.load_default(size=28)
        draw.text((850, 540), initials, font=font_large, fill='#b8ff3d')
        draw.text((94, 690), f'SYS-{index:02d} / {title.upper()}', font=font_small, fill='#a6adb5')
        draw.line((94, 750, 1330, 750), fill='#273138', width=2)
        draw.line((94, 750, 510, 750), fill='#b8ff3d', width=3)
        image.save(target, 'WEBP', quality=88, method=6)
        created += 1

print(f'Created {created} project fallback frame(s).')
