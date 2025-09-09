/**
 * Sample API Payloads for Purchase and Project Requests
 * 
 * This file provides example payloads for both request types that can be used
 * as a reference for API implementations or testing.
 */

// Purchase Request Payload
export const purchaseRequestPayload = {
  type: "purchase",
  title: "New MacBook Pro for Development Team",
  description: "Urgent requirement for M3 MacBook Pro to replace aging development machine",
  category: "IT Equipment",
  desiredCost: 2499,
  currency: "USD",
  neededByDate: "2024-07-15T00:00:00.000Z",
  items: [
    { 
      name: "MacBook Pro M3", 
      quantity: 1, 
      unitPrice: 2499, 
      total: 2499,
      vendorHint: "Apple Store"
    }
  ],
  // Optional quote uploads - would typically be sent as form data
  quotes: []
};

// Project Request Payload
export const projectRequestPayload = {
  type: "project",
  title: "Website Redesign Project",
  description: "Complete redesign of company website with improved UX/UI",
  category: "Digital Transformation",
  desiredCost: 15000,
  currency: "USD",
  neededByDate: "2024-09-30T00:00:00.000Z",
  // Project-specific fields
  clientName: "Internal Marketing Team",
  projectDescription: "Redesign company website with focus on improved user experience, mobile responsiveness, and conversion rate optimization.",
  totalCost: 12000,
  totalBenefit: 25000, 
  totalPrice: 15000,
  // Items are optional for projects
  items: [], 
  quotes: []
};

// API Response Example
export const apiResponseExample = {
  success: true,
  message: "Request created successfully",
  data: {
    id: "PR-2024-005", // For purchase request
    // Or "PROJ-2024-002" for project request
    requesterId: "user-123",
    state: "SUBMITTED",
    createdAt: "2024-06-15T10:30:45.123Z",
    currentApproverId: "manager-456",
    // All fields from the request would be included here as well
  }
};