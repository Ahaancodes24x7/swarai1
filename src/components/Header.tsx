import { useLanguage, Language } from '@/contexts/LanguageContext';
import swarLogo from '@/assets/swar-logo.png';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={swarLogo} alt="SWAR Logo" className="h-12 w-auto" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
            SWAR
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.home')}
          </Link>
          <Link to="/learn-more" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.learnMore')}
          </Link>
          <Link to="/why-it-matters" className="text-foreground/80 hover:text-foreground transition-colors">
            {t('nav.whyItMatters')}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
              <SelectTrigger className="w-[120px] bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => scrollToSection('role-selection')}
            className="bg-gradient-to-r from-primary to-accent-foreground hover:opacity-90 transition-opacity"
          >
            {t('nav.getStarted')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
