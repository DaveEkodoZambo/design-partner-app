import { motion, AnimatePresence } from "framer-motion";
import logoCuy from "@/assets/logoCuy.png";

interface LoadingScreenProps {
  show: boolean;
}

const LoadingScreen = ({ show }: LoadingScreenProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      >
        <motion.img
          src={logoCuy}
          alt="Communauté Urbaine de Yaoundé"
          className="w-44 h-44 object-contain"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default LoadingScreen;
