# National Park Directory - Sitemap Integration Issue Resolution

## Background and Motivation
The project is experiencing a critical integrated issue where fixing the sitemap breaks the live site and vice versa. This creates a continuous loop of fixes that destabilize each other. The root cause appears to be a complex interaction between Astro's build process, the sitemap generation plugin, and Netlify's deployment pipeline.

## Key Challenges and Analysis

### Current Configuration Analysis
1. **Astro Setup**
   - Using @astrojs/sitemap integration
   - Site URL configured correctly as 'https://nationalparkdirectory.com'
   - Basic sitemap configuration present with changefreq and priority
   - Filter configured to exclude 404 pages

2. **Netlify Setup**
   - Custom build command using `build-with-rollup-fix.sh`
   - Publishing from `dist` directory
   - Multiple header rules for caching
   - Complex redirect rules for blog images
   - Debug plugin present for blog content issues

### Identified Risk Areas
1. **Build Process Timing**
   - Sitemap generation may occur at wrong phase of build process
   - Potential race conditions between static file generation and sitemap creation
   - Custom build script may affect normal Astro build flow

2. **File Output Location**
   - Uncertainty about whether sitemap.xml is properly included in dist/ folder
   - Possible conflicts between static file handling and dynamic routes

3. **Netlify Configuration**
   - Multiple redirects and header rules may interfere with sitemap serving
   - Cache control headers might affect sitemap availability
   - Debug plugin could potentially interfere with normal build flow

## High-level Task Breakdown

### Phase 1: Investigation and Diagnosis
1. **Build Output Analysis**
   - [ ] Examine local build output structure
   - [ ] Verify sitemap.xml generation timing and location
   - [ ] Check for any build warnings or errors related to static file generation
   - Success Criteria: Clear understanding of where and when sitemap.xml is generated

2. **Configuration Audit**
   - [ ] Review all Astro config options affecting static file generation
   - [ ] Audit Netlify configuration for potential conflicts
   - [ ] Examine build script for potential interference with sitemap generation
   - Success Criteria: Complete map of all configuration points affecting sitemap

3. **Deployment Process Analysis**
   - [ ] Monitor complete build and deploy process
   - [ ] Track sitemap.xml through entire pipeline
   - [ ] Identify exact point where site/sitemap conflict occurs
   - Success Criteria: Clear identification of conflict point in pipeline

### Phase 2: Implementation
1. **Build Process Optimization**
   - [ ] Modify build script to ensure proper phase ordering
   - [ ] Add explicit sitemap generation step if needed
   - [ ] Verify static file handling in build pipeline
   - Success Criteria: Stable build process with predictable output

2. **Configuration Updates**
   - [ ] Update Astro sitemap configuration based on findings
   - [ ] Adjust Netlify configuration to properly handle sitemap
   - [ ] Modify header/redirect rules if necessary
   - Success Criteria: Clean configuration without conflicting rules

3. **Deployment Pipeline Adjustment**
   - [ ] Implement any necessary build phase changes
   - [ ] Add verification steps for sitemap presence
   - [ ] Update deployment process if needed
   - Success Criteria: Reliable deployment with both site and sitemap working

### Phase 3: Verification and Stabilization
1. **Testing Protocol**
   - [ ] Test local build process
   - [ ] Verify preview deployment
   - [ ] Confirm production deployment
   - Success Criteria: All environments working correctly

2. **Monitoring Implementation**
   - [ ] Add build-time checks for sitemap
   - [ ] Implement deployment verification
   - [ ] Create monitoring for sitemap availability
   - Success Criteria: Automated verification system in place

3. **Documentation and Prevention**
   - [ ] Document final working configuration
   - [ ] Create troubleshooting guide
   - [ ] Add configuration validation checks
   - Success Criteria: Complete documentation and prevention measures

## Project Status Board
- 🟢 Phase 1: Done
- 🟢 Phase 2: Done
- 🟡 Phase 3: In Progress

## Executor's Feedback or Assistance Requests
- Phase 1 (Google Maps): Issue was .env file encoding (UTF-16 LE). Solution: convert to UTF-8. Map now works and API key is read. Proceeding to Phase 2 (Hero Image System).
- Phase 2 (Hero Image): Centralized hero image config and reusable component implemented for all main pages. Proceeding to Phase 3 (SEO Enhancement).

## Lessons
1. Integrated issues require holistic solutions - fixing individual symptoms leads to regression cycles
2. Build pipeline order and timing is critical for static file generation
3. Configuration conflicts can create subtle deployment issues
4. Proper monitoring and verification steps are essential for stability

# National Park Directory - Core Feature Enhancements

## Background and Motivation
The project requires three major enhancements to improve functionality and SEO:
1. Google Maps integration for park pages
2. Unified hero image system across main pages
3. Comprehensive SEO metadata and schema implementation

These changes will improve user experience, maintainability, and search engine visibility.

## Key Challenges and Analysis

### 1. Google Maps Integration
- No existing API key configuration
- Need for graceful fallback handling
- Dynamic loading requirements
- Security considerations for API key storage

### 2. Hero Image System
- Multiple pages requiring consistent design
- Need for centralized configuration
- Potential impact on build system
- Maintainability requirements

### 3. SEO Implementation
- Dynamic metadata generation
- Schema.org integration
- Multiple page types to handle
- Integration with existing Airtable data

## High-level Task Breakdown

### Phase 1: Google Maps Integration
1. **Environment Setup**
   - [ ] Create .env file structure
   - [ ] Add GOOGLE_MAPS_API_KEY configuration
   - [ ] Update documentation for API key requirement
   - Success Criteria: Environment configuration working locally and in production

2. **Maps Component Development**
   - [ ] Create reusable Google Maps component
   - [ ] Implement coordinate-based rendering
   - [ ] Add city/state fallback logic
   - [ ] Add error handling and loading states
   - Success Criteria: Maps component working with both coordinate and address data

3. **Integration Testing**
   - [ ] Test with valid API key
   - [ ] Test fallback scenarios
   - [ ] Verify error handling
   - Success Criteria: Maps working correctly in all scenarios

### Phase 2: Hero Image System
1. **Component Architecture**
   - [ ] Create shared hero component
   - [ ] Implement configuration system
   - [ ] Add image optimization handling
   - Success Criteria: Reusable hero component with configurable image

2. **Page Integration**
   - [ ] Implement on homepage
   - [ ] Add to about, contact, FAQ, and blog pages
   - [ ] Test responsive behavior
   - Success Criteria: Consistent hero sections across all main pages

### Phase 3: SEO Enhancement
1. **Metadata System**
   - [ ] Create dynamic meta tag generation
   - [ ] Implement Open Graph tags
   - [ ] Add Twitter card support
   - Success Criteria: Complete meta tag coverage for all pages

2. **Schema Implementation**
   - [ ] Create JSON-LD generator for parks
   - [ ] Implement schema.org/NationalPark markup
   - [ ] Add default schemas for other pages
   - Success Criteria: Valid schema markup for all page types

3. **Testing and Verification**
   - [ ] Validate metadata generation
   - [ ] Test schema markup
   - [ ] Verify social media previews
   - Success Criteria: All SEO elements validated and working

## Project Status Board
- 🟢 Phase 1: Done
- 🟢 Phase 2: Done
- 🟡 Phase 3: In Progress

## Executor's Feedback or Assistance Requests
*No feedback yet - awaiting initial implementation phase*

## Lessons
1. Include info useful for debugging in the program output
2. Read files before editing
3. Run npm audit if vulnerabilities appear
4. Ask before using git -force
5. Maintain secure API key handling
6. Ensure graceful degradation for all features
7. Keep configuration centralized for maintainability 