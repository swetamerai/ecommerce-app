import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-4">
              <span className="text-primary font-mono text-xl font-normal">01.</span>
              About Me
            </h2>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Based in Lahore, Pakistan, I've spent the last 6 years transforming complex business requirements into elegant, robust, and scalable digital solutions.
              </p>
              <p>
                My journey started with raw PHP, but discovering Laravel changed everything. It taught me the value of developer experience, expressive syntax, and architectural patterns. Since then, I've architected multi-tenant SaaS platforms, high-throughput APIs, and real-time dashboards for clients worldwide.
              </p>
              <p>
                I believe that good code is like good design—invisible. The user should never have to think about the infrastructure supporting their actions. When I'm not writing clean controllers or optimizing Eloquent queries, I'm usually exploring new frontend paradigms or writing technical deep-dives on my blog.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto relative group">
              {/* Decorative border */}
              <div className="absolute inset-0 border-2 border-primary/30 rounded-xl translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
              {/* Image placeholder / Code block abstract representation */}
              <div className="absolute inset-0 bg-secondary rounded-xl overflow-hidden flex flex-col border border-border">
                <div className="h-10 bg-background/50 border-b border-border flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <span className="ml-4 font-mono text-xs text-muted-foreground">User.php</span>
                </div>
                <div className="p-6 font-mono text-sm md:text-base text-muted-foreground flex-1 flex flex-col justify-center leading-relaxed">
                  <p><span className="text-primary">namespace</span> App\Models;</p>
                  <br/>
                  <p><span className="text-primary">use</span> Illuminate\Database\Eloquent\Model;</p>
                  <p><span className="text-primary">use</span> Illuminate\Database\Eloquent\Relations\HasMany;</p>
                  <br/>
                  <p><span className="text-primary">class</span> <span className="text-foreground">Developer</span> <span className="text-primary">extends</span> <span className="text-foreground">Model</span></p>
                  <p>{'{'}</p>
                  <p className="pl-6"><span className="text-primary">public function</span> <span className="text-foreground">skills</span>(): HasMany</p>
                  <p className="pl-6">{'{'}</p>
                  <p className="pl-12"><span className="text-primary">return</span> $this-&gt;hasMany(Skill::class)</p>
                  <p className="pl-16">-&gt;where(<span className="text-green-400">'mastery'</span>, <span className="text-green-400">'&gt;'</span>, 90);</p>
                  <p className="pl-6">{'}'}</p>
                  <p>{'}'}</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
