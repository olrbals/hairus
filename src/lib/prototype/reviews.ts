export type Review = {id:string;rating:string;date:string;visit:string;paragraphs:string[]};
export type ReviewData = {
  score:string;count:number;distribution:{stars:number;percent:number}[];
  highlights:{label:string;percent:number}[];reviews:Review[];demoLabel?:string;
};
// Existing designer prototype figures, not live customer statistics.
const prototypeDistribution=[{stars:5,percent:90},{stars:4,percent:9},{stars:3,percent:1},{stars:2,percent:0},{stars:1,percent:0}];
export function designerReviews(id:string,name:string):ReviewData{
  return {
    score:'4.9',count:id==='sohee'?513:623,distribution:prototypeDistribution,
    highlights:[{label:'상담이 꼼꼼해요',percent:85},{label:'원하는 스타일을 잘 이해해요',percent:78},{label:'친절해요',percent:72},{label:'손질법을 잘 알려줘요',percent:64}],
    reviews:[
      {id:'review-1',rating:'5.0',date:'2026-09-28',visit:'레이어드 컷 · 긴머리',paragraphs:['매번 원하는 스타일을 정확히 이해해주셔요 !',`${name}쌤 진짜 좋아요 유명해지세요 아니에요 유명해지지마세요 유명해주세요 아니 유명`]},
      {id:'review-2',rating:'5.0',date:'2026-09-20',visit:'C컬펌 · 긴머리',paragraphs:[`강한 컬은 부담스럽다고 말씀드렸는데 자연스럽게 맞춰주셨어요. 다음에도 ${name}쌤한테 머리 할래요 ~~~~`]},
    ],
  };
}
export const arvoReviews:ReviewData={
  score:'4.9',count:2004,
  // Prototype figures reused as examples only; no salon review API exists.
  distribution:prototypeDistribution,
  highlights:[{label:'매장이 청결해요',percent:85},{label:'공간이 편안해요',percent:78},{label:'직원들이 친절해요',percent:72},{label:'예약·방문 안내가 꼼꼼해요',percent:64}],
  demoLabel:'데모 리뷰 · 평점, 분포, 비율, 후기 개수와 내용은 프로토타입용 예시입니다.',
  reviews:[
    {id:'salon-review-1',rating:'5.0',date:'2026-09-28',visit:'커트 · 첫 방문',paragraphs:['처음 방문했는데 매장이 정말 깔끔하고 분위기도 편안했어요. 직원분들도 친절하게 안내해 주셔서 기분 좋게 시술받았어요.']},
    {id:'salon-review-2',rating:'5.0',date:'2026-09-20',visit:'펌 · 재방문',paragraphs:['공간이 넓고 쾌적해서 좋았어요. 상담부터 시술까지 차분하게 진행돼서 다음에도 방문하고 싶은 곳이에요.']},
  ],
};
