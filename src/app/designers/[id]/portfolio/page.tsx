import {DesignerExtra} from '@/components/prototype/details';
import {DesignerPortfolio} from '@/components/prototype/designer-portfolio';
export default async function Page({params}:{params:Promise<{id:string}>}) {
  const {id} = await params;
  return id === 'yoona' || id === 'sohee'
    ? <DesignerPortfolio key={id} designerId={id}/>
    : <DesignerExtra id={id} view="portfolio"/>;
}
