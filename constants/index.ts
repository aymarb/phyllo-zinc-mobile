import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Guideline sizes based on standard mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Responsive scaling functions
export const scale = (size: number) => (width / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Screen dimensions
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Common spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Font sizes
export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 32,
  hero: 40,
};

// Font weights
export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Border radius
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// Shadow styles
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Safe area
export const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;
export const BOTTOM_TAB_HEIGHT = 60;

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Team members data
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Moh Sofi'ul Anam",
    role: "Supervisor Lecturer",
    image: "paksofi.png",
    major: ["Faculty of Animal Science"],
    isSupervisor: true,
  },
  {
    id: 2,
    name: "Catherine Noor",
    role: "Lead",
    image: "catherine.jpg",
    major: ["Animal Science"],
  },
  {
    id: 3,
    name: "Zahwa T. A. Zahra",
    role: "Member",
    image: "zahwa.jpg",
    major: ["Biology"],
  },
  {
    id: 4,
    name: "Jesslyn Beatrice",
    role: "Member",
    image: "jesslyn.jpg",
    major: ["Animal Science"],
  },
  {
    id: 5,
    name: "Rona Ayyu Happyna",
    role: "Member",
    image: "rona.jpg",
    major: ["Veterinary"],
  },
  {
    id: 6,
    name: "Ahmad Rizal R. D.",
    role: "Member",
    image: "rizal.jpg",
    major: ["Animal Science"],
  },
];

// Methodology steps
export const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "Plant Material Preparation",
    description:
      "Phyllanthus niruri leaves are collected, washed, and dried under controlled conditions to preserve bioactive compounds.",
  },
  {
    step: "02",
    title: "Extract Preparation",
    description:
      "Leaf extract is prepared through aqueous extraction, concentrating the phytochemicals responsible for nanoparticle synthesis.",
  },
  {
    step: "03",
    title: "Nanoparticle Synthesis",
    description:
      "Zinc salt solution is mixed with plant extract, initiating the green synthesis process at ambient temperature and pressure.",
  },
  {
    step: "04",
    title: "Characterization",
    description:
      "Synthesized ZnO nanoparticles are characterized using UV-Vis, XRD, SEM, and other analytical techniques to confirm properties.",
  },
  {
    step: "05",
    title: "Feed Additive Formulation",
    description:
      "Nanoparticles are formulated into stable feed additives suitable for ruminant dietary supplementation.",
  },
];

// Benefits data
export const BENEFITS = [
  {
    title: "Environmental Impact",
    points: [
      "Reduces methane emissions from ruminants",
      "Decreases greenhouse gas footprint",
      "Supports climate change mitigation",
    ],
  },
  {
    title: "Sustainability",
    points: [
      "Uses renewable plant-based materials",
      "Eliminates toxic chemical byproducts",
      "Biodegradable and eco-friendly",
    ],
  },
  {
    title: "Economic Viability",
    points: [
      "Cost-effective synthesis process",
      "Utilizes abundant plant resources",
      "Scalable production methodology",
    ],
  },
  {
    title: "Animal Health",
    points: [
      "Improves ruminant digestive efficiency",
      "Enhances nutrient bioavailability",
      "Supports overall livestock wellness",
    ],
  },
];

// Virtual Lab scenes
export const VIRTUAL_LAB_SCENES = [
  { 
    name: "Contaminated Farm", 
    title: "Contaminated Farm",
    icon: "warning-outline",
    description: "Observe the effects of heavy metal contamination on agricultural soil and crops." 
  },
  { 
    name: "Zinc Application", 
    title: "Zinc Application",
    icon: "flask-outline",
    description: "Learn about different methods of applying zinc to contaminated soils." 
  },
  { 
    name: "Cellular Absorption", 
    title: "Cellular Absorption",
    icon: "cellular-outline",
    description: "Understand how zinc is absorbed at the cellular level in plants." 
  },
  { 
    name: "Metal Competition", 
    title: "Metal Competition",
    icon: "swap-horizontal-outline",
    description: "Discover how zinc competes with heavy metals for absorption sites." 
  },
  { 
    name: "Healthy Growth", 
    title: "Healthy Growth",
    icon: "leaf-outline",
    description: "See the positive effects of zinc treatment on plant health and growth." 
  },
  { 
    name: "Harvest Results", 
    title: "Harvest Results",
    icon: "nutrition-outline",
    description: "Analyze the quality and safety of crops after zinc treatment." 
  },
  { 
    name: "Research Impact", 
    title: "Research Impact",
    icon: "globe-outline",
    description: "Explore the global impact of this research on agriculture." 
  },
];
