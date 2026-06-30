"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from .env");
}
const mongoUri = databaseUrl;
const seedUserId = new mongodb_1.ObjectId("665000000000000000000001");
const now = new Date();
const blogs = [
    {
        seedKey: "blog-modern-indian-home",
        title: "Modern Indian Home Design",
        heading: "Modern Indian Home Design: Blending Comfort, Culture, and Function",
        subheading: "A practical guide to creating homes that feel premium, personal, and easy to live in.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        body: "Modern Indian interiors work best when they balance everyday comfort with thoughtful detailing. Start with a warm neutral base, add natural textures like wood and stone, and use accent lighting to highlight important corners. Storage should be planned early so rooms stay clutter-free without feeling plain. The result is a home that feels elegant, functional, and deeply personal.",
        createdBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "blog-space-saving-interiors",
        title: "Space Saving Interior Ideas",
        heading: "Space Saving Interior Ideas for Compact Apartments",
        subheading: "Smart furniture, hidden storage, and zoning ideas for smaller homes.",
        image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
        body: "Compact homes need clarity more than compromise. Use multi-functional furniture, floating shelves, sliding shutters, and vertical storage to make every square foot useful. Keep circulation paths open and use mirrors or light colors where natural light is limited. Good planning can make a smaller home feel calm, organized, and visually spacious.",
        createdBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "blog-lighting-guide",
        title: "Interior Lighting Guide",
        heading: "How Lighting Changes the Mood of Your Home",
        subheading: "Layer ambient, task, and accent lighting to make each room feel complete.",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
        body: "Lighting is one of the fastest ways to improve an interior. Ambient lighting gives the room a comfortable base, task lighting supports daily activities, and accent lighting brings attention to textures, artwork, or wall panels. Use warmer tones in living and bedroom spaces, and brighter focused lighting in kitchens, study corners, and vanities.",
        createdBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
];
const galleries = [
    {
        seedKey: "gallery-living-room",
        imageName: "Elegant Living Room",
        imageKey: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
        theme: "Living Room",
        subheading: "Warm textures, clean lines, and layered lighting.",
        storage: "url",
        uploadedBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "gallery-modular-kitchen",
        imageName: "Modern Modular Kitchen",
        imageKey: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80",
        theme: "Kitchen",
        subheading: "Functional layout with premium finishes.",
        storage: "url",
        uploadedBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "gallery-bedroom",
        imageName: "Calm Bedroom Interior",
        imageKey: "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=1200&q=80",
        theme: "Bedroom",
        subheading: "Soft colors, hidden storage, and cozy lighting.",
        storage: "url",
        uploadedBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "gallery-office",
        imageName: "Productive Home Office",
        imageKey: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
        theme: "Workspace",
        subheading: "A focused work corner designed for daily productivity.",
        storage: "url",
        uploadedBy: seedUserId,
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
];
const testimonials = [
    {
        seedKey: "testimonial-priya-sharma",
        fullName: "Priya Sharma",
        phoneNumber: "9999999001",
        text: "Abhirachnaa understood our requirements clearly and transformed our living room into a warm, practical space. The team was professional from planning to execution.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
        video: "",
        approved: true,
        draft: false,
        type: "manual",
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "testimonial-rohit-verma",
        fullName: "Rohit Verma",
        phoneNumber: "9999999002",
        text: "The modular kitchen design was exactly what we needed. It looks premium and makes everyday cooking much easier.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
        video: "",
        approved: true,
        draft: false,
        type: "manual",
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "testimonial-neha-iyer",
        fullName: "Neha Iyer",
        phoneNumber: "9999999003",
        text: "They helped us make a compact apartment feel spacious and organized. The storage planning made a huge difference.",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
        video: "",
        approved: true,
        draft: false,
        type: "manual",
        createdAt: now,
        updatedAt: now,
    },
];
const jobs = [
    {
        seedKey: "job-interior-designer",
        jobTitle: "Interior Designer",
        jobLocation: "Indore, Madhya Pradesh",
        jobType: "Full Time",
        experience: "1-3 years",
        requirements: [
            "Strong understanding of residential interiors",
            "Experience with AutoCAD, SketchUp, or similar tools",
            "Good communication and client presentation skills",
        ],
        responsibilities: [
            "Prepare layouts, concepts, and design presentations",
            "Coordinate with site teams and vendors",
            "Support clients through design finalization",
        ],
        perksAndBenefits: [
            "Growth-oriented work culture",
            "Project exposure across residential interiors",
            "Performance-based incentives",
        ],
        salary: "As per experience",
        bonus: ["Performance bonus"],
        summary: "Join our design team to create functional and beautiful residential interiors for modern Indian homes.",
        department: "Design",
        createdBy: seedUserId,
        jobKey: "interior-designer-indore",
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
    {
        seedKey: "job-site-supervisor",
        jobTitle: "Site Supervisor",
        jobLocation: "Indore, Madhya Pradesh",
        jobType: "Full Time",
        experience: "2-5 years",
        requirements: [
            "Experience managing interior or construction sites",
            "Ability to coordinate contractors and daily schedules",
            "Basic knowledge of materials and finishing work",
        ],
        responsibilities: [
            "Track daily site progress",
            "Coordinate with designers, vendors, and workers",
            "Maintain quality and timeline standards",
        ],
        perksAndBenefits: [
            "Field learning opportunities",
            "Supportive operations team",
            "Travel allowance as applicable",
        ],
        salary: "As per experience",
        bonus: ["Project completion bonus"],
        summary: "We are looking for a responsible site supervisor to manage execution quality and timelines.",
        department: "Execution",
        createdBy: seedUserId,
        jobKey: "site-supervisor-indore",
        published: true,
        draft: false,
        createdAt: now,
        updatedAt: now,
    },
];
async function upsertMany(collection, records) {
    for (const record of records) {
        await collection.updateOne({ seedKey: record.seedKey }, { $set: record }, { upsert: true });
    }
}
async function main() {
    const client = new mongodb_1.MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db();
        await Promise.all([
            upsertMany(db.collection("blogs"), blogs),
            upsertMany(db.collection("galleries"), galleries),
            upsertMany(db.collection("testimonials"), testimonials),
            upsertMany(db.collection("jobs"), jobs),
        ]);
        const counts = await Promise.all([
            db.collection("blogs").countDocuments({ seedKey: { $exists: true } }),
            db.collection("galleries").countDocuments({ seedKey: { $exists: true } }),
            db.collection("testimonials").countDocuments({ seedKey: { $exists: true } }),
            db.collection("jobs").countDocuments({ seedKey: { $exists: true } }),
        ]);
        console.log("Website seed completed:");
        console.log(`- blogs: ${counts[0]}`);
        console.log(`- galleries: ${counts[1]}`);
        console.log(`- testimonials: ${counts[2]}`);
        console.log(`- jobs: ${counts[3]}`);
    }
    finally {
        await client.close();
    }
}
main().catch((error) => {
    console.error("Website seed failed:", error.message);
    process.exit(1);
});
