import {Magazine} from '@/components/prototype/details';
import {PopupDetail} from '@/components/prototype/popup-detail';
import {HairCareArticle} from '@/components/prototype/article-homecare';

export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if (id === 'popup') return <PopupDetail/>;
  if (id === 'care' || id === 'issue') return <HairCareArticle issue={id==='issue'}/>;
  return <Magazine id={id} focus={false}/>;
}
