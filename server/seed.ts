import { storage } from "./storage";

export async function seedDatabase() {
  console.log("🌱 Seeding ClaimIT database with comprehensive data...");

  // ===== CREATE USERS =====
  console.log("\n👥 Creating users...");

  const student1 = await storage.createUser({
    email: "juan.delacruz@g.msuiit.edu.ph",
    fullName: "Juan Dela Cruz",
    role: "student",
    department: "Computer Science",
  });

  const student2 = await storage.createUser({
    email: "maria.santos@g.msuiit.edu.ph",
    fullName: "Maria Santos",
    role: "student",
    department: "Engineering",
  });

  const student3 = await storage.createUser({
    email: "carlo.reyes@g.msuiit.edu.ph",
    fullName: "Carlo Reyes",
    role: "student",
    department: "Information Technology",
  });

  const student4 = await storage.createUser({
    email: "anna.garcia@g.msuiit.edu.ph",
    fullName: "Anna Garcia",
    role: "student",
    department: "Mathematics",
  });

  const student5 = await storage.createUser({
    email: "pedro.gonzales@g.msuiit.edu.ph",
    fullName: "Pedro Gonzales",
    role: "student",
    department: "Physics",
  });

  const student6 = await storage.createUser({
    email: "lisa.manuel@g.msuiit.edu.ph",
    fullName: "Lisa Manuel",
    role: "student",
    department: "Chemistry",
  });

  const faculty1 = await storage.createUser({
    email: "prof.rodriguez@g.msuiit.edu.ph",
    fullName: "Prof. Ana Rodriguez",
    role: "faculty",
    department: "Mathematics",
  });

  const faculty2 = await storage.createUser({
    email: "prof.torres@g.msuiit.edu.ph",
    fullName: "Prof. Ricardo Torres",
    role: "faculty",
    department: "Computer Science",
  });

  const staff1 = await storage.createUser({
    email: "admin.registrar@msuiit.edu.ph",
    fullName: "Jennifer Cruz",
    role: "staff",
    department: "Registrar's Office",
  });

  const sidAdmin = await storage.createUser({
    email: "admin.sid@msuiit.edu.ph",
    fullName: "SID Administrator",
    role: "sid_admin",
    department: "Security Intelligence Division",
  });

  console.log(
    "✓ Created 10 users (6 students, 2 faculty, 1 staff, 1 SID admin)"
  );

  // ===== CREATE LOST ITEMS =====
  console.log("\n📱 Creating lost items...");

  const lostPhone1 = await storage.createItem({
    reporterId: student1.id,
    type: "lost",
    category: "electronics",
    title: "Blue iPhone 14 Pro",
    description:
      "Lost my blue iPhone 14 Pro near the CCS building. It has a clear case with stickers on the back. There's a distinctive crack on the top right corner of the screen protector.",
    location: "CCS Building",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const lostWallet = await storage.createItem({
    reporterId: faculty1.id,
    type: "lost",
    category: "wallets",
    title: "Brown Leather Wallet",
    description:
      "Lost my brown leather wallet containing IDs and some cash. Last seen at the library on the 3rd floor reading area.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const lostLaptop = await storage.createItem({
    reporterId: student3.id,
    type: "lost",
    category: "electronics",
    title: "Dell Laptop Silver",
    description:
      "Lost my silver Dell Inspiron laptop in the gymnasium. It has MSU-IIT stickers on the lid and my name engraved on the bottom.",
    location: "Gymnasium",
    dateLostFound: new Date("2024-12-09"),
    imageUrls: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const lostID = await storage.createItem({
    reporterId: student4.id,
    type: "lost",
    category: "ids_cards",
    title: "Student ID Card",
    description:
      "Lost my student ID card. Name: Anna Garcia, ID Number: 2021-12345. Last seen near the cafeteria.",
    location: "University Canteen",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const lostJacket = await storage.createItem({
    reporterId: student5.id,
    type: "lost",
    category: "clothing",
    title: "Blue Denim Jacket",
    description:
      "Lost my blue denim jacket with patches on the sleeves. Has my name tag inside the collar.",
    location: "COE Building",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const lostBackpack = await storage.createItem({
    reporterId: student6.id,
    type: "lost",
    category: "bags",
    title: "Black North Face Backpack",
    description:
      "Lost my black North Face backpack containing my laptop and textbooks. Left it in the library during study session.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-08"),
    imageUrls: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const lostWatch = await storage.createItem({
    reporterId: faculty2.id,
    type: "lost",
    category: "other",
    title: "Silver Watch Casio",
    description:
      "Lost my silver Casio watch near the faculty lounge. It has a metal band and digital display.",
    location: "Faculty Lounge",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  // Update lost items with QR codes
  await storage.updateItemQRCode(lostPhone1.id, `CLAIMIT-${lostPhone1.id}`);
  await storage.updateItemQRCode(lostWallet.id, `CLAIMIT-${lostWallet.id}`);
  await storage.updateItemQRCode(lostLaptop.id, `CLAIMIT-${lostLaptop.id}`);
  await storage.updateItemQRCode(lostID.id, `CLAIMIT-${lostID.id}`);
  await storage.updateItemQRCode(lostJacket.id, `CLAIMIT-${lostJacket.id}`);
  await storage.updateItemQRCode(lostBackpack.id, `CLAIMIT-${lostBackpack.id}`);
  await storage.updateItemQRCode(lostWatch.id, `CLAIMIT-${lostWatch.id}`);

  console.log("✓ Created 7 lost items");

  // ===== CREATE FOUND ITEMS =====
  console.log("\n🔍 Creating found items...");

  const foundPhone2 = await storage.createItem({
    reporterId: student2.id,
    type: "found",
    category: "electronics",
    title: "Black Samsung Galaxy S23",
    description:
      "Found this Samsung phone on a bench near the canteen. Screen is locked with pattern password.",
    location: "University Canteen",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
    ],
    isHighValue: true,
    turnoverToSID: true,
  });

  const foundKeys1 = await storage.createItem({
    reporterId: student1.id,
    type: "found",
    category: "keys",
    title: "Set of Keys with Blue Keychain",
    description:
      "Found a set of keys with a blue MSU-IIT keychain near the parking lot. Contains 3 keys and a small flashlight attachment.",
    location: "Main Parking Lot",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundKeys2 = await storage.createItem({
    reporterId: faculty1.id,
    type: "found",
    category: "keys",
    title: "Single Key with Red Tag",
    description:
      "Found a single key with a red tag labeled 'Room 301'. Found on the ground floor of SET building.",
    location: "SET Building",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundTumbler = await storage.createItem({
    reporterId: faculty1.id,
    type: "found",
    category: "tumblers",
    title: "Stainless Steel Tumbler",
    description:
      "Found a silver stainless steel tumbler with floral design in the faculty lounge.",
    location: "Faculty Lounge",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundUmbrella1 = await storage.createItem({
    reporterId: student3.id,
    type: "found",
    category: "umbrellas",
    title: "Black Umbrella",
    description:
      "Found a black umbrella left in the classroom. It's a standard size with automatic open/close button.",
    location: "CCS Building",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundUmbrella2 = await storage.createItem({
    reporterId: student4.id,
    type: "found",
    category: "umbrellas",
    title: "Colorful Floral Umbrella",
    description:
      "Found a colorful umbrella with floral pattern near the library entrance.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1517685352247-528d696fa006?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundBook1 = await storage.createItem({
    reporterId: student5.id,
    type: "found",
    category: "books",
    title: "Calculus Textbook",
    description:
      "Found a Calculus textbook (Stewart, 8th Edition) in the library. Has some notes and highlights inside.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-09"),
    imageUrls: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundBook2 = await storage.createItem({
    reporterId: faculty2.id,
    type: "found",
    category: "books",
    title: "Programming Notebook",
    description:
      "Found a notebook with programming notes and code snippets. Appears to be for a Computer Science class.",
    location: "CCS Building",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundWallet2 = await storage.createItem({
    reporterId: student6.id,
    type: "found",
    category: "wallets",
    title: "Black Wallet with Cards",
    description:
      "Found a black wallet near the gymnasium entrance. Contains ID cards but no cash. Turning over to SID for safekeeping.",
    location: "Gymnasium",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    ],
    isHighValue: true,
    turnoverToSID: true,
  });

  const foundEarphones = await storage.createItem({
    reporterId: staff1.id,
    type: "found",
    category: "electronics",
    title: "White Wireless Earphones",
    description:
      "Found white wireless earphones (looks like AirPods) in the registrar's office waiting area.",
    location: "Registrar's Office",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const foundTumbler2 = await storage.createItem({
    reporterId: student2.id,
    type: "found",
    category: "tumblers",
    title: "Pink Tumbler with Stickers",
    description:
      "Found a pink tumbler with various anime stickers on it. Left in the classroom after morning class.",
    location: "COE Building",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundEyeglasses = await storage.createItem({
    reporterId: student3.id,
    type: "found",
    category: "other",
    title: "Prescription Eyeglasses",
    description:
      "Found prescription eyeglasses with black frames. Found on a table in the library study area.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundCharger = await storage.createItem({
    reporterId: student4.id,
    type: "found",
    category: "electronics",
    title: "iPhone Charger Cable",
    description:
      "Found an iPhone charging cable (USB-C to Lightning) in the cafeteria. White color, appears to be genuine Apple cable.",
    location: "University Canteen",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1588599376442-3c93e0d6f1e1?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundWater = await storage.createItem({
    reporterId: student5.id,
    type: "found",
    category: "tumblers",
    title: "Blue Insulated Water Bottle",
    description:
      "Found a blue insulated water bottle (Hydro Flask style) in the gymnasium locker area.",
    location: "Gymnasium",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundID2 = await storage.createItem({
    reporterId: faculty1.id,
    type: "found",
    category: "ids_cards",
    title: "Faculty ID Card",
    description:
      "Found a faculty ID card in the hallway. Turned over to SID for proper handling.",
    location: "SET Building",
    dateLostFound: new Date("2024-12-09"),
    imageUrls: [
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
    ],
    isHighValue: true,
    turnoverToSID: true,
  });

  const foundBag = await storage.createItem({
    reporterId: student6.id,
    type: "found",
    category: "bags",
    title: "Red Tote Bag",
    description:
      "Found a red tote bag with books inside. Left in the library reading area.",
    location: "Main Library",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundHeadphones = await storage.createItem({
    reporterId: faculty2.id,
    type: "found",
    category: "electronics",
    title: "Black Over-Ear Headphones",
    description:
      "Found black over-ear headphones (Sony brand) in the faculty lounge. Still in good working condition.",
    location: "Faculty Lounge",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    ],
    isHighValue: true,
    turnoverToSID: false,
  });

  const foundPen = await storage.createItem({
    reporterId: student1.id,
    type: "found",
    category: "other",
    title: "Mont Blanc Pen",
    description:
      "Found an expensive-looking Mont Blanc pen in the classroom. Has initials 'R.T.' engraved on it.",
    location: "CCS Building",
    dateLostFound: new Date("2024-12-12"),
    imageUrls: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800",
    ],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundJacket2 = await storage.createItem({
    reporterId: student2.id,
    type: "found",
    category: "clothing",
    title: "Gray Hoodie MSU-IIT",
    description:
      "Found a gray hoodie with MSU-IIT logo. Size Large, left in the gymnasium bleachers.",
    location: "Gymnasium",
    dateLostFound: new Date("2024-12-11"),
    imageUrls: [],
    isHighValue: false,
    turnoverToSID: false,
  });

  const foundCalculator = await storage.createItem({
    reporterId: student3.id,
    type: "found",
    category: "electronics",
    title: "Scientific Calculator",
    description:
      "Found a Casio scientific calculator (fx-991ES Plus) in the mathematics classroom. Has name written inside battery compartment.",
    location: "SET Building",
    dateLostFound: new Date("2024-12-10"),
    imageUrls: [],
    isHighValue: false,
    turnoverToSID: false,
  });

  // Update found items with QR codes
  await storage.updateItemQRCode(foundPhone2.id, `CLAIMIT-${foundPhone2.id}`);
  await storage.updateItemQRCode(foundKeys1.id, `CLAIMIT-${foundKeys1.id}`);
  await storage.updateItemQRCode(foundKeys2.id, `CLAIMIT-${foundKeys2.id}`);
  await storage.updateItemQRCode(foundTumbler.id, `CLAIMIT-${foundTumbler.id}`);
  await storage.updateItemQRCode(
    foundUmbrella1.id,
    `CLAIMIT-${foundUmbrella1.id}`
  );
  await storage.updateItemQRCode(
    foundUmbrella2.id,
    `CLAIMIT-${foundUmbrella2.id}`
  );
  await storage.updateItemQRCode(foundBook1.id, `CLAIMIT-${foundBook1.id}`);
  await storage.updateItemQRCode(foundBook2.id, `CLAIMIT-${foundBook2.id}`);
  await storage.updateItemQRCode(foundWallet2.id, `CLAIMIT-${foundWallet2.id}`);
  await storage.updateItemQRCode(
    foundEarphones.id,
    `CLAIMIT-${foundEarphones.id}`
  );
  await storage.updateItemQRCode(
    foundTumbler2.id,
    `CLAIMIT-${foundTumbler2.id}`
  );
  await storage.updateItemQRCode(
    foundEyeglasses.id,
    `CLAIMIT-${foundEyeglasses.id}`
  );
  await storage.updateItemQRCode(foundCharger.id, `CLAIMIT-${foundCharger.id}`);
  await storage.updateItemQRCode(foundWater.id, `CLAIMIT-${foundWater.id}`);
  await storage.updateItemQRCode(foundID2.id, `CLAIMIT-${foundID2.id}`);
  await storage.updateItemQRCode(foundBag.id, `CLAIMIT-${foundBag.id}`);
  await storage.updateItemQRCode(
    foundHeadphones.id,
    `CLAIMIT-${foundHeadphones.id}`
  );
  await storage.updateItemQRCode(foundPen.id, `CLAIMIT-${foundPen.id}`);
  await storage.updateItemQRCode(foundJacket2.id, `CLAIMIT-${foundJacket2.id}`);
  await storage.updateItemQRCode(
    foundCalculator.id,
    `CLAIMIT-${foundCalculator.id}`
  );

  // Mark certain items as surrendered to SID
  await storage.updateItemStatus(foundPhone2.id, "surrendered_sid");
  await storage.updateItemStatus(foundWallet2.id, "surrendered_sid");
  await storage.updateItemStatus(foundID2.id, "surrendered_sid");

  console.log("✓ Created 20 found items");

  // ===== CREATE CLAIMS =====
  console.log("\n📋 Creating claims...");

  const claim1 = await storage.createClaim({
    itemId: foundKeys1.id,
    claimantId: student2.id,
    proofDescription:
      "These are my keys! I lost them yesterday around 3 PM when I parked my motorcycle. The keychain has my name written on the back, and there's a distinctive red key for my apartment. I can provide photos of my motorcycle registration to prove ownership.",
    proofImageUrl: undefined,
  });
  await storage.updateItemStatus(foundKeys1.id, "pending_claim");

  const claim2 = await storage.createClaim({
    itemId: foundBook1.id,
    claimantId: student4.id,
    proofDescription:
      "This is my Calculus textbook. I lost it last week in the library. My name is written on the inside cover, and I can describe the specific sections I highlighted in yellow marker. Chapter 3 has extensive notes in the margins.",
    proofImageUrl: undefined,
  });
  await storage.updateItemStatus(foundBook1.id, "pending_claim");

  const claim3 = await storage.createClaim({
    itemId: foundTumbler2.id,
    claimantId: student5.id,
    proofDescription:
      "That's my pink tumbler! I can identify all the specific anime stickers on it - there's a Naruto sticker near the top, a My Hero Academia one in the middle, and a Demon Slayer sticker at the bottom. I left it in my morning class yesterday.",
    proofImageUrl: undefined,
  });
  await storage.updateClaimStatus(
    claim3.id,
    "approved",
    student2.id,
    "Stickers match the description. Claim approved."
  );
  await storage.updateItemStatus(foundTumbler2.id, "returned");
  await storage.updateUserReputation(student2.id, 10); // Reward finder

  const claim4 = await storage.createClaim({
    itemId: foundCalculator.id,
    claimantId: faculty2.id,
    proofDescription:
      "This is my calculator that I lent to a student last week. My initials 'RT' are written inside the battery compartment. I use this calculator for my mathematics classes.",
    proofImageUrl: undefined,
  });
  await storage.updateClaimStatus(
    claim4.id,
    "approved",
    student3.id,
    "Verified initials match. Item ready for handover."
  );
  await storage.updateItemStatus(foundCalculator.id, "returned");
  await storage.updateUserReputation(student3.id, 10);

  const claim5 = await storage.createClaim({
    itemId: foundPen.id,
    claimantId: faculty2.id,
    proofDescription:
      "That's my Mont Blanc pen! The initials 'R.T.' stand for Ricardo Torres - my name. I lost it last week during a faculty meeting. It was a gift from my wife on our anniversary.",
    proofImageUrl: undefined,
  });
  await storage.updateClaimStatus(
    claim5.id,
    "completed",
    student1.id,
    "Item successfully handed over to Prof. Torres."
  );
  await storage.updateItemStatus(foundPen.id, "returned");
  await storage.updateUserReputation(student1.id, 10);

  console.log("✓ Created 5 claims (2 pending, 2 approved, 1 completed)");

  // ===== CREATE MESSAGES =====
  console.log("\n💬 Creating messages...");

  // Conversation 1: Student2 and Student1 about keys
  await storage.createMessage({
    itemId: foundKeys1.id,
    senderId: student2.id,
    receiverId: student1.id,
    content: "Hi! I saw you found my keys. Can we meet to get them?",
  });

  await storage.createMessage({
    itemId: foundKeys1.id,
    senderId: student1.id,
    receiverId: student2.id,
    content:
      "Sure! I'm available this afternoon. Where would you like to meet?",
  });

  await storage.createMessage({
    itemId: foundKeys1.id,
    senderId: student2.id,
    receiverId: student1.id,
    content: "How about at the CCS building lobby at 2 PM?",
  });

  // Conversation 2: Student4 and Student5 about book
  await storage.createMessage({
    itemId: foundBook1.id,
    senderId: student4.id,
    receiverId: student5.id,
    content:
      "Thank you so much for finding my Calculus book! I really need it for tomorrow's exam.",
  });

  await storage.createMessage({
    itemId: foundBook1.id,
    senderId: student5.id,
    receiverId: student4.id,
    content: "No problem! Glad I could help. When can you pick it up?",
  });

  // Conversation 3: Faculty2 and Student3 about calculator
  await storage.createMessage({
    itemId: foundCalculator.id,
    senderId: faculty2.id,
    receiverId: student3.id,
    content:
      "Hello! I believe you found my calculator. Thank you for reporting it!",
  });

  await storage.createMessage({
    itemId: foundCalculator.id,
    senderId: student3.id,
    receiverId: faculty2.id,
    content:
      "Yes, Prof. Torres! I found it in the classroom. I'll bring it to your office this afternoon.",
  });

  console.log("✓ Created 7 messages across 3 conversations");

  // ===== CREATE NOTIFICATIONS =====
  console.log("\n🔔 Creating notifications...");

  await storage.createNotification({
    userId: student1.id,
    type: "claim_update",
    content:
      "Someone has claimed your found item: Set of Keys with Blue Keychain",
    relatedItemId: foundKeys1.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: student2.id,
    type: "item_match",
    content:
      "A new item matching your interests has been reported: Stainless Steel Tumbler",
    relatedItemId: foundTumbler.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: student2.id,
    type: "new_message",
    content:
      "Juan Dela Cruz sent you a message about 'Set of Keys with Blue Keychain'",
    relatedItemId: foundKeys1.id,
    isRead: true,
  });

  await storage.createNotification({
    userId: student5.id,
    type: "claim_update",
    content: "Your claim for 'Pink Tumbler with Stickers' has been approved!",
    relatedItemId: foundTumbler2.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: faculty2.id,
    type: "claim_update",
    content: "Your claim for 'Scientific Calculator' has been approved!",
    relatedItemId: foundCalculator.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: student3.id,
    type: "new_message",
    content:
      "Prof. Ricardo Torres sent you a message about 'Scientific Calculator'",
    relatedItemId: foundCalculator.id,
    isRead: true,
  });

  await storage.createNotification({
    userId: student4.id,
    type: "item_match",
    content:
      "A new item matching your search has been found: Calculus Textbook",
    relatedItemId: foundBook1.id,
    isRead: true,
  });

  await storage.createNotification({
    userId: faculty1.id,
    type: "turnover_reminder",
    content:
      "Reminder: Please turn over the found Faculty ID Card to SID office",
    relatedItemId: foundID2.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: sidAdmin.id,
    type: "system",
    content: "New high-value item received: Black Samsung Galaxy S23",
    relatedItemId: foundPhone2.id,
    isRead: false,
  });

  await storage.createNotification({
    userId: student6.id,
    type: "system",
    content:
      "Thank you for turning over the wallet to SID. The owner can claim it at the SID office.",
    relatedItemId: foundWallet2.id,
    isRead: true,
  });

  console.log("✓ Created 10 notifications");

  // ===== CREATE TURNOVER LOGS =====
  console.log("\n📦 Creating turnover logs...");

  await storage.createTurnoverLog({
    itemId: foundPhone2.id,
    officerId: sidAdmin.id,
    remarks:
      "Item received in good condition, screen locked with pattern password. Battery at 45%.",
  });

  await storage.createTurnoverLog({
    itemId: foundWallet2.id,
    officerId: sidAdmin.id,
    remarks:
      "Wallet contains student ID and ATM cards. No cash inside. Stored in secure locker #23.",
  });

  await storage.createTurnoverLog({
    itemId: foundID2.id,
    officerId: sidAdmin.id,
    remarks: "Faculty ID card received. Will notify faculty member via email.",
  });

  console.log("✓ Created 3 turnover logs");

  console.log("\n✅ Database seeded successfully with comprehensive data!");
  console.log("\n📊 Summary:");
  console.log(`   • Users: 10 (6 students, 2 faculty, 1 staff, 1 admin)`);
  console.log(`   • Lost Items: 7`);
  console.log(`   • Found Items: 20`);
  console.log(`   • Total Items: 27`);
  console.log(`   • Claims: 5 (2 pending, 2 approved, 1 completed)`);
  console.log(`   • Messages: 7 (across 3 conversations)`);
  console.log(`   • Notifications: 10`);
  console.log(`   • Turnover Logs: 3`);
  console.log("\n👤 Test accounts:");
  console.log(`   Student: ${student1.email}`);
  console.log(`   Student: ${student2.email}`);
  console.log(`   Faculty: ${faculty1.email}`);
  console.log(`   SID Admin: ${sidAdmin.email}`);
}
