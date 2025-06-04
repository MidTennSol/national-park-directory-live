/**
 * Hidden Gems Content Template
 * 
 * Generates content focusing on lesser-known attractions and off-the-beaten-path experiences
 */

export const template = {
  id: 'hidden-gems',
  name: 'Hidden Gems',
  description: 'Focus on lesser-known attractions and secret spots',
  weight: 1.0,
  
  suitability: {
    preferredSeasons: ['spring', 'fall'], // Less crowded seasons
    parkTypes: ['National Park', 'National Monument', 'National Recreation Area'],
    minimumFeatures: 2
  }
};

/**
 * Generate title based on park
 */
export function generateTitle(park, options = {}) {
  const titleVariations = [
    `5 Secret Spots in ${park.name} Most Visitors Never See`,
    `Hidden Treasures of ${park.name}: Beyond the Crowds`,
    `Off the Beaten Path: ${park.name}'s Best Kept Secrets`,
    `Discover the Unknown: Hidden Gems in ${park.name}`,
    `${park.name}'s Secret Wonders: A Local's Guide`
  ];
  
  // Select based on park characteristics
  let selectedIndex = 0;
  if (park.metadata.photographySpots) selectedIndex = 1;
  if (park.activities.includes('hiking')) selectedIndex = 2;
  if (park.metadata.accessibility) selectedIndex = 3;
  
  return titleVariations[selectedIndex];
}

/**
 * Generate description
 */
export function generateDescription(park, options = {}) {
  return `Skip the crowds and discover ${park.name}'s hidden treasures. From secluded viewpoints to forgotten trails, explore the secret spots that only locals know about in this incredible ${park.type.toLowerCase()}.`;
}

/**
 * Generate main content
 */
export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateHiddenSpots(park),
    generateLocalTips(park),
    generateBestTimesToVisit(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

/**
 * Generate tags
 */
export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'hidden gems',
    'secret spots',
    'off the beaten path',
    'local tips',
    ...park.activities.slice(0, 2)
  ];
}

function generateIntroduction(park) {
  return `# Hidden Treasures of ${park.name}: Beyond the Crowds

While millions of visitors flock to ${park.name}'s famous landmarks each year, this remarkable ${park.type.toLowerCase()} holds countless secrets waiting to be discovered. Beyond the postcard-perfect views and crowded overlooks lie hidden gems that offer equally stunning experiences with a fraction of the crowds.

${park.description} But today, we're taking you off the beaten path to discover the ${park.name} that most visitors never see – the quiet corners, secret viewpoints, and forgotten trails that make this place truly magical.`;
}

function generateHiddenSpots(park) {
  const spots = generateSpecificSpots(park);
  
  return `## 5 Hidden Gems You Won't Find in Guidebooks

${spots.map((spot, index) => `### ${index + 1}. ${spot.name}

${spot.description}

**How to get there:** ${spot.directions}

**Best time to visit:** ${spot.bestTime}

**Pro tip:** ${spot.proTip}`).join('\n\n')}`;
}

function generateSpecificSpots(park) {
  // Generate contextual hidden spots based on park features
  const baseSpots = [
    {
      name: "The Quiet Overlook",
      description: `While everyone heads to the main viewpoints, this lesser-known overlook offers equally spectacular views of ${park.name} without the crowds. Early morning visitors are often rewarded with stunning sunrise colors and peaceful solitude.`,
      directions: "Take the service road past the visitor center and look for the unmarked trail on your left.",
      bestTime: "Early morning or late afternoon",
      proTip: "Bring a thermos of coffee and enjoy the sunrise in complete solitude."
    },
    {
      name: "The Forgotten Trail",
      description: `This historic trail once served as the main route through the area but has been largely forgotten since the modern roads were built. The path winds through pristine wilderness areas and offers glimpses into ${park.name}'s past.`,
      directions: "Start from the old ranger station and follow the stone markers.",
      bestTime: "Spring and fall when temperatures are mild",
      proTip: "Download offline maps as cell service is spotty in this area."
    },
    {
      name: "Secret Swimming Hole",
      description: `Hidden away from the main water features, this secluded spot offers crystal-clear water perfect for a refreshing dip. The natural pool is fed by a small waterfall and surrounded by ancient rocks.`,
      directions: "Follow the creek upstream from the main trail for about half a mile.",
      bestTime: "Summer months when water levels are ideal",
      proTip: "Water shoes are essential as the rocks can be slippery."
    }
  ];
  
  // Customize based on park activities and features
  if (park.activities.includes('wildlife viewing')) {
    baseSpots.push({
      name: "Wildlife Sanctuary",
      description: `Away from the busy areas, this quiet meadow serves as an unofficial wildlife sanctuary. Patient visitors can spot animals that avoid the more crowded parts of ${park.name}.`,
      directions: "Take the old fire road to the meadow clearing.",
      bestTime: "Dawn and dusk when animals are most active",
      proTip: "Bring binoculars and move slowly to avoid startling the wildlife."
    });
  }
  
  if (park.activities.includes('photography')) {
    baseSpots.push({
      name: "Photographer's Secret",
      description: `This hidden vantage point offers unique compositions that you won't see on anyone's Instagram feed. The interplay of light and shadow here creates dramatic photos throughout the day.`,
      directions: "Look for the unmarked path behind the maintenance building.",
      bestTime: "Golden hour provides the most dramatic lighting",
      proTip: "A tripod is essential for the low-light conditions."
    });
  }
  
  return baseSpots.slice(0, 5);
}

function generateLocalTips(park) {
  return `## Local Insider Knowledge

### Getting There Without the Crowds
The best time to explore these hidden gems is during shoulder seasons when ${park.name} sees fewer visitors. Weekday mornings are particularly ideal, as most tourists arrive later in the day.

### What the Rangers Know
Local rangers often know about additional hidden spots but may not advertise them to prevent overcrowding. Striking up a friendly conversation at the visitor center can sometimes yield valuable insider information.

### Respect the Secret
Remember that these hidden gems remain special because they're not overrun with visitors. Practice Leave No Trace principles, stay on designated paths, and consider not sharing exact locations on social media to help preserve these special places.`;
}

function generateBestTimesToVisit(park) {
  return `## When to Visit for the Best Experience

### Seasonal Considerations
- **Spring**: Fewer crowds and mild weather, but some areas may still be inaccessible due to weather conditions
- **Summer**: All areas accessible but expect more visitors even at hidden spots
- **Fall**: Perfect weather and stunning colors, but weekend crowds can be significant
- **Winter**: Ultimate solitude but check accessibility and weather conditions

### Time of Day
Early morning (sunrise to 9 AM) and late afternoon (after 4 PM) offer the best combination of good lighting and fewer people. Many hidden spots are particularly beautiful during golden hour.

### Weather Considerations
Check local weather conditions before venturing to more remote areas. Some hidden spots may become dangerous during storms or extreme weather conditions.`;
}

function generateConclusion(park) {
  return `## Discover Your Own Hidden ${park.name}

These secret spots are just the beginning of what ${park.name} has to offer beyond its famous attractions. The true magic of exploration lies in discovery – taking that unmarked trail, following your curiosity, and finding your own special places.

Remember that the best hidden gems are often found by those willing to venture a little further, wake up a little earlier, or stay a little later. ${park.name} rewards the adventurous spirit with experiences that no guidebook can fully capture.

*Ready to discover ${park.name}'s secrets? Start with these hidden gems, but don't be afraid to create your own adventure and find the spots that speak to you.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 