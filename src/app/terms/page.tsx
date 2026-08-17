import { Container, ScrollReveal, Separator, Text } from '@/components/ui';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Surya.ai',
};

export default function TermsPage() {
  return (
    <Container size="lg" className="py-24 md:py-36">
      <ScrollReveal variant="slide-up">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="eyebrow">Legal</span>
            <Separator variant="gold" length="quarter" />
          </div>
          <h1 className="text-h1 mb-8 font-light">
            Terms of <span className="gradient-gold">Service.</span>
          </h1>
          <Text size="lg" color="secondary" className="mb-12">
            The rules and guidelines for using Surya.ai.
          </Text>

          <div className="text-secondary border-glass space-y-10 border-t pt-10 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">1. Intellectual Property</h2>
              <Text color="secondary">
                All content, writeups, code samples, and portfolio materials hosted on Surya.ai
                belong to Surya Teja Uta unless otherwise specified. Open-source repositories linked
                here remain subject to their respective open-source licenses.
              </Text>
            </section>

            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">2. Disclaimer</h2>
              <Text color="secondary">
                The projects and technical writing presented on this website are provided &quot;as
                is&quot; for educational and portfolio demonstration purposes.
              </Text>
            </section>

            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">3. Inquiries</h2>
              <Text color="secondary">
                If you have questions regarding project licensing or collaboration terms, feel free
                to contact suryateja0124@gmail.com.
              </Text>
            </section>
          </div>
        </div>
      </ScrollReveal>
    </Container>
  );
}
