from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent
font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 20)
for step in ['service', 'schedule', 'note', 'review', 'complete']:
    before = Image.open(root / f'before-{step}.png').convert('RGB')
    after = Image.open(root / f'after-{step}.png').convert('RGB')
    canvas = Image.new('RGB', (900, max(before.height, after.height) + 80), '#f0efec')
    draw = ImageDraw.Draw(canvas)
    draw.text((16, 18), f'BEFORE / {step.upper()}', font=font, fill='#222222')
    draw.text((454, 18), f'AFTER / {step.upper()}', font=font, fill='#222222')
    canvas.paste(before, (12, 60))
    canvas.paste(after, (454, 60))
    canvas.save(root / f'comparison-{step}.png')
