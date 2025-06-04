/**
 * Photography Focus Content Template
 * 
 * Generates content focusing on photography opportunities, techniques, and locations
 */

export const template = {
  id: 'photography-focus',
  name: 'Photography Focus',
  description: 'Focus on photography opportunities and techniques',
  weight: 1.1,
  
  suitability: {
    preferredSeasons: ['spring', 'fall'], // Best lighting seasons
    parkTypes: ['National Park', 'National Monument', 'National Seashore'],
    requiredFeatures: ['scenic views']
  }
};

export function generateTitle(park, options = {}) {
  const titleVariations = [
    `Capturing ${park.name}: A Photographer's Guide to Epic Shots`,
    `Photography Paradise: The Ultimate ${park.name} Shot List`,
    `Through the Lens: Mastering Photography at ${park.name}`,
    `Picture Perfect: Your Photography Guide to ${park.name}`,
    `${park.name} Photography: From Snapshots to Masterpieces`
  ];
  
  return titleVariations[park.name.charCodeAt(0) % titleVariations.length];
}

export function generateDescription(park, options = {}) {
  return `Unlock the photographic potential of ${park.name}! Discover the best shooting locations, optimal timing for light, composition techniques, and gear recommendations for capturing stunning images in this spectacular ${park.type.toLowerCase()}.`;
}

export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateBestPhotoSpots(park),
    generateLightingGuide(park),
    generateCompositionTips(park),
    generateGearRecommendations(park),
    generateSeasonalPhotography(park),
    generateTechnicalTips(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'photography',
    'landscape photography',
    'nature photography',
    'photo spots',
    'camera settings',
    'photography tips'
  ];
}

function generateIntroduction(park) {
  return `# Capturing ${park.name}: A Photographer's Guide to Epic Shots

${park.name} stands as one of America's most photogenic destinations, offering endless opportunities for both amateur and professional photographers. From sweeping landscapes to intimate nature details, this remarkable ${park.type.toLowerCase()} provides a diverse canvas for creative expression.

${park.description}

Whether you're wielding a smartphone or professional camera equipment, ${park.name} rewards photographers who understand its unique character, lighting conditions, and seasonal variations. This comprehensive guide will help you capture not just images, but the very essence of this extraordinary place.`;
}

function generateBestPhotoSpots(park) {
  const photoSpots = generateSpecificPhotoLocations(park);
  
  return `## The Ultimate Shot List: Must-Photograph Locations

${photoSpots.map((spot, index) => `### ${index + 1}. ${spot.name}

${spot.description}

**Best time:** ${spot.bestTime}
**Camera settings:** ${spot.settings}
**Composition tip:** ${spot.composition}
**Access level:** ${spot.access}`).join('\n\n')}`;
}

function generateSpecificPhotoLocations(park) {
  return [
    {
      name: "The Grand Vista",
      description: `The park's most iconic viewpoint offers sweeping panoramas that capture the essence of ${park.name}. This location provides opportunities for both wide landscape shots and telephoto compression techniques.`,
      bestTime: "Golden hour (first hour after sunrise, last hour before sunset)",
      settings: "f/8-f/11, ISO 100-400, use graduated ND filter for balanced exposure",
      composition: "Use foreground elements to add depth and lead the eye into the scene",
      access: "Easy walk from main parking area"
    },
    {
      name: "The Intimate Landscape",
      description: "While everyone photographs the big views, this quieter spot offers opportunities for more personal, intimate compositions that reveal ${park.name}'s subtle beauty.",
      bestTime: "Overcast conditions provide even lighting for detailed work",
      settings: "f/5.6-f/8, focus stacking for maximum sharpness, polarizing filter to reduce glare",
      composition: "Look for patterns, textures, and natural leading lines",
      access: "Short hike required, moderate difficulty"
    },
    {
      name: "The Reflection Pool",
      description: "Water features create perfect opportunities for reflection photography, doubling the visual impact of your compositions.",
      bestTime: "Early morning when winds are calm and light is soft",
      settings: "f/11-f/16 for sharp reflections, use tripod for long exposures",
      composition: "Position horizon line carefully - not always in the center",
      access: "Accessible year-round, varies by water levels"
    },
    {
      name: "The Wildlife Stage",
      description: "This area consistently offers the best opportunities for wildlife photography within ${park.name}.",
      bestTime: "Dawn and dusk when animals are most active",
      settings: "f/4-f/5.6, ISO 800-1600, fast shutter speeds (1/500s or faster)",
      composition: "Focus on eyes, capture behavior, leave space for movement",
      access: "Requires patience and potentially longer wait times"
    },
    {
      name: "The Detail Shot",
      description: "Sometimes the most powerful images come from the smallest subjects. This area offers incredible macro photography opportunities.",
      bestTime: "Any time, but overcast light is ideal for even illumination",
      settings: "Macro lens or close-focusing capability, f/8-f/11, focus stacking recommended",
      composition: "Fill the frame, watch your backgrounds, use natural lighting",
      access: "Found throughout the park, requires close observation"
    }
  ];
}

function generateLightingGuide(park) {
  return `## Mastering Light at ${park.name}

### The Golden Hours
The first and last hours of sunlight provide the most dramatic and flattering light for landscape photography. At ${park.name}, these periods transform ordinary scenes into extraordinary images.

**Morning Golden Hour Benefits:**
- Softer shadows and gentler contrast
- Often clearer air with less atmospheric haze
- Wildlife is more active
- Fewer crowds at popular viewpoints

**Evening Golden Hour Benefits:**
- Warmer color temperatures
- More dramatic cloud formations
- Longer duration in summer months
- Romantic, dreamy atmosphere

### Blue Hour Magic
The 20-30 minutes after sunset (and before sunrise) offer unique opportunities for balanced exposures between sky and landscape.

### Overcast Advantages
Don't pack up your camera when clouds roll in! Overcast conditions provide:
- Even, soft lighting perfect for waterfalls and forests
- Saturated colors, especially greens
- Excellent conditions for wildlife photography
- Opportunities for moody, atmospheric images

### Harsh Light Solutions
When stuck with midday sun:
- Seek shaded areas for even lighting
- Use natural reflectors (light-colored rocks, sand)
- Focus on high-contrast black and white opportunities
- Look for interesting shadow patterns`;
}

function generateCompositionTips(park) {
  return `## Composition Secrets for ${park.name}

### Rule of Thirds and Beyond
While the rule of thirds is a good starting point, ${park.name}'s dramatic landscapes often call for more dynamic compositions:

- **Leading Lines:** Use natural features to guide the viewer's eye
- **Foreground Interest:** Include compelling foreground elements to add depth
- **Natural Frames:** Use trees, rock formations, or other features to frame your subject
- **Scale and Perspective:** Include people or recognizable objects to show scale

### Unique Challenges at ${park.name}
The park's specific landscape features require specialized approaches:

**Vast Landscapes:** Use telephoto lenses to compress distance and isolate interesting sections of large scenes.

**Vertical Features:** Don't forget to turn your camera vertical for tall subjects like cliffs, waterfalls, or trees.

**Weather Integration:** Include dramatic weather as a compositional element rather than an obstacle.

### Advanced Techniques
- **Focus Stacking:** Combine multiple images at different focus points for front-to-back sharpness
- **Exposure Blending:** Merge multiple exposures to capture the full dynamic range
- **Panoramic Stitching:** Create ultra-wide images that capture the scope of the landscape`;
}

function generateGearRecommendations(park) {
  return `## Essential Photography Gear for ${park.name}

### Camera and Lenses

#### For Smartphone Photographers
- **Wide-angle attachment:** Capture more of the sweeping landscapes
- **Tripod adapter:** Essential for sharp images in low light
- **Polarizing filter:** Reduce glare and enhance colors
- **Extra battery packs:** Cold weather drains batteries quickly

#### For DSLR/Mirrorless Users
- **Wide-angle lens (14-24mm):** Essential for landscape photography
- **Standard zoom (24-70mm):** Versatile for most situations
- **Telephoto lens (70-200mm+):** Wildlife and distant subjects
- **Macro lens:** For detailed nature photography

### Essential Accessories
- **Sturdy tripod:** Non-negotiable for sharp images and long exposures
- **Graduated ND filters:** Balance bright skies with darker foregrounds
- **Polarizing filter:** Reduce reflections and enhance colors
- **Lens cleaning kit:** Dust and moisture are constant challenges
- **Extra batteries and memory cards:** Cold weather and excitement drain both quickly
- **Headlamp with red filter:** Navigate safely in pre-dawn darkness

### Weather Protection
- **Camera rain cover:** Protect gear from unexpected weather
- **Lens hoods:** Reduce flare and protect front element
- **Silica gel packets:** Combat condensation in camera bags`;
}

function generateSeasonalPhotography(park) {
  return `## Seasonal Photography at ${park.name}

### Spring Photography
**Opportunities:** Fresh growth, waterfalls at peak flow, wildflowers, dramatic weather
**Challenges:** Unpredictable conditions, muddy trails, variable access
**Tips:** Pack for all weather conditions, focus on water features and emerging life

### Summer Photography
**Opportunities:** Full access, long days, active wildlife, thunderstorm drama
**Challenges:** Crowded viewpoints, harsh midday light, heat shimmer
**Tips:** Start very early, seek shade during midday, embrace storm photography

### Fall Photography
**Opportunities:** Spectacular colors, dramatic skies, comfortable temperatures
**Challenges:** Popular season means crowds, weather changes rapidly
**Tips:** Plan shots around peak color timing, use polarizers to enhance colors

### Winter Photography
**Opportunities:** Minimal crowds, unique ice formations, dramatic contrasts
**Challenges:** Limited access, harsh conditions, short days
**Tips:** Protect gear from condensation, bracket exposures on snow, carry safety equipment`;
}

function generateTechnicalTips(park) {
  return `## Technical Excellence at ${park.name}

### Camera Settings for Success
- **Landscape Mode:** f/8-f/11, ISO 100-200, use tripod for sharpness
- **Wildlife Mode:** f/4-f/5.6, ISO 800-1600, shutter speed 1/focal length minimum
- **Star Photography:** f/2.8, ISO 3200-6400, 20-30 second exposures

### Common Mistakes to Avoid
1. **Center-weighted compositions:** Don't always put horizons in the middle
2. **Ignoring weather:** Some of the best shots happen in challenging conditions
3. **Rushing the shot:** Take time to really see and compose
4. **Forgetting backup plans:** Always have alternative locations ready

### Post-Processing Considerations
- Shoot in RAW format for maximum flexibility
- Bracket exposures for challenging lighting
- Consider HDR techniques for high-contrast scenes
- Don't over-process - let the natural beauty shine through`;
}

function generateConclusion(park) {
  return `## Your Photographic Journey at ${park.name}

Photography at ${park.name} is about more than just capturing images – it's about connecting with one of America's most spectacular landscapes and sharing that connection with others. Every photograph you take here has the potential to inspire conservation, appreciation, and wonder.

Remember that the best camera is the one you have with you, and the best photograph is the one that captures not just what you saw, but how the place made you feel. ${park.name} provides endless opportunities for both technical excellence and creative expression.

Whether you leave with a memory card full of images or just a few perfect shots, your photographic journey at ${park.name} will enhance your appreciation for this remarkable place and improve your skills as a photographer.

*Ready to capture the magic of ${park.name}? Pack your gear, check the weather, and prepare for some of the most rewarding photography of your life.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 