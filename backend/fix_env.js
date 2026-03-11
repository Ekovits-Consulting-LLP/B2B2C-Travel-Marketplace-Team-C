const fs = require('fs');
const content = `DB_USER=postgres
DB_HOST=localhost
DB_NAME=travelhub_db
DB_PASSWORD=admin123
DB_PORT=5432
`;
fs.writeFileSync('backend/.env', content, 'utf8');
console.log('.env file written successfully with UTF-8 encoding (no BOM).');
