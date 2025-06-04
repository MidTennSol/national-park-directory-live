/**
 * Accessibility Spotlight Content Template
 * 
 * Generates content focusing on accessibility and inclusive experiences
 */

export const template = {
  id: 'accessibility-spotlight',
  name: 'Accessibility Spotlight',
  description: 'Focus on accessibility and inclusive experiences',
  weight: 1.0,
  
  suitability: {
    preferredSeasons: ['all'],
    parkTypes: ['National Park', 'National Monument', 'National Historic Site'],
    requiredFeatures: ['accessibility']
  }
};

export function generateTitle(park, options = {}) {
  const titleVariations = [
    `Everyone's Park: Accessible Adventures at ${park.name}`,
    `Breaking Barriers: Accessibility at ${park.name}`,
    `Inclusive Adventures: ${park.name} for All Abilities`,
    `Universal Access: Experiencing ${park.name} Together`,
    `Adventures for Everyone: Accessibility Guide to ${park.name}`
  ];
  
  return titleVariations[(park.name.charCodeAt(0) + park.state.charCodeAt(0)) % titleVariations.length];
}

export function generateDescription(park, options = {}) {
  return `Discover how ${park.name} welcomes visitors of all abilities! From accessible trails to adaptive programs, explore the inclusive features that make this spectacular ${park.type.toLowerCase()} accessible to everyone.`;
}

export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateAccessibleTrails(park),
    generateFacilitiesAccessibility(park),
    generateAdaptivePrograms(park),
    generateSensoryExperiences(park),
    generatePlanningResources(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'accessibility',
    'inclusive travel',
    'adaptive programs',
    'accessible trails',
    'universal design',
    'barrier-free'
  ];
}

function generateIntroduction(park) {
  return `# Everyone's Park: Accessible Adventures at ${park.name}

${park.name} believes that the wonder of America's natural and cultural heritage should be accessible to everyone, regardless of physical ability, sensory capacity, or mobility. This remarkable ${park.type.toLowerCase()} has made significant commitments to ensuring that all visitors can experience its spectacular features through thoughtful design, adaptive programming, and inclusive services.

${park.description}

Accessibility at ${park.name} goes beyond basic compliance – it's about creating meaningful experiences that allow every visitor to connect with this special place in their own way. Whether you use a wheelchair, have vision or hearing differences, or face other accessibility needs, ${park.name} offers pathways to wonder and discovery.`;
}

function generateAccessibleTrails(park) {
  return `## Accessible Trails and Pathways

### Paved and Boardwalk Trails
${park.name} offers several fully accessible routes that showcase the park's most spectacular features:

**The Universal Access Trail**
- **Surface:** Smooth, firm pavement suitable for wheelchairs and mobility devices
- **Grade:** Maximum 5% slope with level rest areas every 300 feet
- **Width:** Minimum 8 feet wide to accommodate multiple users
- **Features:** Accessible viewpoints, interpretive panels at multiple heights, and tactile elements
- **Distance:** Varies, typically 0.5-2 miles depending on the specific trail

**Boardwalk Experiences**
- **Design:** Elevated wooden walkways that protect sensitive ecosystems while providing access
- **Handrails:** Continuous railings at appropriate heights with intermediate rails for safety
- **Rest Areas:** Benches and wider platforms for rest and enjoyment
- **Surface:** Non-slip materials that provide safe travel in various weather conditions

### Modified Accessible Routes
For visitors who can navigate some terrain but need easier access than standard trails:

**Packed Gravel Paths**
- **Surface:** Compacted materials that provide firm, stable footing
- **Maintenance:** Regular upkeep to ensure consistent accessibility
- **Assistance:** Available for visitors who need mobility equipment or guidance
- **Lengths:** Various distances to accommodate different ability levels

**Shortened Loop Options**
- **Flexibility:** Abbreviated versions of longer trails that capture key experiences
- **Turnaround Points:** Clearly marked locations where visitors can reverse direction
- **Highlights:** Strategic positioning to include the most impressive viewpoints and features
- **Assistance Options:** Availability of staff support or equipment loans

### Beach and Waterfront Access
Special provisions for enjoying water features:

**Beach Wheelchairs**
- **Equipment:** Wide-tire wheelchairs designed for sand and rough terrain
- **Reservation:** Advance booking systems to ensure availability
- **Training:** Staff assistance with equipment use and transfer techniques
- **Storage:** Secure facilities for personal mobility devices during beach wheelchair use

**Accessible Fishing Areas**
- **Platforms:** Raised, railed areas that accommodate wheelchairs and provide safe fishing access
- **Equipment:** Adaptive fishing gear available for loan
- **Instruction:** Ranger programs that teach accessible fishing techniques
- **Companions:** Programs that pair experienced accessible anglers with newcomers`;
}

function generateFacilitiesAccessibility(park) {
  return `## Accessible Facilities and Services

### Visitor Centers and Museums
${park.name}'s visitor facilities are designed with universal access in mind:

**Physical Accessibility**
- **Entrances:** Automatic doors and ramp access at all main entrances
- **Pathways:** Wide, clear corridors with appropriate lighting and contrast
- **Restrooms:** Fully accessible facilities with adult-sized changing tables
- **Seating:** Multiple seating options at various heights throughout exhibits

**Interpretive Accessibility**
- **Visual Displays:** High-contrast graphics with large, readable fonts
- **Audio Enhancement:** Assistive listening systems for presentations and films
- **Tactile Elements:** Hands-on exhibits that engage multiple senses
- **Digital Access:** QR codes linking to audio descriptions and detailed information

### Accommodation Options
Various lodging choices that meet accessibility standards:

**Accessible Lodging**
- **Room Features:** Roll-in showers, lowered fixtures, and appropriate maneuvering space
- **Communication:** Visual notification systems for visitors with hearing differences
- **Furniture:** Adjustable-height tables and accessible storage options
- **Locations:** Proximity to accessible transportation and park facilities

**Camping Accessibility**
- **Campsite Design:** Level camping pads with accessible picnic tables and fire rings
- **Utilities:** Accessible water spigots and electrical connections
- **Restroom Facilities:** Nearby accessible restrooms and shower facilities
- **Reservations:** Priority booking systems for accessible sites

### Transportation Services
Getting around ${park.name} with accessibility needs:

**Shuttle Services**
- **Accessible Vehicles:** Buses equipped with wheelchair lifts and securement systems
- **Audio Announcements:** Clear announcements of stops and points of interest
- **Visual Displays:** Electronic signs showing route information and next stops
- **Staff Training:** Drivers trained in accessibility assistance and emergency procedures

**Parking and Drop-Off**
- **Accessible Parking:** Ample spaces near all major attractions and facilities
- **Loading Zones:** Designated areas for passenger loading and unloading
- **Pathway Connections:** Direct, accessible routes from parking to attractions
- **Wayfinding:** Clear signage with universal symbols and multiple formats`;
}

function generateAdaptivePrograms(park) {
  return `## Specialized Programs and Services

### Ranger-Led Accessible Programs
${park.name} offers specially designed programs that accommodate various accessibility needs:

**Multi-Sensory Nature Walks**
- **Tactile Elements:** Opportunities to safely touch plants, rocks, and other natural features
- **Audio Descriptions:** Detailed verbal descriptions of visual elements and landscapes
- **Aromatic Experiences:** Emphasis on natural scents and their significance
- **Paced Movement:** Slower pace with frequent stops for rest and exploration

**Adaptive Cultural Programs**
- **Historical Reenactments:** Programs adapted for various physical abilities and learning styles
- **Hands-On Activities:** Craft demonstrations and participatory cultural experiences
- **Storytelling Sessions:** Programs that emphasize oral traditions and narrative engagement
- **Interactive Exhibits:** Mobile programs that can be brought to accessible locations

### Assistive Technology and Equipment
Available resources to enhance accessibility:

**Visual Assistance**
- **Audio Guides:** Detailed audio descriptions of key park features and exhibits
- **Large Print Materials:** Maps, brochures, and guides in high-contrast, large-font formats
- **Magnification Tools:** Handheld magnifiers and binoculars for visitors with low vision
- **Tactile Maps:** Raised-relief maps that provide spatial orientation through touch

**Mobility Support**
- **Wheelchair Loans:** Standard and all-terrain wheelchairs available for temporary use
- **Mobility Scooters:** Electric scooters for visitors who can't walk long distances
- **Walking Aids:** Hiking poles, canes, and other mobility assistance equipment
- **Transfer Equipment:** Devices to assist with transfers between mobility aids and vehicles

**Communication Support**
- **ASL Interpretation:** American Sign Language interpreters for programs and tours
- **Written Materials:** Comprehensive written descriptions and instructions
- **Communication Boards:** Visual aids for visitors with speech differences
- **Technology Integration:** Apps and devices that enhance communication access

### Inclusive Educational Programs
Learning opportunities designed for diverse abilities and learning styles:

**Junior Ranger Programs**
- **Adaptive Activities:** Modified tasks that accommodate various physical and cognitive abilities
- **Flexible Pacing:** Programs that can be adjusted for different attention spans and energy levels
- **Multiple Learning Styles:** Activities that engage visual, auditory, and kinesthetic learners
- **Peer Support:** Buddy systems that pair participants with complementary abilities

**School Group Accommodations**
- **Teacher Resources:** Pre-visit materials and post-visit activities for diverse classrooms
- **Customized Programs:** Tours and activities adapted for specific group needs
- **Support Staff:** Additional assistance for groups with accessibility requirements
- **Flexible Scheduling:** Program timing that accommodates various group needs`;
}

function generateSensoryExperiences(park) {
  return `## Sensory-Rich Experiences for All

### Visual Accessibility
Ensuring that the beauty of ${park.name} can be experienced by visitors with various levels of vision:

**Audio Description Services**
- **Scenic Overlooks:** Detailed verbal descriptions of landscape features and views
- **Wildlife Encounters:** Audio explanations of animal behavior and characteristics
- **Geological Features:** Descriptions of rock formations, colors, and textures
- **Cultural Sites:** Verbal interpretation of historical and cultural significance

**Tactile Exploration Opportunities**
- **Touch Tables:** Safely accessible natural specimens and cultural artifacts
- **Texture Trails:** Pathways with varied surface materials that provide orientation cues
- **Raised Relief Models:** Three-dimensional representations of park features and layouts
- **Braille Materials:** Written information in Braille format for key park resources

### Auditory Accessibility
Accommodating visitors with hearing differences:

**Visual Communication Systems**
- **Written Programs:** Comprehensive written materials for all spoken presentations
- **Sign Language Services:** ASL interpretation for scheduled programs and tours
- **Visual Alert Systems:** Flashing lights and visual signals for emergency communications
- **Captioned Media:** Subtitled films and video presentations in visitor centers

**Vibration and Visual Experiences**
- **Tactile Feedback:** Programs that use vibration to convey information about sounds
- **Visual Storytelling:** Programs that emphasize visual elements and demonstration
- **Silent Activities:** Nature observation and photography programs that don't rely on hearing
- **Written Interaction:** Communication systems that use text and visual cues

### Cognitive Accessibility
Supporting visitors with various learning styles and cognitive differences:

**Simplified Information**
- **Clear Wayfinding:** Simple, consistent signage with universal symbols
- **Structured Programs:** Activities with predictable routines and clear instructions
- **Visual Schedules:** Picture-based schedules that outline program activities
- **Flexible Timing:** Self-paced activities that can be adjusted to individual needs

**Sensory-Friendly Options**
- **Quiet Spaces:** Designated areas for visitors who need sensory breaks
- **Reduced Stimulation:** Programs offered during less crowded times
- **Calming Activities:** Nature-based activities that promote relaxation and focus
- **Support Resources:** Information for caregivers and family members`;
}

function generatePlanningResources(park) {
  return `## Planning Your Accessible Visit

### Pre-Visit Planning Resources
Essential information for planning an accessible trip to ${park.name}:

**Accessibility Information Portal**
- **Detailed Facility Information:** Comprehensive descriptions of accessibility features
- **Current Conditions:** Real-time updates on accessibility of trails and facilities
- **Equipment Reservations:** Online booking systems for assistive equipment
- **Contact Information:** Direct lines to accessibility coordinators and specialists

**Transportation Planning**
- **Accessible Route Planning:** Information about accessible parking and pathways
- **Public Transportation:** Details about accessible transit options to the park
- **Rental Equipment:** Local sources for mobility equipment and assistive technology
- **Shuttle Schedules:** Timing and accessibility features of park transportation

### During Your Visit
Resources and support available while at ${park.name}:

**Visitor Center Services**
- **Accessibility Information Desk:** Staffed by specialists who can provide current information
- **Equipment Check-Out:** Systems for borrowing assistive technology and mobility aids
- **Program Modifications:** Staff who can adapt standard programs for specific needs
- **Emergency Assistance:** Protocols for visitors who need emergency accessibility support

**Communication Resources**
- **Multi-Language Materials:** Accessibility information in various languages
- **Technology Support:** Assistance with accessibility apps and digital resources
- **Interpretation Services:** Arrangements for sign language and language interpretation
- **Family Support:** Resources for families with members who have accessibility needs

### Feedback and Continuous Improvement
${park.name} is committed to ongoing improvement in accessibility:

**Visitor Feedback Systems**
- **Accessibility Surveys:** Opportunities to share experiences and suggestions
- **Digital Feedback:** Online platforms for reporting accessibility barriers
- **Focus Groups:** Regular input sessions with visitors who have accessibility needs
- **Community Partnerships:** Collaboration with disability advocacy organizations

**Future Developments**
- **Improvement Plans:** Information about upcoming accessibility enhancements
- **New Technology:** Integration of emerging assistive technologies
- **Program Expansion:** Development of new inclusive programs and services
- **Staff Training:** Ongoing education for park personnel on accessibility best practices`;
}

function generateConclusion(park) {
  return `## Accessible Adventures for All

${park.name} demonstrates that natural and cultural heritage can and should be accessible to everyone. Through thoughtful design, adaptive programming, and inclusive services, this remarkable ${park.type.toLowerCase()} ensures that accessibility challenges don't prevent anyone from experiencing its wonders.

### The Philosophy of Universal Access
Accessibility at ${park.name} is guided by several key principles:

**Dignity and Independence:**
All visitors should be able to experience the park with dignity and as much independence as possible.

**Equal Experience Quality:**
Accessible options should provide experiences that are equivalent in quality to those available to all visitors.

**Flexibility and Choice:**
Multiple options and approaches ensure that diverse needs can be accommodated.

**Continuous Improvement:**
Accessibility is an ongoing commitment that evolves with technology and understanding.

### Planning Your Inclusive Adventure
Tips for making the most of your accessible visit to ${park.name}:

**Advance Planning:**
- Contact the park's accessibility coordinator before your visit
- Reserve any needed equipment or services well in advance
- Research current conditions and any temporary accessibility challenges
- Plan flexible itineraries that can be adapted based on conditions and energy levels

**During Your Visit:**
- Take advantage of park staff expertise and local knowledge
- Don't hesitate to ask for assistance or modifications to standard programs
- Provide feedback about your experience to help improve future accessibility
- Connect with other visitors and share accessibility tips and resources

### A Model for Inclusive Recreation
${park.name}'s commitment to accessibility serves as a model for how public lands can welcome everyone. The park's approach demonstrates that with creativity, commitment, and community input, natural and cultural heritage sites can remove barriers and create meaningful experiences for all visitors.

*Your visit to ${park.name} is part of a larger movement toward universal access in America's parks. Every successful accessible visit helps demonstrate the importance and possibility of inclusive recreation for all.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 