/**
 * Who made the course. Shown on the landing page and in structured data.
 *
 * Add a square photo at public/author.jpg and set `photo` to '/author.jpg'.
 * Links are optional: any left empty aren't shown.
 */
export const AUTHOR = {
  name: 'Musab Saraswat',
  photo: null as string | null,
  links: {
    linkedin: '',
    youtube: '',
    github: '',
  },
};

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
