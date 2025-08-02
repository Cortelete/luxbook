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

// New type for different course plans
export type CourseType = 'Lash Profissional' | 'Lash Empreendedora' | 'Lash Empresária VIP';

// Defines the possible roles a user can have.
export type Role = 'admin' | 'student' | 'mentor' | 'boss';

// Represents the data associated with a logged-in user.
export interface UserData {
  name: string;
  roles: Role[]; // A user can have multiple roles
  loginId: string; // The ID used for login (e.g., 'aluna')
  courseType: CourseType; // The course plan the student is enrolled in
}

// Type alias for clarity in components that expect an authenticated user.
export type AuthenticatedUser = UserData;