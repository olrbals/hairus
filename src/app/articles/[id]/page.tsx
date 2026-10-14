import {Magazine} from '@/components/prototype/details';
import {PopupDetail} from '@/components/prototype/popup-detail';

export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if (id === 'popup') return <PopupDetail/>;
  return <Magazine id={id} focus={false}/>;
}
