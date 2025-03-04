
import { faker } from "@faker-js/faker";

// Define the DataItem type for better type checking
export const DataItemSchema = {
  id: "string",
  name: "string",
  email: "string",
  role: "string",
  status: "string",
  createdAt: "Date",
  lastActive: "Date",
  revenue: "number",
  transactions: "number",
  conversionRate: "number",
  avgOrderValue: "number",
  lifetimeValue: "number",
  churnRate: "number",
  region: "string",
  country: "string",
  city: "string",
  device: "string",
  browser: "string",
  os: "string",
  sentiment: "string",
};

// Generate random data for the report
export function generateSampleData(count = 300) {
  return Array.from({ length: count }, (_, i) => ({
    id: `ID-${i + 1}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(["Admin", "User", "Editor", "Viewer", "Manager"]),
    status: faker.helpers.arrayElement(["active", "pending", "archived", "suspended"]),
    createdAt: faker.date.past(),
    lastActive: faker.date.recent(),
    revenue: faker.number.int({ min: 0, max: 50000 }),
    transactions: faker.number.int({ min: 1, max: 100 }),
    conversionRate: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
    avgOrderValue: faker.number.int({ min: 10, max: 500 }),
    lifetimeValue: faker.number.int({ min: 100, max: 10000 }),
    churnRate: faker.number.float({ min: 0, max: 30, precision: 0.1 }),
    region: faker.location.state(),
    country: faker.location.country(),
    city: faker.location.city(),
    device: faker.helpers.arrayElement(["Desktop", "Mobile", "Tablet"]),
    browser: faker.helpers.arrayElement(["Chrome", "Firefox", "Safari", "Edge"]),
    os: faker.helpers.arrayElement(["Windows", "macOS", "iOS", "Android", "Linux"]),
    sentiment: faker.helpers.arrayElement(["positive", "neutral", "negative"]),
  }));
}

// This data will be used in the DataTable component
export const sampleData = generateSampleData();
