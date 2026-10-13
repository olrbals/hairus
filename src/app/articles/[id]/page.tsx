import {Magazine} from '@/components/prototype/details';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Magazine id={id} focus={false}/>;}
