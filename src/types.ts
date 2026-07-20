export interface Book {
  id: string;
  title: string;
  retailPrice: number;
  wholesalePrice: number;
  isNew?: boolean;
  /** Tailwind gradient classes used to render the cover in place of a photo */
  coverFrom: string;
  coverTo: string;
  /** Text colour that reads well on the cover gradient */
  textColor: string;
  category: string;
  stock: number;
}

export interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface StationeryItem {
  id: string;
  name: string;
  retailPrice: number;
  wholesalePrice: number;
  stock: number;
  icon: string;
}