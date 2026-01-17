import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What is SWAR?',
    answer: 'SWAR is a voice-first AI platform designed to help identify early signs of dyslexia and dyscalculia in children through speech recognition technology. Our platform provides screening assessments for educators and progress tracking for parents.',
  },
  {
    question: 'How accurate is the assessment?',
    answer: 'SWAR uses evidence-based criteria aligned with DSM-5 guidelines. However, SWAR is a screening tool, not a diagnostic instrument. Students flagged by our system should receive comprehensive evaluation from qualified professionals.',
  },
  {
    question: 'Is my child\'s data safe?',
    answer: 'Yes, we take data privacy very seriously. All data is encrypted, we comply with FERPA and COPPA regulations, and we never share personal information with third parties without consent.',
  },
  {
    question: 'How do I start an assessment?',
    answer: 'Teachers can start an assessment from their dashboard by selecting a student and choosing either a dyslexia or dyscalculia assessment type. The student will then complete voice-based exercises while the system analyzes their responses.',
  },
  {
    question: 'What browsers are supported?',
    answer: 'SWAR works best on Google Chrome, Microsoft Edge, and Safari. For voice recording features, we recommend using Chrome for the best experience.',
  },
  {
    question: 'Can I use SWAR on mobile devices?',
    answer: 'Yes, SWAR is fully responsive and works on tablets and smartphones. However, for the best assessment experience, we recommend using a computer with a good quality microphone.',
  },
  {
    question: 'What languages are supported?',
    answer: 'Currently, SWAR supports assessments in English with interface translations available in Hindi, Punjabi, Tamil, and Telugu. We are working on adding more languages for assessments.',
  },
  {
    question: 'How do I interpret the results?',
    answer: 'Each assessment provides a score and indicates whether a student has been flagged for further evaluation. The Learn More page provides detailed information about the flagging criteria and what each score means.',
  },
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(
    faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions or get in touch with our support team.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {filteredFaqs.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No results found. Try a different search term or contact support.
              </p>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-12">Still Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Mail className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get a response within 24 hours
                  </p>
                  <p className="text-primary">support@swar.ai</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <Phone className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Phone Support</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Mon-Fri, 9 AM - 6 PM IST
                  </p>
                  <p className="text-primary">+91 1800-XXX-XXXX</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="pt-6">
                  <MessageCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Chat with our support team
                  </p>
                  <Button variant="outline" size="sm">Start Chat</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Describe your issue..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
