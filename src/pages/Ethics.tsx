import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Users, Lock, Eye, Scale, Heart, BookOpen } from 'lucide-react';

const Ethics = () => {
  const policies = [
    {
      icon: Shield,
      title: 'FERPA Compliance',
      description: 'Family Educational Rights and Privacy Act',
      content: 'SWAR fully complies with FERPA regulations, ensuring that all student educational records are protected. Parents and eligible students have the right to access, review, and request amendments to educational records.',
    },
    {
      icon: Users,
      title: 'COPPA Compliance',
      description: "Children's Online Privacy Protection Act",
      content: 'We obtain verifiable parental consent before collecting any personal information from children under 13. Parents can review, delete, and control the collection of their child\'s data.',
    },
    {
      icon: FileText,
      title: 'DSM-5 Alignment',
      description: 'Diagnostic and Statistical Manual of Mental Disorders',
      content: 'Our assessment criteria and flagging thresholds are aligned with DSM-5 guidelines for Specific Learning Disorders, ensuring clinically relevant and evidence-based evaluations.',
    },
    {
      icon: Lock,
      title: 'Data Encryption',
      description: 'Industry-standard security protocols',
      content: 'All data is encrypted at rest and in transit using AES-256 encryption. Voice recordings and assessment data are stored on secure, SOC 2 compliant servers.',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Clear AI decision-making',
      content: 'SWAR provides clear explanations for all flagging decisions. Educators and parents can understand exactly why a student was flagged and what specific indicators contributed to the assessment.',
    },
    {
      icon: Scale,
      title: 'Bias Auditing',
      description: 'Regular algorithmic reviews',
      content: 'We conduct quarterly bias audits to ensure our AI performs equitably across all demographic groups, languages, and accents. Results are published in our annual transparency report.',
    },
    {
      icon: Heart,
      title: 'Ethical AI Principles',
      description: 'Human-centered approach',
      content: 'SWAR is designed as a screening tool, not a diagnostic instrument. Final determinations should always involve qualified professionals, and our technology supports rather than replaces human judgment.',
    },
    {
      icon: BookOpen,
      title: 'IDEA Compliance',
      description: 'Individuals with Disabilities Education Act',
      content: 'Our platform supports IDEA requirements by providing early identification data that can inform the referral process for special education evaluations.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-16 w-16 mx-auto text-primary mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Ethics & Governance</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SWAR is committed to the highest standards of ethical AI development, data privacy, 
              and regulatory compliance in educational technology.
            </p>
          </div>
        </section>

        {/* Policies Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6">
              {policies.map((policy, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <policy.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{policy.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{policy.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{policy.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Commitment Statement */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
            <p className="text-lg text-muted-foreground mb-8">
              At SWAR, we believe that technology should serve the best interests of children and their families. 
              Our platform is designed with privacy, safety, and ethical considerations at its core. We are committed 
              to continuous improvement and welcome feedback from educators, parents, and the broader community.
            </p>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="italic text-foreground">
                "SWAR is a screening tool designed to support early identification, not replace professional diagnosis. 
                We encourage families to work with qualified professionals for comprehensive evaluations."
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ethics;
