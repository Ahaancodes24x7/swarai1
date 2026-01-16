import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Play, Brain, Heart, CheckCircle, 
  AlertTriangle, Lightbulb, Users, ArrowRight, 
  FileText, BarChart3, MessageCircle, Shield
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
          title: 'After the Assessment',
          points: [
            'Review the session results immediately after completion',
            'Export PDF reports for documentation and parent communication',
            'Use the generated practice worksheets for follow-up activities',
            'Monitor progress over time using the progress charts'
          ]
        }
      ]
    },
    {
      id: 'understanding-reports',
      title: 'Understanding Assessment Reports',
      description: 'Learn how to interpret scores and AI analysis results',
      icon: FileText,
      content: [
        {
          title: 'Score Interpretation',
          points: [
            'Score 85-100%: Excellent - No concerns detected. Student shows strong skills.',
            'Score 70-84%: Good - Minor areas for improvement. Continue regular practice.',
            'Score 55-69%: Moderate - Some difficulties observed. Extra support recommended.',
            'Score below 55%: Flagged - Significant difficulties detected. Professional evaluation recommended.'
          ]
        },
        {
          title: 'Understanding AI Analysis',
          points: [
            'Phoneme Error Rate: Percentage of sound pronunciation errors (>10% indicates concern)',
            'Phoneme Confusions: Specific sounds the student confuses (e.g., b/d, p/q)',
            'Letter Reversals: Common reversal patterns that may indicate dyslexia',
            'Syllable Stress: Unusual stress patterns in multi-syllable words',
            'Calculation Accuracy: For dyscalculia, how often math answers are correct',
            'Place Value Errors: Difficulties understanding ones, tens, hundreds positions'
          ]
        },
        {
          title: 'Red Flags to Watch For',
          points: [
            'Consistent phoneme confusions across multiple questions',
            'Phoneme Error Rate above 15% on simple words',
            'Frequent letter/number reversals (b/d, 6/9, was/saw)',
            'Significant decline in accuracy as questions become more complex',
            'Very slow response times compared to grade-level expectations',
            'Reliance on finger counting for basic arithmetic in higher grades'
          ]
        },
        {
          title: 'What "Flagged" Means',
          points: [
            'A "flagged" result is NOT a diagnosis - it\'s a screening indicator',
            'It means the student shows patterns consistent with learning differences',
            'Professional evaluation by a specialist is needed for formal diagnosis',
            'Early intervention is key - don\'t delay seeking professional help',
            'Share the PDF report with the specialist for detailed information'
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
            'Affects 5-10% of the population worldwide (15-20% in India due to complex scripts)',
            'It is neurological in origin, meaning the brain processes language differently',
            'Early identification (before age 8) leads to best outcomes'
          ]
        },
        {
          title: 'Common Signs in the Classroom',
          points: [
            'Difficulty with phonological awareness (connecting sounds to letters)',
            'Slow or inaccurate reading, often losing place in text',
            'Trouble spelling, even simple words may be spelled inconsistently',
            'Reversing letters like b/d, p/q, or numbers like 6/9',
            'Difficulty with rhyming or breaking words into syllables',
            'Taking longer to complete reading or writing tasks',
            'Good verbal expression but poor written work',
            'Difficulty copying from the board'
          ]
        },
        {
          title: 'Strengths of Dyslexic Learners',
          points: [
            'Often highly creative and innovative thinkers',
            'Strong visual-spatial skills and 3D thinking',
            'Excellent problem-solving abilities',
            'Good at seeing the "big picture"',
            'Often excel in arts, engineering, architecture, or entrepreneurship',
            'Strong oral communication and storytelling abilities'
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
            'Often co-occurs with dyslexia (30-40% overlap)',
            'Not related to intelligence - students may excel in other subjects'
          ]
        },
        {
          title: 'Common Signs in the Classroom',
          points: [
            'Difficulty understanding number concepts and quantities',
            'Trouble with basic arithmetic facts (addition, subtraction tables)',
            'Confusion with mathematical symbols (+, -, ×, ÷)',
            'Difficulty telling time or managing money',
            'Trouble with place values (ones, tens, hundreds)',
            'Reliance on finger counting even for simple problems',
            'Difficulty estimating quantities or comparing numbers',
            'Trouble with word problems despite good reading skills',
            'Difficulty remembering mathematical procedures'
          ]
        },
        {
          title: 'Strengths of Dyscalculic Learners',
          points: [
            'Often excel in verbal and language-based subjects',
            'Strong creative and artistic abilities',
            'Good at understanding concepts when presented visually',
            'Often develop unique problem-solving strategies',
            'May have strong intuitive understanding of patterns',
            'Excellent narrative and storytelling skills'
          ]
        }
      ]
    },
    {
      id: 'support-flagged',
      title: 'Supporting Flagged Students',
      description: 'Practical strategies for helping students who show learning differences',
      icon: Heart,
      content: [
        {
          title: 'Immediate Steps After Flagging',
          points: [
            'Do NOT announce or discuss the flagging in front of other students',
            'Schedule a private conversation with the student to reassure them',
            'Contact parents/guardians to share results sensitively',
            'Recommend professional evaluation - provide local resources if available',
            'Begin implementing classroom accommodations immediately',
            'Document all observations and interventions for the specialist'
          ]
        },
        {
          title: 'Classroom Strategies for Dyslexia',
          points: [
            'Allow extra time for reading and writing tasks (50-100% more)',
            'Provide audio versions of texts when possible',
            'Use larger fonts (14pt+) and dyslexia-friendly fonts',
            'Allow oral responses as alternatives to written work',
            'Break reading into smaller, manageable chunks',
            'Use colored paper or overlays if it helps the student',
            'Teach phonics explicitly and systematically',
            'Pair reading with listening (audio + text together)',
            'Avoid asking to read aloud in front of class unless volunteered'
          ]
        },
        {
          title: 'Classroom Strategies for Dyscalculia',
          points: [
            'Use visual aids like number lines, manipulatives, and counters',
            'Allow use of calculators for complex calculations',
            'Break math problems into smaller, numbered steps',
            'Connect math to real-life situations (money, cooking, sports)',
            'Use graph paper to help align numbers in columns',
            'Provide extra time for math tests (50-100% more)',
            'Use color coding for different operations',
            'Allow reference cards with formulas and procedures',
            'Focus on understanding concepts, not memorization'
          ]
        },
        {
          title: 'Creating a Supportive Environment',
          points: [
            'Never embarrass or single out students for their difficulties',
            'Celebrate effort and progress, not just correct answers',
            'Educate the whole class about learning differences (age-appropriately)',
            'Use strengths-based language: "learns differently" not "disabled"',
            'Provide written instructions alongside verbal ones',
            'Seat the student near the front to reduce distractions',
            'Allow breaks during long tasks',
            'Partner with supportive peers for group activities'
          ]
        }
      ]
    },
    {
      id: 'parent-communication',
      title: 'Communicating with Parents',
      description: 'How to discuss assessment results with families',
      icon: MessageCircle,
      content: [
        {
          title: 'Preparing for the Conversation',
          points: [
            'Review all assessment data and observations beforehand',
            'Prepare the PDF report to share with parents',
            'Have a list of local specialists and resources ready',
            'Choose a private, comfortable setting for the meeting',
            'Allow enough time (30-45 minutes minimum)',
            'Be prepared for emotional reactions'
          ]
        },
        {
          title: 'How to Deliver the News',
          points: [
            'Start with positive observations about the child',
            'Explain that this is a screening, not a diagnosis',
            'Use simple, jargon-free language',
            'Emphasize that learning differences are NOT related to intelligence',
            'Share success stories of people with dyslexia/dyscalculia',
            'Focus on what CAN be done, not limitations',
            'Reassure parents that early intervention helps significantly'
          ]
        },
        {
          title: 'Addressing Parent Concerns',
          points: [
            'Common reaction: Denial - "My child is just lazy/not trying"',
            'Response: Share specific observations and data from assessments',
            'Common reaction: Guilt - "Did I do something wrong?"',
            'Response: Explain these are neurological differences, not parenting issues',
            'Common reaction: Fear - "Will my child ever succeed?"',
            'Response: Share success stories and emphasize proper support leads to success',
            'Common reaction: Overwhelm - "What do I do now?"',
            'Response: Provide a clear, step-by-step action plan'
          ]
        },
        {
          title: 'Action Items for Parents',
          points: [
            'Schedule an evaluation with a learning disability specialist',
            'Continue encouraging and supporting the child at home',
            'Read to the child daily (for dyslexia) or play number games (for dyscalculia)',
            'Communicate regularly with the school about accommodations',
            'Connect with parent support groups for learning differences',
            'Consider tutoring with specialists trained in LD interventions',
            'Avoid comparisons with siblings or other children'
          ]
        }
      ]
    },
    {
      id: 'using-practice-worksheets',
      title: 'Using Practice Worksheets',
      description: 'How to effectively use the generated practice materials',
      icon: BarChart3,
      content: [
        {
          title: 'About Practice Worksheets',
          points: [
            'Worksheets are automatically generated based on assessment results',
            'They target the specific areas where the student showed difficulty',
            'Activities are designed to be engaging and age-appropriate',
            'Worksheets include both school and home practice activities'
          ]
        },
        {
          title: 'For Dyslexia Practice',
          points: [
            'Phoneme Awareness: Sound matching, rhyming, syllable clapping',
            'Letter Recognition: Letter tracing, b/d discrimination exercises',
            'Reading Fluency: Repeated reading of familiar texts',
            'Spelling: Word families, visual word patterns',
            'Tip: Keep practice sessions short (10-15 minutes) and positive'
          ]
        },
        {
          title: 'For Dyscalculia Practice',
          points: [
            'Number Sense: Counting, comparing quantities, number lines',
            'Place Value: Base-10 blocks activities, expanded form',
            'Basic Operations: Fact families, visual addition/subtraction',
            'Word Problems: Real-life math scenarios with visual supports',
            'Tip: Use manipulatives and visual aids whenever possible'
          ]
        },
        {
          title: 'Best Practices',
          points: [
            'Consistent practice (3-4 times weekly) is more effective than long sessions',
            'Always end on a success - finish with something the student can do',
            'Track progress and celebrate improvements',
            'Involve parents in home practice activities',
            'Adjust difficulty based on student response',
            'Use multisensory approaches: see it, say it, hear it, touch it'
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
            {completedModules.length}/{modules.length} {t('training.completed') || 'completed'}
          </Badge>
          {completedModules.length === modules.length && (
            <Badge variant="default" className="bg-chart-3">
              <CheckCircle className="h-3 w-3 mr-1" />
              All Complete!
            </Badge>
          )}
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
