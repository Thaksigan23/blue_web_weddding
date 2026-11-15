import React from 'react';
import {motion} from 'framer-motion';
import Monogram from './Monogram';
import './centered-opening.css';

export default function CenteredOpening({onOpen,reduced,departing=false}) {
  const reveal={hidden:{opacity:0,y:25,filter:'blur(5px)'},visible:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:.9,ease:[.22,.61,.36,1]}}};
  const logoReveal={hidden:{opacity:0,y:36,scale:.78,filter:'blur(8px)'},visible:{opacity:1,y:0,scale:1,filter:'blur(0px)',transition:{duration:1.35,ease:[.22,.61,.36,1]}}};
  return <motion.section className="intro centered-opening" aria-label="Sharon and Ramaniya engagement introduction" exit={{opacity:0}} transition={{duration:reduced?0:.6}}>
    <motion.div className="centered-opening-content" initial={reduced?false:'hidden'} animate={departing?'leaving':'visible'} variants={{hidden:{},visible:{transition:{staggerChildren:.22,delayChildren:.15}},leaving:{opacity:0,scale:.96,filter:'blur(4px)',transition:{duration:.35}}}}>
      <motion.div className="centered-opening-logo" variants={logoReveal}><Monogram variant="light"/></motion.div>
      <motion.p className="centered-opening-eyebrow" variants={reveal}>A BEAUTIFUL BEGINNING</motion.p>
      <motion.h1 variants={reveal}>Sharon <em>&</em> Ramaniya</motion.h1>
      <motion.div className="centered-opening-details" variants={reveal}><p>Our Engagement</p><span className="centered-opening-rule" aria-hidden="true">✧</span><time dateTime="2026-12-14T18:00:00+05:30">14 DECEMBER 2026</time></motion.div>
      <motion.button type="button" className="primary centered-opening-button" onClick={onOpen} variants={reveal} disabled={departing} aria-busy={departing} whileHover={reduced?undefined:{scale:1.035}} whileTap={reduced?undefined:{scale:.98}}>Click to Open</motion.button>
      <motion.p className="centered-opening-note" variants={reveal}>A little moment. A lifetime of love.</motion.p>
    </motion.div>
  </motion.section>;
}
