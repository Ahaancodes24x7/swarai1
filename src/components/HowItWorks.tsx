import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, AudioWaveform, ClipboardCheck, Flag, ChevronRight } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Brain,
      title: t('howItWorks.phonological'),
      description: 'Phonological processing deficits serve as the core marker for dyslexia identification.',
      details: [
        'CTOPP-2 composite scoring analysis',
        'T-score evaluation (≤40 threshold)',
        'Multi-domain processing assessment',
      ],
    },
    {
      icon: AudioWaveform,
      title: t('howItWorks.speechError'),
      description: 'Specific speech error patterns are detected via our advanced ASR technology.',
      details: [
        'Phoneme Error Rate (PER) calculation',
        'Labial, fricative, and stop confusions',
        'Syllable stress pattern analysis',
      ],
    },
    {
      icon: ClipboardCheck,
      title: t('howItWorks.standardized'),
      description: 'Integration with standardized assessment tools for comprehensive evaluation.',
      details: [
        'DSM-5 compliance criteria',
        '6-month persistence verification',
        'Reading accuracy/fluency metrics',
      ],
    },
    {
      icon: Flag,
      title: t('howItWorks.flagging'),
      description: 'Intelligent system for flagging students who may need additional support.',
      details: [
        'Multi-criteria threshold analysis',
        'Differential diagnosis support',
        'Evidence-based recommendations',
      ],
    },
  ];

  const flaggingCriteria = [
    {
      title: 'Phonological Processing Score',
      description: '≤16th percentile (T-score 40) on CTOPP-2 composite OR ≤7th percentile (T-score 35) with historical support',
    },
    {
      title: 'Speech Error Pattern Confirmation',
      description: 'Phoneme Error Rate (PER) >10% with consistent phoneme confusions across multiple trials',
    },
    {
      title: '6-Month Persistence Criterion',
      description: 'Difficulties sustained despite targeted phonological instruction (DSM-5 compliant)',
    },
    {
      title: 'Reading Impact Assessment',
      description: 'Reading accuracy/fluency/comprehension ≤16th percentile with documented functional impairment',
    },
    {
      title: 'Differential Diagnosis',
      description: 'Rule out intellectual disability, sensory impairments, neurological disorders, and inadequate instruction',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our comprehensive approach combines voice analysis, AI detection, and standardized assessments
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, idx) => (
            <Card key={idx} className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Flagging Criteria */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Flagging Criteria for Dyslexia</h3>
          <p className="text-center text-muted-foreground mb-8">
            A student should be flagged for dyslexia when <strong>ALL</strong> of the following criteria are met:
          </p>
          <div className="space-y-4">
            {flaggingCriteria.map((criteria, idx) => (
              <div 
                key={idx}
                className="flex gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{criteria.title}</h4>
                  <p className="text-muted-foreground text-sm">{criteria.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
