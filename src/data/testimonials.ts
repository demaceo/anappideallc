// Testimonials are intentionally empty for now.
// The user has not yet collected real client testimonials and the previous
// MHI-era quotes were placeholder/illustrative — not safe to surface as
// real social proof on a live site. Drop real entries into `testimonials`
// once consent + final wording are in hand. While this list is empty,
// no testimonial UI is rendered (see how Work/About/etc. consume it).

export interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  serviceId: 'mvp-development' | 'ui-engineering' | 'business-websites' | 'data-visualization'
}

export const testimonials: Testimonial[] = []
