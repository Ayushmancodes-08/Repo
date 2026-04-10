// NeedSense AI - Pure LocalStorage Database Layer
// Successfully reverted from Supabase to ensure total local data control.

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'document' | 'link' | 'other';
  url?: string; 
  name: string;
  size?: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'waste' | 'water' | 'road' | 'electricity' | 'traffic' | 'health' | 'safety' | 'other';
  urgency: 'critical' | 'urgent' | 'developing' | 'normal';
  urgencyScore: number; // 0-100
  status: 'submitted' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  location: { 
    lat: number; 
    lng: number; 
    address: string; 
    district: string;
    landmark?: string;
  };
  digiPin: string;
  landmark: string;
  reportedBy: string;
  reporterType: 'citizen' | 'volunteer' | 'admin';
  assignedTo?: string; // Volunteer ID
  assignedTeam?: string; // Group Name
  attachments?: Attachment[];
  aiClassification?: string;
  aiConfidence?: number;
  aiReasoning?: string;
  isEmergency?: boolean;
  volunteerReview?: { rating: number; comment: string; createdAt?: string };
  proofOfWork?: { image: string; description: string; timestamp: string };
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  password?: string;
  avatar: string;
  skills: string[];
  location: {
    lat: number;
    lng: number;
    digipin: string;
  };
  district?: string;
  preferredRadius: number; // km
  availabilityType: 'Always Available' | 'Weekends Only' | 'Evenings Only' | 'Morning Only' | 'Emergency Only';
  experienceLevel: 'Beginner' | 'Skilled';
  ngoName: string;
  status: 'available' | 'on-mission' | 'offline';
  currentStatus?: 'idle' | 'en-route' | 'working' | 'completing';
  rating: number;
  tasksCompleted: number;
  impactPoints: number;
  citizenRating: number;
  adminRating: number;
  avgResponseTime: string;
  joinedAt: string;
}

export interface NGOAdmin {
  id: string;
  ngoName: string;
  regNumber: string;
  category: 'Healthcare' | 'Sanitation' | 'Disaster Relief' | 'Child Welfare' | 'Environment';
  location: string;
  hqAddress: string;
  city: string;
  email: string;
  password?: string;
  avatar: string;
  joinedAt: string;
}

export interface Citizen {
  id: string;
  name: string;
  email: string;
  password?: string;
  area: string;
  ward: string;
  address: string;
  avatar: string;
  reportsSubmitted: number;
  joinedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  read: boolean;
  targetRole: 'admin' | 'citizen' | 'volunteer' | 'all';
  createdAt: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'prediction' | 'alert' | 'suggestion' | 'efficiency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  sector: string;
  probability?: number;
  createdAt: string;
}

// Seed Data
const SEED_NGO_ADMINS: NGOAdmin[] = [
  {
    id: 'ADM-001',
    ngoName: 'City Care NGO',
    regNumber: 'NGO/2026/001',
    category: 'Sanitation',
    location: 'Bhubaneswar, Odisha',
    hqAddress: 'Plot 42, Saheed Nagar',
    city: 'Bhubaneswar',
    email: 'admin@needsense.ai',
    password: 'admin123',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    joinedAt: '2026-01-01T00:00:00Z'
  }
];

const SEED_ISSUES: Issue[] = [
  {
    id: 'ISS-001', title: 'Broken Water Main', description: 'Major water main leak causing flooding on Main Street.', category: 'water', urgency: 'critical', urgencyScore: 92, status: 'submitted',
    location: { lat: 20.2961, lng: 85.8245, address: '15 Main Street', district: 'District 4' }, digiPin: '824520', landmark: 'Market Square', reportedBy: 'CIT-001', reporterType: 'citizen',
    attachments: [{ id: 'ATT-1', type: 'image', name: 'leak.jpg', url: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?auto=format&fit=crop&q=80&w=800' }],
    aiClassification: 'Infrastructure Critical', aiReasoning: 'Risk of basement flooding in adjacent buildings.', createdAt: '2026-04-08T06:30:00Z', updatedAt: '2026-04-08T07:00:00Z'
  },
  {
    id: 'ISS-002', title: 'Garbage Dump Overflow', description: 'Multiple bins overflowing near the primary school.', category: 'waste', urgency: 'urgent', urgencyScore: 78, status: 'assigned',
    location: { lat: 20.3010, lng: 85.8190, address: 'Market Road', district: 'District 2' }, digiPin: '819020', landmark: 'Primary School Gate', reportedBy: 'CIT-002', reporterType: 'citizen', assignedTo: 'VOL-001',
    attachments: [{ id: 'ATT-2', type: 'image', name: 'garbage.jpg', url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800' }],
    aiClassification: 'Sanitation Hazard', createdAt: '2026-04-08T04:15:00Z', updatedAt: '2026-04-08T06:45:00Z'
  }
];

const SEED_VOLUNTEERS: Volunteer[] = [
  { 
    id: 'VOL-001', name: 'Arjun Pandit', email: 'arjun@mail.com', mobile: '9876543210', password: 'volunteer123', avatar: 'https://i.pravatar.cc/150?u=arjun', 
    skills: ['Sanitation', 'First Aid'], location: { lat: 20.2960, lng: 85.8245, digipin: '824520' }, preferredRadius: 5, 
    availabilityType: 'Always Available', experienceLevel: 'Skilled', ngoName: 'City Care NGO', status: 'available', 
    rating: 4.8, tasksCompleted: 42, impactPoints: 1250, citizenRating: 4.9, adminRating: 4.7, avgResponseTime: '24 mins', joinedAt: '2026-02-15T00:00:00Z'
  },
  { 
    id: 'VOL-002', name: 'Priya Verma', email: 'priya@mail.com', mobile: '9876543211', password: 'volunteer123', avatar: 'https://i.pravatar.cc/150?u=priya', 
    skills: ['Medical / First Aid', 'Counseling'], location: { lat: 20.3000, lng: 85.8100, digipin: '810020' }, preferredRadius: 10, 
    availabilityType: 'Weekends Only', experienceLevel: 'Beginner', ngoName: 'Health Link', status: 'available', 
    rating: 4.5, tasksCompleted: 12, impactPoints: 450, citizenRating: 4.6, adminRating: 4.4, avgResponseTime: '45 mins', joinedAt: '2026-03-01T00:00:00Z'
  }
];

const SEED_CITIZENS: Citizen[] = [
  { id: 'CIT-001', name: 'Rohan Kumar', email: 'rohan@mail.com', password: 'citizen123', area: 'Saheed Nagar', ward: 'Ward 4', address: 'B-12, Sector 4', avatar: 'https://i.pravatar.cc/150?u=rohan', reportsSubmitted: 5, joinedAt: '2026-01-10T00:00:00Z' }
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'NOT-001', title: 'New Mission Assigned', message: 'You have been assigned to handle garbage overflow in Ward 4.', type: 'urgent', read: false, targetRole: 'volunteer', createdAt: '2026-04-08T07:00:00Z' }
];

const SEED_AI_INSIGHTS: AIInsight[] = [
  { id: 'AI-001', title: 'Flooding Prediction', description: '92% probability of water main break escalation in District 4.', type: 'prediction', severity: 'critical', sector: 'Infrastructure', probability: 0.92, createdAt: '2026-04-08T06:00:00Z' }
];

// Database class
class LocalDB {
  private getKey(collection: string): string {
    return `needsense_v2_${collection}`;
  }

  private get<T>(collection: string): T[] {
    const data = localStorage.getItem(this.getKey(collection));
    return data ? JSON.parse(data) : [];
  }

  private set<T>(collection: string, data: T[]): void {
    localStorage.setItem(this.getKey(collection), JSON.stringify(data));
  }

  initialize(): void {
    if (this.get<Issue>('issues').length === 0) this.set('issues', SEED_ISSUES);
    if (this.get<Volunteer>('volunteers').length === 0) this.set('volunteers', SEED_VOLUNTEERS);
    if (this.get<Citizen>('citizens').length === 0) this.set('citizens', SEED_CITIZENS);
    if (this.get<NGOAdmin>('admins').length === 0) this.set('admins', SEED_NGO_ADMINS);
    if (this.get<Notification>('notifications').length === 0) this.set('notifications', SEED_NOTIFICATIONS);
    if (this.get<AIInsight>('ai_insights').length === 0) this.set('ai_insights', SEED_AI_INSIGHTS);
  }

  getIssues(): Issue[] { return this.get<Issue>('issues'); }
  getIssueById(id: string): Issue | undefined { return this.getIssues().find(i => i.id === id); }
  addIssue(issue: Issue): void { const issues = this.getIssues(); issues.unshift(issue); this.set('issues', issues); }
  updateIssue(id: string, updates: Partial<Issue>): void {
    const issues = this.getIssues().map(i => i.id === id ? { ...i, ...updates, updatedAt: new Date().toISOString() } : i);
    this.set('issues', issues);
  }

  getVolunteers(): Volunteer[] { return this.get<Volunteer>('volunteers'); }
  getVolunteerById(id: string): Volunteer | undefined { return this.getVolunteers().find(v => v.id === id); }
  addVolunteer(vol: Volunteer): void { const vols = this.getVolunteers(); vols.push(vol); this.set('volunteers', vols); }
  updateVolunteer(id: string, updates: Partial<Volunteer>): void {
    const vols = this.getVolunteers().map(v => v.id === id ? { ...v, ...updates } : v);
    this.set('volunteers', vols);
  }

  getAIInsights(): AIInsight[] { return this.get<AIInsight>('ai_insights'); }
  getCitizens(): Citizen[] { return this.get<Citizen>('citizens'); }
  getAdmins(): NGOAdmin[] { return this.get<NGOAdmin>('admins'); }

  getNotifications(role?: string): Notification[] {
    const notifs = this.get<Notification>('notifications');
    return role ? notifs.filter(n => n.targetRole === role || n.targetRole === 'all') : notifs;
  }
  markNotificationRead(id: string): void {
    const notifs = this.get<Notification>('notifications').map(n => n.id === id ? { ...n, read: true } : n);
    this.set('notifications', notifs);
  }
  addNotification(notif: Notification): void {
    const notifs = this.get<Notification>('notifications');
    notifs.unshift(notif);
    this.set('notifications', notifs);
  }

  getStats() {
    const issues = this.getIssues();
    const volunteers = this.getVolunteers();
    return {
      totalIssues: issues.length,
      activeIssues: issues.filter(i => ['submitted', 'assigned', 'in-progress'].includes(i.status)).length,
      urgentIssues: issues.filter(i => i.urgency === 'critical' || i.urgency === 'urgent').length,
      resolvedIssues: issues.filter(i => i.status === 'resolved' || i.status === 'closed').length,
      totalVolunteers: volunteers.length,
      activeVolunteers: volunteers.filter(v => v.status === 'available' || v.status === 'on-mission').length,
      onMissionVolunteers: volunteers.filter(v => v.status === 'on-mission').length,
      issuesByCategory: {
        waste: issues.filter(i => i.category === 'waste').length,
        water: issues.filter(i => i.category === 'water').length,
        road: issues.filter(i => i.category === 'road').length,
        electricity: issues.filter(i => i.category === 'electricity').length,
        traffic: issues.filter(i => i.category === 'traffic').length,
        health: issues.filter(i => i.category === 'health').length,
        safety: issues.filter(i => i.category === 'safety').length,
      }
    };
  }

  getClusters() {
    const issues = this.getIssues().filter(i => i.status !== 'resolved' && i.status !== 'closed');
    const clusters: Record<string, Issue[]> = {};
    issues.forEach(i => {
      const key = i.location.district;
      if (!clusters[key]) clusters[key] = [];
      clusters[key].push(i);
    });
    return Object.entries(clusters).map(([district, districtIssues]) => ({
      district,
      count: districtIssues.length,
      severity: districtIssues.some(i => i.urgency === 'critical') ? 'critical' : 'urgent',
      center: {
        lat: districtIssues.reduce((a, b) => a + b.location.lat, 0) / districtIssues.length,
        lng: districtIssues.reduce((a, b) => a + b.location.lng, 0) / districtIssues.length
      },
      issues: districtIssues
    }));
  }

  // --- LOCAL AI ANALYTICS ---
  // Replaced Supabase methods with purely local persistence logic

  saveLiveClusters(clusters: any[]) {
    this.set('ai_live_clusters', clusters);
    console.log("💾 AI Clusters saved to LocalStorage");
  }

  getLiveClusters(): any[] {
    return this.get<any>('ai_live_clusters');
  }

  saveLiveComplaints(complaints: any[]) {
    this.set('ai_live_complaints', complaints);
  }

  getLiveComplaints(): any[] {
    return this.get<any>('ai_live_complaints');
  }
}

export const db = new LocalDB();
