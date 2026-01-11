import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mic, Brain, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBackground} 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent-foreground/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-20 h-20 rounded-full bg-accent/30 blur-xl" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-150">
          <div className="w-32 h-32 rounded-full bg-primary/20 blur-2xl" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-pulse delay-300">
          <div className="w-24 h-24 rounded-full bg-accent-foreground/20 blur-xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-6 w-6 text-primary-foreground" />
          <span className="text-primary-foreground font-medium tracking-widest text-sm uppercase">
            {t('hero.tagline')}
          </span>
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
          {t('hero.title')}
        </h1>

        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-10">
          {t('hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/learn-more">
            <Button size="lg" className="bg-card text-foreground hover:bg-card/90 group">
              {t('nav.learnMore')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20"
            onClick={() => document.getElementById('role-selection')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Mic className="mr-2 h-5 w-5" />
            {t('nav.getStarted')}
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Mic, title: 'Voice Analysis', desc: 'Advanced speech recognition' },
            { icon: Brain, title: 'AI Detection', desc: 'Intelligent pattern analysis' },
            { icon: Sparkles, title: 'Early Flagging', desc: 'Timely intervention support' },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="bg-card/10 backdrop-blur-md rounded-xl p-6 border border-primary-foreground/20 hover:bg-card/20 transition-colors"
            >
              <feature.icon className="h-10 w-10 text-primary-foreground mx-auto mb-4" />
              <h3 className="text-primary-foreground font-semibold mb-2">{feature.title}</h3>
              <p className="text-primary-foreground/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
