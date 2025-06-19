import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  keyProp?: string;
}

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PageTransition: React.FC<Props> = ({ children, keyProp }) => {
  return (
    <motion.div
      key={keyProp}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="min-h-[inherit]"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
