/**
 * Geological Wonders Content Template
 * 
 * Generates content focusing on geology, rock formations, and earth processes
 */

export const template = {
  id: 'geological-wonders',
  name: 'Geological Wonders',
  description: 'Focus on geological features and earth processes',
  weight: 0.8,
  
  suitability: {
    preferredSeasons: ['all'],
    parkTypes: ['National Park', 'National Monument', 'National Geological Site'],
    requiredFeatures: ['geological features']
  }
};

export function generateTitle(park, options = {}) {
  const titleVariations = [
    `The Incredible Geology of ${park.name}: Earth's Masterpiece Explained`,
    `Ancient Forces: How ${park.name} Was Carved from Stone`,
    `Reading the Rocks: The Geological Story of ${park.name}`,
    `Earth's Timeline: Geological Wonders of ${park.name}`,
    `Stone Stories: Understanding the Geology of ${park.name}`
  ];
  
  return titleVariations[park.name.charCodeAt(0) % titleVariations.length];
}

export function generateDescription(park, options = {}) {
  return `Uncover the incredible geological story of ${park.name}! Discover how ancient forces shaped spectacular rock formations and learn to read the landscape like a geologist in this fascinating earth science adventure.`;
}

export function generateContent(park, options = {}) {
  const sections = [
    generateIntroduction(park),
    generateGeologicalHistory(park),
    generateRockFormations(park),
    generateActiveProcesses(park),
    generateFossilRecord(park),
    generateGeologicalTour(park),
    generateConclusion(park)
  ];
  
  return sections.join('\n\n');
}

export function generateTags(park, options = {}) {
  return [
    park.name,
    park.state,
    'geology',
    'rock formations',
    'earth science',
    'geological history',
    'fossils',
    'natural processes'
  ];
}

function generateIntroduction(park) {
  return `# The Incredible Geology of ${park.name}: Earth's Masterpiece Explained

Beneath the surface beauty of ${park.name} lies one of Earth's most fascinating stories – a tale written in stone and carved by time. Every cliff face, every valley, and every unusual rock formation holds clues to ancient worlds, dramatic geological events, and the incredible forces that continue to shape our planet.

${park.description}

Understanding the geology of ${park.name} transforms every visit from simple sightseeing to geological detective work. Armed with basic knowledge of how these features formed, you'll begin to see the landscape as geologists do – as a library of Earth's history where each layer tells a different chapter of our planet's remarkable story.`;
}

function generateGeologicalHistory(park) {
  return `## Deep Time: The Geological Timeline of ${park.name}

### Ancient Beginnings
The story of ${park.name} begins hundreds of millions of years ago, when the area looked nothing like it does today:

**Precambrian Foundation (Over 540 million years ago)**
- **Basement Rocks:** The ancient foundation stones that form the oldest visible geology
- **Metamorphic Processes:** How heat and pressure transformed original rocks
- **Igneous Intrusions:** Molten rock that cooled and solidified deep underground
- **Structural Formation:** The basic framework that would influence all future geology

**Paleozoic Era (540-245 million years ago)**
- **Ancient Seas:** Times when the area was covered by warm, shallow oceans
- **Marine Life:** Creatures whose fossils we can still find today
- **Sediment Deposition:** Layers of sand, mud, and organic material that became rock
- **First Land Plants:** Early terrestrial ecosystems that left their mark

**Mesozoic Era (245-65 million years ago)**
- **Age of Reptiles:** When dinosaurs roamed landscapes that included this area
- **Climate Changes:** Dramatic shifts from tropical to arid conditions
- **Volcanic Activity:** Periods of intense geological activity
- **Continental Drift:** How the moving continents affected local geology

**Cenozoic Era (65 million years ago-present)**
- **Mammal Age:** The rise of modern animal groups
- **Mountain Building:** Uplift events that created current topography
- **Ice Ages:** How glacial periods carved and modified the landscape
- **Recent Changes:** Geological processes still active today

### Major Geological Events
Several specific events dramatically shaped what we see at ${park.name} today:

**Uplift and Mountain Building:**
The forces that raised these rocks from sea level to their current elevations involved incredible pressures and time scales that challenge human comprehension.

**Erosional Carving:**
Water, wind, and ice worked together over millions of years to carve the intricate features that make ${park.name} so spectacular.

**Volcanic Episodes:**
Periods of volcanic activity left their signatures in the rock record, creating some of the most dramatic features visible today.`;
}

function generateRockFormations(park) {
  return `## Reading the Rock Record

### Types of Rock at ${park.name}

#### Sedimentary Rocks: Ancient Environments Preserved
**Sandstone Formations:**
- **Formation Process:** Ancient beaches, deserts, and river systems left layers of sand
- **Identifying Features:** Cross-bedding patterns that show ancient wind and water directions
- **Color Variations:** Iron oxides and other minerals create spectacular color displays
- **Fossil Content:** Preserved remains of ancient life forms

**Limestone and Carbonate Rocks:**
- **Marine Origins:** Formed from ancient sea creatures and coral reefs
- **Cave Formation:** How acidic water dissolves limestone to create underground spaces
- **Fossil Treasures:** Rich deposits of marine fossils from ancient oceans
- **Karst Features:** Sinkholes, springs, and other distinctive limestone landscapes

#### Igneous Rocks: Fire and Fury
**Volcanic Rocks:**
- **Lava Flows:** Solidified streams of molten rock from ancient eruptions
- **Volcanic Ash:** Explosive eruptions that spread material over vast areas
- **Columnar Jointing:** Spectacular geometric patterns in cooling lava
- **Volcanic Necks:** Remnants of ancient volcanoes exposed by erosion

**Plutonic Rocks:**
- **Granite Formations:** Cooled slowly deep underground to form coarse-grained rocks
- **Dike Systems:** Molten rock that intruded into existing formations
- **Batholiths:** Massive underground rock bodies now exposed at the surface
- **Contact Metamorphism:** How heat from intrusions changed surrounding rocks

#### Metamorphic Rocks: Transformation Under Pressure
**Regional Metamorphism:**
- **Pressure and Heat:** How existing rocks were transformed by geological forces
- **Foliation:** The layered appearance created by metamorphic processes
- **Mineral Changes:** New minerals formed under extreme conditions
- **Structural Deformation:** How rocks were folded and faulted during transformation

### Distinctive Geological Features

#### Erosional Masterpieces
**Canyon Systems:**
The intricate canyon networks at ${park.name} reveal the incredible power of water erosion acting over geological time.

**Natural Arches and Bridges:**
These delicate features demonstrate the precise balance between rock strength and erosional forces.

**Hoodoos and Pillars:**
Fantastic rock sculptures created by differential erosion of layered rocks with varying resistance.

#### Structural Geology
**Fault Systems:**
Evidence of ancient earthquakes and tectonic forces that fractured and moved massive rock blocks.

**Fold Structures:**
Places where rock layers were bent and warped by incredible pressures deep within the Earth.

**Joint Patterns:**
Systematic fractures that control how rocks break and erode, creating the geometric patterns we see today.`;
}

function generateActiveProcesses(park) {
  return `## Geological Processes Still at Work

### Ongoing Erosion
${park.name} continues to change today through the same processes that created its spectacular features:

**Water Erosion:**
- **Flash Floods:** Sudden torrents that carve channels and move massive amounts of sediment
- **Chemical Weathering:** How water and acids slowly dissolve certain types of rock
- **Freeze-Thaw Cycles:** Ice expansion that fractures rocks and accelerates breakdown
- **Groundwater Action:** Underground water that continues to carve caves and springs

**Wind Erosion:**
- **Abrasion:** Sand and dust particles that act like natural sandpaper
- **Deflation:** Wind removal of loose particles, gradually lowering surfaces
- **Differential Erosion:** How wind selectively removes softer rocks while leaving harder formations

**Gravity Processes:**
- **Mass Wasting:** Rockfalls, landslides, and debris flows that continue to shape slopes
- **Talus Formation:** Angular rock fragments accumulating at the base of cliffs
- **Soil Creep:** Gradual downhill movement of surface materials

### Climate and Geology Interactions
Modern climate patterns continue to influence geological processes:

**Temperature Extremes:**
Daily and seasonal temperature variations cause rocks to expand and contract, contributing to fracturing and breakdown.

**Precipitation Patterns:**
The timing and intensity of rainfall and snowmelt directly affect erosion rates and patterns.

**Vegetation Effects:**
Plant roots can both protect surfaces from erosion and contribute to rock breakdown through chemical and physical processes.

### Human Impacts on Geological Processes
Understanding how human activities can accelerate or alter natural geological processes:

**Trail Impact:**
How foot traffic can accelerate erosion and change natural drainage patterns.

**Construction Effects:**
The geological considerations involved in building roads, facilities, and trails in sensitive areas.

**Climate Change Implications:**
How changing precipitation patterns and temperature extremes might affect geological processes at ${park.name}.`;
}

function generateFossilRecord(park) {
  return `## Windows into Ancient Life

### Fossil Discoveries at ${park.name}
The rocks of ${park.name} preserve an incredible record of ancient life forms:

**Marine Fossils:**
- **Ancient Sea Creatures:** Shells, corals, and other marine organisms from when this area was underwater
- **Evolutionary Transitions:** Fossils that show how life forms changed over time
- **Mass Extinction Events:** Evidence of the great dying events that reshaped life on Earth
- **Trace Fossils:** Preserved tracks, burrows, and other evidence of ancient animal behavior

**Terrestrial Fossils:**
- **Plant Remains:** Fossilized leaves, wood, and pollen that reveal ancient climates
- **Vertebrate Fossils:** Bones and teeth of ancient mammals, reptiles, and other land animals
- **Insect Preservation:** Rare glimpses into ancient arthropod communities
- **Coprolites:** Fossilized dung that provides insights into ancient diets and ecosystems

### What Fossils Tell Us

#### Ancient Environments
Fossils help scientists reconstruct what ${park.name} was like millions of years ago:

**Climate Indicators:**
- **Tropical Fossils:** Evidence of much warmer climates in the geological past
- **Ice Age Remains:** Fossils that show how life adapted to glacial conditions
- **Drought Indicators:** Preserved evidence of ancient arid periods
- **Seasonal Patterns:** Growth rings and other features that reveal ancient weather cycles

#### Evolutionary History
The fossil record at ${park.name} contributes to our understanding of how life evolved:

**Transitional Forms:**
Fossils that show intermediate stages in the evolution of major animal groups.

**Adaptive Radiation:**
Evidence of how life forms diversified to fill new ecological niches.

**Extinction Patterns:**
Information about which species survived major environmental changes and which did not.

### Fossil Collecting Ethics
Important guidelines for responsible fossil appreciation:

**Look, Don't Take:**
In national parks, fossils are protected resources that must be left for others to enjoy and for scientific study.

**Scientific Value:**
Understanding how professional paleontological research contributes to our knowledge.

**Preservation Importance:**
Why leaving fossils in place maintains their scientific context and value.`;
}

function generateGeologicalTour(park) {
  return `## Your Geological Field Trip

### Self-Guided Geological Stops

#### Stop 1: The Great Unconformity
**What to Look For:**
A dramatic contact between rocks of vastly different ages, representing millions of years of missing geological time.

**What It Means:**
This boundary tells the story of ancient mountain ranges that were completely eroded away before new rocks were deposited on top.

**How to Spot It:**
Look for the obvious difference in rock type, color, or structure across a horizontal boundary.

#### Stop 2: Cross-Bedded Sandstone
**What to Look For:**
Curved or angled layers within sandstone formations that look different from the main horizontal bedding.

**What It Means:**
These patterns preserve ancient sand dunes, river channels, or beach environments, showing which way the wind blew or water flowed millions of years ago.

**How to Spot It:**
The angled layers often create beautiful patterns, especially when highlighted by different weathering or mineral staining.

#### Stop 3: Fault Zones
**What to Look For:**
Places where rock layers are obviously broken and displaced, sometimes with crushed or altered rock along the break.

**What It Means:**
Evidence of ancient earthquakes and tectonic forces that moved massive blocks of rock.

**How to Spot It:**
Look for sudden changes in rock type or sudden offsets in continuous layers.

#### Stop 4: Erosional Features
**What to Look For:**
Caves, arches, hoodoos, and other sculptural features carved by erosion.

**What It Means:**
These features show how different rock types respond to weathering and erosion, creating natural works of art.

**How to Spot It:**
The most obvious and photogenic features, often with explanatory signs.

### Tools for Geological Exploration

#### Essential Field Equipment
- **Hand Lens:** For examining rock and mineral details up close
- **Field Guide:** Helps identify common rocks and geological features
- **Camera:** Document interesting features and patterns for later study
- **Notebook:** Record observations and questions for further research

#### Observation Techniques
- **Color and Texture:** Note the appearance and feel of different rock types
- **Layering Patterns:** Observe how rocks are organized in beds and formations
- **Weathering Patterns:** See how different rocks respond to erosion
- **Structural Features:** Look for folds, faults, and other deformation

### Geological Time Perspective
Understanding the immense time scales involved in creating ${park.name}:

**Deep Time Concepts:**
- **Million-Year Thinking:** Grasping the vast time periods involved in geological processes
- **Rate Perspective:** How incredibly slow processes can create dramatic changes
- **Human Timeline:** Putting geological events in perspective with human history
- **Ongoing Change:** Recognizing that geological processes continue today`;
}

function generateConclusion(park) {
  return `## Earth's Story Continues

The geological wonders of ${park.name} remind us that Earth is a dynamic, ever-changing planet. The spectacular features we see today are neither permanent nor accidental – they're the current chapter in an ongoing story that began billions of years ago and continues every moment.

### Geological Appreciation
Understanding the geology of ${park.name} enhances every aspect of your visit:

**Enhanced Wonder:**
Knowing how features formed increases appreciation for their rarity and beauty.

**Time Perspective:**
Geological time scales put human concerns and activities in broader perspective.

**Process Understanding:**
Recognizing ongoing processes helps visitors see the landscape as dynamic rather than static.

**Conservation Awareness:**
Understanding how long geological features take to form increases commitment to their protection.

### The Bigger Picture
${park.name} is part of Earth's larger geological story:

**Planetary Processes:**
The same forces that shaped this landscape operate globally, connecting local features to worldwide patterns.

**Climate History:**
Geological evidence here contributes to understanding how Earth's climate has changed over time.

**Future Changes:**
Ongoing geological processes ensure that ${park.name} will continue to evolve, though at a pace imperceptible in human lifetimes.

*As you explore ${park.name}, remember that you're walking through deep time, seeing the results of processes that operated for millions of years to create this geological masterpiece. Every rock has a story – and now you have the tools to begin reading those stories for yourself.*`;
}

export default {
  template,
  generateTitle,
  generateDescription,
  generateContent,
  generateTags
}; 