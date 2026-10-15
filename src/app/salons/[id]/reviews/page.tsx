import {notFound} from 'next/navigation';
import {ArvoReviewsPage} from '@/components/prototype/salon-detail';
export default async function Page({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  if(id!=='arvo')notFound();
  return <ArvoReviewsPage/>;
}
