#!/usr/bin/env python3
"""
maxlab Radar — Autonomous Revenue Engine ($150/Day Goal)
Implements the iLander workflow:
1. Target Discovery & Lead Qualification
2. Landing Page Friction Audit (Hero Gap, Tangibility Gap, Dogfooding Parity Gap)
3. Proof-of-Work Formulation (Interactive 3D / WebGL component linked to maxlab.pages.dev)
4. 4-Part Low-Friction Pitch Formulation
5. Pipeline Tracking State Machine ($150/day run rate)
"""

import os
import sys
import json
import datetime
from pathlib import Path

RADAR_DIR = Path(__file__).resolve().parent
LEADS_FILE = RADAR_DIR / "leads.json"
PITCHES_DIR = RADAR_DIR / "pitches"
PITCHES_DIR.mkdir(parents=True, exist_ok=True)

DAILY_TARGET_USD = 150.0
MONTHLY_TARGET_USD = DAILY_TARGET_USD * 30.0  # $4,500/mo

def load_leads():
    if not LEADS_FILE.exists():
        return {"version": "1.0.0", "updated_at": "", "pipeline": "iLander Autonomous Engine", "summary": {}, "leads": []}
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_leads(data):
    data["updated_at"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    # Recalculate summary
    leads = data.get("leads", [])
    total_val = sum(lead.get("package_offer", {}).get("price_usd", 0) for lead in leads)
    data["summary"] = {
        "total_leads": len(leads),
        "audited": sum(1 for l in leads if l.get("status") in ["AUDITED", "PITCH_PREPARED", "OUTREACH_PENDING", "SENT"]),
        "pitch_prepared": sum(1 for l in leads if l.get("status") in ["PITCH_PREPARED", "OUTREACH_PENDING", "SENT"]),
        "outreach_pending": sum(1 for l in leads if l.get("status") in ["PITCH_PREPARED", "OUTREACH_PENDING"]),
        "target_daily_revenue": f"${DAILY_TARGET_USD:.0f}/day",
        "pipeline_potential_value": f"${total_val:,} USD",
        "monthly_target": f"${MONTHLY_TARGET_USD:,.0f} USD"
    }
    with open(LEADS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def generate_pitch_markdown(lead):
    contact = lead.get("lead_contact", {})
    name = contact.get("name", "Founder")
    product_name = lead.get("name", "")
    url = lead.get("url", "")
    audit = lead.get("audit", {})
    headline = audit.get("headline_critique", "")
    friction = audit.get("friction_points", ["Visitors have to mentally simulate what the product feels like instead of seeing it directly."])
    solution = audit.get("proposed_solution", "An interactive 3D hero component demonstrating real-time capability.")

    pitch = f"""# Outreach Pitch: {name} ({product_name} / {url})

**Target:** {name} ({contact.get('role', 'Founder')})  
**Email:** `{contact.get('email', 'pending')}`  
**Channel:** Email / Twitter DM ({contact.get('twitter', 'N/A')})  
**Subject:** {product_name} hero + interactive {lead.get('category', '').split('/')[0].strip()} concept (quick idea)

---

Hey {name.split()[0]},

Huge congrats on rolling out {product_name} ({url}) — the velocity and execution look sharp.

One quick observation while studying your landing page:
{headline}

Specific friction point:
- {friction[0]}

I put together an interactive concept tailored for your hero section:
{solution}

You can see the interactive fidelity, 60fps rendering, and drop-in performance we build over at:
👉 **https://maxlab.pages.dev** (or backup mirror: https://maxlab-tech.github.io/max-portfolio/)

Zero pitch call needed — if you're open to it, I can send over a 40-second screen capture or sandbox branch showing how this drops right into your site with zero framework lock-in.

Would love to know what you think!

Cheers,  
**Max**  
Creative Engineer & Founder, maxlab  
Portfolio: https://maxlab.pages.dev
"""
    return pitch

def print_status():
    data = load_leads()
    leads = data.get("leads", [])
    print("=" * 65)
    print(" maxlab Radar — iLander Autonomous Revenue Engine")
    print(f" Daily Target: ${DAILY_TARGET_USD:.0f}/day | Monthly Quota: ${MONTHLY_TARGET_USD:,.0f}/mo")
    print("=" * 65)
    
    total_pipeline_usd = sum(l.get("package_offer", {}).get("price_usd", 0) for l in leads)
    print(f"Active Leads: {len(leads)} | Total Pipeline: ${total_pipeline_usd:,} USD")
    print("-" * 65)
    for idx, l in enumerate(leads, 1):
        offer = l.get("package_offer", {})
        contact = l.get("lead_contact", {})
        print(f"[{idx}] {l.get('name')} ({l.get('url')})")
        print(f"    Category : {l.get('category')}")
        print(f"    Contact  : {contact.get('name')} <{contact.get('email')}>")
        print(f"    Package  : {offer.get('service')} — ${offer.get('price_usd')} ({offer.get('delivery_days')}d sprint)")
        print(f"    Status   : {l.get('status')} | Pitch: {l.get('pitch_file')}")
        print()
    print("=" * 65)
    print("Run Rate Math:")
    print(" Closing 1 sprint ($650 - $1,200) every 5-7 days = $107 - $171/day (exceeds $150/day target).")
    print("=" * 65)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "sync":
        data = load_leads()
        save_leads(data)
        print("Pipeline synchronized and summary updated.")
    else:
        print_status()
