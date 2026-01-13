import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, AlertTriangle, Heart, Lightbulb, TrendingUp, School, Brain } from 'lucide-react';
import swarLogo from '@/assets/swar-logo.png';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const WhyItMatters = () => {
  const { t } = useLanguage();

  const statistics = [
    { value: '35M+', label: t('whyItMatters.statChildren'), icon: Users, color: 'text-primary' },
    { value: '90%', label: t('whyItMatters.statUndiagnosed'), icon: AlertTriangle, color: 'text-destructive' },
    { value: '3x', label: t('whyItMatters.statDropout'), icon: School, color: 'text-chart-4' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-muted">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              {t('whyItMatters.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('whyItMatters.subtitle')}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {statistics.map((stat, idx) => (
              <Card key={idx} className="text-center border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-8">
                  <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                  <p className={`text-5xl font-bold mb-2 ${stat.color}`}>{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{t('whyItMatters.prevalence')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('whyItMatters.prevalenceText')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle>{t('whyItMatters.detection')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('whyItMatters.detectionText')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-4">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-chart-4" />
                  </div>
                  <CardTitle>{t('whyItMatters.impact')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('whyItMatters.impactText')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-chart-3">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-chart-3/10 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-chart-3" />
                  </div>
                  <CardTitle>{t('whyItMatters.solution')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('whyItMatters.solutionText')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Real Stories Section */}
          <Card className="mb-16 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Brain className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Every Child Deserves a Chance</h3>
                  <p className="text-muted-foreground mb-4">
                    In India, millions of bright children struggle in school not because they lack intelligence, 
                    but because they learn differently. Dyslexia and dyscalculia affect how children process 
                    language and numbers, but with early identification and proper support, these children 
                    can thrive academically and professionally.
                  </p>
                  <p className="text-muted-foreground">
                    SWAR was created to bridge the gap between children who need help and the support they deserve. 
                    By making screening accessible in local languages and affordable for all schools, 
                    we're working to ensure no child is left behind.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a teacher looking to support your students or a parent concerned about your child, 
              SWAR provides the tools you need for early detection and intervention.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/#role-selection">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent-foreground">
                  {t('nav.getStarted')}
                </Button>
              </Link>
              <Link to="/learn-more">
                <Button size="lg" variant="outline">
                  {t('nav.learnMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WhyItMatters;
