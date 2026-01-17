import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Heart, Brain, Home, CheckCircle, 
  Lightbulb, MessageCircle, Shield, Sparkles,
  Clock, Users, Star
} from 'lucide-react';

const ParentHelp = () => {
  const { t } = useLanguage();
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const markComplete = (moduleId: string) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  const modules = [
    {
      id: 'understanding-reports',
      title: 'Understanding Your Child\'s Report',
      description: 'Learn how to read and interpret assessment results',
      icon: BookOpen,
      content: [
        {
          title: 'What the Scores Mean',
          points: [
            'Score 85-100%: Excellent - Your child shows strong skills in this area',
            'Score 70-84%: Good - Minor areas could use extra practice at home',
            'Score 55-69%: Moderate - Some difficulties observed. Consider extra support',
            'Score below 55%: Flagged - Significant concerns. Professional evaluation recommended'
          ]
        },
        {
          title: 'What "Flagged" Really Means',
          points: [
            'A "flagged" result is NOT a diagnosis - it\'s a screening indicator',
            'It means your child may benefit from professional evaluation',
            'Many children who are flagged thrive with proper support',
            'Early identification leads to better outcomes - this is a good thing!',
            'Famous people with dyslexia include Einstein, Steve Jobs, and Richard Branson'
          ]
        },
        {
          title: 'Next Steps After Viewing Results',
          points: [
            'Talk to your child\'s teacher about classroom accommodations',
            'Consider scheduling an evaluation with a learning specialist',
            'Focus on your child\'s strengths while supporting challenge areas',
            'Remember: learning differences are NOT related to intelligence'
          ]
        }
      ]
    },
    {
      id: 'what-is-dyslexia',
      title: 'What is Dyslexia?',
      description: 'Understanding this common learning difference',
      icon: Brain,
      content: [
        {
          title: 'The Basics',
          points: [
            'Dyslexia affects reading, writing, and spelling abilities',
            'It is NOT related to intelligence - your child is NOT "slow" or "lazy"',
            'Affects 5-10% of children (1 in 10 to 1 in 20)',
            'The brain simply processes language differently',
            'With proper support, dyslexic children can become excellent readers'
          ]
        },
        {
          title: 'Signs You Might Notice at Home',
          points: [
            'Difficulty sounding out new words',
            'Reading slowly or avoiding reading activities',
            'Trouble remembering the sequence of letters in words',
            'Mixing up similar looking letters (b/d, p/q)',
            'Excellent verbal expression but struggles with written work',
            'Avoids homework that involves reading'
          ]
        },
        {
          title: 'Your Child\'s Hidden Strengths',
          points: [
            'Dyslexic children are often highly creative',
            'Strong problem-solving and "big picture" thinking',
            'Excellent oral storytelling abilities',
            'Good at building things and spatial reasoning',
            'Many entrepreneurs and artists have dyslexia'
          ]
        }
      ]
    },
    {
      id: 'what-is-dyscalculia',
      title: 'What is Dyscalculia?',
      description: 'Understanding math-related learning differences',
      icon: Brain,
      content: [
        {
          title: 'The Basics',
          points: [
            'Dyscalculia affects understanding of numbers and math concepts',
            'It is NOT related to intelligence or effort',
            'Affects 3-6% of children',
            'Often co-occurs with dyslexia',
            'With proper support, children can develop strong math skills'
          ]
        },
        {
          title: 'Signs You Might Notice at Home',
          points: [
            'Difficulty learning to count or understanding "how many"',
            'Trouble with basic math facts (like times tables)',
            'Using fingers to count long after peers have stopped',
            'Difficulty telling time or understanding money',
            'Confusion with left/right directions',
            'Trouble estimating (how many apples? how long until...?)'
          ]
        },
        {
          title: 'Your Child\'s Hidden Strengths',
          points: [
            'Often excel in reading and language arts',
            'Strong creative and artistic abilities',
            'Good at understanding stories and narratives',
            'May develop unique problem-solving strategies',
            'Often good with computers and technology'
          ]
        }
      ]
    },
    {
      id: 'supporting-at-home',
      title: 'Supporting Your Child at Home',
      description: 'Practical strategies for daily life',
      icon: Home,
      content: [
        {
          title: 'Creating a Supportive Environment',
          points: [
            'Never use labels like "slow" or compare to siblings',
            'Praise effort and progress, not just results',
            'Create a quiet, organized homework space',
            'Break tasks into smaller, manageable pieces',
            'Allow breaks during homework (5 min break every 15-20 min)',
            'Celebrate your child\'s unique strengths daily'
          ]
        },
        {
          title: 'For Reading Difficulties (Dyslexia)',
          points: [
            'Read aloud to your child daily - even if they can read themselves',
            'Use audiobooks alongside printed books',
            'Play word games and rhyming games',
            'Let your child choose books they\'re interested in',
            'Don\'t force reading aloud if it causes stress',
            'Use apps designed for dyslexic readers'
          ]
        },
        {
          title: 'For Math Difficulties (Dyscalculia)',
          points: [
            'Use real objects to teach math (coins, blocks, food items)',
            'Connect math to daily life (cooking, shopping, time)',
            'Play board games that involve counting and numbers',
            'Use visual aids like number lines and charts',
            'Allow calculator use for homework to reduce frustration',
            'Break math problems into clear, numbered steps'
          ]
        },
        {
          title: 'Managing Homework Time',
          points: [
            'Set a consistent homework time each day',
            'Start with the hardest subject when energy is highest',
            'Use a timer to make tasks feel more manageable',
            'Reward completion with preferred activities',
            'Communicate with teacher about reasonable workload',
            'It\'s okay to stop if your child is too frustrated'
          ]
        }
      ]
    },
    {
      id: 'emotional-support',
      title: 'Emotional Support & Building Confidence',
      description: 'Helping your child feel successful',
      icon: Heart,
      content: [
        {
          title: 'Understanding Their Feelings',
          points: [
            'Children with learning differences often feel "different" or "dumb"',
            'They may experience anxiety about school',
            'Frustration can lead to behavioral issues or withdrawal',
            'They need to know their struggles are not their fault',
            'Your belief in them is the most powerful support'
          ]
        },
        {
          title: 'Building Self-Esteem',
          points: [
            'Help them discover and develop their strengths',
            'Find activities where they can excel (sports, art, music)',
            'Share stories of successful people with learning differences',
            'Teach them to advocate for themselves ("I learn best when...")',
            'Avoid rescuing them - help them develop problem-solving skills',
            'Celebrate small wins and progress'
          ]
        },
        {
          title: 'Talking About Learning Differences',
          points: [
            'Use age-appropriate language to explain their learning style',
            'Emphasize that everyone\'s brain works differently',
            'Explain that needing help is not a weakness',
            'Help them understand their specific strengths and challenges',
            'Consider connecting with other families in similar situations'
          ]
        },
        {
          title: 'When to Seek Additional Help',
          points: [
            'If your child shows signs of depression or severe anxiety',
            'If they refuse to go to school',
            'If behavioral problems are increasing',
            'If they make negative statements about themselves',
            'A child psychologist can provide valuable support'
          ]
        }
      ]
    },
    {
      id: 'working-with-school',
      title: 'Working with Your Child\'s School',
      description: 'Advocating for your child\'s needs',
      icon: MessageCircle,
      content: [
        {
          title: 'Requesting Accommodations',
          points: [
            'Share the SWAR assessment results with the teacher',
            'Ask for a meeting to discuss your child\'s needs',
            'Request extended time for tests and assignments',
            'Ask about alternative ways to demonstrate learning',
            'Request preferential seating (near teacher, away from distractions)',
            'Ask about technology supports available'
          ]
        },
        {
          title: 'Rights Under Indian Law',
          points: [
            'Rights of Persons with Disabilities Act (2016) covers learning disabilities',
            'Children are entitled to reasonable accommodations in schools',
            'CBSE and state boards offer accommodations for LD students',
            'Extra time (up to 1 hour), scribe facility, and separate room available',
            'Request certification from a psychologist if needed for board exams'
          ]
        },
        {
          title: 'Building a Team',
          points: [
            'Maintain regular communication with the teacher',
            'Share what works at home that might work at school',
            'Consider hiring a tutor trained in learning differences',
            'Connect with school counselor if available',
            'Document all communications and progress'
          ]
        }
      ]
    },
    {
      id: 'resources',
      title: 'Resources & Where to Get Help',
      description: 'Organizations and tools that can help',
      icon: Sparkles,
      content: [
        {
          title: 'Organizations in India',
          points: [
            'Dyslexia Association of India - www.dyslexiaindia.org.in',
            'Specific Learning Disabilities Forum of India (SLD-FI)',
            'Orkids - Specialty Learning Centre (Mumbai, Delhi, Bangalore)',
            'NIMHANS, Bangalore - Assessment and intervention services',
            'All India Institute of Speech & Hearing (AIISH), Mysore'
          ]
        },
        {
          title: 'Helpful Apps & Technology',
          points: [
            'Voice Dream Reader - Text-to-speech for reading',
            'Learning Ally - Audiobook library for dyslexic students',
            'ModMath - App for dyscalculic students to do math',
            'Ginger Page - Writing assistant with grammar help',
            'Livescribe Smartpen - Records audio while taking notes'
          ]
        },
        {
          title: 'Books for Parents',
          points: [
            '"Overcoming Dyslexia" by Dr. Sally Shaywitz',
            '"The Dyslexic Advantage" by Brock and Fernette Eide',
            '"Understanding Dyscalculia" by Patricia Babtie',
            '"Smart but Stuck" by Thomas Brown (about ADHD + LD)',
            'Many available in Hindi translation'
          ]
        },
        {
          title: 'Getting Professional Help',
          points: [
            'Ask your pediatrician for a referral to a child psychologist',
            'Look for psychologists specializing in educational assessment',
            'Government hospitals often have free or low-cost assessment',
            'Private evaluations typically cost ₹5,000-15,000',
            'Early intervention therapists can be found through schools'
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
          Parent Help & Resources
        </CardTitle>
        <CardDescription>
          Everything you need to know to support your child's learning journey
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">
            {completedModules.length}/{modules.length} completed
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
                      <h4 className="font-semibold text-primary flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        {section.title}
                      </h4>
                      <ul className="space-y-2 ml-6">
                        {section.points.map((point, pIdx) => (
                          <li key={pIdx} className="text-muted-foreground text-sm flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => markComplete(module.id)}
                    disabled={completedModules.includes(module.id)}
                  >
                    {completedModules.includes(module.id) ? (
                      <><CheckCircle className="h-4 w-4 mr-2" /> Completed</>
                    ) : (
                      <>Mark as Complete</>
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

export default ParentHelp;