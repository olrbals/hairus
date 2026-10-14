import {Explore} from '@/components/prototype/explore';
import {StyleExplore} from '@/components/prototype/style-explore';
export default async function Page({searchParams}:{searchParams:Promise<{category?:string}>}){const {category}=await searchParams;return category==='designer'||category==='salon'?<Explore key={category} category={category}/>:<StyleExplore/>;}
