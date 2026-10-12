export const mainTabs = [
 {href:"/home",label:"HOME",icon:"home"}, {href:"/explore",label:"EXPLORE",icon:"explore"},
 {href:"/saved",label:"SAVED",icon:"saved"}, {href:"/my",label:"MY",icon:"my"}
] as const;
// 아래 경로는 후속 단계 계약이며 PHASE 02에서 페이지 구현하지 않는다.
export const plannedRoutes = { splash:"/", onboarding:(step:1|2|3)=>`/onboarding/${step}`, login:"/login", welcome:"/welcome", guide:"/analysis/guide", camera:"/analysis/camera", captured:"/analysis/captured", loading:"/analysis/processing", result:"/analysis/result", edit:"/analysis/edit", style:(id:string)=>`/styles/${encodeURIComponent(id)}`, designer:(id:string)=>`/designers/${encodeURIComponent(id)}`, salon:(id:string)=>`/salons/${encodeURIComponent(id)}`, article:(id:string)=>`/articles/${encodeURIComponent(id)}`, reservation:"/reservation/new", hairNote:(id:string)=>`/hair-notes/${encodeURIComponent(id)}` } as const;
