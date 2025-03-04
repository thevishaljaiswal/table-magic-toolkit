
import { format } from "date-fns";

// Define the data types for our table
export type DataItem = {
  id: string;
  index: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "archived" | "suspended";
  createdAt: Date;
  lastActive: Date;
  revenue: number;
  transactions: number;
  conversionRate: number;
  avgOrderValue: number;
  lifetimeValue: number;
  churnRate: number;
  region: string;
  country: string;
  city: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  sentiment: "positive" | "neutral" | "negative";
  notes: string;
};

// List of possible roles
const roles = [
  "Admin",
  "User",
  "Editor",
  "Viewer",
  "Manager",
  "Contributor",
  "Analyst",
  "Developer",
  "Designer",
  "Support",
];

// List of possible statuses with their probabilities
const statuses: { value: "active" | "pending" | "archived" | "suspended"; probability: number }[] = [
  { value: "active", probability: 0.7 },
  { value: "pending", probability: 0.15 },
  { value: "archived", probability: 0.1 },
  { value: "suspended", probability: 0.05 },
];

// List of possible regions and countries
const regions = [
  {
    name: "North America",
    countries: [
      { name: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"] },
      { name: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"] },
      { name: "Mexico", cities: ["Mexico City", "Guadalajara", "Monterrey", "Puebla", "Tijuana"] },
    ],
  },
  {
    name: "Europe",
    countries: [
      { name: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"] },
      { name: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"] },
      { name: "France", cities: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"] },
    ],
  },
  {
    name: "Asia",
    countries: [
      { name: "Japan", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Sapporo"] },
      { name: "China", cities: ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hong Kong"] },
      { name: "India", cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"] },
    ],
  },
];

// List of possible browsers
const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

// List of possible operating systems
const operatingSystems = ["Windows", "macOS", "Linux", "iOS", "Android"];

// List of possible devices with their probabilities
const devices: { value: "desktop" | "mobile" | "tablet"; probability: number }[] = [
  { value: "desktop", probability: 0.65 },
  { value: "mobile", probability: 0.3 },
  { value: "tablet", probability: 0.05 },
];

// List of possible sentiments with their probabilities
const sentiments: { value: "positive" | "neutral" | "negative"; probability: number }[] = [
  { value: "positive", probability: 0.6 },
  { value: "neutral", probability: 0.3 },
  { value: "negative", probability: 0.1 },
];

// Helper function to randomly select an item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to randomly select an item based on probability weights
function getWeightedRandomItem<T extends { value: any; probability: number }>(items: T[]): T["value"] {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const item of items) {
    cumulativeProbability += item.probability;
    if (random < cumulativeProbability) {
      return item.value;
    }
  }

  return items[0].value; // Fallback
}

// Helper function to generate a random date within a range
function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to generate a random number within a range
function getRandomNumber(min: number, max: number, decimals: number = 0): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

// Helper function to generate a random email
function generateEmail(name: string): string {
  const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "company.com"];
  const domain = getRandomItem(domains);
  // Convert name to lowercase and replace spaces with dots
  const formattedName = name.toLowerCase().replace(/\s+/g, ".");
  return `${formattedName}@${domain}`;
}

// Helper function to generate random notes
function generateNotes(): string {
  const noteSnippets = [
    "Customer requested a follow-up call.",
    "Interested in premium features.",
    "Had technical issues with the app.",
    "Provided positive feedback about the service.",
    "Requested additional documentation.",
    "Encountered problems during onboarding.",
    "Suggested new features for the product.",
    "Complained about pricing.",
    "No special requirements noted.",
    "Cancelled subscription but might return.",
  ];

  // Randomly decide whether to have notes or not
  if (Math.random() > 0.7) {
    return getRandomItem(noteSnippets);
  }
  return "";
}

// Function to generate a list of sample data
export function generateData(count: number = 300): DataItem[] {
  const data: DataItem[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  // First names and last names for generating full names
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
    "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen",
    "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra",
    "Donald", "Ashley", "Steven", "Dorothy", "Paul", "Kimberly", "Andrew", "Emily", "Joshua", "Donna",
    "Kenneth", "Michelle", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa", "Edward", "Deborah",
    "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon", "Jeffrey", "Laura", "Ryan", "Cynthia",
    "Jacob", "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen",
    "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Gregory", "Christine", "Frank", "Debra", "Alexander", "Rachel",
    "Raymond", "Catherine", "Patrick", "Janet", "Jack", "Maria", "Dennis", "Carolyn", "Jerry", "Hannah"
  ];
  
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
    "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
    "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes",
    "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
    "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez"
  ];

  for (let i = 0; i < count; i++) {
    // Generate random name
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    
    // Generate random region, country, and city
    const region = getRandomItem(regions);
    const country = getRandomItem(region.countries);
    const city = getRandomItem(country.cities);
    
    // Generate random dates
    const createdAt = getRandomDate(oneYearAgo, now);
    const lastActive = getRandomDate(createdAt, now);
    
    // Generate random metrics
    const revenue = getRandomNumber(0, 10000, 2);
    const transactions = getRandomNumber(0, 100);
    const conversionRate = getRandomNumber(1, 30, 2);
    const avgOrderValue = revenue / (transactions || 1);
    const lifetimeValue = getRandomNumber(0, 20000, 2);
    const churnRate = getRandomNumber(0, 30, 2);
    
    // Generate other random properties
    const role = getRandomItem(roles);
    const status = getWeightedRandomItem(statuses);
    const device = getWeightedRandomItem(devices);
    const browser = getRandomItem(browsers);
    const os = getRandomItem(operatingSystems);
    const sentiment = getWeightedRandomItem(sentiments);
    const notes = generateNotes();
    
    // Create the data item
    data.push({
      id: `DATA-${i.toString().padStart(5, '0')}`,
      index: i,
      name,
      email: generateEmail(name),
      role,
      status,
      createdAt,
      lastActive,
      revenue,
      transactions,
      conversionRate,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      lifetimeValue,
      churnRate,
      region: region.name,
      country: country.name,
      city,
      device,
      browser,
      os,
      sentiment,
      notes,
    });
  }

  return data;
}

// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format date values
export function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy');
}

// Format percentage values
export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

// Define column visibility options
export type VisibilityState = {
  [key: string]: boolean;
};

// Initial column visibility state - all columns visible by default
export const initialVisibility: VisibilityState = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  lastActive: true,
  revenue: true,
  transactions: true,
  conversionRate: true,
  avgOrderValue: true,
  lifetimeValue: true,
  churnRate: true,
  region: true,
  country: true,
  city: true,
  device: true,
  browser: true,
  os: true,
  sentiment: true,
};

// Export sample data
export const sampleData = generateData(300);
