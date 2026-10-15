import Link from 'next/link';
import {Fragment} from 'react';
import type {ReviewData} from '@/lib/prototype/reviews';
import styles from './reviews.module.css';

// Shared markup and unchanged visual rules from the integrated designer detail.
export function ReviewSection({data,allReviewsHref}:{data:ReviewData;allReviewsHref?:string}){
  return <section id="reviews" className={styles.reviews} aria-labelledby="reviews-title">
      <h2 id="reviews-title">REVIEWS</h2>
      {data.demoLabel&&<p className={styles.demoLabel}>{data.demoLabel}</p>}
      <div className={styles.rating}>
        <div className={styles.ratingSummary}>
          <div className={styles.ratingScore}><strong>{data.score}</strong><span aria-hidden="true">★</span></div>
          <div className={styles.ratingMeta}><span>/ 5.0</span><small>고객 후기 {data.count}개</small></div>
        </div>
        <div className={styles.ratingDistribution} aria-label="별점별 후기 분포">
          {data.distribution.map(({stars,percent})=><div key={stars} className={styles.ratingDistributionRow}>
            <div className={styles.ratingDistributionTrack} role="progressbar" aria-label={`${stars}점 평가 비율`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
              <span style={{width:`${percent}%`}}/>
            </div>
            <span aria-hidden="true">{stars}</span>
          </div>)}
        </div>
      </div>
      <div className={styles.reviewHighlights}>
        <h3>고객들이 자주 언급한 장점</h3>
        <ul>{data.highlights.map(({label,percent})=><li key={label}>
          <div className={styles.reviewHighlightHeading}><span>{label}</span><span>{percent}%</span></div>
          <div className={styles.reviewHighlightTrack} role="progressbar" aria-label={`${label} 언급 비율`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <span style={{width:`${percent}%`}}/>
          </div>
        </li>)}</ul>
      </div>
      {data.reviews.map(review=><article key={review.id}><header><span>★ {review.rating}</span><time dateTime={review.date}>{review.date.replaceAll('-','.')}</time></header><small>{review.visit}</small><p>{review.paragraphs.map((paragraph,index)=><Fragment key={index}>{index>0&&<br/>}{paragraph}</Fragment>)}</p></article>)}
      {allReviewsHref&&<Link className={styles.textLink} href={allReviewsHref!}>모든 후기 보기 →</Link>}
    </section>;
}
