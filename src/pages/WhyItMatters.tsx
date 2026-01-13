import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, AlertTriangle, Heart, Lightbulb, TrendingUp, School, Brain, IndianRupee, MapPin, BookOpen, GraduationCap, Building2 } from 'lucide-react';
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

  const indiaStats = [
    { value: '15-20%', label: 'Estimated prevalence of dyslexia in Indian schools', icon: GraduationCap },
    { value: '₹2.5L Cr', label: 'Annual economic impact of untreated learning disabilities', icon: IndianRupee },
    { value: '1:50,000', label: 'Specialist to student ratio in rural India', icon: MapPin },
    { value: '22+', label: 'Official languages, each needing specific screening tools', icon: BookOpen },
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

          {/* What is Dyslexia & Dyscalculia Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Understanding Learning Differences</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">What is Dyslexia?</CardTitle>
                      <CardDescription>Reading and Language Processing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Dyslexia is a neurological learning difference that primarily affects reading, writing, and spelling. 
                    It is <strong>NOT</strong> related to intelligence—many highly successful individuals, including 
                    Albert Einstein, Steve Jobs, and Richard Branson, had dyslexia.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Common Signs:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Difficulty connecting letters with sounds</li>
                      <li>• Slow or inaccurate reading</li>
                      <li>• Reversing letters (b/d, p/q) or words (was/saw)</li>
                      <li>• Trouble with spelling and writing</li>
                      <li>• Difficulty with rhyming words</li>
                    </ul>
                  </div>
                  <div className="bg-chart-3/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-chart-3 mb-2">The Good News:</h4>
                    <p className="text-sm text-muted-foreground">
                      With early identification and proper support, children with dyslexia can become successful 
                      readers and achieve academic excellence. The key is catching it early!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-chart-4/10 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">What is Dyscalculia?</CardTitle>
                      <CardDescription>Mathematical Processing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Dyscalculia is a learning difference that affects the ability to understand numbers and 
                    mathematical concepts. Like dyslexia, it is neurological and unrelated to intelligence. 
                    It affects 3-6% of the population.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Common Signs:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Difficulty understanding number concepts</li>
                      <li>• Trouble with basic arithmetic (even with practice)</li>
                      <li>• Confusion with math symbols (+, -, ×, ÷)</li>
                      <li>• Difficulty telling time or managing money</li>
                      <li>• Reliance on finger counting for simple math</li>
                    </ul>
                  </div>
                  <div className="bg-chart-3/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-chart-3 mb-2">The Good News:</h4>
                    <p className="text-sm text-muted-foreground">
                      With targeted interventions using visual aids and hands-on learning, children with 
                      dyscalculia can develop strong math skills. Many successful professionals have dyscalculia!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact in India Section */}
          <Card className="mb-16 bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                The Impact in India
              </CardTitle>
              <CardDescription>Understanding the scale of the challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {indiaStats.map((stat, idx) => (
                  <div key={idx} className="text-center p-4 bg-background rounded-lg">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                <div className="p-6 bg-destructive/10 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    The Challenge
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>260+ million</strong> children in Indian schools, with an estimated 35-50 million affected by learning differences</li>
                    <li>• <strong>90% remain undiagnosed</strong> due to lack of awareness, trained professionals, and screening tools</li>
                    <li>• <strong>Only 1 specialist per 50,000 students</strong> in rural areas compared to 1:500 in developed countries</li>
                    <li>• <strong>Most screening tools are in English</strong>, making them inaccessible for Hindi, Tamil, Telugu, and other regional language speakers</li>
                    <li>• <strong>Social stigma</strong> prevents parents from seeking help, with children often labeled as "lazy" or "stupid"</li>
                    <li>• <strong>Higher dropout rates</strong>—students with unidentified learning differences are 3x more likely to drop out</li>
                  </ul>
                </div>

                <div className="p-6 bg-chart-3/10 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-chart-3" />
                    Why Early Detection Matters
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Before age 8</strong> is the critical window for intervention—the brain is most adaptable</li>
                    <li>• <strong>90% success rate</strong> with early intervention compared to 25% if detected in secondary school</li>
                    <li>• <strong>Prevents secondary issues</strong> like anxiety, depression, and low self-esteem</li>
                    <li>• <strong>Economic benefit</strong>: Every ₹1 spent on early intervention saves ₹7 in later remediation costs</li>
                    <li>• <strong>RTE Act compliance</strong>: Early identification helps schools provide mandated accommodations</li>
                  </ul>
                </div>

                <div className="p-6 bg-primary/10 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    How SWAR Helps
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Voice-based screening</strong> works for students who struggle with written tests</li>
                    <li>• <strong>Multilingual support</strong> in Hindi, Tamil, Telugu, Punjabi, and English</li>
                    <li>• <strong>AI-powered analysis</strong> provides instant, accurate results</li>
                    <li>• <strong>Teacher training</strong> built into the platform</li>
                    <li>• <strong>Affordable and scalable</strong> for government and private schools alike</li>
                    <li>• <strong>Bridges the specialist gap</strong> by empowering teachers to conduct initial screenings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

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

          {/* Success Stories Section */}
          <Card className="mb-16 bg-gradient-to-r from-chart-3/10 to-primary/10">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-background p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Albert Einstein</h3>
                  <p className="text-sm text-muted-foreground">
                    Struggled with reading and speech as a child, later diagnosed with dyslexia. 
                    Became one of the greatest scientists in history.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Richard Branson</h3>
                  <p className="text-sm text-muted-foreground">
                    Has dyslexia and was considered a poor student. Founded Virgin Group with 
                    400+ companies and a net worth of $5 billion.
                  </p>
                </div>
                <div className="bg-background p-6 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Agatha Christie</h3>
                  <p className="text-sm text-muted-foreground">
                    Had dysgraphia (writing difficulty). Became the best-selling fiction writer of 
                    all time with over 2 billion copies sold.
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
