import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>1. Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p><strong>Personal Information:</strong> Name, email address, role (parent/teacher), and account credentials.</p>
                  <p><strong>Student Information:</strong> Student name, age, grade level, and assessment data (with parental consent).</p>
                  <p><strong>Voice Recordings:</strong> Audio recordings captured during assessment sessions for speech analysis.</p>
                  <p><strong>Usage Data:</strong> Platform interactions, session durations, and feature usage for service improvement.</p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>2. How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>We use collected information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide speech-based learning difference assessments</li>
                    <li>Generate progress reports and recommendations</li>
                    <li>Improve our AI models and detection accuracy</li>
                    <li>Communicate important updates and support information</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>3. Data Storage & Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3.</p>
                  <p>Voice recordings are processed in real-time and stored securely with access controls.</p>
                  <p>We maintain SOC 2 Type II compliance for our infrastructure.</p>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>4. Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal data and your child's assessment records</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your data (subject to legal retention requirements)</li>
                    <li>Opt out of non-essential data processing</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>5. Children's Privacy (COPPA)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>We take children's privacy seriously and comply with COPPA requirements:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We obtain verifiable parental consent before collecting data from children under 13</li>
                    <li>Parents can review and delete their child's information at any time</li>
                    <li>We collect only the minimum data necessary for assessment purposes</li>
                    <li>We do not use children's data for advertising purposes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>6. Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p>For privacy-related inquiries or to exercise your rights, contact us at:</p>
                  <p>Email: privacy@swar.ai</p>
                  <p>Phone: +91 1800-XXX-XXXX</p>
                  <p>Address: New Delhi, India</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
