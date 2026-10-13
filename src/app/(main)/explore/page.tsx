import {Explore} from '@/components/prototype/explore';
export default async function Page({searchParams}:{searchParams:Promise<{category?:string}>}){const {category}=await searchParams;return <Explore key={category||'style'} category={category}/>;}
