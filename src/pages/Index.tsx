
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center p-10 bg-white rounded-xl shadow-sm"
      >
        <h1 className="text-5xl font-bold text-slate-800">Hello World</h1>
      </motion.div>
    </div>
  );
};

export default Index;
