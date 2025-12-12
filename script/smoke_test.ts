
async function runSmokeTest() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('🚀 Starting Smoke Test...\n');

  try {
    // 1. Test Server Health (Root)
    console.log('1️⃣ Checking Server Health...');
    const health = await fetch('http://localhost:5000/');
    if (health.ok) {
        console.log('✅ Server is reachable (Status: ' + health.status + ')');
    } else {
        console.error('❌ Server is unreachable or error (Status: ' + health.status + ')');
    }

    // 2. Test Login
    console.log('\n2️⃣ Testing Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'juan.delacruz@g.msuiit.edu.ph' })
    });
    
    if (!loginRes.ok) {
        const text = await loginRes.text();
        throw new Error(`Login failed: ${loginRes.status} ${loginRes.statusText} - ${text}`);
    }
    const loginData = await loginRes.json();
    console.log('✅ Login successful for:', loginData.user.fullName);
    const userId = loginData.user.id;

    // 3. Fetch Items
    console.log('\n3️⃣ Fetching Items...');
    const itemsRes = await fetch(`${baseUrl}/items`, {
        headers: { 
            'Content-Type': 'application/json',
            'x-user-id': userId // Based on api.ts logic
        }
    });

    if (!itemsRes.ok) throw new Error(`Fetch items failed: ${itemsRes.status}`);
    const itemsData = await itemsRes.json();
    console.log(`✅ Fetched ${itemsData.items.length} items`);
    
    // 4. Test Report Item (Dry run or minimal)
    if (itemsData.items.length > 0) {
        console.log('   Sample Item:', itemsData.items[0].title);
    }

    console.log('\n✨ Smoke Test Completed Successfully!');

  } catch (err) {
    console.error('\n❌ Smoke Test Failed:', err);
    process.exit(1);
  }
}

runSmokeTest();
