declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2025-04-16-ultimate-guide-to-greenbelt-park-washington-dc-maryland-complete-visitor-experience.md": {
	id: "2025-04-16-ultimate-guide-to-greenbelt-park-washington-dc-maryland-complete-visitor-experience.md";
  slug: "2025-04-16-ultimate-guide-to-greenbelt-park-washington-dc-maryland-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-17-embracing-the-wilderness-a-journey-along-north-country-national-scenic-trail.md": {
	id: "2025-04-17-embracing-the-wilderness-a-journey-along-north-country-national-scenic-trail.md";
  slug: "2025-04-17-embracing-the-wilderness-a-journey-along-north-country-national-scenic-trail";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-18-embarking-on-the-wild-frontier-bighorn-canyon-national-recreation-area.md": {
	id: "2025-04-18-embarking-on-the-wild-frontier-bighorn-canyon-national-recreation-area.md";
  slug: "2025-04-18-embarking-on-the-wild-frontier-bighorn-canyon-national-recreation-area";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-19-unveiling-the-layers-of-time-fort-point-national-historic-site.md": {
	id: "2025-04-19-unveiling-the-layers-of-time-fort-point-national-historic-site.md";
  slug: "2025-04-19-unveiling-the-layers-of-time-fort-point-national-historic-site";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-20-discovering-the-hidden-gem-unearthing-the-wonders-of-curecanti-national-recreation-area.md": {
	id: "2025-04-20-discovering-the-hidden-gem-unearthing-the-wonders-of-curecanti-national-recreation-area.md";
  slug: "2025-04-20-discovering-the-hidden-gem-unearthing-the-wonders-of-curecanti-national-recreation-area";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-21-unearthing-history-at-shiloh-national-military-park-journey-beyond-the-battlefield.md": {
	id: "2025-04-21-unearthing-history-at-shiloh-national-military-park-journey-beyond-the-battlefield.md";
  slug: "2025-04-21-unearthing-history-at-shiloh-national-military-park-journey-beyond-the-battlefield";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-22-flight-93-national-memorial-a-testament-to-bravery-and-resilience.md": {
	id: "2025-04-22-flight-93-national-memorial-a-testament-to-bravery-and-resilience.md";
  slug: "2025-04-22-flight-93-national-memorial-a-testament-to-bravery-and-resilience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-23-echoes-from-the-past-a-journey-through-mill-springs-battlefield-national-monument.md": {
	id: "2025-04-23-echoes-from-the-past-a-journey-through-mill-springs-battlefield-national-monument.md";
  slug: "2025-04-23-echoes-from-the-past-a-journey-through-mill-springs-battlefield-national-monument";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-24-a-voyage-into-history-unraveling-the-mysteries-of-hamilton-grange-national-memorial.md": {
	id: "2025-04-24-a-voyage-into-history-unraveling-the-mysteries-of-hamilton-grange-national-memorial.md";
  slug: "2025-04-24-a-voyage-into-history-unraveling-the-mysteries-of-hamilton-grange-national-memorial";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-25-journey-through-time-first-state-national-historical-park.md": {
	id: "2025-04-25-journey-through-time-first-state-national-historical-park.md";
  slug: "2025-04-25-journey-through-time-first-state-national-historical-park";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-26-ultimate-guide-to-eisenhower-national-historic-site-gettysburg-pennsylvania-complete-visitor-experience.md": {
	id: "2025-04-26-ultimate-guide-to-eisenhower-national-historic-site-gettysburg-pennsylvania-complete-visitor-experience.md";
  slug: "2025-04-26-ultimate-guide-to-eisenhower-national-historic-site-gettysburg-pennsylvania-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-27-into-the-wild-fredericksburg-spotsylvania-national-military-park-fredericksburg-virginia.md": {
	id: "2025-04-27-into-the-wild-fredericksburg-spotsylvania-national-military-park-fredericksburg-virginia.md";
  slug: "2025-04-27-into-the-wild-fredericksburg-spotsylvania-national-military-park-fredericksburg-virginia";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-28-cape-hatteras-national-seashore-unveiled-raleigh-north-carolinas-natural-wonder.md": {
	id: "2025-04-28-cape-hatteras-national-seashore-unveiled-raleigh-north-carolinas-natural-wonder.md";
  slug: "2025-04-28-cape-hatteras-national-seashore-unveiled-raleigh-north-carolinas-natural-wonder";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-29-puukohol-heiau-unveiled-kailua-kona-hawaiis-cultural-masterpiece.md": {
	id: "2025-04-29-puukohol-heiau-unveiled-kailua-kona-hawaiis-cultural-masterpiece.md";
  slug: "2025-04-29-puukohol-heiau-unveiled-kailua-kona-hawaiis-cultural-masterpiece";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-30-ultimate-guide-to-reconstruction-era-national-historical-park-beaufort-south-carolina-complete-visitor-experience.md": {
	id: "2025-04-30-ultimate-guide-to-reconstruction-era-national-historical-park-beaufort-south-carolina-complete-visitor-experience.md";
  slug: "2025-04-30-ultimate-guide-to-reconstruction-era-national-historical-park-beaufort-south-carolina-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-04-31-ultimate-guide-to-tuzigoot-national-monument-phoenix-arizona-complete-visitor-experience.md": {
	id: "2025-04-31-ultimate-guide-to-tuzigoot-national-monument-phoenix-arizona-complete-visitor-experience.md";
  slug: "2025-04-31-ultimate-guide-to-tuzigoot-national-monument-phoenix-arizona-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-01-embracing-the-wilderness-a-deep-dive-into-noatak-national-preserve-alaska.md": {
	id: "2025-05-01-embracing-the-wilderness-a-deep-dive-into-noatak-national-preserve-alaska.md";
  slug: "2025-05-01-embracing-the-wilderness-a-deep-dive-into-noatak-national-preserve-alaska";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-02-in-the-footsteps-of-an-artistic-pioneer-exploring-thomas-cole-national-historic-site.md": {
	id: "2025-05-02-in-the-footsteps-of-an-artistic-pioneer-exploring-thomas-cole-national-historic-site.md";
  slug: "2025-05-02-in-the-footsteps-of-an-artistic-pioneer-exploring-thomas-cole-national-historic-site";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-03-unraveling-the-everglades-elegance.md": {
	id: "2025-05-03-unraveling-the-everglades-elegance.md";
  slug: "2025-05-03-unraveling-the-everglades-elegance";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-04-unveiling-bostons-historic-gem.md": {
	id: "2025-05-04-unveiling-bostons-historic-gem.md";
  slug: "2025-05-04-unveiling-bostons-historic-gem";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-05-presidential-pathways-a-deeper-dive-into-the-james-a-garfield-national-historic-site-mentor-ohio.md": {
	id: "2025-05-05-presidential-pathways-a-deeper-dive-into-the-james-a-garfield-national-historic-site-mentor-ohio.md";
  slug: "2025-05-05-presidential-pathways-a-deeper-dive-into-the-james-a-garfield-national-historic-site-mentor-ohio";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-06-discovering-the-dream.md": {
	id: "2025-05-06-discovering-the-dream.md";
  slug: "2025-05-06-discovering-the-dream";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-07-discovering-the-echoes-of-conflict.md": {
	id: "2025-05-07-discovering-the-echoes-of-conflict.md";
  slug: "2025-05-07-discovering-the-echoes-of-conflict";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-08-tonto-national-monument-mastery-phoenix-arizonas-ancient-echoes.md": {
	id: "2025-05-08-tonto-national-monument-mastery-phoenix-arizonas-ancient-echoes.md";
  slug: "2025-05-08-tonto-national-monument-mastery-phoenix-arizonas-ancient-echoes";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-09-majestic-thoroughfare-revealed-baltimore-washington-parkway-marylands-paved-pearl.md": {
	id: "2025-05-09-majestic-thoroughfare-revealed-baltimore-washington-parkway-marylands-paved-pearl.md";
  slug: "2025-05-09-majestic-thoroughfare-revealed-baltimore-washington-parkway-marylands-paved-pearl";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-10-unmasking-ocmulgee-mounds-an-epic-journey-to-macon-georgias-prehistoric-marvel.md": {
	id: "2025-05-10-unmasking-ocmulgee-mounds-an-epic-journey-to-macon-georgias-prehistoric-marvel.md";
  slug: "2025-05-10-unmasking-ocmulgee-mounds-an-epic-journey-to-macon-georgias-prehistoric-marvel";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-11-wildlife-watching-guide-national-parks.md": {
	id: "2025-05-11-wildlife-watching-guide-national-parks.md";
  slug: "2025-05-11-wildlife-watching-guide-national-parks";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-12-wildlife-photography-tips-national-parks.md": {
	id: "2025-05-12-wildlife-photography-tips-national-parks.md";
  slug: "2025-05-12-wildlife-photography-tips-national-parks";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-13-welcome-to-our-national-park-blog.md": {
	id: "2025-05-13-welcome-to-our-national-park-blog.md";
  slug: "2025-05-13-welcome-to-our-national-park-blog";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-14-unraveling-the-charm-of-bountiful-badlands.md": {
	id: "2025-05-14-unraveling-the-charm-of-bountiful-badlands.md";
  slug: "2025-05-14-unraveling-the-charm-of-bountiful-badlands";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-15-roosevelt-campobello-international-park-revelation-lubec-maines-panorama-of-history-and-nature.md": {
	id: "2025-05-15-roosevelt-campobello-international-park-revelation-lubec-maines-panorama-of-history-and-nature.md";
  slug: "2025-05-15-roosevelt-campobello-international-park-revelation-lubec-maines-panorama-of-history-and-nature";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-16-ultimate-guide-to-city-of-rocks-national-reserve-boise-idaho-complete-visitor-experience.md": {
	id: "2025-05-16-ultimate-guide-to-city-of-rocks-national-reserve-boise-idaho-complete-visitor-experience.md";
  slug: "2025-05-16-ultimate-guide-to-city-of-rocks-national-reserve-boise-idaho-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-17-windswept-wonders-the-heritage-trail.md": {
	id: "2025-05-17-windswept-wonders-the-heritage-trail.md";
  slug: "2025-05-17-windswept-wonders-the-heritage-trail";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-18-reliving-the-golden-age-railroads-backbone.md": {
	id: "2025-05-18-reliving-the-golden-age-railroads-backbone.md";
  slug: "2025-05-18-reliving-the-golden-age-railroads-backbone";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-19-cumberland-gap.md": {
	id: "2025-05-19-cumberland-gap.md";
  slug: "2025-05-19-cumberland-gap";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-20-best-national-parks-to-visit-in-spring.md": {
	id: "2025-05-20-best-national-parks-to-visit-in-spring.md";
  slug: "2025-05-20-best-national-parks-to-visit-in-spring";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-21-best-hiking-trails-in-yellowstone.md": {
	id: "2025-05-21-best-hiking-trails-in-yellowstone.md";
  slug: "2025-05-21-best-hiking-trails-in-yellowstone";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-22-ultimate-guide-to-russell-cave-national-monument-huntsville-alabama-complete-visitor-experience.md": {
	id: "2025-05-22-ultimate-guide-to-russell-cave-national-monument-huntsville-alabama-complete-visitor-experience.md";
  slug: "2025-05-22-ultimate-guide-to-russell-cave-national-monument-huntsville-alabama-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-23-unveiling-history-pine-story-time.md": {
	id: "2025-05-23-unveiling-history-pine-story-time.md";
  slug: "2025-05-23-unveiling-history-pine-story-time";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-24-waco-mammoth-national-monument-mastery-waco-texas-insiders-guide.md": {
	id: "2025-05-24-waco-mammoth-national-monument-mastery-waco-texas-insiders-guide.md";
  slug: "2025-05-24-waco-mammoth-national-monument-mastery-waco-texas-insiders-guide";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-25-prince-william-forest-park-unveiled-washington-dc-virginias-natural-wonder.md": {
	id: "2025-05-25-prince-william-forest-park-unveiled-washington-dc-virginias-natural-wonder.md";
  slug: "2025-05-25-prince-william-forest-park-unveiled-washington-dc-virginias-natural-wonder";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-26-journey-to-pullman-national-historical-park-chicago-illinoiss-must-see-destination.md": {
	id: "2025-05-26-journey-to-pullman-national-historical-park-chicago-illinoiss-must-see-destination.md";
  slug: "2025-05-26-journey-to-pullman-national-historical-park-chicago-illinoiss-must-see-destination";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-27-a-journey-through-time-discovering-kaloko-honokhau-national-historical-park.md": {
	id: "2025-05-27-a-journey-through-time-discovering-kaloko-honokhau-national-historical-park.md";
  slug: "2025-05-27-a-journey-through-time-discovering-kaloko-honokhau-national-historical-park";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-28-ultimate-guide-to-capitol-hill-parks-washington-district-of-columbia-complete-visitor-experience.md": {
	id: "2025-05-28-ultimate-guide-to-capitol-hill-parks-washington-district-of-columbia-complete-visitor-experience.md";
  slug: "2025-05-28-ultimate-guide-to-capitol-hill-parks-washington-district-of-columbia-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-29-ultimate-guide-to-cedar-creek-belle-grove-national-historical-park-winchester-virginia-complete-visitor-experience.md": {
	id: "2025-05-29-ultimate-guide-to-cedar-creek-belle-grove-national-historical-park-winchester-virginia-complete-visitor-experience.md";
  slug: "2025-05-29-ultimate-guide-to-cedar-creek-belle-grove-national-historical-park-winchester-virginia-complete-visitor-experience";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-30-journey-to-yorktown-battlefield-part-of-colonial-national-historical-park-williamsburg-virginias-must-see-destination.md": {
	id: "2025-05-30-journey-to-yorktown-battlefield-part-of-colonial-national-historical-park-williamsburg-virginias-must-see-destination.md";
  slug: "2025-05-30-journey-to-yorktown-battlefield-part-of-colonial-national-historical-park-williamsburg-virginias-must-see-destination";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-05-31-boston-national-historical-park-unveiled-boston-massachusettss-natural-wonder.md": {
	id: "2025-05-31-boston-national-historical-park-unveiled-boston-massachusettss-natural-wonder.md";
  slug: "2025-05-31-boston-national-historical-park-unveiled-boston-massachusettss-natural-wonder";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-01-introduction-saguaros-sanctuary.md": {
	id: "2025-06-01-introduction-saguaros-sanctuary.md";
  slug: "2025-06-01-introduction-saguaros-sanctuary";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-02-introduction-discovering-the-essence-of-time.md": {
	id: "2025-06-02-introduction-discovering-the-essence-of-time.md";
  slug: "2025-06-02-introduction-discovering-the-essence-of-time";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-03-introduction-discovering-el-morro.md": {
	id: "2025-06-03-introduction-discovering-el-morro.md";
  slug: "2025-06-03-introduction-discovering-el-morro";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-04-ageless-frost-a-timeless-heritage.md": {
	id: "2025-06-04-ageless-frost-a-timeless-heritage.md";
  slug: "2025-06-04-ageless-frost-a-timeless-heritage";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-05-yellowstone-national-park-mastery-bozeman-idaho-montana-wyoming-insiders-guide.md": {
	id: "2025-06-05-yellowstone-national-park-mastery-bozeman-idaho-montana-wyoming-insiders-guide.md";
  slug: "2025-06-05-yellowstone-national-park-mastery-bozeman-idaho-montana-wyoming-insiders-guide";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-06-the-presidents-palette-vibrant-history.md": {
	id: "2025-06-06-the-presidents-palette-vibrant-history.md";
  slug: "2025-06-06-the-presidents-palette-vibrant-history";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-07-echoes-from-the-past-untold-stories.md": {
	id: "2025-06-07-echoes-from-the-past-untold-stories.md";
  slug: "2025-06-07-echoes-from-the-past-untold-stories";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-08-embracing-wilderness-at-its-best.md": {
	id: "2025-06-08-embracing-wilderness-at-its-best.md";
  slug: "2025-06-08-embracing-wilderness-at-its-best";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-09-fort-matanzas-national-monument-unleashed-st-augustine-floridas-historic-retinue.md": {
	id: "2025-06-09-fort-matanzas-national-monument-unleashed-st-augustine-floridas-historic-retinue.md";
  slug: "2025-06-09-fort-matanzas-national-monument-unleashed-st-augustine-floridas-historic-retinue";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-10-content.md": {
	id: "2025-06-10-content.md";
  slug: "2025-06-10-content";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-11-a-walk-through-history-pea-ridge-uncovered.md": {
	id: "2025-06-11-a-walk-through-history-pea-ridge-uncovered.md";
  slug: "2025-06-11-a-walk-through-history-pea-ridge-uncovered";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-12-harmony-in-the-heartland-a-jazz-aficionados-guide-to-new-orleans-jazz-national-historical-park-louisiana.md": {
	id: "2025-06-12-harmony-in-the-heartland-a-jazz-aficionados-guide-to-new-orleans-jazz-national-historical-park-louisiana.md";
  slug: "2025-06-12-harmony-in-the-heartland-a-jazz-aficionados-guide-to-new-orleans-jazz-national-historical-park-louisiana";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-13-minuteman-missile-mystique-a-deep-dive-into-rapid-city-south-dakotas-cold-war-relic.md": {
	id: "2025-06-13-minuteman-missile-mystique-a-deep-dive-into-rapid-city-south-dakotas-cold-war-relic.md";
  slug: "2025-06-13-minuteman-missile-mystique-a-deep-dive-into-rapid-city-south-dakotas-cold-war-relic";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-14-ellis-island-epoch-the-heart-of-new-york-new-jerseys-immigrant-story.md": {
	id: "2025-06-14-ellis-island-epoch-the-heart-of-new-york-new-jerseys-immigrant-story.md";
  slug: "2025-06-14-ellis-island-epoch-the-heart-of-new-york-new-jerseys-immigrant-story";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-15-unveiling-the-heroic-past-charles-young-buffalo-soldiers-national-monument-a-hidden-gem-in-dayton-ohio.md": {
	id: "2025-06-15-unveiling-the-heroic-past-charles-young-buffalo-soldiers-national-monument-a-hidden-gem-in-dayton-ohio.md";
  slug: "2025-06-15-unveiling-the-heroic-past-charles-young-buffalo-soldiers-national-monument-a-hidden-gem-in-dayton-ohio";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-16-discovering-the-intertwined-nodes-of-history.md": {
	id: "2025-06-16-discovering-the-intertwined-nodes-of-history.md";
  slug: "2025-06-16-discovering-the-intertwined-nodes-of-history";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-17-first-ladies-national-historic-site-explored-a-canton-ohio-cultural-gem.md": {
	id: "2025-06-17-first-ladies-national-historic-site-explored-a-canton-ohio-cultural-gem.md";
  slug: "2025-06-17-first-ladies-national-historic-site-explored-a-canton-ohio-cultural-gem";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2025-06-18-echoes-of-the-past-a-journey-through-petroglyph-national-monument.md": {
	id: "2025-06-18-echoes-of-the-past-a-journey-through-petroglyph-national-monument.md";
  slug: "2025-06-18-echoes-of-the-past-a-journey-through-petroglyph-national-monument";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
