import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export default function Education() {
  return (
    <section id="education" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-4">
            <span className="text-primary font-mono text-xl font-normal">05.</span>
            Education
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto flex gap-6 items-start hover:border-primary/30 transition-colors"
        >
          <div className="bg-primary/10 p-4 rounded-xl text-primary hidden sm:block">
            <GraduationCap size={32} />
          </div>
          
          <div>
            <div className="text-primary font-mono text-sm mb-1">2013 — 2017</div>
            <h3 className="text-xl font-bold mb-2">Bachelor of Science in Computer Science</h3>
            <div className="text-foreground font-medium mb-4">University of the Punjab, Lahore</div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Focused on software engineering principles, database design, and algorithms. 
              Graduated with honors. Final year project involved building a distributed computing 
              resource allocation system in C++.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
