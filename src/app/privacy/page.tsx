import { Container, ScrollReveal, Separator, Text } from '@/components/ui';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Surya.ai',
};

export default function PrivacyPage() {
  return (
    <Container size="lg" className="py-24 md:py-36">
      <ScrollReveal variant="slide-up">
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="eyebrow">Legal</span>
            <Separator variant="gold" length="quarter" />
          </div>
          <h1 className="text-h1 mb-8 font-light">
            Privacy <span className="gradient-gold">Policy.</span>
          </h1>
          <Text size="lg" color="secondary" className="mb-12">
            Surya.ai respects your privacy. Here is how information is handled on this site.
          </Text>

          <div className="text-secondary border-glass space-y-10 border-t pt-10 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">1. Information Collection</h2>
              <Text color="secondary">
                This website is primarily an informational portfolio. We do not place invasive
                tracking cookies or collect personal identification data unless you voluntarily
                submit your email via a contact or newsletter form.
              </Text>
            </section>

            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">2. Use of Information</h2>
              <Text color="secondary">
                Any information submitted voluntarily (such as your email address when reaching out)
                is strictly used to reply to your inquiry or deliver requested technical updates. We
                do not sell or share your information with third parties.
              </Text>
            </section>

            <section className="space-y-4">
              <h2 className="text-h3 text-foreground font-normal">3. Contact</h2>
              <Text color="secondary">
                For any privacy concerns or questions regarding this site, reach out to
                suryateja0124@gmail.com.
              </Text>
            </section>
          </div>
        </div>
      </ScrollReveal>
    </Container>
  );
}
