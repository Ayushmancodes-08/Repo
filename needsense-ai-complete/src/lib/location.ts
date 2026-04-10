/**
 * DigiPin - Digital Postal Index Number (India)
 * An offline, grid-based addressing system developed by IIT Hyderabad.
 * This implementation simulates the logic for municipal precision.
 */

const CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Base 32 excluding 0, 1, I, O

/**
 * Maps geographical coordinates to a 10-character DigiPin
 */
export function generateDigiPin(lat: number, lng: number): string {
  // Determine Region (India Context)
  let region = "1"; // Default Northern
  
  if (lat < 15) region = "6"; // Southern (TN, KL)
  else if (lat < 19 && lng > 75) region = "5"; // Central South (AP, KA)
  else if (lat < 21 && lng < 75) region = "2"; // Western (GJ, MH)
  else if (lng > 85) region = "7"; // Eastern (WB, OD)
  else if (lat > 25 && lng > 88) region = "8"; // North East
  else if (lat > 25) region = "1"; // North
  else region = "3"; // Central (UP, MP)

  // Encoding logic (Simulating hierarchical grid partitioning)
  let code = region;
  
  // Use lat/lng fractional parts to generate deterministic characters
  let seedLat = (lat + 90) / 180;
  let seedLng = (lng + 180) / 360;

  for (let i = 0; i < 9; i++) {
    // Alternate partitioning
    if (i % 2 === 0) {
      const idx = Math.floor(seedLat * 32);
      code += CHARS[idx % 32];
      seedLat = (seedLat * 32) % 1;
    } else {
      const idx = Math.floor(seedLng * 32);
      code += CHARS[idx % 32];
      seedLng = (seedLng * 32) % 1;
    }
    
    // Add hyphens for readability at specific positions
    if (i === 3 || i === 7) code += "-";
  }

  return code;
}

/**
 * Validates a DigiPin format
 */
export function isValidDigiPin(pin: string): boolean {
  const cleanPin = pin.replace(/-/g, "");
  return cleanPin.length === 10 && /^[1-8][2-9ABCDEFGHJKLMNPQRSTUVWXYZ]{9}$/.test(cleanPin);
}
