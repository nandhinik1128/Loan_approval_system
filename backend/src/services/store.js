import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, index: true },
    phone: String,
    passwordHash: String,
    role: { type: String, enum: ['applicant', 'admin', 'financier'] },
    otpCode: String,
    otpExpiresAt: Date,
    passwordResetAt: Date
  },
  { timestamps: true }
);

const applicationSchema = new mongoose.Schema(
  {
    applicantId: String,
    applicantEmail: String,
    applicantName: String,
    loanType: String,
    employmentType: String,
    requestedAmount: Number,
    monthlyIncome: Number,
    monthlyObligations: Number,
    creditScore: Number,
    tenureMonths: Number,
    interestRate: Number,
    propertyValue: Number,
    identityDetails: Object,
    documents: Array,
    notes: Array,
    status: String,
    adminRecommendation: String,
    financierDecision: String,
    riskScore: Number,
    debtToIncome: Number,
    checklist: Array,
    flags: Array,
    decisionSummary: Object,
    auditTrail: Array
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const ApplicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema);

const memory = {
  users: [],
  applications: []
};

let useMongo = false;

const toUser = (user) => {
  if (!user) return null;
  const plain = user.toObject ? user.toObject() : user;
  return {
    ...plain,
    id: plain._id?.toString?.() || plain.id,
    _id: plain._id?.toString?.() || plain._id,
    passwordHash: plain.passwordHash
  };
};

const toApplication = (application) => {
  if (!application) return null;
  const plain = application.toObject ? application.toObject() : application;
  return {
    ...plain,
    id: plain._id?.toString?.() || plain.id,
    _id: plain._id?.toString?.() || plain._id
  };
};

export async function connectStore() {
  if (!env.mongoUri) {
    useMongo = false;
    return { adapter: 'memory' };
  }

  try {
    await mongoose.connect(env.mongoUri);
    useMongo = true;
    return { adapter: 'mongo' };
  } catch (error) {
    useMongo = false;
    return { adapter: 'memory', error: error.message };
  }
}

export async function seedUser(user) {
  const existing = await findUserByEmail(user.email);
  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(user.password, 10);
  if (useMongo) {
    const created = await UserModel.create({
      name: user.name,
      email: user.email.toLowerCase(),
      phone: user.phone,
      passwordHash,
      role: user.role
    });
    return toUser(created);
  }

  const created = {
    id: `user_${memory.users.length + 1}`,
    name: user.name,
    email: user.email.toLowerCase(),
    phone: user.phone,
    passwordHash,
    role: user.role,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memory.users.push(created);
  return toUser(created);
}

export async function listUsers() {
  if (useMongo) {
    const users = await UserModel.find();
    return users.map(toUser);
  }
  return memory.users.map(toUser);
}

export async function findUserByEmail(email) {
  if (!email) return null;
  if (useMongo) {
    return toUser(await UserModel.findOne({ email: email.toLowerCase() }));
  }
  return toUser(memory.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null);
}

export async function findUserById(userId) {
  if (!userId) return null;
  if (useMongo) {
    return toUser(await UserModel.findById(userId));
  }
  return toUser(memory.users.find((user) => String(user.id) === String(userId)) || null);
}

export async function createUser(payload) {
  const passwordHash = await bcrypt.hash(payload.password, 10);
  if (useMongo) {
    const created = await UserModel.create({
      ...payload,
      email: payload.email.toLowerCase(),
      passwordHash
    });
    return toUser(created);
  }

  const created = {
    id: `user_${memory.users.length + 1}`,
    ...payload,
    email: payload.email.toLowerCase(),
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memory.users.push(created);
  return toUser(created);
}

export async function updateUser(userId, updates) {
  if (useMongo) {
    const updated = await UserModel.findByIdAndUpdate(userId, updates, { new: true });
    return toUser(updated);
  }

  const index = memory.users.findIndex((user) => String(user.id) === String(userId));
  if (index === -1) return null;
  memory.users[index] = { ...memory.users[index], ...updates, updatedAt: new Date() };
  return toUser(memory.users[index]);
}

export async function createApplication(payload) {
  if (useMongo) {
    const created = await ApplicationModel.create(payload);
    return toApplication(created);
  }

  const created = {
    id: `app_${memory.applications.length + 1}`,
    ...payload,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memory.applications.push(created);
  return toApplication(created);
}

export async function listApplications(filter = {}) {
  if (useMongo) {
    const applications = await ApplicationModel.find(filter).sort({ createdAt: -1 });
    return applications.map(toApplication);
  }

  return memory.applications
    .filter((application) => Object.entries(filter).every(([key, value]) => application[key] === value))
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map(toApplication);
}

export async function findApplicationById(applicationId) {
  if (!applicationId) return null;
  if (useMongo) {
    return toApplication(await ApplicationModel.findById(applicationId));
  }
  return toApplication(memory.applications.find((application) => String(application.id) === String(applicationId)) || null);
}

export async function updateApplication(applicationId, updates) {
  if (useMongo) {
    const updated = await ApplicationModel.findByIdAndUpdate(applicationId, updates, { new: true });
    return toApplication(updated);
  }

  const index = memory.applications.findIndex((application) => String(application.id) === String(applicationId));
  if (index === -1) return null;
  memory.applications[index] = { ...memory.applications[index], ...updates, updatedAt: new Date() };
  return toApplication(memory.applications[index]);
}

export async function resetStore() {
  if (useMongo) {
    await UserModel.deleteMany({});
    await ApplicationModel.deleteMany({});
    return;
  }

  memory.users = [];
  memory.applications = [];
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
