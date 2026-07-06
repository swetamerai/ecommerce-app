import React from 'react';
import { motion } from 'framer-motion';
import { 
  SiLaravel, 
  SiPhp, 
  SiMysql, 
  SiDocker, 
  SiGit, 
  SiVuedotjs, 
  SiReact, 
  SiTailwindcss,
  SiRedis
} from 'react-icons/si';

const skills = [
  { name: 'Laravel', icon: SiLaravel, color: 'group-hover:text-[#FF2D20]' },
  { name: 'PHP', icon: SiPhp, color: 'group-hover:text-[#777BB4]' },
  { name: 'MySQL', icon: SiMysql, color: 'group-hover:text-[#4479A1]' },
  { name: 'Vue.js', icon: SiVuedotjs, color: 'group-hover:text-[#4FC08D]' },
  { name: 'React', icon: SiReact, color: 'group-hover:text-[#61DAFB]' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'group-hover:text-[#06B6D4]' },
  { name: 'Docker', icon: SiDocker, color: 'group-hover:text-[#2496ED]' },
  { name: 'Redis', icon: SiRedis, color: 'group-hover:text-[#DC382D]' },
  { name: 'Git', icon: SiGit, color: 'group-hover:text-[#F05032]' },
];

const backendFocus = ['Livewire', 'Eloquent ORM', 'REST APIs', 'Pest PHP', 'Microservices', 'WebSockets'];

export default function Skills() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="skills" className="py-24 bg-secondary/30 relative border-y border-border/30">
      <div className="container mx-auto px-6 md:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="text-primary font-mono text-xl font-normal">02.</span>
            Technical Arsenal
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2">
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {skills.map((skill) => (
                <motion.div 
                  key={skill.name} 
                  variants={item}
                  className="group flex flex-col items-center justify-center p-6 bg-background rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,45,32,0.1)] hover:-translate-y-1"
                >
                  <skill.icon className={`text-4xl text-muted-foreground transition-colors duration-300 ${skill.color} mb-4`} />
                  <span className="font-medium text-sm text-foreground">{skill.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              Backend Focus
            </h3>
            <ul className="space-y-4">
              {backendFocus.map((focus, i) => (
                <motion.li 
                  key={focus}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-lg">{focus}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-12 p-6 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-mono text-primary mb-2">My Philosophy</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tools are just tools. True engineering is understanding the problem well enough to pick the right one. 
                I lean on Laravel because it stays out of my way and lets me focus on business logic.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
