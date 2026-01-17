import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AudioWaveform, ClipboardCheck, Target, Shield, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const LearnMore = () => {
  const { t } = useLanguage();

  const detectionMethods = [
    {
      icon: Brain,
      title: 'Phonological Processing Deficits',
      description: 'Our core marker for dyslexia identification',
      details: [
        'CTOPP-2 (Comprehensive Test of Phonological Processing) composite scoring',
        'Phonological awareness assessment including blending and segmentation',
        'Phonological memory evaluation through digit span and nonword repetition',
        'Rapid symbolic naming speed measurement',
      ],
    },
    {
      icon: AudioWaveform,
      title: 'Speech Recognition Analysis',
      description: 'Advanced ASR technology for error pattern detection',
      details: [
        'Phoneme Error Rate (PER) calculation with >10% threshold indication',
        'Labial consonant confusion analysis (b/p, m/n)',
        'Fricative pattern detection (s/sh, f/th)',
        'Stop consonant substitution tracking',
        'Syllable stress pattern analysis via acoustic modeling',
      ],
    },
    {
      icon: ClipboardCheck,
      title: 'Standardized Assessment Integration',
      description: 'DSM-5 compliant evaluation criteria',
      details: [
        'Reading accuracy measurement below 16th percentile threshold',
        'Reading fluency words-per-minute assessment',
        'Comprehension level evaluation',
        'Academic, occupational, and daily functioning impact assessment',
      ],
    },
    {
      icon: Target,
      title: 'Dyscalculia Detection via Speech',
      description: 'Number sense and calculation ability assessment',
      details: [
        'Oral counting accuracy and sequence analysis',
        'Number naming and recognition through verbal responses',
        'Basic arithmetic verbalization patterns',
        'Number comparison and estimation skills',
        'Subitizing ability (instant recognition of quantities)',
      ],
    },
  ];

  const flaggingCriteria = {
    dyslexia: [
      {
        criterion: 'Phonological Processing Score',
        threshold: '≤16th percentile (T-score 40) on CTOPP-2 composite in at least one domain',
        alternative: 'OR ≤7th percentile (T-score 35) with weaker historical support',
      },
      {
        criterion: 'Speech Error Pattern Confirmation',
        threshold: 'Phoneme Error Rate (PER) >10% on repeated reading/naming tasks',
        details: 'Consistent phoneme confusions across multiple trials',
      },
      {
        criterion: '6-Month Persistence Criterion',
        threshold: 'Difficulties sustained despite targeted phonological instruction',
        details: 'Required for DSM-5 compliance',
      },
      {
        criterion: 'Reading Impact',
        threshold: 'Reading accuracy/fluency/comprehension ≤16th percentile',
        details: 'Documented impairment in academic, occupational, or everyday functioning',
      },
      {
        criterion: 'Differential Diagnosis',
        threshold: 'Rule out alternative explanations',
        details: 'Intellectual disability (IQ <70), uncorrected hearing/vision, neurological disorders, psychosocial adversity, language proficiency issues, inadequate instruction',
      },
    ],
    dyscalculia: [
      {
        criterion: 'Number Sense Deficit',
        threshold: '≤16th percentile on standardized math assessments',
        details: 'Difficulty with quantity comparison and number line estimation',
      },
      {
        criterion: 'Calculation Fluency',
        threshold: 'Significantly slower arithmetic fact retrieval',
        details: 'Relies on finger counting or tallying beyond age-appropriate period',
      },
      {
        criterion: 'Mathematical Reasoning',
        threshold: 'Difficulty applying mathematical concepts',
        details: 'Struggles with word problems and multi-step procedures',
      },
      {
        criterion: '6-Month Persistence',
        threshold: 'Difficulties persist despite targeted intervention',
        details: 'DSM-5 requirement for specific learning disorder diagnosis',
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How SWAR Detects Learning Differences
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our voice-first AI platform uses cutting-edge speech recognition technology combined with 
              evidence-based assessment protocols to identify early signs of dyslexia and dyscalculia.
            </p>
          </div>
        </section>

        {/* Detection Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Detection Methodology</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {detectionMethods.map((method, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                        <method.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{method.title}</CardTitle>
                        <p className="text-muted-foreground text-sm">{method.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {method.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Flagging Criteria */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Flagging Criteria</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              SWAR uses evidence-based thresholds aligned with DSM-5 criteria to flag students who may need further evaluation.
            </p>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Dyslexia Criteria */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-chart-1/20 to-chart-2/20">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-chart-1" />
                    Dyslexia Flagging Criteria
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    A student is flagged when <strong>ALL</strong> criteria are met
                  </p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {flaggingCriteria.dyslexia.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.criterion}</h4>
                          <p className="text-sm text-primary mt-1">{item.threshold}</p>
                          {item.details && (
                            <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                          )}
                          {item.alternative && (
                            <p className="text-sm text-muted-foreground mt-1">{item.alternative}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Dyscalculia Criteria */}
              <Card>
                <CardHeader className="bg-gradient-to-r from-chart-3/20 to-chart-4/20">
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-chart-3" />
                    Dyscalculia Flagging Criteria
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    A student is flagged when <strong>ALL</strong> criteria are met
                  </p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {flaggingCriteria.dyscalculia.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-chart-3 text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold">{item.criterion}</h4>
                          <p className="text-sm text-chart-3 mt-1">{item.threshold}</p>
                          {item.details && (
                            <p className="text-sm text-muted-foreground mt-1">{item.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Safety & Compliance */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Safety & Compliance</h2>
                  <p className="text-muted-foreground">Our commitment to ethical AI in education</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'FERPA compliant data handling',
                  'COPPA compliant child privacy protection',
                  'DSM-5 aligned assessment criteria',
                  'Evidence-based screening protocols',
                  'Transparent AI decision-making',
                  'Regular algorithmic bias audits',
                  'Parental consent workflows',
                  'Secure data encryption',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-chart-3 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMore;
