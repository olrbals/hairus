import {PeopleExplore} from '@/components/prototype/people-explore';
import {StyleExplore} from '@/components/prototype/style-explore';
export default async function Page({searchParams}:{searchParams:Promise<{category?:string}>}){const {category}=await searchParams;return category==='designer'||category==='salon'?<PeopleExplore key={category} category={category}/>:<StyleExplore/>;}
