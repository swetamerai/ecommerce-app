import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-mono text-sm mb-4">06. What's Next?</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Whether you have a complex backend problem to solve, a project that needs rescuing, 
            or just want to say hi, my inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-8"
          >
            <div className="bg-secondary/30 border border-border/50 rounded-xl p-6">
              <h3 className="font-bold text-xl mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <a href="mailto:hello@ahmadraza.dev" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-12 h-12 bg-background border border-border flex items-center justify-center rounded-lg group-hover:border-primary/50 transition-colors">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">Email</div>
                    <div className="font-mono text-sm">hello@ahmadraza.dev</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-12 h-12 bg-background border border-border flex items-center justify-center rounded-lg group-hover:border-primary/50 transition-colors">
                    <Github size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">GitHub</div>
                    <div className="font-mono text-sm">github.com/ahmadraza-dev</div>
                  </div>
                </a>
                
                <a href="#" className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors group">
                  <div className="w-12 h-12 bg-background border border-border flex items-center justify-center rounded-lg group-hover:border-primary/50 transition-colors">
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">LinkedIn</div>
                    <div className="font-mono text-sm">in/ahmadraza-dev</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3 bg-card border border-border/50 rounded-xl p-6 md:p-8"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                  <Input id="name" placeholder="John Doe" className="bg-background/50 h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                  <Input id="email" type="email" placeholder="john@example.com" className="bg-background/50 h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                <Input id="subject" placeholder="Project Inquiry" className="bg-background/50 h-12" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <Textarea 
                  id="message" 
                  placeholder="Tell me about your project..." 
                  className="bg-background/50 min-h-[150px] resize-none"
                />
              </div>
              
              <Button type="button" size="lg" className="w-full sm:w-auto px-8 h-12 group">
                Send Message
                <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
