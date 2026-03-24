import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import postcss from 'postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folders to search for CSS files
const dirPath = path.join(__dirname, 'src');

function findCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findCssFiles(filePath, fileList);
        } else if (filePath.endsWith('.css')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const plugin = postcss.plugin('remove-animations-hovers', () => {
    return (root) => {
        // Remove keyframes
        root.walkAtRules('keyframes', (rule) => {
            rule.remove();
        });

        // Remove transitions, transforms, animations
        root.walkDecls(/^(transition|animation|transform|animation-)/, (decl) => {
            decl.remove();
        });

        // Process rules for :hover
        root.walkRules((rule) => {
            if (rule.selectors && rule.selectors.some(s => s.includes(':hover'))) {
                const newSelectors = rule.selectors.filter(sel => !sel.includes(':hover'));
                if (newSelectors.length === 0) {
                    rule.remove(); 
                } else {
                    rule.selectors = newSelectors;
                }
            }
        });
    };
});

async function processFiles() {
    const cssFiles = findCssFiles(dirPath);
    console.log(`Found ${cssFiles.length} CSS files.`);

    for (const file of cssFiles) {
        const css = fs.readFileSync(file, 'utf8');
        try {
            const result = await postcss([plugin]).process(css, { from: file, to: file });
            fs.writeFileSync(file, result.css, 'utf8');
            console.log(`Processed: ${file}`);
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
    console.log("Done.");
}

processFiles();
