/**
 * NeedSense AI - Backend Integration Service
 * All citizen issues reported via the 6-step reporting sequence must be transmitted to the specified AI proxy.
 */

import { db } from './database';

// Use the provided Ngrok URL from the user
const PROXY_URL = "https://chamomile-veneering-geriatric.ngrok-free.dev/process";

export const geminiService = {
  async classifyIssue(title: string, description: string, area: string = "General", imageBase64?: string) {
    try {
      // The Python backend expects a list of complaints with 'text' and 'area'
      const payload = [{
        text: description || title,
        area: area || "Ward 1",
        timestamp: new Date().toISOString()
      }];

      console.log("🚀 Sending to Python AI Backend:", payload);

      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Python Backend API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Received from Python AI Backend:", data);

      // --- PERSIST TO LOCAL STORAGE ---
      if (data.clusters) {
        db.saveLiveClusters(data.clusters);
      }
      if (data.complaints) {
          db.saveLiveComplaints(data.complaints);
      } else if (data.clusters) {
          // Fallback: extract complaints from clusters if available
          const allComplaints = data.clusters.flatMap((c: any) => c.complaints || []);
          if (allComplaints.length > 0) db.saveLiveComplaints(allComplaints);
      }
      
      const firstCluster = data.clusters?.[0] || {};

      return {
        category: firstCluster.issue_category?.toLowerCase() || "other",
        urgency: (firstCluster.urgency_score > 70 ? "critical" : firstCluster.urgency_score > 40 ? "urgent" : "normal") as any,
        urgencyScore: firstCluster.urgency_score || 50,
        tag: firstCluster.issue_type || "Analyzed",
        isEmergency: firstCluster.urgency_score > 80,
        reasoning: data.crisis_predictions?.[0]?.predicted_crisis || "Clustered with similar civic issues.",
        suggestedAction: firstCluster.recommended_action || "Manual inspection required.",
        confidence: 0.9,
        // Store the raw output for analytics dashboards
        rawClusters: data.clusters,
        rawPredictions: data.crisis_predictions
      };
    } catch (error) {
      console.error("AI Proxy Error:", error);
      return { 
        category: "other", 
        urgency: "normal", 
        urgencyScore: 40, 
        isEmergency: false, 
        reasoning: "Python Backend connection issue. Using local fallback.", 
        suggestedAction: "Physical verification required.", 
        confidence: 0.5 
      };
    }
  },

  async predictCrisis(issues: any[]) {
    // Standard mock for prediction logic
    return "Analyzing city-wide trends for potential infrastructure or health crises...";
  },

  async summarizeAnalytics(stats: any) {
    return "Current trends show 12% increase in sanitation efficiency and high community engagement in District 4.";
  }
};
