import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    role: 'Senior Software Engineer',
    company: 'DevForge Agency',
    period: '2021 — Present',
    description: [
      'Architected and led the development of a multi-tenant SaaS application serving over 200 businesses.',
      'Optimized database queries and implemented Redis caching, reducing average API response times by 65%.',
      'Mentored junior developers and established CI/CD pipelines using GitHub Actions and Docker.'
    ]
  },
  {
    role: 'Full-Stack Developer',
    company: 'TechNovation',
    period: '2019 — 2021',
    description: [
      'Built a headless e-commerce backend in Laravel to support a custom Vue.js storefront.',
      'Integrated multiple third-party payment gateways (Stripe, PayPal, local providers).',
      'Refactored legacy PHP applications into modern MVC structures using Laravel.'
    ]
  },
  {
    role: 'Junior Web Developer',
    company: 'Creative Digital',
    period: '2017 — 2019',
    description: [
      'Developed and maintained WordPress and custom PHP websites for various clients.',
      'Created custom Laravel administration panels for data management.',
      'Collaborated closely with designers to implement pixel-perfect HTML/CSS.'
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-secondary/20 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-4xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="text-primary font-mono text-xl font-normal">04.</span>
            Where I've Worked
          </h2>
        </motion.div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-4 md:gap-8 items-baseline">
                {/* Timeline line for mobile */}
                <div className="md:hidden absolute left-0 top-2 bottom-0 w-px bg-border"></div>
                <div className="md:hidden absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary"></div>
                
                <div className="md:col-span-1 mb-2 md:mb-0 text-sm font-mono text-muted-foreground mt-1">
                  {exp.period}
                </div>
                
                <div className="md:col-span-3">
                  <h3 className="text-xl font-bold text-foreground">
                    {exp.role} <span className="text-primary">@ {exp.company}</span>
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm leading-relaxed">
                        <span className="text-primary mt-1.5 text-xs">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
