const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./server/database/cms.db');

db.serialize(() => {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.error('Error querying users:', err);
      db.close();
      return;
    }

    console.log('Current users in database:');
    console.log(rows);

    if (rows.length === 0) {
      console.log('No users found. Creating admin user...');

      bcrypt.hash('admin123', 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          db.close();
          return;
        }

        db.run(
          'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
          ['admin', 'admin@stpaulusjuanda.org', hash, 'admin'],
          function(err) {
            if (err) {
              console.error('Error inserting admin user:', err);
              db.close();
              return;
            }
            console.log('Admin user created successfully!');
            console.log('ID:', this.lastID);
            db.close();
          }
        );
      });
    } else {
      console.log('Admin user already exists.');
      db.close();
    }
  });
});
