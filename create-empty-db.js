// Script simple pour créer la base de données SQLite avec Node.js pur
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbDir = path.join(__dirname, 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

console.log('\n🗄️  Création de la base de données SQLite...\n');

// Créer le dossier prisma s'il n'existe pas
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Dossier prisma créé');
}

// Supprimer l'ancienne base si elle existe
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('🗑️  Ancienne base supprimée');
}

// Créer un fichier vide pour la base de données
fs.writeFileSync(dbPath, '');
console.log('📄 Fichier de base créé:', dbPath);

console.log('\n✅ Base de données créée avec succès!');
console.log('📍 Emplacement:', dbPath);
console.log('\n💡 Les tables seront créées automatiquement au démarrage de l\'application Electron\n');
