// api/triage.js — CivicOne 311 AI triage (v1, handoff mode)
// Vercel serverless function. Needs GEMINI_API_KEY set in Vercel env vars.
// Privacy: nothing is stored. Report text goes to the AI, comes back, and is gone.

const MODEL = "gemini-3.5-flash";

// Draft list — matches the site's form; to be confirmed against SF311's official list.
const CATEGORIES = [
  "Street or Sidewalk Cleaning",
  "Graffiti",
  "Pothole & Street Issues",
  "Streetlight Repair",
  "Abandoned Vehicle",
  "Encampment",
  "General Request",
];

const SYSTEM_PROMPT = `You are the intake triage system for CivicOne, a civic
app serving San Francisco District 5 residents in many languages.

A resident describes a neighborhood problem in their own language. Your job:

1. EMERGENCY CHECK FIRST. If the text describes any emergency — fire, medical
   crisis, violence, crime in progress, someone in danger — set "emergency"
   to true and put a short message in the resident's own language telling them
   to call 911 immediately in "summary_local". Do nothing else.
2. Pick "category" ONLY from this exact list: ${CATEGORIES.join("; ")}.
   If nothing fits, use "General Request". Never invent a category.
3. Rate "severity" 1 (minor), 2 (moderate), or 3 (safety hazard), with a
   one-line "severity_reason" in English.
4. Write "title" (under 10 words, English) and "description_en": a clear,
   factual English report suitable for the SF311 system. Include the location
   ONLY if the resident provided one. Never guess or invent a location or any
   detail not in the resident's message.
5. Write "summary_local": 1-2 sentences in the SAME language the resident
   wrote in, confirming what is about to be reported.
6. If no location was given, set "needs_more_info" to true and put a polite
   question asking where the problem is, in the resident's language, in
   "followup_question". Otherwise set it to false and followup_question to null.

Respond with ONLY a JSON object with exactly these keys:
emergency (boolean), category (string), severity (number), severity_reason
(string), title (string), description_en (string), summary_local (string),
needs_more_info (boolean), followup_question (string or null).`;

export default async function handler(req, res) {
  // Health check: visit this URL in a browser to confirm deploy + key.
  // Add ?q=describe a problem to run a live triage test from the browser.
  
