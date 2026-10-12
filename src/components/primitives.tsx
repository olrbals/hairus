import type {ButtonHTMLAttributes, ReactNode} from "react";
export function Button({variant="primary",className="",...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"glass"|"plain"}) {return <button type="button" className={`button button--${variant} ${className}`} {...props}/>;}
export function SectionHeading({title,description,action}: {title:string;description:string;action?:ReactNode}) {return <header className="section-heading"><h2>{title}</h2><p>{description}</p>{action}</header>;}
export function Icon({name}:{name:"home"|"explore"|"saved"|"my"|"bookmark"}) {return <img src={`/assets/figma/${name}.svg`} alt="" aria-hidden="true"/>;}
