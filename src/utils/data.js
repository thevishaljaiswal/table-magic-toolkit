
import { faker } from "@faker-js/faker";

// Utility functions for formatting data
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercent = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

// Function to generate a single data item
export const createDataItem = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });

  return {
    id: faker.string.uuid(),
    name: `${firstName} ${lastName}`,
    email: email,
    role: faker.helpers.arrayElement(["admin", "editor", "viewer"]),
    status: faker.helpers.arrayElement(["active", "pending", "archived", "suspended"]),
    createdAt: faker.date.past(),
    lastActive: faker.date.recent(),
    revenue: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    transactions: faker.number.int({ min: 0, max: 100 }),
    conversionRate: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    avgOrderValue: faker.number.float({ min: 0, max: 500, precision: 0.01 }),
    lifetimeValue: faker.number.float({ min: 0, max: 50000, precision: 0.01 }),
    churnRate: faker.number.float({ min: 0, max: 100, precision: 0.01 }),
    region: faker.location.country(),
    country: faker.location.country(),
    city: faker.location.city(),
    device: faker.helpers.arrayElement(["desktop", "mobile", "tablet"]),
    browser: faker.helpers.arrayElement(["chrome", "firefox", "safari", "edge"]),
    os: faker.helpers.arrayElement(["windows", "macOS", "linux", "iOS", "android"]),
    sentiment: faker.helpers.arrayElement(["positive", "neutral", "negative"]),
  };
};

// Function to generate multiple data items
export const createDataItems = (count) => {
  return Array.from({ length: count }, () => createDataItem());
};
