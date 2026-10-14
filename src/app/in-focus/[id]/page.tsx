import {Magazine} from '@/components/prototype/details';
import {InFocusEditorial} from '@/components/prototype/in-focus-editorial';

export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;
  if (id === 'soft-bob') return <InFocusEditorial/>;
  return <Magazine id={id} focus={true}/>;
}
