// src/components/BlurText.js
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const BlurText = ({ text, delay = 0.15 }) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={ref} style={{ display: 'inline-block', overflow: 'hidden' }}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: -40, opacity: 0, filter: 'blur(8px)' }}
          animate={
            inView
              ? { y: 0, opacity: 1, filter: 'blur(0px)' }
              : { y: -40, opacity: 0, filter: 'blur(8px)' }
          }
          transition={{
            duration: 0.6,
            delay: i * delay,
            ease: 'easeOut',
          }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </h2>
  );
};

export default BlurText;