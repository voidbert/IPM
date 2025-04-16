import { copyFile } from 'fs/promises';

try {
    await copyFile('db.json', '.db-new.json');
} catch (err) {
    console.error('Error copying file:', err);
}