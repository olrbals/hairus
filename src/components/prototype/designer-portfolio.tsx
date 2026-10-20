import {BackLink} from '@/components/navigation-history';
import {HeaderBackIcon} from '@/components/primitives';
import {designerPortfolios, type PortfolioSectionData} from '@/lib/prototype/portfolio';
import {PortfolioCarousel} from './portfolio-carousel';
import styles from './designer-portfolio.module.css';

function PortfolioSection({section, name}: {section: PortfolioSectionData; name: string}) {
  return <section className={styles.section} data-figma-node={section.figmaNode} aria-labelledby={`portfolio-${section.id}`}>
    <h2 id={`portfolio-${section.id}`} data-figma-node={section.headingNode}>{section.title}</h2>
    <PortfolioCarousel works={section.works} label={`${name} ${section.title}`} figmaNode={section.carouselNode}/>
  </section>;
}

export function DesignerPortfolio({designerId}: {designerId: string}) {
  const portfolio = designerPortfolios[designerId];
  return <main id="main" className={styles.page} data-figma-node="920:4815" data-designer-id={designerId}>
    <header className={`${styles.header} hairus-page-header`} data-figma-node="920:4817">
      <BackLink className="hairus-header-back" href={`/designers/${designerId}`} aria-label={`${portfolio.name} 디자이너 상세로 돌아가기`}><HeaderBackIcon/></BackLink><span>포트폴리오</span><span aria-hidden="true"/>
    </header>
    <h1 className="sr-only">{portfolio.name} 디자이너 Portfolio</h1>
    <div className={styles.sections}>
      {portfolio.sections.map(section => <PortfolioSection key={section.id} section={section} name={portfolio.name}/>)}
    </div>
  </main>;
}
