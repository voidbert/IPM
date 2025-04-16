const fs = requires('fs');

fs.copyFileSync('db.json', '.db-new.json');