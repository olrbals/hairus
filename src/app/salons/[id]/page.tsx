import {Detail} from '@/components/prototype/details';
import {ArvoSalonPage} from '@/components/prototype/salon-detail';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return id==='arvo'?<ArvoSalonPage/>:<Detail kind="salon" id={id}/>;}
