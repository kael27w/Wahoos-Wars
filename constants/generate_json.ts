import { getCampusLocations } from './campus_locations';
import * as fs from 'fs';

async function main() {
    const locations = await getCampusLocations();
    console.log(JSON.stringify(locations, null, 2));
    
    // Also save to file
    fs.writeFileSync('campus_locations.json', JSON.stringify(locations, null, 2));
}

main().catch(console.error);