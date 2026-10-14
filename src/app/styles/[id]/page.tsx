import {Detail} from '@/components/prototype/details';
import {AiryLayeredDetail} from '@/components/prototype/airy-layered-detail';

export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if (id === 'airy') return <AiryLayeredDetail/>;
  return <Detail kind="style" id={id}/>;
}
