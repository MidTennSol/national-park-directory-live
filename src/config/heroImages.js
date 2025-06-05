// Auto-generate hero background image paths
function generateHeroImages() {
  const images = [];
  // Generate paths for hero-background-1.jpg through hero-background-7.jpg
  // You can add more by simply adding more numbered images to the public/images folder
  for (let i = 1; i <= 7; i++) {
    images.push(`/images/hero-background-${i}.jpg`);
  }
  return images;
}

// Shared cycling hero configuration for all pages except parks
const sharedHeroConfig = {
  images: generateHeroImages(),
  cycleInterval: 6000 // 6 seconds between image changes
};

export default {
  home: {
    ...sharedHeroConfig,
    title: 'National Park Directory',
    description: "Explore America's natural and cultural heritage through our comprehensive guide to national parks, monuments, historic sites, and more."
  },
  parks: {
    ...sharedHeroConfig,
    title: 'National Parks Directory',
    description: 'Explore all national parks, monuments, historic sites, and more across the United States.'
  },
  about: {
    ...sharedHeroConfig,
    title: 'About Us',
    description: 'Learn more about the mission and team behind the National Park Directory.'
  },
  contact: {
    ...sharedHeroConfig,
    title: 'Contact Us',
    description: 'Have questions or feedback? Get in touch with our team.'
  },
  faq: {
    ...sharedHeroConfig,
    title: 'Frequently Asked Questions',
    description: 'Find answers to common questions about national parks and our directory.'
  },
  blog: {
    ...sharedHeroConfig,
    title: 'Blog',
    description: 'Read the latest news, stories, and tips about exploring national parks.'
  },
  terms: {
    ...sharedHeroConfig,
    title: 'Terms of Service',
    description: 'Please read our terms and conditions for using the National Park Directory.'
  },
  privacy: {
    ...sharedHeroConfig,
    title: 'Privacy Policy',
    description: 'Learn how we protect and handle your personal information.'
  }
}; 