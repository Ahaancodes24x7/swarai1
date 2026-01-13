import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Download, Printer, BookOpen, Calculator } from 'lucide-react';

interface PracticeWorksheetProps {
  studentName: string;
  sessionType: 'dyslexia' | 'dyscalculia';
  score: number;
  grade: number;
}

const PracticeWorksheet = ({ studentName, sessionType, score, grade }: PracticeWorksheetProps) => {
  const { t } = useLanguage();

  const generateDyslexiaWorksheet = (difficulty: 'basic' | 'intermediate' | 'advanced') => {
    const worksheets = {
      basic: {
        title: 'Phoneme Awareness Practice',
        activities: [
          {
            name: 'Sound Matching',
            instructions: 'Circle the pictures that start with the same sound.',
            examples: ['🍎 Apple - 🐜 Ant - 🚗 Car', '🐱 Cat - 🎂 Cake - 🌙 Moon', '🐕 Dog - 🚪 Door - 🌸 Flower']
          },
          {
            name: 'Rhyming Words',
            instructions: 'Draw a line to connect words that rhyme.',
            examples: ['cat → bat, hat, mat', 'sun → run, fun, bun', 'red → bed, fed, led']
          },
          {
            name: 'Letter Tracing',
            instructions: 'Trace the letters and say the sound out loud.',
            examples: ['b, d, p, q (focus on distinguishing similar letters)', 'a, e, i, o, u (vowels)', 's, m, n, r, t (common consonants)']
          },
          {
            name: 'Syllable Clapping',
            instructions: 'Clap once for each syllable. Write the number.',
            examples: ['elephant (3)', 'cat (1)', 'banana (3)', 'happy (2)']
          }
        ]
      },
      intermediate: {
        title: 'Reading Fluency Practice',
        activities: [
          {
            name: 'Word Families',
            instructions: 'Add different beginning letters to make new words.',
            examples: ['_at: cat, bat, hat, mat, rat', '_op: hop, mop, top, pop, stop', '_ake: make, take, cake, lake, bake']
          },
          {
            name: 'Sight Word Flash Cards',
            instructions: 'Practice reading these common words quickly.',
            examples: ['the, and, is, it, to', 'was, you, are, for, on', 'said, have, but, what, were']
          },
          {
            name: 'Sentence Building',
            instructions: 'Put the words in order to make a sentence.',
            examples: ['cat / The / is / happy', 'to / I / school / go', 'the / Dog / runs / park / in']
          },
          {
            name: 'Reading Comprehension',
            instructions: 'Read the sentence and answer the question.',
            examples: ['The cat is on the mat. Q: Where is the cat?', 'Tom has a red ball. Q: What color is the ball?']
          }
        ]
      },
      advanced: {
        title: 'Advanced Reading Skills',
        activities: [
          {
            name: 'Multi-syllable Words',
            instructions: 'Break these words into syllables and read them.',
            examples: ['re-mem-ber', 'to-mor-row', 'fan-tas-tic', 'im-por-tant']
          },
          {
            name: 'Silent Letters',
            instructions: 'Circle the silent letter in each word.',
            examples: ['knife, know, knee', 'write, wrong, wrap', 'comb, lamb, thumb']
          },
          {
            name: 'Paragraph Reading',
            instructions: 'Read the paragraph aloud. Time yourself and try to beat your record.',
            examples: ['Simple story passages appropriate for the grade level']
          }
        ]
      }
    };

    return worksheets[difficulty];
  };

  const generateDyscalculiaWorksheet = (difficulty: 'basic' | 'intermediate' | 'advanced') => {
    const worksheets = {
      basic: {
        title: 'Number Sense Practice',
        activities: [
          {
            name: 'Counting Objects',
            instructions: 'Count the objects and write the number.',
            examples: ['🍎🍎🍎 = ___', '⭐⭐⭐⭐⭐ = ___', '🔵🔵 = ___']
          },
          {
            name: 'Number Recognition',
            instructions: 'Circle the correct number.',
            examples: ['Which is 5? (3, 5, 8)', 'Which is 12? (12, 21, 2)', 'Which is bigger? 7 or 4']
          },
          {
            name: 'Number Line',
            instructions: 'Fill in the missing numbers on the number line.',
            examples: ['1, 2, ___, 4, 5', '10, ___, 12, ___, 14', '___, 7, 8, 9, ___']
          },
          {
            name: 'Comparing Numbers',
            instructions: 'Put >, <, or = in the box.',
            examples: ['5 ☐ 3', '7 ☐ 7', '2 ☐ 9']
          }
        ]
      },
      intermediate: {
        title: 'Basic Operations Practice',
        activities: [
          {
            name: 'Addition with Pictures',
            instructions: 'Count and add. Use the pictures to help.',
            examples: ['🍎🍎 + 🍎🍎🍎 = ___', '⭐⭐⭐ + ⭐⭐ = ___']
          },
          {
            name: 'Subtraction Stories',
            instructions: 'Solve the word problem.',
            examples: ['Tom has 5 apples. He gives 2 to Sara. How many does Tom have now?', '8 birds are in a tree. 3 fly away. How many are left?']
          },
          {
            name: 'Fact Families',
            instructions: 'Complete the fact family.',
            examples: ['2 + 3 = 5, 3 + 2 = ___, 5 - 2 = ___, 5 - 3 = ___', '4 + 6 = 10, 6 + 4 = ___, 10 - 4 = ___, 10 - 6 = ___']
          },
          {
            name: 'Place Value',
            instructions: 'Write the number in expanded form.',
            examples: ['24 = ___ tens + ___ ones', '56 = ___ tens + ___ ones', '103 = ___ hundreds + ___ tens + ___ ones']
          }
        ]
      },
      advanced: {
        title: 'Advanced Math Skills',
        activities: [
          {
            name: 'Multiplication Tables',
            instructions: 'Complete the multiplication facts.',
            examples: ['2 × ___ = 8', '5 × 4 = ___', '___ × 3 = 12']
          },
          {
            name: 'Division',
            instructions: 'Solve using equal sharing.',
            examples: ['12 ÷ 3 = ___ (12 cookies shared among 3 friends)', '20 ÷ 4 = ___', '15 ÷ 5 = ___']
          },
          {
            name: 'Word Problems',
            instructions: 'Read carefully. Draw a picture to help solve.',
            examples: ['Each bag has 4 apples. There are 5 bags. How many apples in total?', 'Sara has 24 stickers. She gives 8 to each friend. How many friends got stickers?']
          },
          {
            name: 'Money',
            instructions: 'Calculate the total.',
            examples: ['₹10 + ₹5 = ___', '₹50 - ₹20 = ___', '3 pencils at ₹5 each = ___']
          }
        ]
      }
    };

    return worksheets[difficulty];
  };

  // Determine difficulty based on score
  const getDifficulty = (): 'basic' | 'intermediate' | 'advanced' => {
    if (score < 55) return 'basic';
    if (score < 75) return 'intermediate';
    return 'advanced';
  };

  const worksheet = sessionType === 'dyslexia' 
    ? generateDyslexiaWorksheet(getDifficulty())
    : generateDyscalculiaWorksheet(getDifficulty());

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Practice Worksheet - ${studentName}</title>
        <style>
          body { font-family: 'Arial', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #6366f1; text-align: center; margin-bottom: 10px; }
          h2 { color: #1e293b; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 20px; }
          .student-info { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
          .activity { margin-bottom: 30px; page-break-inside: avoid; }
          .activity-title { background: #e0e7ff; padding: 10px 15px; border-radius: 6px; font-weight: bold; }
          .instructions { font-style: italic; color: #64748b; margin: 10px 0; }
          .examples { background: #fafafa; padding: 15px; border-radius: 6px; margin-top: 10px; }
          .example-item { padding: 10px 0; border-bottom: 1px dashed #e2e8f0; }
          .example-item:last-child { border-bottom: none; }
          .footer { margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 SWAR Practice Worksheet</h1>
          <p>${worksheet.title}</p>
        </div>
        
        <div class="student-info">
          <strong>Student:</strong> ${studentName} | 
          <strong>Grade:</strong> ${grade} | 
          <strong>Focus Area:</strong> ${sessionType === 'dyslexia' ? 'Reading & Language' : 'Mathematics'} |
          <strong>Level:</strong> ${getDifficulty().charAt(0).toUpperCase() + getDifficulty().slice(1)}
        </div>
        
        ${worksheet.activities.map(activity => `
          <div class="activity">
            <div class="activity-title">${activity.name}</div>
            <p class="instructions">📝 ${activity.instructions}</p>
            <div class="examples">
              ${activity.examples.map(example => `
                <div class="example-item">${example}</div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>Generated by SWAR - Speech-based Screening for Learning Disabilities</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {sessionType === 'dyslexia' ? (
            <BookOpen className="h-5 w-5 text-primary" />
          ) : (
            <Calculator className="h-5 w-5 text-primary" />
          )}
          Practice Worksheet
        </CardTitle>
        <CardDescription>
          Customized activities for {studentName} based on assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <h4 className="font-semibold mb-2">{worksheet.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Level: <span className="font-medium capitalize">{getDifficulty()}</span> 
            {' '}(based on {score}% score)
          </p>
          <div className="space-y-2">
            {worksheet.activities.slice(0, 3).map((activity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {idx + 1}
                </span>
                <span>{activity.name}</span>
              </div>
            ))}
            {worksheet.activities.length > 3 && (
              <p className="text-xs text-muted-foreground ml-8">
                +{worksheet.activities.length - 3} more activities
              </p>
            )}
          </div>
        </div>
        
        <Button onClick={handlePrint} className="w-full">
          <Printer className="h-4 w-4 mr-2" />
          Print Worksheet
        </Button>
      </CardContent>
    </Card>
  );
};

export default PracticeWorksheet;
