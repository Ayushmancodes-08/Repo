import { db } from "./database";
import { geminiService } from "./gemini";

export const simulationEngine = {
  async runFullCycle() {
    console.log("🚀 Starting Full NeedSense Operational Simulation...");

    // 1. Citizen Report
    const newIssue = {
      id: `ISS-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      title: "Chemical Spill near Central High School",
      description: "A truck carrying industrial cleaning supplies has spilled liquid across the road. There is a strong chemical smell and children are being evacuated.",
      category: "safety" as any,
      urgency: "critical" as any,
      urgencyScore: 94,
      isEmergency: true,
      aiReasoning: "Multiple visual markers indicate high chemical risk near school area.",
      digiPin: "BHU-S4-J2",
      landmark: "Central High School East Gate",
      attachments: [],
      status: "submitted" as any,
      location: {
        lat: 20.2920,
        lng: 85.8400,
        address: "7th Avenue, Near Central HS",
        district: "District 5"
      },
      reportedBy: "CIT-002",
      reporterType: "citizen" as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.addIssue(newIssue);
    console.log("✅ Step 1: Citizen submitted report with DIGIPIN BHU-S4-J2.");

    // 2. AI Processing
    await new Promise(r => setTimeout(r, 1000));
    const aiAnalysis = await geminiService.classifyIssue(newIssue.title, newIssue.description);
    db.updateIssue(newIssue.id, {
      aiClassification: aiAnalysis.tag,
      aiConfidence: aiAnalysis.confidence,
    });
    console.log("✅ Step 2: AI Backend Proxy analyzed and verified the incident.");

    // 3. Admin Notification & Dispatch
    await new Promise(r => setTimeout(r, 1500));
    const volunteers = db.getVolunteers();
    const targetVol = volunteers.find(v => v.name === 'Arjun Pandit') || volunteers[0];

    db.updateIssue(newIssue.id, {
      status: 'assigned',
      assignedTo: targetVol.id,
      assignedTeam: "Alpha Strike Team"
    });

    db.addNotification({
      id: `NOT-${Date.now()}`,
      title: "EXTREME URGENCY ALERT",
      message: `AI confirms ${aiAnalysis.tag} at Central HS. Alpha Team dispatched.`,
      type: "urgent",
      read: false,
      targetRole: "admin",
      createdAt: new Date().toISOString()
    });
    console.log(`✅ Step 3: Admin Command Center dispatched Alpha Team (${targetVol.name}).`);

    // 4. Volunteer Execution (In-Progress)
    await new Promise(r => setTimeout(r, 2000));
    db.updateIssue(newIssue.id, { status: 'in-progress' });
    db.updateVolunteer(targetVol.id, { status: 'on-mission', currentStatus: 'working' });
    console.log("✅ Step 4: Volunteer reached site and initiated containment protocol.");

    // 5. Proof Upload & Resolution
    await new Promise(r => setTimeout(r, 2000));
    db.updateIssue(newIssue.id, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      proofOfWork: {
        image: "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb",
        description: "Spill neutralized using industrial absorbent. School perimeter secured.",
        timestamp: new Date().toISOString()
      }
    });

    db.addNotification({
      id: `NOT-${Date.now() + 2}`,
      title: "Proof of Work Verified",
      message: "The chemical spill has been contained. AI validation complete.",
      type: "success",
      read: false,
      targetRole: "volunteer",
      createdAt: new Date().toISOString()
    });
    console.log("✅ Step 5: Volunteer uploaded proof of work. Resolution verified.");

    // 6. Final Closing
    db.updateIssue(newIssue.id, { status: 'closed' });
    console.log("✅ Step 6: Mission closed. Citizen notified of safe re-entry.");

    return true;
  }
};
