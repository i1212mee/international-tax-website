// This script cleans up the app.js file by removing duplicate function definitions

const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
let content = fs.readFileSync(appJsPath, 'utf8');

// Count occurrences of function definitions
const functionPatterns = [
    /function getDomesticWHTRate/g,
    /function displayWithholdingTaxResults/g
];

console.log('Before cleanup:');
functionPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    console.log(`  ${pattern.toString()}: ${matches ? matches.length : 0} occurrences`);
});

// Remove duplicate getDomesticWHTRate functions (keep only one at the end)
// Find all getDomesticWHTRate function definitions and remove duplicates

// Strategy: Keep only the last occurrence of getDomesticWHTRate
const getDomesticWHTRatePattern = /\/\/ Get domestic WHT rate[^\n]*\nfunction getDomesticWHTRate\([^}]+\{[^}]*\}[^}]*\}[^}]*\}/g;
const matches = content.match(getDomesticWHTRatePattern);

if (matches && matches.length > 1) {
    console.log(`Found ${matches.length} getDomesticWHTRate functions, keeping only one`);
    
    // Remove all but the last match
    let firstMatch = true;
    content = content.replace(getDomesticWHTRatePattern, (match) => {
        if (firstMatch) {
            firstMatch = false;
            return match;
        }
        return '';
    });
}

// Remove duplicate displayWithholdingTaxResults functions
const displayWHTPattern = /\/\/ Display Withholding Tax Results[^\n]*\nfunction displayWithholdingTaxResults\([^)]+\)\s*\{[\s\S]*?^}\n(?=function|\n\/\/|$)/gm;
const displayMatches = content.match(displayWHTPattern);

if (displayMatches && displayMatches.length > 1) {
    console.log(`Found ${displayMatches.length} displayWithholdingTaxResults functions, keeping only one`);
    
    let firstMatch = true;
    content = content.replace(displayWHTPattern, (match) => {
        if (firstMatch) {
            firstMatch = false;
            return match;
        }
        return '';
    });
}

// Fix broken async function (line 996: "async" alone)
content = content.replace(/\/\/ Query Withholding Tax Rate\s*\nasync\s*\n\/\/ Get domestic WHT rate/g, '// Query Withholding Tax Rate\n\n// Get domestic WHT rate');

// Write cleaned content
fs.writeFileSync(appJsPath, content, 'utf8');

console.log('After cleanup:');
functionPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    console.log(`  ${pattern.toString()}: ${matches ? matches.length : 0} occurrences`);
});

console.log('Cleanup complete!');