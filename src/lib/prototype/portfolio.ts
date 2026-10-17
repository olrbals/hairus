export type PortfolioWork = {
  image: string;
  caption: string;
  figmaNode: string;
  /** Figma image-fill geometry, as percentages of the changing card frame. */
  crop?: {width: string; height: string; left: string; top: string};
};

export type PortfolioSectionData = {
  id: string;
  title: string;
  figmaNode: string;
  headingNode: string;
  carouselNode: string;
  works: PortfolioWork[];
};

const work = (file: string, caption: string, node: number, crop?: PortfolioWork['crop']): PortfolioWork => ({
  image: `/assets/figma/v1/${file}.png`, caption, figmaNode: `920:${node}`, crop,
});

const yoona: PortfolioSectionData[] = [
  {id: 'cut', title: 'DESIGN CUT', figmaNode: '920:4819', headingNode: '920:4822', carouselNode: '920:4823', works: [
    work('bd491', '테슬컷', 4824, {width:'109%', height:'103.42%', left:'-4.32%', top:'0.06%'}),
    work('5a15e', '레이어드컷', 4826),
    work('b40dd', '레이어드컷', 4828),
    work('14959', '허쉬컷', 4830),
    work('8288b', '레이어드컷', 4832, {width:'116.26%', height:'131%', left:'-16.23%', top:'-6.06%'}),
    work('1440b', '허쉬컷', 4834),
  ]},
  {id: 'colors', title: 'COLORS', figmaNode: '920:4836', headingNode: '920:4839', carouselNode: '920:4840', works: [
    work('79719', '매트브라운', 4841, {width:'134%', height:'113.17%', left:'-17.08%', top:'-0.11%'}),
    work('f66bd', '애쉬베이지', 4843),
    work('28f27', '매트브라운', 4845, {width:'119.81%', height:'135%', left:'-9.93%', top:'0.05%'}),
    work('636e2', '매트브라운', 4847, {width:'108.27%', height:'122%', left:'-4.19%', top:'-2.34%'}),
  ]},
  {id: 'perms', title: 'PERMS', figmaNode: '920:4849', headingNode: '920:4852', carouselNode: '920:4853', works: [
    work('5a15e', '샌드펌', 4854),
    work('d7b6a', '그레이스펌', 4856, {width:'108.57%', height:'108.83%', left:'-8.57%', top:'-8.83%'}),
    work('8b53e', '샌드펌', 4858, {width:'127%', height:'122.7%', left:'-19.93%', top:'-2.64%'}),
    work('3f757', '샌드펌', 4860),
    work('00c16', '그레이스펌', 4862),
    work('83c13', '히피펌', 4864),
    work('eebc4', '히피펌', 4866),
  ]},
];

// Existing catalog.ts explicitly attributes these matching styles to Sohee.
// Other slots reuse the Figma imagery with the user's approval (2026-10-17).
// Node IDs refer to the shared design slots, not ownership of the photographs.
const soheeImages: Record<string, string> = {'920:4824': '05be4', '920:4830': 'deb8c'};
const sohee = yoona.map(section => ({...section, works: section.works.map(item => {
  const image = soheeImages[item.figmaNode];
  return image ? {...item, image: `/assets/figma/v1/${image}.png`, crop: undefined} : {...item};
})}));

export const designerPortfolios: Record<string, {name: string; sections: PortfolioSectionData[]}> = {
  yoona: {name: '윤아', sections: yoona},
  sohee: {name: '소희', sections: sohee},
};
