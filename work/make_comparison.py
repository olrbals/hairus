from PIL import Image,ImageDraw,ImageFont,ImageChops
from pathlib import Path
p=Path('outputs/comparison')
f=ImageFont.truetype('/System/Library/Fonts/AppleSDGothicNeo.ttc',20)
small=ImageFont.truetype('/System/Library/Fonts/AppleSDGothicNeo.ttc',15)
def read(id):
 im=Image.open(p/(id+'.png')).convert('RGB');return im.crop((40,40,im.width-40,im.height-40))
def pair(a,b,out,title,labels,box=None,scale=1):
 ims=[read(a),read(b)]
 if box:ims=[im.crop(box) for im in ims]
 if scale!=1:ims=[im.resize((int(im.width*scale),int(im.height*scale)),Image.Resampling.NEAREST) for im in ims]
 w=ims[0].width;h=max(x.height for x in ims)
 canvas=Image.new('RGB',(w*2+72,h+108),(240,240,238));d=ImageDraw.Draw(canvas)
 d.text((24,12),title,font=f,fill='#20201e')
 for i,(im,label) in enumerate(zip(ims,labels)):
  x=24+i*(w+24);d.text((x,47),label,font=small,fill='#20201e');canvas.paste(im,(x,84))
 canvas.save(p/out)
pair('876-3140','905-9776','matching-side-by-side.png','매칭 05 · 불편했던 경험 선택',['왼쪽: 시연용 876:3140','오른쪽: 95% 이상 완성 905:9776'])
pair('876-2654','905-10025','home-full-side-by-side.png','Home · 전체 화면 비교',['왼쪽: 시연용 876:2654','오른쪽: 95% 이상 완성 905:10025'])
pair('876-2654','905-10025','home-top-side-by-side.png','Home · 첫 화면 확대 비교',['왼쪽: 시연용 876:2654','오른쪽: 95% 이상 완성 905:10025'],(0,0,430,874))
pair('876-2654','905-10025','home-caption-side-by-side.png','In Focus · 캡션 비교 (2배 확대)',['시연용: 제목 16px','95% 영역: 제목 20px'],(12,1210,418,1360),2)
a=Image.open(p/'876-3140.png').convert('RGB');b=Image.open(p/'905-9776.png').convert('RGB');diff=ImageChops.difference(a,b);print('matching pixel bbox',diff.getbbox());print('changed pixels',sum(1 for px in diff.getdata() if px!=(0,0,0)))
