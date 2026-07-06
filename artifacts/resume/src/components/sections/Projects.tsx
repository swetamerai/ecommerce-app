import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder } from 'lucide-react';

const projects = [
  {
    title: 'Nexus E-Commerce Engine',
    description: 'A headless e-commerce API platform built to support multi-channel retail. Features robust inventory management, complex variant pricing, Stripe Connect integration for multi-vendor payouts, and high-performance Redis caching.',
    tech: ['Laravel', 'MySQL', 'Redis', 'Stripe API', 'Docker'],
    github: '#',
    live: '#'
  },
  {
    title: 'OmniSaaS Dashboard',
    description: 'Multi-tenant SaaS boilerplate that handles user provisioning, subscription billing, role-based access control, and tenant-specific database isolation. Accelerated time-to-market for 4 different internal products.',
    tech: ['Laravel', 'Inertia.js', 'Vue 3', 'Tailwind', 'PostgreSQL'],
    github: '#',
    live: '#'
  },
  {
    title: 'Pulse Real-time Notification Service',
    description: 'A centralized websocket-based notification microservice. Aggregates events from various internal systems and delivers real-time alerts to connected frontends. Capable of handling 10k+ concurrent connections.',
    tech: ['PHP 8', 'Laravel WebSockets', 'Redis', 'React'],
    github: '#',
    live: ''
  },
  {
    title: 'Aura CMS',
    description: 'A bespoke content management system tailored for high-traffic digital publishers. Includes a block-based visual editor, complex publishing workflows, media management, and automated SEO analysis.',
    tech: ['Laravel', 'Livewire', 'Alpine.js', 'MySQL'],
    github: '',
    live: '#'
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 flex items-center justify-between"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-4">
            <span className="text-primary font-mono text-xl font-normal">03.</span>
            Featured Projects
          </h2>
          <div className="hidden md:block h-[1px] bg-border/50 flex-1 ml-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-xl p-8 border border-border/50 hover:border-primary/50 transition-colors group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <Folder className="text-primary w-10 h-10" strokeWidth={1.5} />
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub Repository">
                      <Github size={20} />
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Live Demo">
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed flex-1">
                {project.description}
              </p>
              
              <ul className="flex flex-wrap gap-3 font-mono text-xs text-muted-foreground mt-auto">
                {project.tech.map(tech => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
