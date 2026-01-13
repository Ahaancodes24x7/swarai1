import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Play, Brain, Heart, CheckCircle, 
  AlertTriangle, Lightbulb, Users, ArrowRight 
} from 'lucide-react';

const TeacherTraining = () => {
  const { t } = useLanguage();
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const markComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const modules = [
    {
      id: 'how-to-use',
      title: t('training.howToUse'),
      description: t('training.howToUseDesc'),
      icon: Play,
      content: [
        {
          title: 'Getting Started',
          points: [
            'Log in to your teacher dashboard',
            'Add students by clicking the "+" button in the Students section',
            'Enter student name, age (optional), and grade level',
            'Select the appropriate grade for accurate assessment difficulty'
          ]
        },
        {
          title: 'Conducting an Assessment',
          points: [
            'Click the play button next to a student\'s name or use "Start Session"',
            'Choose between Dyslexia or Dyscalculia assessment',
            'Select the correct grade level for age-appropriate questions',
            'Ensure the student is in a quiet environment with a working microphone',
            'Click the microphone button to record the student\'s response',
            'Click again to stop recording, then click "Next" to proceed'
          ]
        },
        {
          title: 'Understanding Results',
          points: [
            'Score 85-100%: Excellent - No concerns detected',
            'Score 70-84%: Good - Minor areas for improvement',
            'Score 55-69%: Moderate - Extra support recommended',
            'Score below 55%: Flagged - Professional evaluation recommended',
            'AI analysis provides detailed speech pattern insights',
            'Export PDF reports for documentation and sharing with parents'
          ]
        }
      ]
    },
    {
      id: 'what-is-dyslexia',
      title: t('training.whatIsDyslexia'),
      description: t('training.whatIsDyslexiaDesc'),
      icon: Brain,
      content: [
        {
          title: 'What is Dyslexia?',
          points: [
            'Dyslexia is a learning difference that affects reading, spelling, and writing',
            'It is NOT related to intelligence - many highly successful people have dyslexia',
            'Affects 5-10% of the population worldwide',
            'It is neurological in origin, meaning the brain processes language differently'
          ]
        },
        {
          title: 'Common Signs to Look For',
          points: [
            'Difficulty with phonological awareness (connecting sounds to letters)',
            'Slow or inaccurate reading, often losing place in text',
            'Trouble spelling, even simple words may be spelled inconsistently',
            'Reversing letters like b/d, p/q, or numbers like 6/9',
            'Difficulty with rhyming or breaking words into syllables',
            'Taking longer to complete reading or writing tasks'
          ]
        },
        {
          title: 'Strengths of Dyslexic Learners',
          points: [
            'Often highly creative and innovative thinkers',
            'Strong visual-spatial skills and 3D thinking',
            'Excellent problem-solving abilities',
            'Good at seeing the "big picture"',
            'Often excel in arts, engineering, architecture, or entrepreneurship'
          ]
        }
      ]
    },
    {
      id: 'what-is-dyscalculia',
      title: t('training.whatIsDyscalculia'),
      description: t('training.whatIsDyscalculiaDesc'),
      icon: Brain,
      content: [
        {
          title: 'What is Dyscalculia?',
          points: [
            'Dyscalculia is a learning difference that affects mathematical abilities',
            'It affects understanding of numbers, quantities, and mathematical concepts',
            'Affects 3-6% of the population',
            'Often co-occurs with dyslexia (30-40% overlap)'
          ]
        },
        {
          title: 'Common Signs to Look For',
          points: [
            'Difficulty understanding number concepts and quantities',
            'Trouble with basic arithmetic facts (addition, subtraction tables)',
            'Confusion with mathematical symbols (+, -, ×, ÷)',
            'Difficulty telling time or managing money',
            'Trouble with place values (ones, tens, hundreds)',
            'Reliance on finger counting even for simple problems',
            'Difficulty estimating quantities or comparing numbers'
          ]
        },
        {
          title: 'Strengths of Dyscalculic Learners',
          points: [
            'Often excel in verbal and language-based subjects',
            'Strong creative and artistic abilities',
            'Good at understanding concepts when presented visually',
            'Often develop unique problem-solving strategies',
            'May have strong intuitive understanding of patterns'
          ]
        }
      ]
    },
    {
      id: 'support-strategies',
      title: t('training.supportStrategies'),
      description: t('training.supportStrategiesDesc'),
      icon: Heart,
      content: [
        {
          title: 'Creating a Supportive Environment',
          points: [
            'Never embarrass or single out students for their difficulties',
            'Celebrate effort and progress, not just correct answers',
            'Allow extra time for reading and writing tasks',
            'Use multi-sensory teaching approaches',
            'Provide written instructions alongside verbal ones'
          ]
        },
        {
          title: 'For Dyslexia Support',
          points: [
            'Use audiobooks and text-to-speech technology',
            'Allow oral responses as alternatives to written work',
            'Break reading into smaller, manageable chunks',
            'Use colored overlays or paper if it helps',
            'Teach phonics explicitly and systematically',
            'Provide reading partners or buddy reading opportunities'
          ]
        },
        {
          title: 'For Dyscalculia Support',
          points: [
            'Use visual aids like number lines and manipulatives',
            'Allow use of calculators for complex calculations',
            'Break math problems into smaller steps',
            'Connect math to real-life situations (money, cooking)',
            'Use graph paper to help align numbers',
            'Provide extra time for math tests'
          ]
        },
        {
          title: 'Communicating with Parents',
          points: [
            'Share observations with sensitivity and compassion',
            'Emphasize that learning differences are not the child\'s fault',
            'Recommend professional evaluation for confirmed diagnosis',
            'Provide resources and strategies parents can use at home',
            'Schedule regular check-ins to discuss progress'
          ]
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('training.title')}
        </CardTitle>
        <CardDescription>
          {t('training.description')}
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">
            {completedModules.length}/{modules.length} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {modules.map((module) => (
            <AccordionItem key={module.id} value={module.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    completedModules.includes(module.id) 
                      ? 'bg-chart-3/20' 
                      : 'bg-primary/10'
                  }`}>
                    {completedModules.includes(module.id) 
                      ? <CheckCircle className="h-5 w-5 text-chart-3" />
                      : <module.icon className="h-5 w-5 text-primary" />
                    }
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{module.title}</p>
                    <p className="text-sm text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 pt-4 pl-13">
                  {module.content.map((section, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-chart-4" />
                        {section.title}
                      </h4>
                      <ul className="space-y-1.5 ml-6">
                        {section.points.map((point, pIdx) => (
                          <li key={pIdx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <ArrowRight className="h-3 w-3 mt-1.5 text-primary shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Button 
                    size="sm" 
                    variant={completedModules.includes(module.id) ? "secondary" : "default"}
                    onClick={() => markComplete(module.id)}
                    disabled={completedModules.includes(module.id)}
                    className="mt-4"
                  >
                    {completedModules.includes(module.id) ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        Mark as Complete
                      </>
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TeacherTraining;
