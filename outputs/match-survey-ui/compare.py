"""Place Figma reference and production browser capture side by side for QA."""
from pathlib import Path
from PIL import Image, ImageDraw

folder = Path(__file__).resolve().parent
pairs = [('intro','intro'), ('step1-off','step1-off'), ('step1','step1-on'),
         ('step2','step2'), ('step3','step3-off'), ('step3-on','step3-on'),
         ('step4','step4'), ('step5','step5')]
for reference, implementation in pairs:
    original = Image.open(folder / f'figma-{reference}.png').convert('RGB')
    # Figma section captures carry 40px of canvas outside the 430x874 section.
    if original.size == (510, 954):
        original = original.crop((40, 40, 470, 914))
    actual = Image.open(folder / f'{implementation}.png').convert('RGB')
    actual = actual.crop((0, 0, original.width, original.height))
    result = Image.new('RGB', (original.width * 2 + 24, original.height + 32), '#eeeeee')
    result.paste(original, (0, 32))
    result.paste(actual, (original.width + 24, 32))
    labels = ImageDraw.Draw(result)
    labels.text((12, 10), 'FIGMA', fill='#111')
    labels.text((original.width + 36, 10), 'IMPLEMENTATION', fill='#111')
    result.save(folder / f'compare-{reference}.png')
