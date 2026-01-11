import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import swarLogo from '@/assets/swar-logo.png';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={swarLogo} alt="SWAR Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold">SWAR</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm">
              Voice-first AI platform for early detection and support of learning differences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/learn-more" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('nav.learnMore')}
                </Link>
              </li>
              <li>
                <Link to="/auth?role=parent" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('role.parent')}
                </Link>
              </li>
              <li>
                <Link to="/auth?role=teacher" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('role.teacher')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/ethics" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('footer.ethics')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
                  {t('footer.helpCenter')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Mail className="h-5 w-5" />
                <span>contact@swar.ai</span>
              </li>
              <li className="flex items-center gap-3 text-secondary-foreground/70">
                <Phone className="h-5 w-5" />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/70">
                <MapPin className="h-5 w-5 mt-0.5" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-12 pt-8 text-center text-secondary-foreground/60 text-sm">
          <p>© {new Date().getFullYear()} SWAR. All rights reserved. Detect • Support • Include</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
