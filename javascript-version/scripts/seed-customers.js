const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking current customer count...');
    const currentCount = await prisma.customer.count();
    console.log(`Current customers: ${currentCount}`);
    
    if (currentCount >= 70) {
      console.log('Database already has customers, skipping seed.');
      return;
    }

    console.log('Reading customer data...');
    const sqlFile = path.join(__dirname, '..', 'customer_data_safe.sql');
    
    if (!fs.existsSync(sqlFile)) {
      console.log('Customer data file not found, skipping seed.');
      return;
    }

    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    const insertStatements = sqlContent.split('\n').filter(line => line.trim().startsWith('INSERT'));
    
    console.log(`Found ${insertStatements.length} customer records to import`);
    
    // Parse and insert customers one by one
    for (const statement of insertStatements) {
      try {
        // Extract values from INSERT statement using regex
        const valuesMatch = statement.match(/VALUES\('([^']+)','([^']*)',('([^']*)'|NULL),('([^']*)'|NULL),('([^']*)'|NULL),('([^']*)'|NULL),('([^']*)'|NULL),('([^']*)'|NULL),('([^']*)'|NULL),'([^']+)','([^']+)',('([^']*)'|NULL),(\d+),(\d+)\)/);
        
        if (valuesMatch) {
          const [, id, companyName, , contactName, , email, , phone, , address, , city, , country, , website, source, status, , notes, createdAt, updatedAt] = valuesMatch;
          
          await prisma.customer.create({
            data: {
              id,
              companyName,
              contactName: contactName || null,
              email: email || null,
              phone: phone || null,
              address: address || null,
              city: city || null,
              country: country || null,
              website: website || null,
              source,
              status,
              notes: notes || null,
              createdAt: new Date(parseInt(createdAt)),
              updatedAt: new Date(parseInt(updatedAt))
            }
          });
        }
      } catch (error) {
        console.log(`Skipping duplicate customer: ${error.message}`);
      }
    }
    
    const finalCount = await prisma.customer.count();
    console.log(`Database seeded successfully! Total customers: ${finalCount}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
