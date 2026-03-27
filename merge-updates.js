const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
const updateJsPath = path.join(__dirname, 'update-app.js');

try {
    // Read the original app.js
    let content = fs.readFileSync(appJsPath, 'utf8');
    
    // Read the new functions
    const newFunctions = fs.readFileSync(updateJsPath, 'utf8');
    
    // 1. Add getDomesticWHTRate function before queryWithholdingTax
    const insertPoint = '// Query Withholding Tax Rate\nasync function queryWithholdingTax';
    if (content.includes(insertPoint) && !content.includes('function getDomesticWHTRate')) {
        const beforeInsert = content.split(insertPoint)[0];
        const afterInsert = content.split(insertPoint)[1];
        
        // Extract getDomesticWHTRate function from newFunctions
        const getDomesticMatch = newFunctions.match(/\/\/ Get domestic WHT rate[\s\S]*?^}/m);
        if (getDomesticMatch) {
            content = beforeInsert + getDomesticMatch[0] + '\n\n' + insertPoint + afterInsert;
        }
    }
    
    // 2. Update queryWithholdingTax to get domestic rate
    const oldQueryCode = `// Get treaty rate from local database
        const treatyKey = \`\${payerCountry}_\${payeeCountry}_\${paymentType}\`;
        const treatyRate = TAX_DATA.withholding[treatyKey] || getDefaultWHTRate(paymentType);`;
    
    const newQueryCode = `// Get domestic rate (non-treaty rate) from payer country
        const domesticRate = getDomesticWHTRate(payerCountry, paymentType);

        // Get treaty rate from local database
        const treatyKey = \`\${payerCountry}_\${payeeCountry}_\${paymentType}\`;
        const treatyRate = TAX_DATA.withholding[treatyKey] || null;
        const hasTreaty = !!TAX_DATA.withholding[treatyKey];`;
    
    content = content.replace(oldQueryCode, newQueryCode);
    
    // 3. Update displayWithholdingTaxResults call
    const oldCall = `// Display results with cross-verification
        displayWithholdingTaxResults(
            payerName, payerCountry,
            payeeName, payeeCountry,
            paymentType, treatyRate,
            webResults, searchDuration
        );`;
    
    const newCall = `// Display results with cross-verification
        displayWithholdingTaxResults(
            payerName, payerCountry,
            payeeName, payeeCountry,
            paymentType, domesticRate, treatyRate, hasTreaty,
            webResults, searchDuration
        );`;
    
    content = content.replace(oldCall, newCall);
    
    // 4. Replace displayWithholdingTaxResults function
    const oldFunctionMatch = content.match(/\/\/ Display Withholding Tax Results[\s\S]*?^function displayWithholdingTaxResults[\s\S]*?^\}$/m);
    if (oldFunctionMatch) {
        const newFunctionMatch = newFunctions.match(/\/\/ Display Withholding Tax Results with Two Sections[\s\S]*?^\}$/m);
        if (newFunctionMatch) {
            content = content.replace(oldFunctionMatch[0], newFunctionMatch[0]);
        }
    }
    
    // Write the updated content
    fs.writeFileSync(appJsPath, content, 'utf8');
    console.log('app.js updated successfully!');
    
} catch (error) {
    console.error('Error updating app.js:', error.message);
    process.exit(1);
}