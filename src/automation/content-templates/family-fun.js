/**
 * Family Fun Content Template
 * 
 * Generates content focusing on family-friendly activities and experiences
 */

export const template = {
  id: 'family-fun',
  name: 'Family Fun',
  description: 'Focus on family-friendly activities and experiences',
  weight: 1.1,
  
  suitability: {
    preferredSeasons: ['summer'],
    parkTypes: ['National Park', 'National Seashore', 'National Recreation Area'],
    requiredFeatures: ['accessibility', 'visitor center']
  }
};

export function generateTitle(park, options = {}) {
  const titleVariations = [
    `Making Memories: Family-Friendly Adventures at ${park.name}`,
    `${park.name} with Kids: Your Complete Family Guide`,
    `Family Fun at ${park.name}: Activities for Every Age`,
    `Creating Lifelong Memories: A Family Guide to ${park.name}`,
    `${park.name} Family Adventure: Where Wonder Meets Discovery`
  ];
  
  return titleVariations[park.name.length % titleVariations.length];
}

export function generateDescription(park, options = {}) {
  return `Discover why ${park.name} is perfect for families! From easy trails to hands-on activities, find everything you need to create unforgettable memories with kids of all ages in this spectacular ${park.type.toLowerCase()}.`;
}

export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateFamilyActivities(park),
    generateEducationalPrograms(park),
    generateEasyTrails(park),
    generateVisitorCenterFun(park),
    generatePracticalTips(park),
    generateSeasonalFamily(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'family travel',
    'kids activities',
    'family fun',
    'educational programs',
    'easy trails',
    'family vacation'
  ];
}

function generateIntroduction(park) {
  return `# Making Memories: Family-Friendly Adventures at ${park.name}

${park.name} isn't just a destination – it's where families create memories that last a lifetime. This remarkable ${park.type.toLowerCase()} offers the perfect blend of natural wonder, educational opportunities, and accessible adventures that captivate children and adults alike.

${park.description}

From toddlers taking their first steps on nature trails to teenagers developing a lifelong love of the outdoors, ${park.name} provides experiences that grow with your family. Whether you're planning a day trip or an extended vacation, this guide will help you make the most of your family adventure.`;
}

function generateFamilyActivities(park) {
  const activities = generateFamilySpecificActivities(park);
  
  return `## Top Family Activities at ${park.name}

${activities.map((activity, index) => `### ${index + 1}. ${activity.name}

${activity.description}

**Age range:** ${activity.ageRange}
**Duration:** ${activity.duration}
**Difficulty:** ${activity.difficulty}
**What to bring:** ${activity.supplies}
**Pro tip:** ${activity.tip}`).join('\n\n')}`;
}

function generateFamilySpecificActivities(park) {
  return [
    {
      name: "Nature Scavenger Hunt",
      description: `Turn exploration into a game with a nature scavenger hunt! ${park.name} provides endless opportunities for kids to search for specific plants, animals, rocks, and natural features while learning about the ecosystem.`,
      ageRange: "Ages 4-12 (adaptable for all ages)",
      duration: "1-3 hours",
      difficulty: "Easy",
      supplies: "Scavenger hunt list, pencils, small collection bags (for trash only)",
      tip: "Create different difficulty levels for different aged children in your group."
    },
    {
      name: "Junior Ranger Program",
      description: "Kids can earn their official Junior Ranger badge by completing activities designed to teach them about conservation, wildlife, and park stewardship. It's education disguised as fun!",
      ageRange: "Ages 6-12",
      duration: "2-4 hours",
      difficulty: "Easy to Moderate",
      supplies: "Junior Ranger booklet (available at visitor center), pencil",
      tip: "Complete some activities before your visit to maximize park time."
    },
    {
      name: "Wildlife Watching",
      description: "Patient families are often rewarded with incredible wildlife sightings. Teaching kids to observe quietly and respectfully can lead to magical encounters with ${park.name}'s resident animals.",
      ageRange: "All ages",
      duration: "30 minutes to several hours",
      difficulty: "Easy",
      supplies: "Binoculars, wildlife identification guides, camera",
      tip: "Early morning and evening offer the best viewing opportunities."
    },
    {
      name: "Photography Adventure",
      description: "Give kids disposable cameras or smartphones and challenge them to capture the beauty of ${park.name}. This activity encourages observation and creates personal mementos.",
      ageRange: "Ages 5 and up",
      duration: "Ongoing throughout visit",
      difficulty: "Easy",
      supplies: "Camera for each child, photo challenges list",
      tip: "Focus on composition and storytelling rather than technical perfection."
    }
  ];
}

function generateEducationalPrograms(park) {
  return `## Educational Opportunities

### Ranger-Led Programs
${park.name} offers various ranger-led programs designed specifically for families:

- **Guided Nature Walks:** Learn about local flora and fauna from knowledgeable rangers
- **Evening Programs:** Campfire talks and stargazing sessions that captivate all ages
- **Living History Demonstrations:** Interactive presentations that bring the park's history to life
- **Special Events:** Seasonal programs celebrating unique aspects of ${park.name}

### Self-Guided Learning
- **Interpretive Trails:** Well-marked paths with educational signage
- **Audio Tours:** Available for smartphones to enhance any hike
- **Visitor Center Exhibits:** Interactive displays that engage young minds
- **Touch Tables:** Hands-on learning opportunities with natural specimens

### Educational Resources
- Download park activity guides before your visit
- Check the park website for current educational programs
- Ask rangers about special activities during your visit dates
- Consider timing your visit around special events or programs`;
}

function generateEasyTrails(park) {
  return `## Kid-Friendly Trails and Walks

### The Perfect Introduction Trail
**Distance:** Short loop (usually under 1 mile)
**Terrain:** Paved or well-maintained dirt path
**Highlights:** Multiple points of interest to keep kids engaged
**Facilities:** Restrooms and water available nearby

### Accessible Boardwalk Adventure
Many sections of ${park.name} feature boardwalks that provide access for strollers and wheelchairs while protecting sensitive ecosystems.

### Stream-Side Exploration
Water features naturally attract children, and ${park.name}'s stream areas offer safe opportunities for supervised exploration and learning.

### Trail Tips for Families
- **Start Small:** Choose shorter trails for your first visit
- **Bring Snacks:** Frequent energy refueling keeps everyone happy
- **Pack Entertainment:** Small games or activities for rest stops
- **Allow Extra Time:** Kids move at their own pace and notice everything
- **Make it Interactive:** Point out interesting features and ask questions`;
}

function generateVisitorCenterFun(park) {
  return `## Visitor Center Adventures

The ${park.name} Visitor Center is much more than an information stop – it's a destination in itself for families:

### Interactive Exhibits
- Touch screens and hands-on displays designed for curious minds
- Scale models and dioramas that help kids understand the park's geography
- Wildlife displays featuring local animals
- Geological specimens that tell the park's ancient story

### Educational Activities
- Junior Ranger program materials and guidance
- Educational films shown throughout the day
- Rotating special exhibits that highlight different aspects of the park
- Reading corner with nature books for children

### Practical Family Services
- Clean restrooms with baby changing facilities
- Water fountains and bottle filling stations
- First aid assistance
- Lost and found services
- Weather and trail condition updates

### Gift Shop Treasures
Help kids select meaningful souvenirs that will remind them of their ${park.name} adventure:
- Junior Ranger patches and certificates
- Nature identification guides
- Park-specific books and educational materials
- Eco-friendly toys and games`;
}

function generatePracticalTips(park) {
  return `## Essential Family Travel Tips

### Before You Go
- **Check Weather:** ${park.name} weather can change quickly
- **Plan Rest Stops:** Build in time for snacks and bathroom breaks
- **Download Maps:** Cell service may be limited in some areas
- **Reserve Accommodations:** Popular family destinations book up quickly

### Packing Essentials
- **The 10 Essentials for Families:**
  1. First aid kit with children's medications
  2. Extra water (more than you think you'll need)
  3. Snacks and lunch
  4. Sun protection (hats, sunscreen, sunglasses)
  5. Extra clothing layers
  6. Headlamps or flashlights
  7. Emergency whistle
  8. Trash bags
  9. Hand sanitizer and wipes
  10. Entertainment for wait times

### Safety Considerations
- **Stay Together:** Establish buddy systems and meeting points
- **Identify Rangers:** Teach kids how to identify park rangers if they get separated
- **Respect Wildlife:** Maintain safe distances and never feed animals
- **Stay on Trails:** Protect both family safety and park ecosystems

### Managing Expectations
- **Flexibility is Key:** Be prepared to adjust plans based on weather or kids' energy levels
- **Quality Over Quantity:** Better to thoroughly enjoy one area than rush through many
- **Embrace Teaching Moments:** Use unexpected situations as learning opportunities`;
}

function generateSeasonalFamily(park) {
  return `## Best Times for Family Visits

### Summer: Peak Family Season
**Advantages:** All facilities open, longest days, warmest weather
**Considerations:** Crowds, higher temperatures, busy trails
**Tips:** Start early, bring extra water, make reservations well in advance

### Spring: Nature's Awakening
**Advantages:** Mild weather, fewer crowds, wildlife activity
**Considerations:** Some facilities may have limited hours, unpredictable weather
**Tips:** Pack layers, check accessibility before visiting

### Fall: Comfortable Exploration
**Advantages:** Pleasant temperatures, beautiful colors, moderate crowds
**Considerations:** Shorter days, weather changes quickly
**Tips:** Bring warm clothes for morning and evening

### Winter: Unique Experiences
**Advantages:** Minimal crowds, unique winter activities, cozy atmosphere
**Considerations:** Limited access, cold temperatures, early sunset
**Tips:** Check accessibility, dress in layers, plan shorter adventures`;
}

function generateConclusion(park) {
  return `## Creating Lifelong Nature Lovers

A family visit to ${park.name} is more than just a vacation – it's an investment in your children's relationship with the natural world. Research shows that children who spend time in nature develop stronger environmental awareness, better physical health, and increased creativity.

The memories you create at ${park.name} will become family stories told for generations. That moment when your child spots their first wildlife, successfully completes a challenging trail, or asks thoughtful questions about conservation – these experiences shape who they become.

### Making It Count
- **Document the Adventure:** Photos, journals, and souvenirs help preserve memories
- **Follow Up at Home:** Continue learning about what you experienced
- **Plan Return Visits:** Each visit reveals new wonders and creates deeper connections
- **Share the Experience:** Tell friends and family about the magic of ${park.name}

*Ready to create unforgettable family memories? ${park.name} is waiting to welcome your family and provide adventures that will last a lifetime.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 