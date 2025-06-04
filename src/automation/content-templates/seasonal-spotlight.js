/**
 * Seasonal Spotlight Content Template
 * 
 * Generates content focusing on seasonal highlights and timing for park visits
 */

import { getCurrentSeason } from '../config.js';

export const template = {
  id: 'seasonal-spotlight',
  name: 'Seasonal Spotlight',
  description: 'Focus on seasonal activities, weather, and timing',
  weight: 1.2, // Slightly favored
  
  // When this template should be used
  suitability: {
    requiresSeasonalHighlights: true,
    preferredSeasons: ['spring', 'fall'], // Best for seasonal content
    parkTypes: ['National Park', 'National Seashore', 'National Monument'],
    minimumFeatures: 1
  }
};

/**
 * Generate title based on park and current season
 */
export function generateTitle(park, options = {}) {
  const season = options.season || getCurrentSeason();
  const seasonData = getSeasonData(season);
  
  const titleVariations = [
    `${seasonData.activity} at ${park.name}: ${seasonData.subtitle}`,
    `${park.name} in ${seasonData.displayName}: ${seasonData.experience}`,
    `${seasonData.displayName} Guide to ${park.name}: ${seasonData.focus}`,
    `Experience ${park.name}: ${seasonData.specialEvent}`,
    `${park.name}'s ${seasonData.displayName} Magic: ${seasonData.unique}`
  ];
  
  // Select variation based on park characteristics
  let selectedIndex = 0;
  if (park.metadata.photographySpots) selectedIndex = 1;
  if (park.metadata.familyFriendly) selectedIndex = 2;
  if (park.historicalSignificance) selectedIndex = 3;
  
  return titleVariations[selectedIndex];
}

/**
 * Generate description/excerpt
 */
export function generateDescription(park, options = {}) {
  const season = options.season || getCurrentSeason();
  const seasonData = getSeasonData(season);
  
  return `Discover the best of ${park.name} during ${seasonData.displayName}. From ${seasonData.highlights.join(' to ')}, learn when to visit and what to expect during this ${seasonData.adjective} season.`;
}

/**
 * Generate main content
 */
export function generateContent(park, options = {}) {
  const season = options.season || getCurrentSeason();
  const seasonData = getSeasonData(season);
  
  const sections = [
    generateIntroduction(park, seasonData),
    generateSeasonalHighlights(park, seasonData),
    generateBestTimesToVisit(park, seasonData),
    generateWhatToExpect(park, seasonData),
    generatePlanningTips(park, seasonData),
    generateConclusion(park, seasonData)
  ];
  
  return sections.join('\n\n');
}

/**
 * Generate appropriate tags
 */
export function generateTags(park, options = {}) {
  const season = options.season || getCurrentSeason();
  const seasonData = getSeasonData(season);
  
  const baseTags = [park.name, park.state, seasonData.displayName, 'seasonal guide'];
  const seasonalTags = seasonData.tags;
  const parkTags = park.activities.slice(0, 3); // Top 3 activities
  
  return [...baseTags, ...seasonalTags, ...parkTags];
}

/**
 * Get season-specific data
 */
function getSeasonData(season) {
  const seasonInfo = {
    spring: {
      displayName: 'Spring',
      adjective: 'vibrant',
      activity: 'Spring Wildflowers',
      subtitle: 'A Nature Photographer\'s Paradise',
      experience: 'Your Complete Guide',
      focus: 'Perfect Timing for Nature Lovers',
      specialEvent: 'Wildflower Season Spectacular',
      unique: 'When Nature Awakens',
      highlights: ['blooming wildflowers', 'cascading waterfalls', 'mild hiking weather'],
      tags: ['wildflowers', 'photography', 'mild weather', 'waterfalls'],
      activities: ['wildflower viewing', 'photography', 'hiking', 'bird watching'],
      weather: 'mild temperatures and occasional rain showers',
      crowds: 'moderate, with weekends being busier',
      specialConsiderations: 'trails may be muddy, pack layers for changing weather'
    },
    summer: {
      displayName: 'Summer',
      adjective: 'peak',
      activity: 'Summer Adventures',
      subtitle: 'The Ultimate Family Destination',
      experience: 'Your Adventure Headquarters',
      focus: 'Peak Season Planning Guide',
      specialEvent: 'Summer Family Fun Central',
      unique: 'When Adventure Calls',
      highlights: ['full trail access', 'camping opportunities', 'family activities'],
      tags: ['summer', 'family activities', 'camping', 'hiking'],
      activities: ['hiking', 'camping', 'ranger programs', 'photography'],
      weather: 'warm to hot temperatures with clear skies',
      crowds: 'heaviest crowds, arrive early for parking',
      specialConsiderations: 'bring plenty of water, wear sun protection'
    },
    fall: {
      displayName: 'Fall',
      adjective: 'spectacular',
      activity: 'Fall Foliage',
      subtitle: 'Nature\'s Grand Finale',
      experience: 'A Photographer\'s Dream',
      focus: 'Peak Colors and Perfect Weather',
      specialEvent: 'Autumn\'s Masterpiece',
      unique: 'When Nature Paints the Landscape',
      highlights: ['stunning foliage', 'crisp hiking weather', 'fewer crowds'],
      tags: ['fall foliage', 'photography', 'hiking', 'scenic drives'],
      activities: ['leaf peeping', 'photography', 'hiking', 'scenic drives'],
      weather: 'crisp, clear days with cool evenings',
      crowds: 'moderate, especially during peak foliage',
      specialConsiderations: 'weather can change quickly, dress in layers'
    },
    winter: {
      displayName: 'Winter',
      adjective: 'serene',
      activity: 'Winter Solitude',
      subtitle: 'A Peaceful Wilderness Experience',
      experience: 'Your Winter Escape',
      focus: 'Embracing the Quiet Season',
      specialEvent: 'Winter\'s Peaceful Beauty',
      unique: 'When Silence Speaks Volumes',
      highlights: ['peaceful solitude', 'winter wildlife', 'snow-covered landscapes'],
      tags: ['winter', 'solitude', 'wildlife', 'snow'],
      activities: ['winter hiking', 'wildlife viewing', 'photography', 'snowshoeing'],
      weather: 'cold temperatures with possible snow',
      crowds: 'minimal, offering peaceful experiences',
      specialConsiderations: 'check road conditions, bring winter gear'
    }
  };
  
  return seasonInfo[season] || seasonInfo.spring;
}

/**
 * Content generation helper functions
 */
function generateIntroduction(park, seasonData) {
  return `# ${seasonData.activity} at ${park.name}: ${seasonData.subtitle}

There's something magical about visiting ${park.name} during ${seasonData.displayName.toLowerCase()}. As ${seasonData.highlights[0]}, the park transforms into a ${seasonData.adjective} destination that offers visitors a unique perspective on this incredible ${park.type.toLowerCase()}.

${park.description} During ${seasonData.displayName.toLowerCase()}, ${park.name} becomes particularly special for ${seasonData.activities.slice(0, 2).join(' and ')}, making it an ideal time for both seasoned adventurers and first-time visitors.`;
}

function generateSeasonalHighlights(park, seasonData) {
  return `## What Makes ${seasonData.displayName} Special at ${park.name}

### ${seasonData.highlights[0].charAt(0).toUpperCase() + seasonData.highlights[0].slice(1)}
${generateHighlightDetail(park, seasonData.highlights[0], seasonData)}

### ${seasonData.highlights[1].charAt(0).toUpperCase() + seasonData.highlights[1].slice(1)}
${generateHighlightDetail(park, seasonData.highlights[1], seasonData)}

### ${seasonData.highlights[2].charAt(0).toUpperCase() + seasonData.highlights[2].slice(1)}
${generateHighlightDetail(park, seasonData.highlights[2], seasonData)}`;
}

function generateHighlightDetail(park, highlight, seasonData) {
  const details = {
    'blooming wildflowers': `The ${seasonData.displayName.toLowerCase()} wildflower display at ${park.name} is truly spectacular. Depending on elevation and rainfall, you'll encounter vibrant displays of native blooms that paint the landscape in brilliant colors.`,
    'cascading waterfalls': `${seasonData.displayName} snowmelt and rainfall create powerful waterfalls throughout ${park.name}. The rushing water adds a dramatic soundtrack to your visit and provides excellent photography opportunities.`,
    'mild hiking weather': `With comfortable temperatures and longer daylight hours, ${seasonData.displayName.toLowerCase()} offers ideal conditions for exploring ${park.name}'s trail system without the extreme heat of summer or cold of winter.`,
    'full trail access': `Summer means most trails are accessible and in prime condition. This is your chance to explore the more challenging routes and reach those spectacular viewpoints that may be inaccessible during other seasons.`,
    'camping opportunities': `Summer camping at ${park.name} offers warm nights under starry skies. It's the perfect time to experience the park's nocturnal side and wake up to sunrise views right from your campsite.`,
    'family activities': `Summer brings ranger-led programs, visitor center activities, and perfect weather for introducing children to the wonders of ${park.name}. Educational programs make learning fun for visitors of all ages.`,
    'stunning foliage': `The fall color display at ${park.name} is nothing short of breathtaking. As temperatures cool, the park transforms into a tapestry of reds, oranges, and golds that creates unforgettable photographic opportunities.`,
    'crisp hiking weather': `Fall's comfortable temperatures and low humidity make it arguably the best time for hiking at ${park.name}. You'll enjoy clear, crisp days perfect for covering more miles on the trail.`,
    'fewer crowds': `As summer vacations end, ${park.name} becomes more peaceful. You'll have better access to popular viewpoints and more intimate experiences with the park's natural beauty.`,
    'peaceful solitude': `Winter transforms ${park.name} into a quiet sanctuary. With fewer visitors, you'll experience a more contemplative side of the park and have unique opportunities for wildlife photography.`,
    'winter wildlife': `Many animals are more easily spotted against the winter landscape. This season offers excellent opportunities to observe ${park.name}'s wildlife in their winter habitat.`,
    'snow-covered landscapes': `Snow adds a magical quality to ${park.name}'s already stunning scenery. The contrast between dark rock formations and white snow creates dramatic and beautiful photographic compositions.`
  };
  
  return details[highlight] || `This aspect of ${park.name} is particularly noteworthy during ${seasonData.displayName.toLowerCase()}.`;
}

function generateBestTimesToVisit(park, seasonData) {
  return `## Best Times to Visit During ${seasonData.displayName}

### Weather Patterns
Expect ${seasonData.weather} during your ${seasonData.displayName.toLowerCase()} visit to ${park.name}. ${seasonData.specialConsiderations.charAt(0).toUpperCase() + seasonData.specialConsiderations.slice(1)}.

### Crowd Levels
You'll encounter ${seasonData.crowds} during ${seasonData.displayName.toLowerCase()}. For the best experience, consider visiting on weekdays if possible, and arrive early to secure parking at popular trailheads.

### Peak Times Within the Season
${generatePeakTimingAdvice(park, seasonData)}`;
}

function generatePeakTimingAdvice(park, seasonData) {
  const timingAdvice = {
    spring: `Early spring can be unpredictable, but late spring (May-June) typically offers the best combination of mild weather and peak wildflower displays.`,
    summer: `Early summer provides the perfect balance of accessible trails and manageable crowds. July and August are peak season with the warmest weather but highest visitor numbers.`,
    fall: `Peak foliage timing varies by elevation and weather patterns. Generally, higher elevations change first, with full color displays occurring mid to late fall.`,
    winter: `Mid-winter offers the most reliable snow coverage and winter conditions, while early and late winter may have more variable weather patterns.`
  };
  
  return timingAdvice[seasonData.displayName.toLowerCase()] || 'Timing can vary based on annual weather patterns.';
}

function generateWhatToExpect(park, seasonData) {
  const activities = park.activities.slice(0, 4);
  const activitiesText = activities.length > 1 ? activities.slice(0, -1).join(', ') + `, and ${activities[activities.length - 1]}` : activities[0];
  
  return `## What to Expect During Your Visit

### Activities and Experiences
${seasonData.displayName} is perfect for ${activitiesText} at ${park.name}. The ${seasonData.adjective} conditions make it an ideal time to ${seasonData.activities[0]} and explore the park's most popular features.

### Trail Conditions
${generateTrailConditions(park, seasonData)}

### Photography Opportunities
${generatePhotographyAdvice(park, seasonData)}`;
}

function generateTrailConditions(park, seasonData) {
  const conditions = {
    spring: 'Trail conditions can vary with some muddy sections from snowmelt and rain. Waterproof hiking boots are recommended.',
    summer: 'Most trails are in excellent condition with clear access. Popular trails may be crowded, especially on weekends.',
    fall: 'Trail conditions are generally excellent with fallen leaves adding beauty but potentially hiding trail obstacles.',
    winter: 'Some trails may be snow-covered or icy. Check current conditions and consider bringing traction devices for your boots.'
  };
  
  return conditions[seasonData.displayName.toLowerCase()] || 'Trail conditions vary by season and recent weather.';
}

function generatePhotographyAdvice(park, seasonData) {
  if (!park.metadata.photographySpots) {
    return `While ${park.name} offers beautiful scenery year-round, ${seasonData.displayName.toLowerCase()} provides unique lighting and natural conditions for capturing memorable photos.`;
  }
  
  const photoAdvice = {
    spring: 'Golden hour lighting enhances wildflower colors, while overcast conditions provide even lighting for waterfall photography.',
    summer: 'Early morning and late evening offer the best lighting. Midday sun can be harsh, but creates dramatic shadows in canyon settings.',
    fall: 'The warm, angled sunlight of fall perfectly complements foliage colors. Overcast days intensify color saturation.',
    winter: 'The low winter sun creates long shadows and dramatic lighting. Snow provides natural reflectors for enhanced lighting.'
  };
  
  return photoAdvice[seasonData.displayName.toLowerCase()] || 'Great photography opportunities exist throughout the season.';
}

function generatePlanningTips(park, seasonData) {
  return `## Planning Your ${seasonData.displayName} Visit

### What to Pack
- Weather-appropriate clothing for ${seasonData.weather}
- ${generatePackingList(park, seasonData)}
- Camera for capturing ${seasonData.highlights[0]}
- Plenty of water and snacks

### Reservations and Permits
Check if ${park.name} requires advance reservations for camping or timed entry, especially during peak ${seasonData.displayName.toLowerCase()} periods.

### Local Resources
- [${park.name} Official Website](https://www.nps.gov/${park.slug})
- Current weather and trail conditions
- ${seasonData.displayName} activity schedules`;
}

function generatePackingList(park, seasonData) {
  const packingLists = {
    spring: 'waterproof jacket and layered clothing for changing conditions',
    summer: 'sun protection including hat, sunglasses, and sunscreen',
    fall: 'warm layers for cool mornings and evenings',
    winter: 'warm winter gear including insulated boots and gloves'
  };
  
  return packingLists[seasonData.displayName.toLowerCase()] || 'season-appropriate clothing';
}

function generateConclusion(park, seasonData) {
  return `## Experience ${park.name}'s ${seasonData.displayName} Magic

${seasonData.displayName} at ${park.name} offers a unique perspective on this remarkable ${park.type.toLowerCase()}. Whether you're drawn by ${seasonData.highlights[0]}, seeking ${seasonData.highlights[1]}, or simply wanting to experience ${seasonData.highlights[2]}, this ${seasonData.adjective} season provides unforgettable memories.

Plan your visit during ${seasonData.displayName.toLowerCase()} and discover why this time of year transforms ${park.name} into something truly special. From ${seasonData.activities[0]} to ${seasonData.activities[1]}, you'll find that ${seasonData.displayName.toLowerCase()} showcases the very best of what this incredible destination has to offer.

*Ready to plan your ${seasonData.displayName.toLowerCase()} adventure? Check current conditions and start planning your visit to ${park.name} today.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 