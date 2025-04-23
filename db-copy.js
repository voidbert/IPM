import { copyFile } from 'fs/promises';
 
await copyFile('db.json', '.db-new.json');