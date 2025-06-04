/**
 * Wildlife Encounters Content Template
 * 
 * Generates content focusing on wildlife watching, animal behavior, and safety
 */

export const template = {
  id: 'wildlife-encounters',
  name: 'Wildlife Encounters',
  description: 'Focus on wildlife viewing, animal behavior, and safety',
  weight: 1.2,
  
  suitability: {
    preferredSeasons: ['spring', 'summer', 'fall'],
    parkTypes: ['National Park', 'National Wildlife Refuge', 'National Preserve'],
    requiredFeatures: ['wildlife viewing']
  }
};

export function generateTitle(park, options = {}) {
  const titleVariations = [
    `Wildlife Watching at ${park.name}: Your Complete Guide`,
    `Amazing Animals of ${park.name}: When and Where to Find Them`,
    `Wild Encounters: A Safari Guide to ${park.name}`,
    `The Wildlife Watcher's Guide to ${park.name}`,
    `${park.name} Safari: Spotting Nature's Most Incredible Creatures`
  ];
  
  return titleVariations[Math.floor(park.name.length % titleVariations.length)];
}

export function generateDescription(park, options = {}) {
  return `Discover the incredible wildlife of ${park.name}! From majestic mammals to colorful birds, learn when and where to spot amazing animals, plus essential safety tips for unforgettable wildlife encounters.`;
}

export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateWildlifeSpecies(park),
    generateBestViewingSpots(park),
    generateSeasonalGuide(park),
    generateSafetyTips(park),
    generatePhotographyTips(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'wildlife viewing',
    'animal watching',
    'nature photography',
    'safari',
    'animals',
    'wildlife safety'
  ];
}

function generateIntroduction(park) {
  return `# Wildlife Watching at ${park.name}: Your Complete Guide

${park.name} is home to an incredible diversity of wildlife, making it one of the premier destinations for animal enthusiasts and nature lovers. Whether you're hoping to catch a glimpse of massive mammals or photograph colorful birds, this remarkable ${park.type.toLowerCase()} offers unforgettable wildlife encounters for visitors of all ages.

${park.description}

From dawn chorus symphonies to spectacular predator-prey interactions, ${park.name} provides a window into the natural world that few places can match. This comprehensive guide will help you maximize your wildlife viewing opportunities while ensuring both your safety and the animals' well-being.`;
}

function generateWildlifeSpecies(park) {
  const commonAnimals = generateAnimalList(park);
  
  return `## The Amazing Animals of ${park.name}

${commonAnimals.map(animal => `### ${animal.name}

${animal.description}

**Best viewing times:** ${animal.bestTimes}
**Where to look:** ${animal.locations}
**Fun fact:** ${animal.funFact}`).join('\n\n')}`;
}

function generateAnimalList(park) {
  const baseAnimals = [
    {
      name: "Large Mammals",
      description: `The park's most iconic residents include impressive mammals that have roamed these lands for thousands of years. These magnificent creatures are often the highlight of any visit to ${park.name}.`,
      bestTimes: "Early morning and late evening when temperatures are cooler",
      locations: "Open meadows, near water sources, and along forest edges",
      funFact: "Many large mammals follow seasonal migration patterns within the park boundaries."
    },
    {
      name: "Bird Species",
      description: `${park.name} hosts an incredible variety of bird species, from tiny songbirds to magnificent raptors. The diversity of habitats supports both resident and migratory species throughout the year.`,
      bestTimes: "Dawn and dusk when birds are most active",
      locations: "Varied by species - wetlands, forests, cliffs, and open areas",
      funFact: "Some birds travel thousands of miles to reach the park during migration seasons."
    },
    {
      name: "Small Mammals",
      description: "Often overlooked but equally fascinating, the park's small mammals play crucial roles in the ecosystem. From busy rodents to elusive nocturnal creatures, these animals are worth seeking out.",
      bestTimes: "Vary by species - some are active during day, others at night",
      locations: "Rocky areas, fallen logs, near streams, and in dense vegetation",
      funFact: "Small mammals are often indicators of ecosystem health and biodiversity."
    }
  ];
  
  return baseAnimals;
}

function generateBestViewingSpots(park) {
  return `## Prime Wildlife Viewing Locations

### The Golden Triangle
The area between the visitor center, main trail system, and water features consistently offers the best wildlife viewing opportunities. This zone combines multiple habitat types and reliable water sources that attract diverse species.

### Water Features
Rivers, lakes, and streams serve as wildlife magnets, especially during dry seasons. Animals come to drink, hunt, and cool off, making these areas excellent for patient observers.

### Transition Zones
The edges between different habitats (forest meets meadow, water meets land) are particularly productive for wildlife viewing. These "edge effects" concentrate animal activity.

### Elevated Viewpoints
High ground provides excellent vantage points for spotting wildlife across large areas. Bring binoculars to scan distant meadows and valleys.

## Best Viewing Strategies

### Patience is Key
The most successful wildlife watchers arrive early, stay late, and remain patient. Animals operate on their own schedules, not ours.

### Move Slowly and Quietly
Quick movements and loud noises will send animals fleeing. Practice moving deliberately and speaking in whispers.

### Use Your Senses
Listen for calls, rustling, and other sounds. Watch for movement, tracks, and signs of recent animal activity.`;
}

function generateSeasonalGuide(park) {
  return `## Seasonal Wildlife Calendar

### Spring (March - May)
- **Highlights:** Newborn animals, increased activity, bird migration
- **Best for:** Photography of young animals, bird watching
- **What to expect:** More active wildlife but potentially unpredictable weather

### Summer (June - August)
- **Highlights:** Peak activity periods, full access to all areas
- **Best for:** Extended viewing sessions, diverse species encounters
- **What to expect:** Early morning and evening viewing windows are crucial

### Fall (September - November)
- **Highlights:** Migration patterns, preparation behaviors, stunning backdrops
- **Best for:** Witnessing natural cycles, photography with fall colors
- **What to expect:** Shorter days but potentially more concentrated activity

### Winter (December - February)
- **Highlights:** Adaptation behaviors, winter-active species, tracking opportunities
- **Best for:** Intimate encounters with hardy species
- **What to expect:** Limited access but unique viewing opportunities`;
}

function generateSafetyTips(park) {
  return `## Essential Wildlife Safety

### The Golden Rules
1. **Maintain Safe Distances:** Use the "thumb rule" - if your outstretched thumb doesn't cover the entire animal, you're too close
2. **Never Feed Wildlife:** Human food is harmful to animals and creates dangerous dependencies
3. **Stay on Designated Trails:** Protect both yourself and sensitive habitats
4. **Make Noise in Dense Areas:** Alert animals to your presence to avoid surprise encounters

### Specific Safety Protocols

#### Large Mammal Encounters
- If you encounter large mammals, do not run
- Back away slowly while facing the animal
- Make yourself appear larger by raising your arms
- Speak in a calm, low voice

#### Group Safety
- Stay together as a group, especially with children
- Designate someone to watch for approaching animals
- Have an emergency plan and know where the nearest help is located

### Emergency Preparedness
- Carry a whistle or other noise maker
- Know the location of the nearest ranger station
- Have a first aid kit for minor injuries
- Understand basic animal behavior to predict reactions`;
}

function generatePhotographyTips(park) {
  return `## Capturing Amazing Wildlife Photos

### Equipment Essentials
- **Telephoto Lens:** Essential for maintaining safe distances
- **Tripod:** Stabilizes shots during low-light conditions
- **Extra Batteries:** Cold weather drains batteries quickly
- **Memory Cards:** Bring more than you think you'll need

### Technique Tips
- **Patience Over Positioning:** Wait for natural behaviors rather than forcing shots
- **Focus on Eyes:** Sharp eyes make compelling wildlife photographs
- **Capture Behavior:** Action shots tell better stories than static poses
- **Use Natural Light:** Golden hour provides the most flattering lighting

### Ethical Photography
- Animal welfare comes before the perfect shot
- Don't disturb animals for photos
- Respect nesting and feeding areas
- Follow all park photography regulations`;
}

function generateConclusion(park) {
  return `## Your Wildlife Adventure Awaits

${park.name} offers some of the most incredible wildlife viewing opportunities in the country. With proper preparation, patience, and respect for the animals, your visit can result in unforgettable encounters that will last a lifetime.

Remember that every wildlife sighting is a privilege – these animals allow us into their world, and it's our responsibility to be respectful guests. Whether you spot a massive mammal or a tiny songbird, each encounter contributes to a deeper understanding and appreciation of the natural world.

*Ready to start your wildlife adventure? Check the park's current wildlife activity reports, pack your binoculars, and prepare for the experience of a lifetime at ${park.name}.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 