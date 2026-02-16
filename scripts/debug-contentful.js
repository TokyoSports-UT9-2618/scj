
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const contentful = require('contentful-management');

const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const spaceId = process.env.CONTENTFUL_SPACE_ID;

console.log(`🔍 Debugging Contentful Connection (v2)...`);
console.log(`Token: ${token ? token.substring(0, 10) + '...' : 'Not found'}`);
console.log(`Target Space ID: ${spaceId}`);

if (!token) {
    console.error('❌ Token not found in .env.local');
    process.exit(1);
}

const client = contentful.createClient({ accessToken: token });

async function debug() {
    try {
        console.log('\n--- 1. User Info ---');
        try {
            const user = await client.getCurrentUser();
            console.log(`✅ Authenticated as: ${user.firstName} ${user.lastName} (${user.email})`);
        } catch (e) {
            console.error('❌ Failed to get user info:', e.message);
        }

        console.log('\n--- 2. Organizations ---');
        try {
            const orgs = await client.getOrganizations();
            console.log(`✅ Found ${orgs.items.length} organizations:`);
            orgs.items.forEach(o => {
                console.log(` - [${o.sys.id}] ${o.name}`);
            });
        } catch (e) {
            console.error('❌ Failed to get organizations:', e.message);
        }

        console.log('\n--- 3. Spaces (List) ---');
        try {
            // Try fetching with limit 100 just in case
            const spaces = await client.getSpaces({ limit: 100 });
            console.log(`✅ Found ${spaces.items.length} spaces:`);
            spaces.items.forEach(s => {
                const isTarget = s.sys.id === spaceId;
                console.log(` - [${s.sys.id}] ${s.name} ${isTarget ? 'MATCH!' : ''}`);
            });
        } catch (e) {
            console.error('❌ Failed to list spaces:', e.message);
        }

        console.log('\n--- 4. Target Space (Direct Access) ---');
        try {
            const space = await client.getSpace(spaceId);
            console.log(`✅ Successfully accessed space: ${space.name} (${space.sys.id})`);
        } catch (e) {
            console.error(`❌ Failed to access space '${spaceId}' directly:`);
            console.error(`   Error: ${e.message}`);
            if (e.message.includes('404')) {
                console.error('   👉 404 Not Found: The space does not exist OR you do not have permission to see it.');
            } else if (e.message.includes('403')) {
                console.error('   👉 403 Forbidden: You see the space, but cannot manage it.');
            }
        }

    } catch (e) {
        console.error('💥 Critical Error:', e.message);
    }
}

debug();
