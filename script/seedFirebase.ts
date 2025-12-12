import { faker } from "@faker-js/faker";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX6a3K0-J_PK-zWID35aYrqajNV96Oubk",
  authDomain: "claimit-3581e.firebaseapp.com",
  projectId: "claimit-3581e",
  storageBucket: "claimit-3581e.firebasestorage.app",
  messagingSenderId: "195897344578",
  appId: "1:195897344578:web:2dd48e75f8db241e2763db",
  measurementId: "G-BCED766PFS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Campus locations for realistic context
const CAMPUS_LOCATIONS = [
  "CCS Building",
  "COE Building",
  "SET Building",
  "Main Library",
  "University Canteen",
  "Gymnasium",
  "Faculty Lounge",
  "Registrar's Office",
  "Main Parking Lot",
  "Student Center",
];

const DEPARTMENTS = [
  "Computer Science",
  "Engineering",
  "Information Technology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
];

const ITEM_CATEGORIES = [
  "electronics",
  "clothing",
  "ids_cards",
  "wallets",
  "books",
  "bags",
  "tumblers",
  "umbrellas",
  "keys",
  "other",
] as const;

// Image URLs for different item types
const ITEM_IMAGES: Record<string, string[]> = {
  electronics: [
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
  ],
  clothing: [
    "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800",
  ],
  ids_cards: [
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
  ],
  wallets: [
    "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
  ],
  books: [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800",
  ],
  bags: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800",
  ],
  tumblers: [
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800",
  ],
  umbrellas: [
    "https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=800",
    "https://images.unsplash.com/photo-1517685352247-528d696fa006?w=800",
  ],
  keys: [
    "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  ],
  other: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800",
    "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800",
  ],
};

// Item title templates
const ITEM_TITLES: Record<string, () => string> = {
  electronics: () => {
    const items = [
      `${faker.color.human()} ${faker.helpers.arrayElement(["iPhone", "Samsung Galaxy", "Android"])} ${faker.helpers.arrayElement(["14", "15", "S23", "S24"])}`,
      `${faker.color.human()} Laptop ${faker.helpers.arrayElement(["Dell", "HP", "Lenovo", "MacBook"])}`,
      `Wireless ${faker.helpers.arrayElement(["Earphones", "Headphones"])}`,
      "Scientific Calculator",
      `${faker.helpers.arrayElement(["USB", "Phone"])} Charger Cable`,
    ];
    return faker.helpers.arrayElement(items);
  },
  clothing: () =>
    `${faker.color.human()} ${faker.helpers.arrayElement(["Jacket", "Hoodie", "Sweater", "Cap"])}`,
  ids_cards: () =>
    faker.helpers.arrayElement(["Student ID Card", "Faculty ID Card", "Staff ID"]),
  wallets: () =>
    `${faker.color.human()} ${faker.helpers.arrayElement(["Leather", "Canvas", "Vinyl"])} Wallet`,
  books: () =>
    faker.helpers.arrayElement([
      `${faker.helpers.arrayElement(["Calculus", "Physics", "Chemistry", "Programming"])} Textbook`,
      `${faker.helpers.arrayElement(["Math", "Science", "Programming"])} Notebook`,
    ]),
  bags: () =>
    `${faker.color.human()} ${faker.helpers.arrayElement(["Backpack", "Tote Bag", "Messenger Bag"])}`,
  tumblers: () =>
    `${faker.color.human()} ${faker.helpers.arrayElement(["Tumbler", "Water Bottle", "Insulated Bottle"])}`,
  umbrellas: () =>
    `${faker.color.human()} ${faker.helpers.arrayElement(["Umbrella", "Compact Umbrella"])}`,
  keys: () => faker.helpers.arrayElement(["Set of Keys", "Single Key", "Car Keys"]),
  other: () =>
    faker.helpers.arrayElement([
      "Eyeglasses",
      "Watch",
      "Pen",
      "USB Flash Drive",
      "Face Mask",
    ]),
};

async function seedDatabase() {
  console.log("🌱 Starting Firebase seeding with Faker data...\n");

  try {
    // ===== CREATE USERS =====
    console.log("👥 Creating users...");
    const userIds: string[] = [];

    // Create students
    for (let i = 0; i < 6; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const docRef = await addDoc(collection(db, "users"), {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@g.msuiit.edu.ph`,
        fullName: `${firstName} ${lastName}`,
        role: "student",
        department: faker.helpers.arrayElement(DEPARTMENTS),
        reputationScore: faker.number.int({ min: 0, max: 50 }),
        createdAt: Timestamp.now(),
      });
      userIds.push(docRef.id);
    }

    // Create faculty
    for (let i = 0; i < 2; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const docRef = await addDoc(collection(db, "users"), {
        email: `prof.${lastName.toLowerCase()}@g.msuiit.edu.ph`,
        fullName: `Prof. ${firstName} ${lastName}`,
        role: "faculty",
        department: faker.helpers.arrayElement(DEPARTMENTS),
        reputationScore: faker.number.int({ min: 20, max: 100 }),
        createdAt: Timestamp.now(),
      });
      userIds.push(docRef.id);
    }

    // Create staff
    const staffFirstName = faker.person.firstName();
    const staffLastName = faker.person.lastName();
    const staffDocRef = await addDoc(collection(db, "users"), {
      email: `${staffFirstName.toLowerCase()}.${staffLastName.toLowerCase()}@msuiit.edu.ph`,
      fullName: `${staffFirstName} ${staffLastName}`,
      role: "staff",
      department: "Registrar's Office",
      reputationScore: 30,
      createdAt: Timestamp.now(),
    });
    userIds.push(staffDocRef.id);

    // Create SID admin
    const sidAdminDocRef = await addDoc(collection(db, "users"), {
      email: "admin.sid@msuiit.edu.ph",
      fullName: "SID Administrator",
      role: "sid_admin",
      department: "Security Intelligence Division",
      reputationScore: 100,
      createdAt: Timestamp.now(),
    });
    userIds.push(sidAdminDocRef.id);

    console.log(`✓ Created ${userIds.length} users\n`);

    // ===== CREATE ITEMS =====
    console.log("📱 Creating items...");
    const itemIds: string[] = [];
    const lostItemIds: string[] = [];
    const foundItemIds: string[] = [];

    // Create 15 lost items
    for (let i = 0; i < 15; i++) {
      const category = faker.helpers.arrayElement(ITEM_CATEGORIES);
      const title = ITEM_TITLES[category]();
      const isHighValue = faker.datatype.boolean({ probability: 0.4 });
      
      const itemId = faker.string.uuid();
      const docRef = await addDoc(collection(db, "items"), {
        reporterId: faker.helpers.arrayElement(userIds.slice(0, -1)), // Not SID admin
        type: "lost",
        category,
        title,
        description: faker.lorem.paragraph({ min: 2, max: 4 }),
        location: faker.helpers.arrayElement(CAMPUS_LOCATIONS),
        imageUrls: faker.helpers.maybe(
          () => [faker.helpers.arrayElement(ITEM_IMAGES[category] || ITEM_IMAGES.other)],
          { probability: 0.7 }
        ) || [],
        isHighValue,
        dateReported: Timestamp.fromDate(faker.date.recent({ days: 14 })),
        dateLostFound: Timestamp.fromDate(faker.date.recent({ days: 20 })),
        qrCode: `CLAIMIT-${itemId}`,
        status: "open",
        turnoverToSID: false,
      });
      itemIds.push(docRef.id);
      lostItemIds.push(docRef.id);
    }
    console.log(`✓ Created 15 lost items`);

    // Create 15 found items
    for (let i = 0; i < 15; i++) {
      const category = faker.helpers.arrayElement(ITEM_CATEGORIES);
      const title = ITEM_TITLES[category]();
      const isHighValue = faker.datatype.boolean({ probability: 0.5 });
      const turnoverToSID = isHighValue && faker.datatype.boolean({ probability: 0.6 });
      
      const itemId = faker.string.uuid();
      const status = turnoverToSID ? "surrendered_sid" : "open";
      
      const docRef = await addDoc(collection(db, "items"), {
        reporterId: faker.helpers.arrayElement(userIds),
        type: "found",
        category,
        title,
        description: faker.lorem.paragraph({ min: 2, max: 4 }),
        location: faker.helpers.arrayElement(CAMPUS_LOCATIONS),
        imageUrls: faker.helpers.maybe(
          () => [faker.helpers.arrayElement(ITEM_IMAGES[category] || ITEM_IMAGES.other)],
          { probability: 0.7 }
        ) || [],
        isHighValue,
        dateReported: Timestamp.fromDate(faker.date.recent({ days: 14 })),
        dateLostFound: Timestamp.fromDate(faker.date.recent({ days: 20 })),
        qrCode: `CLAIMIT-${itemId}`,
        status,
        turnoverToSID,
      });
      itemIds.push(docRef.id);
      foundItemIds.push(docRef.id);
    }
    console.log(`✓ Created 15 found items\n`);

    // ===== CREATE CLAIMS =====
    console.log("📋 Creating claims...");
    const claimIds: string[] = [];

    for (let i = 0; i < 8; i++) {
      const itemId = faker.helpers.arrayElement(foundItemIds);
      const claimantId = faker.helpers.arrayElement(userIds.slice(0, -2)); // Students and faculty only
      const statuses = ["pending", "approved", "rejected", "completed"];
      const status = faker.helpers.arrayElement(statuses);
      
      const claimData: any = {
        itemId,
        claimantId,
        status,
        proofDescription: faker.lorem.paragraph({ min: 3, max: 5 }),
        proofImageUrl: faker.helpers.maybe(() => faker.image.url(), { probability: 0.3 }),
        dateFiled: Timestamp.fromDate(faker.date.recent({ days: 10 })),
        reviewedBy: null,
        reviewNotes: null,
        handoverQrCode: null,
      };

      if (["approved", "rejected", "completed"].includes(status)) {
        claimData.reviewedBy = faker.helpers.arrayElement(userIds.slice(-3)); // Staff or admins
        claimData.reviewNotes = faker.lorem.sentence();
      }

      if (["approved", "completed"].includes(status)) {
        claimData.handoverQrCode = `HANDOVER-${faker.string.uuid()}`;
      }

      const docRef = await addDoc(collection(db, "claims"), claimData);
      claimIds.push(docRef.id);
    }
    console.log(`✓ Created 8 claims\n`);

    // ===== CREATE MESSAGES =====
    console.log("💬 Creating messages...");
    
    // Create 5 conversations with 3-5 messages each
    for (let i = 0; i < 5; i++) {
      const itemId = faker.helpers.arrayElement(foundItemIds);
      const user1 = faker.helpers.arrayElement(userIds.slice(0, -1));
      const user2 = faker.helpers.arrayElement(userIds.filter(id => id !== user1));
      const messageCount = faker.number.int({ min: 3, max: 5 });

      for (let j = 0; j < messageCount; j++) {
        const isUser1Sender = j % 2 === 0;
        await addDoc(collection(db, "messages"), {
          itemId,
          senderId: isUser1Sender ? user1 : user2,
          receiverId: isUser1Sender ? user2 : user1,
          content: faker.lorem.sentence({ min: 5, max: 15 }),
          timestamp: Timestamp.fromDate(faker.date.recent({ days: 7 })),
          isRead: faker.datatype.boolean({ probability: 0.6 }),
        });
      }
    }
    console.log(`✓ Created messages for 5 conversations\n`);

    // ===== CREATE NOTIFICATIONS =====
    console.log("🔔 Creating notifications...");
    
    const notificationTypes = ["claim_update", "new_message", "item_match", "turnover_reminder", "system"];
    
    for (let i = 0; i < 12; i++) {
      const type = faker.helpers.arrayElement(notificationTypes);
      const userId = faker.helpers.arrayElement(userIds);
      
      let content = "";
      switch (type) {
        case "claim_update":
          content = `Your claim has been ${faker.helpers.arrayElement(["approved", "reviewed", "updated"])}`;
          break;
        case "new_message":
          content = `${faker.person.fullName()} sent you a message`;
          break;
        case "item_match":
          content = `A new item matching your search has been found`;
          break;
        case "turnover_reminder":
          content = `Reminder: Please turn over the item to SID office`;
          break;
        case "system":
          content = faker.helpers.arrayElement([
            "System maintenance scheduled",
            "New features available",
            "Thank you for using ClaimIT",
          ]);
          break;
      }

      await addDoc(collection(db, "notifications"), {
        userId,
        type,
        content,
        relatedItemId: faker.helpers.maybe(() => faker.helpers.arrayElement(itemIds), { probability: 0.7 }),
        timestamp: Timestamp.fromDate(faker.date.recent({ days: 10 })),
        isRead: faker.datatype.boolean({ probability: 0.5 }),
      });
    }
    console.log(`✓ Created 12 notifications\n`);

    // ===== CREATE TURNOVER LOGS =====
    console.log("📦 Creating turnover logs...");
    
    const sidAdminId = userIds[userIds.length - 1];
    for (let i = 0; i < 4; i++) {
      const itemId = faker.helpers.arrayElement(foundItemIds);
      const isReleased = faker.datatype.boolean({ probability: 0.5 });
      
      await addDoc(collection(db, "turnoverLogs"), {
        itemId,
        officerId: sidAdminId,
        dateReceived: Timestamp.fromDate(faker.date.recent({ days: 15 })),
        dateReleased: isReleased ? Timestamp.fromDate(faker.date.recent({ days: 5 })) : null,
        remarks: faker.lorem.sentence(),
      });
    }
    console.log(`✓ Created 4 turnover logs\n`);

    console.log("✅ Firebase seeding completed successfully!");
    console.log("\nSummary:");
    console.log(`- Users: ${userIds.length}`);
    console.log(`- Items: ${itemIds.length} (15 lost, 15 found)`);
    console.log(`- Claims: ${claimIds.length}`);
    console.log(`- Messages: ~20`);
    console.log(`- Notifications: 12`);
    console.log(`- Turnover Logs: 4`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log("\n🎉 All done! Check your Firestore console.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
