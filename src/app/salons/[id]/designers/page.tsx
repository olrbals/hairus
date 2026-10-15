import {SalonDesigners} from '@/components/prototype/details';
import {ArvoDesignersPage} from '@/components/prototype/salon-detail';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return id==='arvo'?<ArvoDesignersPage/>:<SalonDesigners id={id}/>;}
