const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '../src');
const APP_DIR = path.join(SRC_DIR, 'app');

function getAllFiles(dir, extns) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            files = files.concat(getAllFiles(fullPath, extns));
        } else if (extns.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
        }
    }
    return files;
}

function extractLinks(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = [];
    const regex = /href=(["'])(.*?)\1/g; // Basic regex for static strings
    // Note: This misses dynamic template literals like `href={`/courses/${id}`}` but good enough for static check
    let match;
    while ((match = regex.exec(content)) !== null) {
        links.push({ url: match[2], line: 0 }); // Todo: add line number logic if needed
    }
    return links;
}

function checkLink(url) {
    if (!url.startsWith('/')) return 'external/ignored'; // Ignore external or relative
    if (url === '/') return 'ok'; // Root exists

    // Normalize URL: remove query params
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('/').filter(Boolean);

    // Check file existence
    // 1. Exact match: /dashboard -> src/app/dashboard/page.tsx
    let currentPath = APP_DIR;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Check exact directory
        const directPath = path.join(currentPath, part);

        // Check for dynamic directory [id]
        if (fs.existsSync(currentPath)) {
            const children = fs.readdirSync(currentPath);
            const dynamicDir = children.find(c => c.startsWith('[') && c.endsWith(']'));

            if (fs.existsSync(directPath) && fs.statSync(directPath).isDirectory()) {
                currentPath = directPath;
            } else if (dynamicDir) {
                currentPath = path.join(currentPath, dynamicDir);
            } else {
                return 'broken';
            }
        } else {
            return 'broken';
        }
    }

    // After traversing, check if there's a page.tsx in the final directory
    if (fs.existsSync(path.join(currentPath, 'page.tsx'))) {
        return 'ok';
    }

    return 'broken';
}

console.log('Starting Link Audit...');
const files = getAllFiles(SRC_DIR, ['.tsx', '.ts', '.js']);
let errors = 0;

files.forEach(file => {
    const links = extractLinks(file);
    links.forEach(link => {
        if (link.url.startsWith('/')) {
            const status = checkLink(link.url);
            if (status === 'broken') {
                console.error(`❌ Broken Link: ${link.url} in ${path.relative(process.cwd(), file)}`);
                errors++;
            }
        }
    });
});

if (errors === 0) {
    console.log('✅ Zero broken links found.');
} else {
    console.log(`FOUND ${errors} BROKEN LINKS.`);
    process.exit(1);
}
