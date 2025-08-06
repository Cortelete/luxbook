// UI & Content Types
export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ImageCarouselData {
  caption: string;
  images: string[];
}

export interface TipCategoryData {
  icon: 'MegaphoneIcon' | 'HeartIcon' | 'BriefcaseIcon' | 'CurrencyDollarIcon';
  title: string;
  summary: string;
  tips: string[];
}

export type ContentItemType = 
  'paragraph' | 
  'list' | 
  'table' | 
  'subtitle' | 
  'image_carousel' |
  'note' | 
  'checklist' | 
  'subsection_title' | 
  'contact_details' |
  'tip_category' |
  'course_offer' |
  'final_quote';

export interface ContentItem {
  type: ContentItemType;
  content: string | string[] | TableData | ImageCarouselData | TipCategoryData;
  level?: number;
  id?: string; // Added to uniquely identify subsections for deep linking
}

export interface CourseSection {
  id: string;
  title: string;
  brief: string;
  content: ContentItem[];
}

// User & Auth Types
export type CourseType = 'Lash Profissional' | 'Lash Empreendedora' | 'Lash Empresária VIP';

export type Role = 'admin' | 'student' | 'mentor' | 'boss';

export interface UserData {
  id: string; // A unique ID for the user
  name: string;
  email: string; // The user's unique email for contact/display
  roles: Role[]; // A user can have multiple roles
  courseType: CourseType; // The course plan the student is enrolled in
}