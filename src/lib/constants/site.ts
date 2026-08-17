export const siteConfig = {
  name: 'Surya.ai',
  description: 'Surya Teja builds practical AI agents, automation, products, and experiments.',
  url: 'https://surya.ai',
  ogImage: '/images/og-image.png',
  links: {
    github: 'https://github.com/Surya2421',
    linkedin: 'https://www.linkedin.com/in/surya-teja-uta-985498315',
    instagram: 'https://www.instagram.com/qr/?hl=en',
    youtube: 'https://www.youtube.com/@suryareal-ust',
    email: 'mailto:suryateja0124@gmail.com',
  },
  author: { name: 'Surya Teja Uta', email: 'suryateja0124@gmail.com' },
};

export const navigation = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Work' },
  { href: '/content', label: 'Notes' },
  { href: '/journey', label: 'Journey' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export const socialLinks = [
  { name: 'Email', href: siteConfig.links.email, icon: 'mail' },
  { name: 'LinkedIn', href: siteConfig.links.linkedin, icon: 'linkedin' },
  { name: 'GitHub', href: siteConfig.links.github, icon: 'github' },
  { name: 'YouTube', href: siteConfig.links.youtube, icon: 'youtube' },
  { name: 'Instagram', href: siteConfig.links.instagram, icon: 'instagram' },
] as const;
