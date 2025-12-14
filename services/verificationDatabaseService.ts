
import { UserRole } from '../types';

export interface DatabaseCheckResult {
  name: string;
  verified: boolean;
  details: string;
  timestamp: string;
}

export interface ComprehensiveVerificationResult {
  isEligible: boolean;
  checks: DatabaseCheckResult[];
}

// 1. Government ID Database Mock
// Simulates checking a national identity database (e.g., Aadhar, SSN)
const checkGovernmentIdDatabase = async (govId: string): Promise<DatabaseCheckResult> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency
    
    // Mock logic: IDs ending in '000' are invalid/fake
    const isValid = !govId.endsWith('000');
    
    return {
        name: 'Government ID Database',
        verified: isValid,
        details: isValid ? 'Identity confirmed. Citizen record found.' : 'Record not found or ID suspended.',
        timestamp: new Date().toISOString()
    };
};

// 2. Land/GIS Records Mock
// Simulates checking geospatial land ownership records
const checkLandGisRecords = async (govId: string): Promise<DatabaseCheckResult> => {
    await new Promise(resolve => setTimeout(resolve, 1200)); 
    
    // Mock logic: Randomly assign acreage for valid IDs
    const acres = Math.floor(Math.random() * 10) + 1;
    
    return {
        name: 'Land/GIS Records',
        verified: true,
        details: `Verified ownership of ${acres}.5 acres. Geo-fencing active.`,
        timestamp: new Date().toISOString()
    };
};

// 3. Cooperative Database Mock
// Simulates checking local farming cooperative membership
const checkCooperativeDb = async (govId: string): Promise<DatabaseCheckResult> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
        name: 'Cooperative DB',
        verified: true,
        details: 'Active member of "Green Earth Farmers Co-op".',
        timestamp: new Date().toISOString()
    };
};

// 4. Association Database Mock
// Simulates checking national or regional herbal associations
const checkAssociationDb = async (govId: string): Promise<DatabaseCheckResult> => {
    await new Promise(resolve => setTimeout(resolve, 900));
    
    return {
        name: 'Association DB',
        verified: true,
        details: 'Registered with "National Medicinal Plants Board".',
        timestamp: new Date().toISOString()
    };
};

/**
 * Orchestrates the verification process across all 4 databases.
 */
export const verifyFarmerCredentials = async (
    govId: string, 
    onStepComplete: (result: DatabaseCheckResult) => void
): Promise<boolean> => {
    
    // 1. Check Government ID
    const govResult = await checkGovernmentIdDatabase(govId);
    onStepComplete(govResult);
    if (!govResult.verified) return false; // Fail fast if identity is invalid

    // 2. Check Land Records
    const landResult = await checkLandGisRecords(govId);
    onStepComplete(landResult);

    // 3. Check Cooperative DB
    const coopResult = await checkCooperativeDb(govId);
    onStepComplete(coopResult);

    // 4. Check Association DB
    const assocResult = await checkAssociationDb(govId);
    onStepComplete(assocResult);

    return true;
};
