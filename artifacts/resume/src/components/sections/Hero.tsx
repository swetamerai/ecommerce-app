import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid & Gradient */}
      <div className="absolute inset-0 z-0 bg-grid opacity-20"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0 pointer-events-none opacity-50"></div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-mono text-muted-foreground mb-6"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Available for new opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4"
        >
          Ahmad Raza
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl text-muted-foreground font-medium mb-6 flex items-center gap-3"
        >
          <Terminal className="text-primary hidden md:block" size={32} />
          Senior Laravel / Full-Stack Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed"
        >
          I build precise, high-performance web applications that scale. 
          Specializing in complex backend architectures, RESTful APIs, and 
          seamless frontend integrations. Code that doesn't just work, but thrives.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button size="lg" className="h-14 px-8 text-base group" asChild>
            <a href="#projects">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-base border-border hover:bg-secondary/80" asChild>
            <a href="/cv-placeholder.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4 text-muted-foreground" />
              Download CV
            </a>
          </Button>
        </motion.div>

        {/* Tech Stack quick view */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 pt-8 border-t border-border/40 w-full max-w-3xl flex flex-wrap gap-8 items-center text-muted-foreground/60"
        >
          <span className="font-mono text-sm uppercase tracking-wider text-muted-foreground/40">Powered by</span>
          <span className="font-bold text-lg hover:text-foreground transition-colors cursor-default">Laravel</span>
          <span className="font-bold text-lg hover:text-foreground transition-colors cursor-default">PHP 8.x</span>
          <span className="font-bold text-lg hover:text-foreground transition-colors cursor-default">Vue.js</span>
          <span className="font-bold text-lg hover:text-foreground transition-colors cursor-default">React</span>
          <span className="font-bold text-lg hover:text-foreground transition-colors cursor-default">Docker</span>
        </motion.div>
      </div>
    </section>
  );
}
