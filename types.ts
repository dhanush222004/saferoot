import React from 'react';

export enum UserRole {
  Farmer = 'Farmer',
  AI = 'AI',
  Lab = 'Lab',
  Customer = 'Customer',
  Admin = 'Admin',
  Factory = 'Factory',
}

export interface User {
  id: string;
  role: UserRole;
  password?: string;
  name?: string; // Added for user's full name
}

export interface VerificationResult {
    passed: boolean;
    confidence: number;
    batchId: string;
    herbSpecies: string;
    weight: number;
    details?: string;
}

export interface BatchDetails extends VerificationResult {
    blockchainHash: string;
}

export interface RoleAction {
    name: string;
    path: string;
    implemented: boolean;
    icon?: React.ElementType;
}

export interface BioWasteSubmission {
    type: string;
    quantity: number;
    location: string;
    batchId?: string;
}

export interface ProductJourneyStep {
    name: string;
    date: string;
    location: string;
    details: string;
    icon: React.ElementType;
}

// Added for Search functionality
export interface Product {
    id: string;
    name: string;
    batchId: string;
}

export interface Batch {
    id: string;
    herbSpecies: string;
    status: string;
}

export interface SearchResults {
    users: User[];
    batches: Batch[];
    products: Product[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  image?: string; // Optional base64 data URL for images
}

export enum ZoneType {
  Harvest = 'Harvest',
  Permitted = 'Permitted',
  Restricted = 'Restricted',
}

export interface HarvestZone {
  id: string;
  name: string;
  boundaries: {
    top: string;
    left: string;
    width: string;
    height: string;
    borderRadius?: string;
  };
  allowedHerbs: string[];
  zoneType: ZoneType;
}


export interface MedicinalHerb {
  id: string;
  name: string;
  scientificName: string;
  imageUrl: React.ElementType;
  uses: string[];
  source: string;
  sourceUrl: string;
}

export interface WeatherForecast {
  day: string;
  icon: React.ElementType;
  temp: string;
  precip: string;
}

export interface WeatherAdvisory {
  location: string;
  forecast: WeatherForecast[];
  aiSummary: string;
}

export enum NewsCategory {
  Policy = 'Policy',
  Weather = 'Weather',
  Market = 'Market Update',
  Technology = 'Technology',
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  source: string;
  icon: React.ElementType;
}