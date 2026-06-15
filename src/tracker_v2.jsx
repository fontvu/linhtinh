import { useState, useEffect } from "react";
import { Info, ListChecks, MapPin, FileText, Coins, HelpCircle, PenLine, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

const STORAGE_KEY = "masters-tracker-v2";
const AUTH_KEY = "masters-tracker-v2-auth";
const AUTH_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const PASSCODE_HASH = "c24988fef0f40d549658960190eae263136e01207f466b7070b625e7ea9b4ab7";
const PASSCODE_HINT = "your birthday";

const STORAGE_API = {
  async get(key) {
    if (window.storage?.get) return window.storage.get(key);
    return { value: window.localStorage.getItem(key) };
  },
  async set(key, value) {
    if (window.storage?.set) return window.storage.set(key, value);
    window.localStorage.setItem(key, value);
  }
};

const textEncoder = new TextEncoder();
async function sha256(value) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getSavedAuth() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    return saved?.ts && Date.now() - saved.ts < AUTH_DURATION_MS;
  } catch (e) {
    return false;
  }
}

function saveAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, JSON.stringify({ ts: Date.now() }));
}

function clearAuth() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}

const COLORS = {
  coral:  { bg:"#FAECE7", border:"#F0C4B4", dot:"#D85A30" },
  amber:  { bg:"#FAEEDA", border:"#F0D49A", dot:"#BA7517" },
  purple: { bg:"#EEEDFE", border:"#C5C3F0", dot:"#534AB7" },
  teal:   { bg:"#E1F5EE", border:"#A8DCC9", dot:"#0F6E56" },
  blue:   { bg:"#E6F1FB", border:"#AACDE8", dot:"#185FA5" },
};

const PHASES = [
  {
    id: "p0", label: "PHASE 0", title: "Foundations", period: "June – August 2026",
    color: "coral",
    items: [
      {
        id: "p0_aps", priority: "critical", deadline: "2026-06-30",
        title: "Start APS certificate application at DAAD Vietnam",
        details: {
          what: "The APS (Akademische Prüfstelle) certificate is an academic credential verification issued by DAAD Vietnam. It is required by many German universities, and some scholarship or program-specific Swedish/Finnish applications may request it. Always confirm the exact requirement with each target university or portal.",
          steps: [
            "Download the current APS application form from aps.org.vn and read the requirements checklist carefully.",
            "Prepare 5 physical copies of every document: degree certificate, transcripts, and ID — all with certified Vietnamese-to-German or Vietnamese-to-English translations.",
            "Submit the dossier in person or by registered post to the German Embassy Hanoi (29 Tran Phu, Ba Dinh) during office hours (Mon–Thu 8:30–11:30).",
            "Pay the fee of 6,000,000 VND (~€220) at the embassy cashier at time of submission.",
            "Schedule your academic interview — interviews are typically held in May and November. Ask staff for the next available slot when you submit.",
            "After the interview, wait 4–6 weeks for the APS certificate to be issued. Request 2 certified copies for use with multiple universities."
          ],
          where: [
            { name: "APS Vietnam official site", url: "https://aps.org.vn" },
            { name: "German Embassy Hanoi", url: "https://hanoi.diplo.de" }
          ],
          docs: [
            "Original degree certificate + 5 certified copies with certified translation",
            "Full academic transcript + 5 certified copies with certified translation",
            "Valid passport (original + copies)",
            "Completed APS application form",
            "Passport-size photos (check current count on aps.org.vn)",
            "Payment of 6,000,000 VND at embassy cashier"
          ],
          fees: "6,000,000 VND (~€220) paid at the German Embassy Hanoi. No additional mailing fees if submitting in person.",
          faq: [
            { q: "Do all target programs require APS?", a: "No. APS is commonly required by German universities and may be requested by some Swedish scholarship or program-specific applications, but it is not universally required on universityadmissions.se. Always verify each target program's current document requirements before applying." },
            { q: "How long is the APS certificate valid?", a: "The APS certificate does not expire, but some universities may ask for one issued within a recent period. Getting it done now covers all Fall 2027 deadlines comfortably." },
            { q: "What if the interview is full for the next cycle?", a: "Contact DAAD Vietnam directly at aps.org.vn to join a waiting list. Submitting documents early often secures a spot even if the formal slot is later." }
          ]
        }
      },
      {
        id: "p0_ielts_book", priority: "critical", deadline: "2026-07-15",
        title: "Book IELTS Academic test date",
        details: {
          what: "IELTS Academic is the required English proficiency test for all target programs. You need a minimum overall band of 6.5 (some programs require 7.0). Booking early ensures you can retake if needed before the December–January application deadlines. Results typically arrive 13 days after the test for paper-based IELTS and 3–5 days for computer-delivered testing.",
          steps: [
            "Decide between IDP Vietnam (idpielts.com.vn) or British Council Vietnam (britishcouncil.vn) — both are equally accepted and priced the same.",
            "Create or log into your account on the chosen provider's website.",
            "Select 'IELTS Academic' (not General Training) and choose a test date at least 3–4 weeks away to allow preparation time.",
            "Choose a test center convenient for you in Hanoi or Ho Chi Minh City.",
            "Pay the registration fee of approximately 4,750,000 VND (~€175). Payment is online by card or via bank transfer.",
            "You will receive a confirmation email with your test date, center address, and candidate number. Save this."
          ],
          where: [
            { name: "IDP Vietnam IELTS", url: "https://www.idp.com/vietnam/ielts/" },
            { name: "British Council Vietnam IELTS", url: "https://www.britishcouncil.vn/exam/ielts" }
          ],
          docs: [
            "Valid passport (same one used at test center — must not expire before test date)",
            "Payment method (credit/debit card or bank transfer details)",
            "Email address for registration and result delivery"
          ],
          fees: "~4,750,000 VND (~€175) for IELTS Academic. One Skill Retake (OSR) to improve a single band costs ~2,500,000 VND (~€95) and results arrive within 3–5 days (computer-delivered test).",
          faq: [
            { q: "Computer-delivered or paper-based — which is better?", a: "Computer-delivered (CD-IELTS) gives results in 3–5 days vs. 13 days for paper. CD allows you to type the writing section and is generally available on more dates. Most test takers find it equally fair." },
            { q: "What score do the target programs require?", a: "Sweden (SISGP): 6.5 overall, no band below 5.5. CYBERSURE: check individual partner university requirements (~6.5–7.0). Aalto: 6.5 overall. Mannheim: 6.5 overall. Cologne: varies by department, typically 6.0–6.5." },
            { q: "Can I use TOEFL instead?", a: "Yes, most programs accept TOEFL iBT (score ~79–100 equivalent to IELTS 6.5–7.0). However, IELTS is more common in Europe and is always accepted. Stick with IELTS Academic unless you have a strong preference." }
          ]
        }
      },
      {
        id: "p0_ielts_sit", priority: "critical", deadline: "2026-08-31",
        title: "Sit IELTS/TOEFL test, receive scores (target 6.5+)",
        details: {
          what: "The actual IELTS Academic test sitting. Results are used for all program and scholarship applications. Completing by end of August gives you time for a retake if needed before December–January deadlines.",
          steps: [
            "Two weeks before: do full timed practice tests under real conditions (British Council IELTS Practice Materials or Cambridge IELTS books 1–18).",
            "One day before: rest, prepare your valid passport, know your test center address and arrival time (usually 30–60 min before start).",
            "Test day: four sections — Listening (30 min), Reading (60 min), Writing (60 min), Speaking (separate day or same day depending on test type).",
            "Computer-delivered: results available online in 3–5 days. Paper-based: 13 days.",
            "Download your Test Report Form (TRF) — it includes a unique TRF number you can use to send scores electronically to universities.",
            "If score is below target: book a One Skill Retake (OSR) for the lowest band, or rebook a full test. Allow 4 weeks between attempts."
          ],
          where: [
            { name: "IELTS official practice materials", url: "https://www.ielts.org/about-ielts/ielts-for-study/study-materials" },
            { name: "British Council free practice tests", url: "https://www.britishcouncil.org/exam/ielts/preparation" }
          ],
          docs: [
            "Valid passport (the exact same document registered at booking)",
            "Candidate confirmation email or booking number",
            "Pencils and eraser for paper-based test (if applicable)"
          ],
          fees: "Covered by booking fee. One Skill Retake if needed: ~2,500,000 VND. Full resit: ~4,750,000 VND.",
          faq: [
            { q: "How do I send scores to universities?", a: "Each test includes 5 free score sends to institutions. Log into your IELTS account after receiving results and enter the university and department details. Additional sends cost ~€20 each. For Sweden/universityadmissions.se, upload the PDF certificate instead." },
            { q: "Is 6.5 achievable in 6–8 weeks?", a: "For a strong English communicator, yes. Focus on academic writing (Task 2 essays) and skimming/scanning for Reading. Listening and Speaking are easier to lift quickly with targeted practice. A score of 6.5–7.0 is realistic with consistent daily study." }
          ]
        }
      },
      {
        id: "p0_emp_current", priority: "critical", deadline: "2026-07-15",
        title: "Request employment certificate from current employer",
        details: {
          what: "SISGP (Sweden Institute Scholarship) requires proof of at least 3,000 total working hours across up to 3 employers. The employment certificate from your current employer must state your job title, start date, and contracted weekly hours. This is a core eligibility document.",
          steps: [
            "Draft a formal request email to your HR department or direct manager specifying what the certificate must contain: full name, job title, company name, employment start date, contracted weekly working hours, and a company stamp and authorized signature.",
            "Mention that this is for an international scholarship application and ask for the document on company letterhead.",
            "Follow up within one week if no response — HR departments often process such requests in batches.",
            "Once received, verify: (a) dates are correct, (b) weekly contracted hours are stated explicitly (not just 'full-time'), (c) it has an official stamp and signature.",
            "Make 2–3 certified copies for use across different applications."
          ],
          where: [
            { name: "SISGP eligibility criteria", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" }
          ],
          docs: [
            "Draft letter template to give HR (reduces errors)",
            "Your employee ID or HR system reference number",
            "A sample from SI showing required fields (download from si.se)"
          ],
          fees: "No cost. Some employers charge for certified copies — typically under 100,000 VND per copy.",
          faq: [
            { q: "What if my employer only writes 'full-time' without stating hours?", a: "Ask HR to specify the contracted weekly hours in the letter (e.g., '40 hours per week'). The SI evaluators need an exact number to calculate total hours. A letter saying 'full-time' alone may not count." },
            { q: "Does the certificate need to be in English?", a: "For SISGP: yes, English or with a certified English translation. For German programs (Mannheim, Cologne): German or English is preferred. Having an English-language certificate works for all applications." }
          ]
        }
      },
      {
        id: "p0_emp_past", priority: "high", deadline: "2026-07-31",
        title: "Request employment certificate(s) from past employers",
        details: {
          what: "SISGP counts work experience from up to 3 employers. Your past employers need to provide certificates in the same format as your current employer. Gathering these now avoids last-minute chasing in February 2027.",
          steps: [
            "List all employers where you had formal employment (not freelance/contract work) and calculate the hours you might need from each to reach 3,000 total.",
            "Contact the HR department of each past employer by email. Use the same template as for your current employer, adapted with correct dates.",
            "If a company has dissolved or HR is unresponsive, a signed letter from your direct manager (at their new employer) may be accepted — check SI's latest guidance.",
            "For employers outside Vietnam (e.g., if you worked abroad), the certificate still needs to be in English or with a certified translation.",
            "Collect and file all certificates together in a dedicated folder (physical and digital)."
          ],
          where: [
            { name: "SISGP work experience documentation guide", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/eligibility/" }
          ],
          docs: [
            "Contact details for HR at each past employer",
            "Your employee records (start/end dates, department, role)",
            "Certified translation if the certificate is in Vietnamese only"
          ],
          fees: "Typically free. Allow up to 300,000 VND per certified translation if needed.",
          faq: [
            { q: "Can I count internships or part-time work?", a: "SISGP counts paid employment. Internships count if they were paid and documented. Part-time work counts — SI calculates actual hours (e.g., 20 hours/week × 52 weeks = 1,040 hours). Voluntary/unpaid work does not count." },
            { q: "What if I cannot get a certificate from a dissolved company?", a: "SI accepts alternative documentation such as tax contribution records, payslips, or a statutory declaration. Check the current-year guidelines at si.se for what substitutes are accepted." }
          ]
        }
      },
      {
        id: "p0_hours_tally", priority: "critical", deadline: "2026-08-31",
        title: "Calculate and document total work hours (target ≥ 3,000)",
        details: {
          what: "SISGP requires a minimum of 3,000 hours of post-graduation work experience across a maximum of 3 employers. You must build a structured proof package demonstrating this total. 3,000 hours ≈ 75 weeks at 40 hours/week ≈ 18 months full-time.",
          steps: [
            "Create a spreadsheet with columns: Employer | Start Date | End Date | Contracted Hours/Week | Total Weeks | Total Hours.",
            "For each employer, multiply contracted weekly hours by total weeks employed. Count only weeks of actual employment — exclude unpaid leave if significant.",
            "Sum the total hours across all employers (max 3 for SISGP). If total exceeds 3,000, you are eligible.",
            "Cross-check every figure against your employment certificates — the numbers must match.",
            "Build the first page of your proof PDF: a clean summary table with the above columns, showing how you reach 3,000+ hours.",
            "Attach the employment certificates as subsequent pages in the same PDF. This becomes your hours proof package for SISGP (needed in Phase 3)."
          ],
          where: [
            { name: "SISGP eligibility calculator", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" }
          ],
          docs: [
            "All employment certificates (current + past employers)",
            "Personal calendar or HR records to verify exact dates",
            "Spreadsheet or calculation worksheet",
            "Final merged PDF of summary table + certificates"
          ],
          fees: "No fee. PDF merging can be done free at ilovepdf.com or smallpdf.com.",
          faq: [
            { q: "Do I count hours from before graduation?", a: "No. SISGP only counts post-bachelor-graduation work experience. Any employment while still a student does not count toward the 3,000-hour requirement." },
            { q: "What if I am slightly under 3,000 hours at deadline?", a: "Continue working and update the calculation. Hours at the time of application (February 2027) are what count. Estimate additional hours you will gain before the deadline." }
          ]
        }
      },
      {
        id: "p0_leadership", priority: "critical", deadline: "2026-08-31",
        title: "Identify, build, and document leadership experience",
        details: {
          what: "SISGP's second core criterion is leadership — defined as taking initiative and driving change in professional or community settings. This includes formal management roles, project leadership, founding organizations, mentoring, or community impact work. You need documented evidence, not just a claim.",
          steps: [
            "Brainstorm all leadership activities: team lead roles, projects you initiated, committees, volunteer work, professional associations, academic clubs.",
            "For each activity, identify: role title, organization, dates, number of people impacted or managed, and a concrete measurable outcome.",
            "Obtain documentation for each: appointment letter, committee minutes, org chart showing your role, news coverage, photos with captions, award certificates.",
            "If current leadership evidence is thin, identify one opportunity to take on now (e.g., lead an internal security initiative, mentor a junior colleague formally, join a professional association board).",
            "Draft a one-line 'leadership impact statement' for each activity: [Role] at [Organization], [Date range], led [X people/initiative], resulting in [measurable outcome].",
            "Compile all documentation into a PDF package for SISGP (needed in Phase 3)."
          ],
          where: [
            { name: "SI leadership criterion explanation", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/selection-criteria/" }
          ],
          docs: [
            "Appointment letters or role descriptions for each leadership position",
            "Evidence of outcomes (project reports, committee decisions, published work)",
            "Organization charts showing your position",
            "Any awards or recognitions for leadership"
          ],
          fees: "No cost. Translation of documents if needed: ~200,000–500,000 VND per page.",
          faq: [
            { q: "Does 'team lead' in my job title count?", a: "Yes, if you can document it with an appointment letter and describe the scope (people managed, outcomes achieved). Make it concrete: 'Led a 4-person security assessment team for PCI-DSS audit, resulting in certification' is strong evidence." },
            { q: "Do volunteer or community roles count as leadership?", a: "Yes — SI explicitly values non-professional leadership in community, student, or civic organizations. A documented board role at a non-profit or professional association is highly valued." }
          ]
        }
      }
    ]
  },
  {
    id: "p1", label: "PHASE 1", title: "Document Assembly", period: "September – November 2026",
    color: "amber",
    items: [
      {
        id: "p1_transcript", priority: "high", deadline: "2026-10-01",
        title: "Obtain certified English-translated transcript",
        details: {
          what: "An official academic transcript listing all courses, credit hours, and grades from your bachelor degree, with a certified English translation. Required by all target programs. Swedish universities need it uploaded to universityadmissions.se; German programs need certified hard copies.",
          steps: [
            "Request an official transcript from your university's academic records office. Ask for the 'English-language version' if your university issues one directly — this avoids translation costs.",
            "If only Vietnamese is available, hire a certified translator (thong dich vien co cong chung) to translate the document and have it notarized.",
            "Bring the original + translation to a district notary (Phong Cong Chung) for certification. You will need your ID and the university's seal on the original.",
            "Request 4–5 certified copies: one each for Sweden (scan/upload), Germany (sealed post), Finland, and a personal copy.",
            "Verify that the transcript includes: your full name, student ID, program name, graduation date, all course names, credit values, and final GPA."
          ],
          where: [
            { name: "Vietnam notary public finder", url: "https://congchung.vn" }
          ],
          docs: [
            "Original Vietnamese transcript (with university seal)",
            "Certified English translation by a licensed translator",
            "Notarized/certified copies for each program",
            "Your student ID for the request process"
          ],
          fees: "Translation: ~200,000–500,000 VND per page. Notarization: ~20,000–50,000 VND per copy. Allow 300,000–1,000,000 VND total.",
          faq: [
            { q: "Does 1 Vietnamese credit (tin chi) equal 1 ECTS?", a: "No. Vietnamese tin chi are not identical to ECTS credits. Use any conversion only as a rough estimate and confirm with each target university, because they perform their own evaluations.", },
            { q: "How long does the notarization process take?", a: "Same-day to 3 business days at most district-level notary offices in major cities. For urgency, use a private notary public (van phong cong chung tu)." }
          ]
        }
      },
      {
        id: "p1_degree", priority: "high", deadline: "2026-10-01",
        title: "Obtain certified English degree certificate",
        details: {
          what: "Your bachelor degree certificate (bang tot nghiep), certified and translated into English, proves you hold the minimum qualification for master admission. This is separate from the transcript and required by all programs.",
          steps: [
            "Obtain a certified copy of your original degree from your university's academic office if you have lost the original or need additional copies.",
            "If the degree is in Vietnamese only, hire a certified translator and have the translation notarized alongside the original.",
            "For German programs: the original + certified translation may need to be submitted by registered international post — check each program's instructions.",
            "For Swedish programs via universityadmissions.se: upload a high-resolution scan. Keep the original safe for potential authentication requests.",
            "Store the certified degree separately from the transcript — they are submitted independently to most programs."
          ],
          where: [
            { name: "universityadmissions.se upload guide", url: "https://www.universityadmissions.se/en/apply-for-studies/documents/" }
          ],
          docs: [
            "Original bachelor degree certificate",
            "Certified English translation",
            "Notarized copies",
            "University stamp verification (if required by program)"
          ],
          fees: "Same as transcript: translation ~200,000–500,000 VND/page, notarization ~50,000 VND/copy.",
          faq: [
            { q: "Do I need to send the original degree to Germany?", a: "German universities typically require certified copies ('beglaubigte Kopien') instead of originals. If your program uses uni-assist, the agency will guide authentication. Always follow the current instructions for your target university.", }
          ]
        }
      },
      {
        id: "p1_passport", priority: "normal", deadline: "2026-10-01",
        title: "Scan passport, verify validity through mid-2029",
        details: {
          what: "All applications require a passport scan. More importantly, if you are admitted, your passport must remain valid throughout your study period (typically 2 years from Sept 2027 = until Sept 2029). Check and renew now if needed.",
          steps: [
            "Open your passport and check the expiry date. It must be valid until at least March 2030 to be safe (2 years of study + 6-month buffer for visa processing).",
            "If your passport expires before mid-2029, apply for renewal at your nearest immigration office. Vietnamese passport renewal takes 5–15 business days.",
            "Scan the photo page at 300 dpi or higher — universities need to read all text clearly. Save as PDF and JPEG.",
            "Keep a physical copy in a separate location from the original."
          ],
          where: [
            { name: "Vietnam Immigration Department", url: "https://www.xuatnhapcanh.gov.vn" }
          ],
          docs: [
            "Current valid passport",
            "Passport-size photos (4x6 cm, white background) if renewing",
            "Household registration book (so ho khau) if renewing"
          ],
          fees: "Passport renewal: ~200,000–500,000 VND depending on processing speed. Scanning: free.",
          faq: [
            { q: "My passport expires in 2028 — is that enough?", a: "Borderline. A 2-year master program starting Sept 2027 ends Sept 2029. Most countries require 6 months of validity beyond your stay for visa purposes, meaning validity through March 2030 is ideal. Renew proactively." }
          ]
        }
      },
      {
        id: "p1_cv", priority: "high", deadline: "2026-10-15",
        title: "Prepare base academic CV",
        details: {
          what: "A clean, structured CV tailored for academic/scholarship applications. Different from a professional resume — it emphasizes education, publications (if any), academic projects, certifications, and professional experience linked to your study goals. Used across all applications.",
          steps: [
            "Use a clean one-column format (no tables). Recommended sections: Education | Work Experience | Certifications & Training | Technical Skills | Leadership & Volunteering | Languages.",
            "Quantify everything: not 'led security audits' but 'led PCI-DSS audit covering 5 payment systems for 2M monthly transactions'.",
            "For SISGP: also download and complete the SI mandatory CV template (si.se) — this is a separate document with fixed fields and is required in addition to your academic CV.",
            "Keep the base CV at 2 pages maximum. Tailor a slightly different version for each program's focus (security, data analysis, IS governance).",
            "Have a trusted English speaker proofread grammar and clarity before finalizing."
          ],
          where: [
            { name: "SI CV template", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/application-instructions/" }
          ],
          docs: [
            "List of all certifications with dates (BSCP, ISO 27001 auditor, etc.)",
            "List of all employers with precise dates and titles",
            "Names and contact of professional referees (for reference section)"
          ],
          fees: "Free. Grammarly Premium (~$12/month) helpful but optional.",
          faq: [
            { q: "Should I include a photo on the CV?", a: "For European university applications: generally no photo. For SISGP SI template: follow SI instructions exactly — the template will specify if a photo is needed." },
            { q: "Can I use a LinkedIn-generated CV?", a: "Use LinkedIn as a data source, but reformat it manually. Auto-generated CVs have inconsistent formatting and often include irrelevant sections. The SISGP SI template is a mandatory separate form." }
          ]
        }
      },
      {
        id: "p1_mannheim_audit", priority: "high", deadline: "2026-09-30",
        title: "Map transcript against Mannheim ECTS thresholds",
        details: {
          what: "Mannheim MSc Business Informatics and similar programs have specific prerequisite requirements in Informatics, Business, Mathematics, and Programming. Audit your transcript against the current entry requirements to assess eligibility and identify gaps before applying.",
          steps: [
            "Obtain the current prerequisite list from the program website. Exact thresholds change, so confirm the latest requirements directly with the admissions office.",
            "Convert your Vietnamese tin chi to ECTS: multiply each course credit by 1.5 to get approximate ECTS.",
            "Map each course from your transcript to one of the four categories. Use course names and descriptions — when in doubt, map to the most conservative category.",
            "Sum ECTS per category and compare to thresholds.",
            "If you are below threshold in one area, identify bridging courses (see p1_bridge item) that could address the gap before application.",
            "Document this mapping in a table — you may need to include it in your application or motivation letter to help Mannheim assess you."
          ],
          where: [
            { name: "Mannheim MSc Business Informatics program", url: "https://www.bwl.uni-mannheim.de/en/master-programs/msc-in-business-informatics/" }
          ],
          docs: [
            "Full transcript with course names and credit values",
            "Mannheim prerequisite list (download from program site)",
            "Your ECTS conversion table"
          ],
          fees: "No fee for the audit itself.",
          faq: [
            { q: "What if I am below one threshold?", a: "Mannheim sometimes admits applicants with minor deficiencies if the overall profile is strong. Address the gap in your motivation letter and consider bridging courses. Contact the admissions office at bwl.uni-mannheim.de before applying to get an informal assessment." }
          ]
        }
      },
      {
        id: "p1_bridge", priority: "normal", deadline: "2026-11-30",
        title: "Enroll in bridging course if short on math/stats or programming",
        details: {
          what: "If your transcript is short on mathematics, statistics, or programming ECTS required by Mannheim or other target programs, online bridging courses can fill the gap and signal initiative to admissions committees.",
          steps: [
            "Identify the specific gap from your Mannheim ECTS audit (p1_mannheim_audit).",
            "For programming: Harvard CS50P (free, Python-focused, auditable), or Coursera Michigan 'Python for Everybody' (certificate ~$49).",
            "For statistics: Coursera 'Statistics with Python' (UMich, ~$49), or edX 'Probability and Statistics in Data Science' (free to audit).",
            "For mathematics: Khan Academy free courses are sufficient for review; Coursera 'Mathematics for Machine Learning' (Imperial College) for formal certification.",
            "Complete and obtain a certificate. Include it in your CV and mention completion in your motivation letter.",
            "Note: online certificates supplement, they do not replace, formal ECTS. But they demonstrate self-directed learning valued by SISGP."
          ],
          where: [
            { name: "Harvard CS50P (free)", url: "https://cs50.harvard.edu/python/" },
            { name: "Coursera Python for Everybody", url: "https://www.coursera.org/specializations/python" },
            { name: "Coursera Statistics with Python", url: "https://www.coursera.org/specializations/statistics-with-python" }
          ],
          docs: [
            "Course completion certificate (PDF)",
            "Transcript of completion from the platform (for German universities)"
          ],
          fees: "Free to audit most courses. Certificates: $49–$79 per course on Coursera. edX: free audit or ~$100 for verified certificate.",
          faq: [
            { q: "Do MOOC certificates help my application?", a: "They are useful supplementary evidence, not primary credentials. A Coursera Python certificate will not compensate for a formal ECTS deficit, but it shows initiative and is valued in personal statements and CVs for both SISGP and academic programs." }
          ]
        }
      },
      {
        id: "p1_referees", priority: "high", deadline: "2026-09-15",
        title: "Approach two SISGP referees, confirm commitment",
        details: {
          what: "SISGP requires two reference letters from people who can speak to your professional excellence and leadership. SI sends the upload link directly to referees after you submit your scholarship application in February 2027. Without 2 uploaded references, your application is auto-disqualified.",
          steps: [
            "Identify two ideal referees: one current or recent supervisor (professional context) and one academic mentor or professor. Both should know you well enough to write specifically about your work and leadership.",
            "Approach each referee in person or by email. Explain the scholarship, the submission timeline (February 2027), and that SI will send them an upload link directly.",
            "Ask them explicitly if they can commit to submitting within 2 weeks of receiving the SI link.",
            "Identify a backup referee in case one withdraws — preferably another manager or senior colleague.",
            "Set a calendar reminder to brief referees fully in January 2027 (see p1_brief_referees)."
          ],
          where: [
            { name: "SISGP reference letter guidelines", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/application-instructions/" }
          ],
          docs: [
            "Referee contact details (name, title, email, institution)",
            "Brief summary of what you need them to emphasize (leadership, professional excellence)",
            "Draft timeline so they know when to expect the SI upload link"
          ],
          fees: "No cost.",
          faq: [
            { q: "Can a colleague (peer) be a referee?", a: "SI prefers supervisors, managers, professors, or senior leaders who can assess your professional performance. Peers are generally not suitable as primary referees." },
            { q: "What happens if a referee misses the deadline?", a: "Your application may be disqualified. Maintain a backup referee and monitor the status. SI's system typically shows whether referees have submitted. Follow up with referees 3 days before the deadline." }
          ]
        }
      },
      {
        id: "p1_brief_referees", priority: "high", deadline: "2026-09-30",
        title: "Brief referees with context, CV, programs, and SISGP criteria",
        details: {
          what: "Strong reference letters are specific, not generic. Briefing your referees with the right context dramatically improves the quality of the letters they write. Do this in September so they have time to prepare a draft before February.",
          steps: [
            "Schedule a 20-minute meeting or send a detailed briefing email to each referee.",
            "Share: (a) your current CV, (b) the SISGP selection criteria (professional excellence, leadership, SDG alignment, return commitment), (c) a list of 3–4 specific examples from your work together you would like them to highlight.",
            "Mention which programs you are applying to and why, so referees can tailor their letters to the academic context.",
            "Provide the expected timeline: application Feb 2027, SI upload link sent to them directly after your submission.",
            "Ask them to tell you if anything changes (new job, email change, planned leave) that might affect their availability in Feb 2027."
          ],
          where: [
            { name: "SI selection criteria guide", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/selection-criteria/" }
          ],
          docs: [
            "Your CV (latest version)",
            "SISGP selection criteria summary (1 page)",
            "List of suggested talking points for each referee",
            "Program list and motivation summary"
          ],
          fees: "No cost.",
          faq: [
            { q: "Is it appropriate to give referees talking points?", a: "Absolutely — it is standard practice and helps referees write stronger, more specific letters. You are not writing the letter for them; you are giving them context they may not remember after working with you years ago." }
          ]
        }
      },
      {
        id: "p1_sisgp_list", priority: "critical", deadline: "2026-11-30",
        title: "Check SISGP 2027/28 eligible program list (~mid-Nov 2026)",
        details: {
          what: "SI publishes the list of SISGP-eligible programs annually in mid-November. Only programs on this list qualify for the scholarship. Your ranked list on universityadmissions.se must contain at least one eligible program, or you cannot apply for SISGP.",
          steps: [
            "Set a calendar reminder for November 2026 to check the SI website.",
            "Navigate to si.se, Scholarships section, SISGP, then 'List of eligible programmes'.",
            "Verify that your target programs are on the current list. Program codes change year to year, so do not rely on previous-cycle examples.",
            "If a program you planned to apply for is NOT on the list, immediately adjust your universityadmissions.se ranking to include an eligible alternative.",
            "Note the program codes exactly — you will need them when submitting your SISGP application in February."
          ],
          where: [
            { name: "SISGP eligible programs list", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/eligible-programmes/" }
          ],
          docs: [
            "Printed/saved PDF of the eligible programs list once published",
            "Notes on alternative programs if your choices are not included"
          ],
          fees: "No cost.",
          faq: [
            { q: "What if the list changes from the previous year?", a: "It changes annually. Programs are added and removed. Do not assume the 2026/27 list applies to 2027/28. Always verify from the official SI website in November 2026." }
          ]
        }
      },
      {
        id: "p1_shortlist", priority: "critical", deadline: "2026-12-01",
        title: "Finalize 4-program shortlist for universityadmissions.se",
        details: {
          what: "Sweden uses a centralized application system (universityadmissions.se). You can apply to a maximum of 4 programs, ranked in binding order of preference. This is your binding Swedish application — the ranking matters for admission offers when seats are limited.",
          steps: [
            "Confirm IELTS score received and meets program requirements.",
            "Verify which Swedish programs are on the SISGP 2027/28 eligible list (from p1_sisgp_list).",
            "Research each candidate program: language of instruction, thesis options, specialization tracks, alumni outcomes.",
            "Rank programs 1–4 in genuine order of preference. The top rank is your primary choice — this is binding and cannot be changed after application.",
            "Create a universityadmissions.se account (if not already done) and prepare to submit in January 2027.",
            "Note: the application fee is SEK 900 (~€80), paid once for all 4 programs."
          ],
          where: [
            { name: "universityadmissions.se program search", url: "https://www.universityadmissions.se/en/courses-and-programmes/" }
          ],
          docs: [
            "IELTS result (TRF number or PDF)",
            "SISGP eligible programs list (Nov 2026)",
            "Your APS certificate if required by the Swedish program or scholarship application",
            "Transcript and degree (for upload)"
          ],
          fees: "SEK 900 (~€80) application fee paid via universityadmissions.se. One-time payment regardless of number of programs (up to 4).",
          faq: [
            { q: "Can I change my ranked list after submitting?", a: "During the application window you can edit. After the deadline (January 15, 2027), the ranking is locked. Choose your top choice carefully — it affects which admission offer you receive first." },
            { q: "Do I need to write motivation letters in universityadmissions.se?", a: "No. universityadmissions.se is only for submitting documents and paying the fee. Each university has its own portal where you upload your motivation letter. Do not confuse the two systems." }
          ]
        }
      }
    ]
  },
  {
    id: "p2", label: "PHASE 2", title: "Submission Wave", period: "November 2026 – January 2027",
    color: "purple",
    items: [
      {
        id: "p2_cybersure_letter", priority: "high", deadline: "2026-12-20",
        title: "Write CYBERSURE motivation letter",
        details: {
          what: "CYBERSURE is an Erasmus Mundus Joint Master (EMJM) in cybersecurity run by the Universities of Lorraine, UCLouvain, and KTH. The motivation letter (~600–800 words) must explain your cybersecurity background, research interests, and why this specific consortium fits your goals. A strong letter is the primary selection criterion.",
          steps: [
            "Research each partner university and their specific cybersecurity research areas (crypto, network security, formal methods). Mention 1–2 faculty or research groups by name.",
            "Structure: (1) Hook — a concrete security problem or incident that drives your interest. (2) Academic background — your relevant coursework and projects. (3) Professional experience — your cybersecurity-related work and previous roles. (4) Why CYBERSURE — specific curriculum elements, the multi-campus structure, research angle. (5) Career goal — how CYBERSURE serves your professional development.",
            "Do not write a generic 'I have always been interested in cybersecurity' opening. Be specific.",
            "Address the 3 key programs: Lorraine (cryptography/formal security), UCLouvain (systems security), KTH (network security). Show you understand the progression.",
            "Have a native English speaker review for clarity and tone before submitting.",
            "Keep it under 800 words — concise and specific beats comprehensive and generic."
          ],
          where: [
            { name: "CYBERSURE Erasmus Mundus program", url: "https://www.cybersure-master.eu" },
            { name: "Erasmus Mundus scholarship details", url: "https://www.eacea.ec.europa.eu/scholarships/emjm-scholarships_en" }
          ],
          docs: [
            "Your CV (cybersecurity-focused version)",
            "CYBERSURE program curriculum (download from cybersure-master.eu)",
            "Notes on specific faculty research interests at each partner university"
          ],
          fees: "No application fee for CYBERSURE. Allow budget for document translation, courier services, and visa application support if needed.",
          faq: [
            { q: "What does the CYBERSURE scholarship cover?", a: "Erasmus Mundus scholarships cover: full tuition at all partner universities, a monthly living allowance of approximately €1,400, travel and installation grants. Highly competitive — apply with a strong profile." },
            { q: "When are CYBERSURE results announced?", a: "Typically mid-March 2027. If admitted with scholarship, you can hold the offer while waiting for SISGP results (late April). However, you cannot accept both." }
          ]
        }
      },
      {
        id: "p2_cybersure_submit", priority: "high", deadline: "2027-01-05",
        title: "Submit CYBERSURE application",
        details: {
          what: "The formal online submission of the CYBERSURE Erasmus Mundus application through the program portal. Deadline is typically early January — check the exact date on cybersure-master.eu each year.",
          steps: [
            "Register on the CYBERSURE application portal at cybersure-master.eu.",
            "Upload all required documents: motivation letter, CV, bachelor transcript + translation, degree certificate + translation, IELTS/TOEFL result, two reference letters (or referee contact details if letters are submitted directly by referees), passport scan.",
            "Complete the application form sections: academic background, language proficiency, research interests, preferred study track.",
            "Review every field before submitting — applications cannot typically be edited after submission.",
            "Submit and save the confirmation email and application ID.",
            "Follow up with your referees to confirm they have received the request and will submit on time."
          ],
          where: [
            { name: "CYBERSURE application portal", url: "https://www.cybersure-master.eu/apply" }
          ],
          docs: [
            "Motivation letter (finalized from p2_cybersure_letter)",
            "CV",
            "Bachelor transcript + certified translation",
            "Degree certificate + certified translation",
            "IELTS/TOEFL certificate",
            "Passport scan",
            "Two reference letters or referee contact emails"
          ],
          fees: "No application fee.",
          faq: [
            { q: "How competitive is CYBERSURE?", a: "Very competitive globally. Strong candidates have a bachelor degree in CS/IS/engineering, demonstrable cybersecurity experience, research interest, and a strong motivation letter. A technical security background and relevant projects help distinguish your application." }
          ]
        }
      },
      {
        id: "p2_aalto_letter", priority: "normal", deadline: "2026-12-20",
        title: "[Optional] Write Aalto motivation letter",
        details: {
          what: "Aalto University (Helsinki) offers strong Master programs in Information Networks, Computer Science, and Cybersecurity. This is an optional backup with no scholarship attached. Some admitted international students receive tuition waivers, but verify the current funding rules before budgeting.",
          steps: [
            "Identify your preferred Aalto program: MSc Information Networks (multi-disciplinary, strong industry links) or MSc Computer Science (theoretical, research-oriented).",
            "Research Aalto-specific elements: their unique 'learning by doing' culture, co-design studios, industry collaboration model. Mention these specifically.",
            "Structure similarly to CYBERSURE letter but tailored to Aalto: hook, background, why Aalto, career goal.",
            "Keep under 500 words — Aalto typically expects a concise statement of purpose.",
            "Note: Aalto typically uses its own portal at admissions.aalto.fi. Studyinfo.fi is the central application portal for most other Finnish universities.",
          ],
          where: [
            { name: "Aalto University admissions", url: "https://admissions.aalto.fi" },
            { name: "Aalto MSc Information Networks", url: "https://www.aalto.fi/en/programmes/master-s-programme-in-information-networks" }
          ],
          docs: [
            "Tailored CV for Aalto",
            "Motivation letter draft",
            "Transcript and degree certificate (for upload)"
          ],
          fees: "€100 application fee per application (covers one Aalto program).",
          faq: [
            { q: "Does Aalto have a scholarship for international students?", a: "Aalto does not offer a fixed scholarship like SISGP. However, many admitted international students receive tuition waivers (you pay no tuition). Check the Aalto financial support page at the time of application." }
          ]
        }
      },
      {
        id: "p2_aalto_submit", priority: "normal", deadline: "2027-01-02",
        title: "[Optional] Submit Aalto application (~1 Dec – 2 Jan)",
        details: {
          what: "Formal submission of the Aalto University application via admissions.aalto.fi. The deadline is typically January 2, 2027 at 15:00 Finnish time (21:00 Vietnam time). Do not miss the timezone difference.",
          steps: [
            "Register or log into admissions.aalto.fi.",
            "Select your target program and intake (September 2027).",
            "Upload: motivation letter, CV, transcript, degree certificate, IELTS certificate, passport scan.",
            "Complete the online application form including references — Aalto may ask for referee email addresses rather than pre-uploaded letters.",
            "Pay the €100 fee by credit card or bank transfer.",
            "Submit before 15:00 Helsinki time on January 2 (21:00 Vietnam time). Do not wait for the last minute.",
            "Save confirmation email and application ID."
          ],
          where: [
            { name: "Aalto admissions portal", url: "https://admissions.aalto.fi" }
          ],
          docs: [
            "All documents prepared for CYBERSURE (reusable)",
            "€100 payment method (credit card)",
            "Accurate Helsinki timezone clock"
          ],
          fees: "€100 non-refundable application fee.",
          faq: [
            { q: "Can I apply to multiple Aalto programs?", a: "Each application covers one program. A separate €100 fee applies for each additional Aalto program. Choose your highest-priority Aalto program and submit one application unless budget allows more." }
          ]
        }
      },
      {
        id: "p2_tampere_letter", priority: "normal", deadline: "2026-12-28",
        title: "[Optional] Write Tampere/Finland motivation letter",
        details: {
          what: "Many Finnish universities use studyinfo.fi for master applications. Programs in Information Technology, Software Engineering, and Data Science are good backup options. Confirm whether one motivation letter is accepted across your chosen Finnish applications.",
          steps: [
            "Identify your target Finnish program and learn the specific focus areas or specialization tracks.",
            "Write a motivation letter tailored to the program's curriculum. Research faculty research groups if applying to a research-track program.",
            "Keep it concise — many Finnish programs prefer concise statements rather than long essays.",
            "Note: JYU (Jyvaskyla) MSc Information Systems often includes information systems management, governance, and data-driven decision-making themes."
          ],
          where: [
            { name: "studyinfo.fi Finnish universities portal", url: "https://studyinfo.fi/app" },
            { name: "Tampere University international admissions", url: "https://www.tuni.fi/en/study-with-us/admissions" }
          ],
          docs: [
            "Tailored motivation letter (shorter than CYBERSURE/Sweden letters)",
            "CV",
            "Transcript and degree certificate"
          ],
          fees: "€100 covers all Finnish universities applied to through studyinfo.fi in one application round. Allow extra budget for certified translations, document shipping, and visa support materials.",
          faq: [
            { q: "How does studyinfo.fi work vs. Aalto?", a: "studyinfo.fi is the central portal for all Finnish universities except Aalto (which has its own system). Pay once (€100) and apply to multiple Finnish programs in one round. Aalto is separate and has its own €100 fee." }
          ]
        }
      },
      {
        id: "p2_tampere_submit", priority: "normal", deadline: "2027-01-07",
        title: "[Optional] Submit Tampere/Finnish app via studyinfo.fi",
        details: {
          what: "Formal submission through studyinfo.fi for Tampere, JYU, or other Finnish university programs. Application windows are usually mid-December to early January, but the exact dates vary by year.",
          steps: [
            "Log into studyinfo.fi with your existing account or create one.",
            "Search for and add your target Finnish master programs.",
            "Upload required documents per program (typically: transcript, degree, IELTS, motivation letter, CV).",
            "Pay the €100 application fee.",
            "Submit before the portal's published deadline, accounting for Helsinki time if you are applying from Vietnam.",
            "Save confirmation and check the applicant portal for document verification status in the weeks after submission."
          ],
          where: [
            { name: "studyinfo.fi", url: "https://studyinfo.fi/app" }
          ],
          docs: [
            "All standard documents (reuse from other applications)",
            "€100 payment method"
          ],
          fees: "€100 covers all Finnish programs in one round (one-time fee for studyinfo.fi).",
          faq: [
            { q: "When do Finnish universities announce results?", a: "Typically April 2027. Some programs announce in March. You will receive an email notification from studyinfo.fi and can check your applicant portal." }
          ]
        }
      },
      {
        id: "p2_sweden_letters", priority: "critical", deadline: "2027-01-10",
        title: "Write Swedish motivation letters (one per program, SDG narrative)",
        details: {
          what: "Each Swedish university has its own portal where you upload a program-specific motivation letter. These are separate from universityadmissions.se (which only collects documents and fees). Strong Swedish motivation letters should address SDG alignment if you are applying for SISGP, because that scholarship evaluates your development impact.",
          steps: [
            "For each of your 4 Swedish programs, write a distinct letter (500–800 words) tailored to that program's curriculum, faculty, and research focus.",
            "Include an explicit SDG section: identify the SDG most relevant to your work (SDG 9 — Industry, Innovation and Infrastructure; SDG 16 — Peace, Justice and Strong Institutions). Explain how your planned studies at that specific university connect to achieving progress on that goal.",
            "Structure: hook (security problem in your context) → background → why this program → SDG connection → career return plan.",
            "Do not reuse the same letter for multiple programs. Admissions readers can tell, and SISGP evaluators specifically assess whether SDG alignment is genuine.",
            "Upload each letter to the respective university portal (not universityadmissions.se).",
            "Note the individual university upload deadlines — they may vary slightly from the universityadmissions.se document deadline (typically Feb 2, 2027)."
          ],
          where: [
            { name: "Orebro University application portal", url: "https://www.oru.se/english/education/study-at-orebro-university/admission/" },
            { name: "Stockholm University application portal", url: "https://www.su.se/english/education/how-to-apply" },
            { name: "UN Sustainable Development Goals", url: "https://sdgs.un.org/goals" }
          ],
          docs: [
            "SDG 9 and SDG 16 description pages (save for reference)",
            "Curriculum of each target program",
            "Faculty research profiles for each program"
          ],
          fees: "No fee for the letters themselves.",
          faq: [
            { q: "Which SDG should I choose for cybersecurity/IS?", a: "SDG 9 (Build resilient infrastructure, promote inclusive and sustainable industrialization, foster innovation) is the strongest fit for cybersecurity and IS work. SDG 16 (Promote peaceful and inclusive societies, access to justice, build effective institutions) is also relevant if your focus is on governance. Be specific about how your work connects — vague SDG claims weaken your SISGP application." },
            { q: "Do I need a separate SDG essay for SISGP?", a: "No separate essay — your motivation letters and the SISGP motivation letter (Phase 3) collectively demonstrate SDG alignment. The Swedish university letters are good practice for articulating this." }
          ]
        }
      },
      {
        id: "p2_sweden_submit", priority: "critical", deadline: "2027-01-15",
        title: "Submit Sweden applications via universityadmissions.se",
        details: {
          what: "The universityadmissions.se submission is primarily document upload and fee payment — not motivation letters (those go to individual university portals). This is the formal registration for all 4 Swedish programs. Deadline: January 15, 2027.",
          steps: [
            "Log into universityadmissions.se with your account.",
            "Confirm your 4 ranked programs are correctly listed.",
            "Upload supporting documents: scanned degree certificate, academic transcript (both with certified English translations), IELTS/TOEFL certificate, passport scan, and APS certificate if the program or portal specifically requests it.",
            "Pay the SEK 900 (~€80) application fee by credit/debit card.",
            "Submit before 23:59 Stockholm time on January 15 (05:59 Vietnam time on January 16).",
            "Note: some document upload deadlines may extend after program ranking. Always confirm the current year's exact dates on universityadmissions.se.",
            "After submission, upload motivation letters to each individual university portal by their respective deadlines."
          ],
          where: [
            { name: "universityadmissions.se", url: "https://www.universityadmissions.se" }
          ],
          docs: [
            "Bachelor degree certificate + certified English translation",
            "Full academic transcript + certified English translation",
            "IELTS/TOEFL certificate",
            "Passport scan",
            "APS certificate (Vietnamese applicants must submit this)",
            "SEK 900 payment method"
          ],
          fees: "SEK 900 (~€80) one-time application fee for all 4 Swedish programs.",
          faq: [
            { q: "Do I upload motivation letters to universityadmissions.se?", a: "No. universityadmissions.se is for documents (transcripts, degree, IELTS) and fee payment only. Motivation letters go to each individual university portal. This is a very common source of confusion — confirm with each university's own instructions." }
          ]
        }
      }
    ]
  },
  {
    id: "p3", label: "PHASE 3", title: "SISGP Scholarship Application", period: "February 2027",
    color: "teal",
    items: [
      {
        id: "p3_si_template", priority: "critical", deadline: "2027-02-05",
        title: "Download SI mandatory CV template and complete it",
        details: {
          what: "SISGP requires applicants to use a specific CV template published by the Swedish Institute — not your own academic CV format. This template has fixed fields and a structure SI expects. Submitting a non-template CV risks rejection or disqualification.",
          steps: [
            "Go to si.se and navigate to the SISGP application instructions page. Download the current-year CV template (it is updated annually — do not reuse a template from a previous year).",
            "The template has fixed sections: Personal Information, Education, Professional Experience (with dates, employer, role, weekly hours), Leadership Experience, Languages, and a few more.",
            "Fill in Professional Experience with exact weekly contracted hours for each employer — this is how SI verifies your 3,000-hour eligibility. Maximum 3 employers.",
            "Leadership section: be specific and concrete. Not 'participated in community events' but 'Chaired monthly security awareness sessions for a team, resulting in measurable improvement in security awareness metrics.'",
            "Do not modify the template format. Do not add your own sections. Submit it exactly as designed.",
            "Save as PDF before submitting — some systems require PDF format."
          ],
          where: [
            { name: "SI SISGP application instructions (includes CV template)", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/application-instructions/" }
          ],
          docs: [
            "Downloaded SI CV template (new version for the current application year)",
            "All employment certificates (for cross-referencing weekly hours)",
            "List of leadership activities with specific outcomes and metrics"
          ],
          fees: "No cost.",
          faq: [
            { q: "Can I add my own section to the SI CV template?", a: "No. SI evaluators are instructed to reject non-compliant formats. Fill in all fields using the template structure only. If a section does not apply, leave it blank rather than modifying the template." },
            { q: "What if the template changes from the year I downloaded it?", a: "Always download fresh from si.se during the application window. The template is typically released in early February when the scholarship portal opens." }
          ]
        }
      },
      {
        id: "p3_sisgp_letter", priority: "critical", deadline: "2027-02-10",
        title: "Write SISGP motivation letter (SDG/leadership narrative)",
        details: {
          what: "The SISGP motivation letter (approximately 400–600 words) is the most important piece of your scholarship application. It must directly address all 4 SI selection criteria: professional excellence, leadership, SDG alignment, and commitment to return and contribute to your home country.",
          steps: [
            "Open the SISGP selection criteria page (si.se) and read the rubric. Every paragraph of your letter should map to at least one criterion.",
            "Professional excellence: specific achievement at work or previous employers. Use metrics. 'Led a compliance audit for a payment platform handling millions of transactions monthly.'",
            "Leadership: a specific initiative you drove. Not a role you held — an outcome you created. Include people impacted.",
            "SDG alignment: name your SDG (suggest SDG 9), explain specifically how your planned program connects to it, and how you will use the knowledge at home. Be concrete: 'I will apply cybersecurity knowledge to strengthen Vietnam financial services infrastructure, supporting SDG 9.3 (access to financial services for SMEs).'",
            "Return commitment: Vietnam-specific. What role, which sector, what contribution? SI wants to fund leaders who will return and drive development — not those who intend to stay in Sweden.",
            "Every claim must be documentable (evidenced in your CV, reference letters, or supporting documents). Do not overclaim.",
            "Have a trusted reviewer assess the letter against the 4 criteria before submitting."
          ],
          where: [
            { name: "SISGP selection criteria", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/selection-criteria/" }
          ],
          docs: [
            "SISGP selection criteria print-out (use as checklist while writing)",
            "Your final CV",
            "List of specific achievements with metrics from professional history"
          ],
          fees: "No cost.",
          faq: [
            { q: "How important is the return commitment?", a: "Critical. SI explicitly funds leadership for global development, not emigration. A vague return commitment ('I plan to bring knowledge back') is weak. A specific one ('I will join [Organization/Ministry] in Vietnam to [specific role] addressing [specific problem]') is strong." },
            { q: "How long should the letter be?", a: "400–600 words. Concise, substantive, and specific. Every sentence must earn its place by addressing a selection criterion." }
          ]
        }
      },
      {
        id: "p3_references", priority: "critical", deadline: "2027-02-07",
        title: "Confirm both SISGP reference letters are uploaded",
        details: {
          what: "SI sends upload links directly to your referees after you submit your SISGP application. You cannot upload reference letters yourself. Without 2 submitted references, your scholarship application is automatically disqualified — regardless of how strong the rest of your application is.",
          steps: [
            "Submit your SISGP application as soon as the portal opens (~February 9). This triggers the automatic email from SI to your referees.",
            "Alert both referees immediately after you submit: 'I just submitted. You should receive an email from SI shortly. Please check spam and submit within 5 days.'",
            "In the SI applicant portal, check the reference status. Most years you can see whether each referee has submitted.",
            "If a referee has not submitted after 7 days, follow up personally. If a referee is unreachable, contact SI support immediately to ask about substituting your backup referee.",
            "Confirm both letters are marked 'Submitted' in the SI portal before the scholarship deadline."
          ],
          where: [
            { name: "SISGP applicant portal", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" }
          ],
          docs: [
            "Referee names and email addresses (the ones registered in the SI application)",
            "Your backup referee contact details"
          ],
          fees: "No cost.",
          faq: [
            { q: "What if an SI email to my referee goes to spam?", a: "Very common. Warn your referees proactively that an email from si.se will arrive and to whitelist the domain or check spam folders. Failure to find this email is the most common reason references are missed." }
          ]
        }
      },
      {
        id: "p3_hours_proof", priority: "critical", deadline: "2027-02-07",
        title: "Assemble formatted work-hours proof package PDF",
        details: {
          what: "SI requires a structured proof-of-work-hours document to verify your 3,000+ hour eligibility. This is a single merged PDF: a summary table on page 1, followed by each employment certificate as subsequent pages.",
          steps: [
            "Create Page 1: a clean table with columns — Employer | Employment Period | Contracted Hours/Week | Total Weeks | Total Hours. Sum the final column to show ≥ 3,000 hours.",
            "Verify every number against the corresponding employment certificate — the numbers must match exactly. Discrepancies will cause rejection.",
            "Arrange the employment certificates in the same order as your table rows.",
            "Merge all pages into a single PDF: ilovepdf.com or smallpdf.com (free). Name the file clearly: 'WorkHoursProof_YourName.pdf'.",
            "Review the merged PDF on a device other than your computer to ensure formatting survived the merge.",
            "Upload to the SI application portal when prompted."
          ],
          where: [
            { name: "ilovepdf free PDF merger", url: "https://www.ilovepdf.com/merge_pdf" }
          ],
          docs: [
            "Summary hours table (prepared in Phase 0, p0_hours_tally)",
            "Employment certificates from all employers (current + past)",
            "PDF merge tool"
          ],
          fees: "Free using online tools.",
          faq: [
            { q: "Can I submit the employment certificates separately instead of merged?", a: "SI typically requires a single document. If the portal allows multiple uploads, follow portal instructions. When in doubt, merge into one PDF — it is easier for evaluators and avoids missing attachments." }
          ]
        }
      },
      {
        id: "p3_leadership_pack", priority: "critical", deadline: "2027-02-07",
        title: "Assemble leadership evidence documentation package PDF",
        details: {
          what: "SI evaluates leadership as a primary criterion. Alongside your CV and motivation letter, you submit a supporting evidence package containing documents that prove your leadership claims. This must exactly match what you wrote in the SI CV template and motivation letter.",
          steps: [
            "Create Page 1: a summary list — Role | Organization | Date Range | People Impacted | Measurable Outcome. List all leadership activities you claimed in your CV and letter.",
            "For each activity, attach its supporting document: appointment letter, committee minutes, award certificate, article, org chart, project completion letter.",
            "Arrange documents in the same order as your summary list.",
            "Cross-check every claim against this package: if you wrote it in the CV or letter, there must be a supporting document here.",
            "Merge into a single PDF. Name clearly: 'LeadershipEvidence_YourName.pdf'.",
            "Review for consistency — SI evaluators compare the motivation letter, CV, and evidence package for coherence."
          ],
          where: [
            { name: "SI leadership criterion definition", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/selection-criteria/" }
          ],
          docs: [
            "All leadership documents gathered in Phase 0 (p0_leadership)",
            "Summary table (prepare now if not done in Phase 0)",
            "Appointment letters, certificates, committee records"
          ],
          fees: "Free. Scanning documents: free at most photocopy shops for ≤20,000 VND/page.",
          faq: [
            { q: "What if some leadership activities lack formal documentation?", a: "A signed letter from the organization confirming your role is acceptable. Even a formal email from a supervisor describing the impact of your initiative can serve as supporting evidence. Informal photos or event programs are supplementary at best." }
          ]
        }
      },
      {
        id: "p3_sisgp_submit", priority: "critical", deadline: "2027-02-25",
        title: "Submit SISGP scholarship application (~9–25 Feb 2027)",
        details: {
          what: "The final SISGP scholarship application submission via the SI portal. The window typically opens February 9 and closes February 25, 2027. Submit early — do not wait until the last day, as technical issues near deadlines are common.",
          steps: [
            "When the SI portal opens (~Feb 9), log in and verify your pre-filled information from the account you created.",
            "Upload all required documents: SI CV template, motivation letter, work hours proof PDF, leadership evidence PDF. Follow the portal's upload instructions for file size and format.",
            "Enter your referee email addresses. This triggers SI to send them the reference upload links.",
            "Review the entire application: ensure all fields are complete and all documents are uploaded correctly.",
            "Submit. You will receive a confirmation email with an application reference number.",
            "Monitor the applicant portal daily to confirm referee submissions and any document verification requests from SI."
          ],
          where: [
            { name: "SISGP application portal", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/how-to-apply/" }
          ],
          docs: [
            "SI CV template (completed)",
            "SISGP motivation letter",
            "Work hours proof PDF (p3_hours_proof)",
            "Leadership evidence PDF (p3_leadership_pack)",
            "Referee email addresses"
          ],
          fees: "No application fee. The SISGP award typically includes tuition coverage plus a monthly stipend and a travel grant, though the exact terms depend on the current year.",
          faq: [
            { q: "What if I submit and then find an error?", a: "Contact the SI help desk immediately at scholarships@si.se. Some errors can be corrected before the deadline with SI support. Do not assume submitted applications are locked forever — but act immediately." },
            { q: "When do SISGP results come out?", a: "Typically late April 2027. You receive an email from SI. Acceptance must be confirmed within a short window (usually 1–2 weeks). Verify whether accepting SISGP would preclude another funded offer like CYBERSURE." }
          ]
        }
      }
    ]
  },
  {
    id: "p4", label: "PHASE 4", title: "Results, Late Deadlines & Decision", period: "March – June 2027",
    color: "blue",
    items: [
      {
        id: "p4_cybersure_result", priority: "normal", deadline: "2027-03-31",
        title: "Review CYBERSURE result (~mid-March)",
        details: {
          what: "CYBERSURE typically notifies applicants in mid-March 2027. If admitted with scholarship, this is a top-tier outcome. If admitted without scholarship, weigh the tuition cost against SISGP-funded Sweden options.",
          steps: [
            "Check your email from cybersure-master.eu and your application portal status.",
            "If admitted with Erasmus Mundus scholarship: note the acceptance deadline and response required (usually 2–3 weeks). Do not accept yet if SISGP result is pending in April.",
            "Contact CYBERSURE admissions and explain you are awaiting another scholarship decision. Request a 2-week extension. They are often accommodating for strong candidates.",
            "If admitted without scholarship: calculate total program cost vs. SISGP (free). Erasmus Mundus without scholarship may still be viable if living costs are lower than tuition.",
            "If waitlisted: stay engaged. Waitlist movement happens in April–May."
          ],
          where: [
            { name: "CYBERSURE applicant portal", url: "https://www.cybersure-master.eu/apply" }
          ],
          docs: [
            "CYBERSURE admission letter",
            "Financial comparison: CYBERSURE vs SISGP vs Finland"
          ],
          fees: "No fee at this stage.",
          faq: [
            { q: "Can I hold both CYBERSURE and SISGP offers simultaneously?", a: "Check the terms of each scholarship carefully. Some funded awards require a commitment that precludes accepting another scholarship at the same time.", }
          ]
        }
      },
      {
        id: "p4_sweden_result", priority: "normal", deadline: "2027-03-31",
        title: "Review Sweden admission result (~late March)",
        details: {
          what: "Swedish university admission results are released via universityadmissions.se in late March. This is admission-only — the SISGP scholarship result is separate and comes in late April. Being admitted is necessary but not sufficient for SISGP.",
          steps: [
            "Log into universityadmissions.se and check your admission status under 'My Application'.",
            "You will see: 'Conditionally admitted' (offer pending document verification) or 'Admitted'. Conditional offers become firm when university verifies your documents.",
            "If admitted to your top-ranked program: congratulations — this is needed for SISGP (you must have an admission to a SISGP-eligible program).",
            "If not admitted to your #1 program but admitted to #2 or #3: this still qualifies for SISGP if the program is on the eligible list.",
            "If not admitted to any program: contact each university individually. There may be appeals processes or late-round admissions.",
            "Do not confuse this result with the SISGP scholarship result — they are separate decisions."
          ],
          where: [
            { name: "universityadmissions.se my application", url: "https://www.universityadmissions.se/en/apply-for-studies/follow-your-application/" }
          ],
          docs: [
            "universityadmissions.se login credentials",
            "Note of your 4-program ranking and SISGP eligibility status of each"
          ],
          fees: "No fee.",
          faq: [
            { q: "What does Conditionally Admitted mean?", a: "It means the university intends to admit you, pending verification that your uploaded documents are authentic. Once verified (usually by May), the conditional status becomes Admitted. You cannot enroll with a conditional offer." }
          ]
        }
      },
      {
        id: "p4_sisgp_result", priority: "normal", deadline: "2027-04-30",
        title: "Review SISGP scholarship result (~late April)",
        details: {
          what: "The SISGP scholarship result is released in late April 2027. This is separate from the Swedish admission decision. A positive SISGP result combined with a Swedish admission = fully funded master degree. This is the primary funding outcome to wait for.",
          steps: [
            "SI sends an email notification to your registered email address. Also check the SISGP applicant portal.",
            "If awarded: you have a short acceptance window (typically 7–14 days). Do not miss this deadline.",
            "If awarded: you must now choose between SISGP and CYBERSURE (if you received that offer). Compare: SISGP covers tuition + SEK 12,000/month + travel grant at a Swedish university. CYBERSURE covers tuition + ~€1,400/month at 3 European universities across 2 years.",
            "If not awarded (reserve list): stay on the list. Reserve candidates are often awarded scholarships in May–June as primary awardees decline.",
            "If not awarded at all: revert to Plan B — Finnish tuition waiver programs or German self-funded options (Mannheim, Cologne)."
          ],
          where: [
            { name: "SISGP result notification", url: "https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/" }
          ],
          docs: [
            "SI award letter (save PDF immediately)",
            "Acceptance deadline noted in calendar",
            "Comparison matrix: SISGP vs CYBERSURE vs alternatives"
          ],
          fees: "No fee. SISGP award: tuition + SEK 12,000/month + SEK 15,000 travel + insurance.",
          faq: [
            { q: "What is the monthly SISGP stipend in real terms?", a: "SEK 12,000/month (as of recent years) = approximately €1,050/month at current exchange rates. Sweden is expensive — average student living costs are SEK 8,000–12,000/month in smaller cities, more in Stockholm. The stipend covers basic needs but requires budgeting." }
          ]
        }
      },
      {
        id: "p4_finland_result", priority: "normal", deadline: "2027-04-30",
        title: "Review Finland results (Aalto/Tampere/JYU) (~April)",
        details: {
          what: "Finnish university admission results are typically released in April 2027. Many Finnish universities offer tuition waivers to admitted international master students, making admission alone a financially viable option if SISGP does not come through.",
          steps: [
            "Check your studyinfo.fi applicant portal for result notifications from Tampere/JYU.",
            "Check admissions.aalto.fi separately for Aalto results.",
            "If admitted: check each university's financial aid page for tuition waiver status. Waivers are often automatic for admitted international students but sometimes require a separate application.",
            "Evaluate: Finnish programs without scholarship mean living costs (~€800–1,200/month) but often no tuition. Compare to German programs.",
            "If Finnish backup is your strongest non-SISGP option, begin apartment search and visa application planning."
          ],
          where: [
            { name: "studyinfo.fi applicant portal", url: "https://studyinfo.fi/app" },
            { name: "Aalto admissions portal", url: "https://admissions.aalto.fi" }
          ],
          docs: [
            "Admission letters from each Finnish university",
            "Tuition waiver confirmation (if applicable)",
            "Finnish student visa requirements (Migri.fi)"
          ],
          fees: "Finnish visa fee: €350–520 depending on type. Student residence permit application via Migri.fi.",
          faq: [
            { q: "Does Finland offer merit scholarships for international students?", a: "Finnish universities have limited merit scholarships — most support comes through tuition waivers. Check each university Foundation scholarship page. Aalto, Tampere, and JYU all have some scholarship funds, though smaller than SISGP." }
          ]
        }
      },
      {
        id: "p4_mannheim_apply", priority: "high", deadline: "2027-05-15",
        title: "[Backup] Apply to Mannheim MSc Business Informatics (~15 May)",
        details: {
          what: "If your preferred scholarship-funded options (SISGP, CYBERSURE, Finnish waiver) have not materialized by May, apply to Mannheim MSc Business Informatics as a self-funded backup. Mannheim is a strong academic option in Germany, and the program emphasizes business and information systems.",
          steps: [
            "Apply via Mannheim's own portal: bewerber.uni-mannheim.de (not a central portal).",
            "Required documents: academic CV, motivation letter, transcript + certified translation, degree certificate + certified translation, IELTS certificate, APS certificate if required.",
            "If APS is required, follow Mannheim's current instructions exactly. Some applicants must provide a sealed original APS via post, while others may be able to upload a certified scan. Verify the current process with Mannheim admissions.",
            "Prepare a motivation letter specifically for Mannheim: emphasize the Business Informatics curriculum fit, your background in information systems and related domains, and your career goals.",
            "Mannheim admission decisions are typically released in early summer."
          ],
          where: [
            { name: "Mannheim MSc Business Informatics", url: "https://www.bwl.uni-mannheim.de/en/master-programs/msc-in-business-informatics/" },
            { name: "Mannheim application portal", url: "https://bewerber.uni-mannheim.de" }
          ],
          docs: [
            "APS certificate original (sent by registered post to Mannheim)",
            "All standard academic documents",
            "Mannheim-specific motivation letter"
          ],
          fees: "No application fee for Mannheim. Tuition for non-EU students is modest compared to many private programs, but verify the exact figures on the program site. Living costs in Mannheim are comparable to other German university cities.",
          faq: [
            { q: "Why is Mannheim a backup rather than a primary choice?", a: "Mannheim is excellent academically, but without a scholarship you will need to self-fund both tuition and living costs. SISGP or CYBERSURE scholarships may offer a stronger financial outcome if awarded. Mannheim is still a strong option for self-funded study." }
          ]
        }
      },
      {
        id: "p4_cologne_apply", priority: "high", deadline: "2027-06-15",
        title: "[Backup] Apply to Cologne MSc IS via uni-assist (~15 June)",
        details: {
          what: "University of Cologne MSc Information Systems is another strong German backup, applied through uni-assist (the central German application service for international applicants). Deadlines are typically in early to mid-June, and uni-assist processing can take several weeks.",
          steps: [
            "Register at uni-assist.de and create an applicant profile.",
            "Select University of Cologne and the MSc Information Systems program.",
            "Upload all required documents through uni-assist: transcript, degree certificate, certified translations, IELTS, APS certificate if required.",
            "Pay the uni-assist application fees and any additional per-university charges for the same round.",
            "Submit to uni-assist as early as possible to allow several weeks for processing before the published Cologne deadline.",
            "Uni-assist forwards your processed dossier to Cologne admissions. You may need to create a separate Cologne applicant portal account for additional documents."
          ],
          where: [
            { name: "uni-assist central portal", url: "https://www.uni-assist.de" },
            { name: "University of Cologne MSc Information Systems", url: "https://www.wiso.uni-koeln.de/en/studying/masters/information-systems/" }
          ],
          docs: [
            "APS certificate (sealed, sent to uni-assist postal address by registered mail)",
            "All standard documents via uni-assist upload",
            "€75 + €30 payment for uni-assist fees"
          ],
          fees: "uni-assist charges a base fee plus additional per-university fees in the same round. Cologne tuition is charged separately by the university, and living costs are comparable to other German university cities.",
          faq: [
            { q: "Can I apply to both Mannheim and Cologne through uni-assist?", a: "Mannheim uses its own portal (bewerber.uni-mannheim.de), not uni-assist. Cologne uses uni-assist. Apply to each through the correct channel. If applying to other German universities through uni-assist in the same round, the additional €30 fee per university applies." }
          ]
        }
      },
      {
        id: "p4_decision", priority: "critical", deadline: "2027-06-30",
        title: "Make final enrollment decision and accept offer",
        details: {
          what: "By June 2027 you should have clarity on all offers and can make a final enrollment decision. This determines which program to formally accept, visa to apply for, and preparations to begin.",
          steps: [
            "List all offers with their financial packages, program quality assessment, location preferences, and career alignment.",
            "Recommended priority order: (1) SISGP-funded Swedish program (full scholarship + stipend, best ROI), (2) CYBERSURE scholarship (Erasmus Mundus, multi-country experience, excellent networks), (3) Finnish program with tuition waiver (low cost, good quality), (4) Mannheim or Cologne self-funded (quality education, requires personal investment).",
            "Accept your chosen offer by the specified deadline. Decline all other offers promptly (this is courteous and allows waitlisted candidates to advance).",
            "Begin visa application immediately after acceptance. Processing times vary by country and can range from several weeks to a few months, so start early and follow the current embassy/immigration guidance.",
            "Research accommodation: student dormitory applications open immediately after admission in most cities.",
            "Apply for any required pre-enrollment documents (medical certificates, certificate of good conduct) that some countries require."
          ],
          where: [
            { name: "Sweden Migrationsverket student visa", url: "https://www.migrationsverket.se/English/Private-individuals/Studying-in-Sweden.html" },
            { name: "Finland Migri student residence permit", url: "https://migri.fi/en/studying" },
            { name: "German Embassy Hanoi National D-Visa", url: "https://hanoi.diplo.de/vn-vi/service/visa" }
          ],
          docs: [
            "Formal offer/acceptance letter from your chosen university",
            "Passport (valid through study period + 6 months)",
            "Financial proof (for visa: bank statements showing living expenses coverage)",
            "Health insurance documentation"
          ],
          fees: "Visa fees vary by country and year. Check the current rates on the official immigration or embassy websites. Travel: book early for the best flight prices.",
          faq: [
            { q: "What if no strong offer materializes by June?", a: "This would be a rare but possible outcome. Regroup: reapply next cycle with a stronger application (improved IELTS, more leadership documentation, stronger letters). The application framework and documents you built this year are entirely reusable next year with updates." },
            { q: "Do I need to give notice before enrolling?", a: "Standard notice in Vietnam is typically 30–45 days. Once you have an official acceptance and visa, give formal notice to your employer and maintain professionalism — you may want their reference or network connections in future." }
          ]
        }
      }
    ]
  }
];

// ─── Helper functions ────────────────────────────────────────────────
function daysUntil(ds) {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(ds + "T00:00:00");
  return Math.round((d - today) / 86400000);
}

function fmtDate(ds) {
  return new Date(ds + "T00:00:00").toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
}

// ─── Pill component ───────────────────────────────────────────────────
function Pill({ deadline, done }) {
  if (done) return (
    <span style={{ background:"#D1FAE5", color:"#065F46", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>
      Done ✓
    </span>
  );
  const d = daysUntil(deadline);
  let bg, color, label;
  if (d < 0)       { bg="#FEE2E2"; color="#991B1B"; label=`${Math.abs(d)}d overdue`; }
  else if (d === 0) { bg="#FEF3C7"; color="#92400E"; label="Due today"; }
  else if (d <= 7)  { bg="#FEF3C7"; color="#92400E"; label=`${d}d left`; }
  else if (d <= 30) { bg="#EFF6FF"; color="#1E3A8A"; label=`${d}d left`; }
  else              { bg:"#F3F4F6"; color="#6B7280"; label=fmtDate(deadline); }
  return (
    <span style={{ background:bg, color, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

// ─── Sec (section block) component ───────────────────────────────────
function Sec({ icon: Icon, title, children, dotColor }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
        <Icon size={14} color={dotColor} strokeWidth={2.5} />
        <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:"#6B7280" }}>{title}</span>
      </div>
      <div style={{ paddingLeft:20 }}>{children}</div>
    </div>
  );
}

// ─── DetailPanel component ─────────────────────────────────────────────
function DetailPanel({ details, note, onNoteUpdate, dotColor, itemTitle }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(note || "");

  if (!details) return null;

  const cardStyle = {
    background:"#FFFFFF",
    border:"1px solid #E5E7EB",
    borderLeft:`3px solid ${dotColor}`,
    borderRadius:8,
    padding:"16px 20px",
    marginTop:8,
    fontSize:13,
    color:"#374151",
    lineHeight:1.7
  };

  return (
    <div style={cardStyle}>
      {/* What is it */}
      <Sec icon={Info} title="What is it?" dotColor={dotColor}>
        <p style={{ margin:0 }}>{details.what}</p>
      </Sec>

      {/* Process */}
      <Sec icon={ListChecks} title="Process" dotColor={dotColor}>
        <ol style={{ margin:0, paddingLeft:16 }}>
          {details.steps.map((s, i) => (
            <li key={i} style={{ marginBottom:6 }}>{s}</li>
          ))}
        </ol>
      </Sec>

      {/* Where / Sources */}
      {details.where && details.where.length > 0 && (
        <Sec icon={MapPin} title="Where to apply / Sources" dotColor={dotColor}>
          <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
            {details.where.map((w, i) => (
              <a key={i} href={w.url} target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", gap:4, color:dotColor, textDecoration:"none", fontWeight:500 }}>
                <ExternalLink size={11} />
                {w.name}
              </a>
            ))}
          </div>
        </Sec>
      )}

      {/* Documents */}
      <Sec icon={FileText} title="Documents to prepare" dotColor={dotColor}>
        <ul style={{ margin:0, paddingLeft:16 }}>
          {details.docs.map((d, i) => (
            <li key={i} style={{ marginBottom:4 }}>{d}</li>
          ))}
        </ul>
      </Sec>

      {/* Fees */}
      <Sec icon={Coins} title="Fees" dotColor={dotColor}>
        <div style={{ background:`${dotColor}12`, border:`1px solid ${dotColor}30`, borderRadius:6, padding:"8px 12px" }}>
          {details.fees}
        </div>
      </Sec>

      {/* FAQ */}
      {details.faq && details.faq.length > 0 && (
        <Sec icon={HelpCircle} title="FAQ" dotColor={dotColor}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {details.faq.map((item, i) => (
              <div key={i} style={{ border:"1px solid #E5E7EB", borderRadius:6, overflow:"hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width:"100%", background:"#F9FAFB", border:"none", padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left", fontSize:12, fontWeight:600, color:"#374151" }}>
                  <span style={{ flex:1, paddingRight:8 }}>{item.q}</span>
                  {openFaq === i ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding:"8px 12px", fontSize:12, color:"#4B5563", lineHeight:1.6, borderTop:"1px solid #E5E7EB" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Sec>
      )}

      {/* Notes */}
      <Sec icon={PenLine} title="My Notes" dotColor={dotColor}>
        {editingNote ? (
          <div>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              rows={3}
              style={{ width:"100%", padding:"6px 8px", border:"1px solid #D1D5DB", borderRadius:6, fontSize:12, fontFamily:"inherit", resize:"vertical", boxSizing:"border-box" }}
              placeholder="Add notes, reminders, or updates here..."
            />
            <button onClick={() => { onNoteUpdate(noteText); setEditingNote(false); }}
              style={{ marginTop:4, padding:"4px 12px", background:dotColor, color:"#fff", border:"none", borderRadius:6, fontSize:12, cursor:"pointer" }}>
              Save
            </button>
            <button onClick={() => { setNoteText(note || ""); setEditingNote(false); }}
              style={{ marginTop:4, marginLeft:6, padding:"4px 12px", background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB", borderRadius:6, fontSize:12, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        ) : (
          <div onClick={() => setEditingNote(true)} style={{ cursor:"pointer", minHeight:32, color: noteText ? "#374151" : "#9CA3AF", fontSize:12, padding:"4px 6px", border:"1px dashed #D1D5DB", borderRadius:6 }}>
            {noteText || "Click to add notes..."}
          </div>
        )}
      </Sec>
    </div>
  );
}

// ─── Main Tracker component ───────────────────────────────────────────
export default function MastersTracker() {
  const [items, setItems]         = useState({});
  const [expanded, setExpanded]   = useState({});
  const [open, setOpen]           = useState({});
  const [filter, setFilter]       = useState("all");
  const [saveStatus, setSaveStatus] = useState("");
  const [loaded, setLoaded]       = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [authenticated, setAuthenticated] = useState(getSavedAuth);
  const [passcode, setPasscode]   = useState("");
  const [authError, setAuthError] = useState("");

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const res = await STORAGE_API.get(STORAGE_KEY);
        if (res && res.value) {
          const saved = JSON.parse(res.value);
          if (saved.items)    setItems(saved.items);
          if (saved.open)     setOpen(saved.open);
          if (saved.expanded) setExpanded(saved.expanded);
        }
      } catch(e) { /* first run */ }
      setLoaded(true);
    })();
  }, []);

  // Save to storage
  const save = async (newItems, newOpen, newExpanded) => {
    try {
      await STORAGE_API.set(STORAGE_KEY, JSON.stringify({ items: newItems, open: newOpen, expanded: newExpanded }));
      setSaveStatus("Saved ✓");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch(e) { setSaveStatus("Save failed"); }
  };

  const toggleCheck = (id) => {
    const updated = { ...items, [id]: { ...items[id], checked: !items[id]?.checked } };
    setItems(updated);
    save(updated, open, expanded);
  };

  const updateNote = (id, note) => {
    const updated = { ...items, [id]: { ...items[id], note } };
    setItems(updated);
    save(updated, open, expanded);
  };

  const toggleExpand = (id) => {
    const updated = { ...expanded, [id]: !expanded[id] };
    setExpanded(updated);
    save(items, open, updated);
  };

  const togglePhase = (id) => {
    const updated = { ...open, [id]: !open[id] };
    setOpen(updated);
    save(items, updated, expanded);
  };

  const resetAll = async () => {
    setItems({}); setExpanded({}); setOpen({});
    try { await STORAGE_API.set(STORAGE_KEY, JSON.stringify({ items:{}, open:{}, expanded:{} })); } catch(e) {}
    setConfirmReset(false);
    setSaveStatus("Reset ✓");
    setTimeout(() => setSaveStatus(""), 2000);
  };

  // Flatten all items for summary stats
  const allItems = PHASES.flatMap(p => p.items);
  const doneCount = allItems.filter(it => items[it.id]?.checked).length;
  const totalItems = allItems.length;
  const pct = Math.round((doneCount / totalItems) * 100);

  // Next upcoming deadline
  const upcoming = allItems
    .filter(it => !items[it.id]?.checked)
    .map(it => ({ ...it, d: daysUntil(it.deadline) }))
    .filter(it => it.d >= 0)
    .sort((a,b) => a.d - b.d)[0];

  // Filter logic
  const filterItem = (it) => {
    if (filter === "incomplete") return !items[it.id]?.checked;
    if (filter === "urgent")    return !items[it.id]?.checked && daysUntil(it.deadline) <= 30;
    if (filter === "critical")  return it.priority === "critical";
    return true;
  };

  const handlePasscodeSubmit = async (event) => {
    event.preventDefault();
    try {
      const typedHash = await sha256(passcode);
      if (typedHash === PASSCODE_HASH) {
        saveAuth();
        setAuthenticated(true);
        setAuthError("");
      } else {
        setAuthError("Incorrect passcode. Hint: your birthday.");
      }
    } catch (e) {
      setAuthError("Unable to verify passcode right now. Please try again.");
    }
  };

  const lockTracker = () => {
    clearAuth();
    setAuthenticated(false);
    setPasscode("");
    setAuthError("");
  };

  if (!authenticated) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8FAFC", padding:20 }}>
      <div style={{ width:"100%", maxWidth:420, background:"#fff", borderRadius:18, boxShadow:"0 30px 80px rgba(15,23,42,0.12)", padding:28 }}>
        <h2 style={{ margin:0, fontSize:22, color:"#111827" }}>Tracker locked</h2>
        <p style={{ margin:"10px 0 20px", color:"#4B5563", fontSize:14 }}>Enter the 6-digit passcode to open the tracker.</p>
        <form onSubmit={handlePasscodeSubmit}>
          <label style={{ display:"block", marginBottom:8, fontSize:12, fontWeight:700, color:"#374151" }}>Passcode</label>
          <input
            type="password"
            maxLength={6}
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"1px solid #D1D5DB", fontSize:14, marginBottom:12 }}
            placeholder="Enter 6 digits"
          />
          <button type="submit" style={{ width:"100%", padding:"12px 14px", borderRadius:10, border:"none", background:"#2563EB", color:"#fff", fontWeight:700, cursor:"pointer" }}>Unlock</button>
        </form>
        <p style={{ margin:"14px 0 0", fontSize:12, color:"#6B7280" }}>Hint: {PASSCODE_HINT}</p>
        {authError && <p style={{ margin:"10px 0 0", color:"#B91C1C", fontSize:13 }}>{authError}</p>}
      </div>
    </div>
  );

  if (!loaded) return <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh", color:"#6B7280" }}>Loading tracker...</div>;

  const prioColor = { critical:"#EF4444", high:"#F59E0B", normal:"#10B981" };

  return (
    <div style={{ minHeight:"100vh", background:"#F9FAFB", fontFamily:"-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"24px 16px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:"#111827" }}>🎓 European Master’s Application Tracker</h1>
          <p style={{ margin:"6px 0 0", fontSize:13, color:"#6B7280" }}>
            Fall 2027 entry • Sweden (SISGP), CYBERSURE, Finland, Germany • {totalItems} tasks total
          </p>
        </div>

        {/* Progress */}
        <div style={{ background:"#fff", borderRadius:10, padding:"16px 20px", marginBottom:16, border:"1px solid #E5E7EB" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#374151" }}>Overall Progress</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{doneCount}/{totalItems} ({pct}%)</span>
          </div>
          <div style={{ background:"#E5E7EB", borderRadius:999, height:8 }}>
            <div style={{ background: pct === 100 ? "#10B981" : "#6366F1", borderRadius:999, height:8, width:`${pct}%`, transition:"width 0.4s ease" }} />
          </div>
        </div>

        {/* Upcoming deadline banner */}
        {upcoming && upcoming.d <= 30 && (
          <div style={{ background:"#FFFBEB", border:"1px solid #FCD34D", borderRadius:8, padding:"10px 16px", marginBottom:16, fontSize:13, color:"#92400E" }}>
            ⏰ <strong>Next deadline:</strong> {upcoming.title} — {upcoming.d === 0 ? "today" : `in ${upcoming.d} days`} ({fmtDate(upcoming.deadline)})
          </div>
        )}

        {/* Filters */}
        <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
          {[
            { key:"all", label:"All tasks" },
            { key:"incomplete", label:"Incomplete" },
            { key:"urgent", label:"Due in 30 days" },
            { key:"critical", label:"Critical only" }
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding:"5px 14px", borderRadius:999, fontSize:12, fontWeight:600, border:`1px solid ${filter===f.key ? "#6366F1" : "#D1D5DB"}`, background: filter===f.key ? "#6366F1" : "#fff", color: filter===f.key ? "#fff" : "#6B7280", cursor:"pointer" }}>
              {f.label}
            </button>
          ))}
          {saveStatus && <span style={{ marginLeft:"auto", fontSize:12, color:"#10B981", display:"flex", alignItems:"center", fontWeight:600 }}>{saveStatus}</span>}
        </div>

        {/* Phase cards */}
        {PHASES.map(phase => {
          const C = COLORS[phase.color];
          const phaseItems = phase.items.filter(filterItem);
          if (phaseItems.length === 0) return null;
          const phaseDone = phase.items.filter(it => items[it.id]?.checked).length;
          const phaseTotal = phase.items.length;
          const isOpen = open[phase.id] !== false;

          return (
            <div key={phase.id} style={{ background:"#fff", border:`1px solid ${C.border}`, borderRadius:10, marginBottom:16, overflow:"hidden" }}>
              {/* Phase header */}
              <button onClick={() => togglePhase(phase.id)}
                style={{ width:"100%", background:C.bg, border:"none", padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left" }}>
                <div>
                  <span style={{ fontSize:10, fontWeight:800, letterSpacing:"0.1em", color:C.dot, textTransform:"uppercase" }}>{phase.label}</span>
                  <span style={{ fontWeight:700, fontSize:15, color:"#111827", marginLeft:10 }}>{phase.title}</span>
                  <span style={{ fontSize:12, color:"#6B7280", marginLeft:8 }}>{phase.period}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:12, fontWeight:600, color:C.dot }}>{phaseDone}/{phaseTotal}</span>
                  {isOpen ? <ChevronUp size={14} color={C.dot} /> : <ChevronDown size={14} color={C.dot} />}
                </div>
              </button>

              {/* Progress bar */}
              {isOpen && (
                <div style={{ height:3, background:`${C.dot}22` }}>
                  <div style={{ height:3, background:C.dot, width:`${phaseTotal > 0 ? Math.round((phaseDone/phaseTotal)*100) : 0}%`, transition:"width 0.3s" }} />
                </div>
              )}

              {/* Items */}
              {isOpen && phaseItems.map((it, idx) => {
                const checked = !!items[it.id]?.checked;
                const note    = items[it.id]?.note || "";
                const isExp   = !!expanded[it.id];
                return (
                  <div key={it.id} style={{ borderBottom: idx < phaseItems.length - 1 ? "1px solid #F3F4F6" : "none", padding:"12px 20px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      {/* Priority dot */}
                      <div style={{ width:8, height:8, borderRadius:"50%", background:prioColor[it.priority] || "#6B7280", flexShrink:0 }} />
                      {/* Checkbox */}
                      <input type="checkbox" checked={checked} onChange={() => toggleCheck(it.id)}
                        style={{ width:16, height:16, cursor:"pointer", flexShrink:0, accentColor:C.dot }} />
                      {/* Title */}
                      <span style={{ flex:1, fontSize:13, fontWeight:500, color: checked ? "#9CA3AF" : "#111827", textDecoration: checked ? "line-through" : "none", lineHeight:1.4 }}>
                        {it.title}
                      </span>
                      {/* Pill */}
                      <Pill deadline={it.deadline} done={checked} />
                      {/* Expand */}
                      <button onClick={() => toggleExpand(it.id)}
                        style={{ background:"none", border:"none", cursor:"pointer", color: isExp ? C.dot : "#6B7280", fontSize:11, fontWeight:600, padding:"2px 6px", borderRadius:4, whiteSpace:"nowrap" }}>
                        {isExp ? "▲ Hide" : "▼ Details"}
                      </button>
                    </div>
                    {/* Detail panel */}
                    {isExp && (
                      <DetailPanel
                        details={it.details}
                        note={note}
                        onNoteUpdate={(n) => updateNote(it.id, n)}
                        dotColor={C.dot}
                        itemTitle={it.title}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, color:"#9CA3AF" }}>
          <span>Progress is saved locally in this browser.</span>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={lockTracker} style={{ padding:"4px 12px", background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB", borderRadius:6, fontSize:12, cursor:"pointer" }}>
              Lock tracker
            </button>
            {confirmReset ? (
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={resetAll} style={{ padding:"4px 12px", background:"#EF4444", color:"#fff", border:"none", borderRadius:6, fontSize:12, cursor:"pointer" }}>Confirm Reset</button>
                <button onClick={() => setConfirmReset(false)} style={{ padding:"4px 12px", background:"#F3F4F6", color:"#374151", border:"1px solid #D1D5DB", borderRadius:6, fontSize:12, cursor:"pointer" }}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setConfirmReset(true)} style={{ padding:"4px 12px", background:"none", color:"#9CA3AF", border:"1px solid #E5E7EB", borderRadius:6, fontSize:12, cursor:"pointer" }}>
                Reset progress
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}