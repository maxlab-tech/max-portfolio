import os
import json
import subprocess
from datetime import datetime, timezone

API_KEY = "am_us_d54a074d70a33d63d1fd50ae86af2c58ab4a320638e9610533060ab59db045d3"
INBOX_ID = "maxlabstudio@agentmail.to"
BASE_DIR = "/mnt/c/Users/Lenovo/Projects/max-portfolio/radar"
LEADS_FILE = os.path.join(BASE_DIR, "leads.json")

leads_to_send = [
    {
        "id": "lead-001",
        "to": "crosdalenathan@gmail.com",
        "name": "Nathan Crosdale",
        "company": "Shape",
        "subject": "Shape hero + interactive agent simulation (quick idea)",
        "pitch_file": os.path.join(BASE_DIR, "pitches/useshape-pitch.md")
    },
    {
        "id": "lead-002",
        "to": "support@ci.computer",
        "name": "Liam Broza",
        "company": "Companion Intelligence",
        "subject": "Companion Core 128: interactive 3D hardware hero concept",
        "pitch_file": os.path.join(BASE_DIR, "pitches/companion-core-pitch.md")
    },
    {
        "id": "lead-003",
        "to": "support@zcad.ai",
        "name": "Zixel Technologies Team",
        "company": "zCAD AI",
        "subject": "zCAD AI hero: live parametric 3D viewport concept",
        "pitch_file": os.path.join(BASE_DIR, "pitches/zcad-ai-pitch.md")
    }
]

def parse_pitch_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Split by separator --- to extract body
    parts = content.split("---", 1)
    body = parts[1].strip() if len(parts) > 1 else content.strip()
    return body

def markdown_to_html(md_text):
    import html
    paragraphs = md_text.split("\n\n")
    html_parts = []
    for p in paragraphs:
        p_clean = p.strip()
        if not p_clean:
            continue
        if p_clean.startswith("- "):
            items = [f"<li>{html.escape(line[2:].strip())}</li>" for line in p_clean.split("\n") if line.startswith("- ")]
            html_parts.append(f"<ul style='margin: 8px 0; padding-left: 20px; line-height: 1.6;'>{''.join(items)}</ul>")
        elif p_clean.startswith("👉 "):
            url = p_clean.replace("👉", "").strip().replace("**", "")
            html_parts.append(f"<p style='margin: 12px 0;'><a href='{url}' style='color: #00d4aa; font-weight: bold; text-decoration: none;'>👉 {url}</a></p>")
        else:
            lines = [html.escape(line) for line in p_clean.split("\n")]
            formatted = "<br/>".join(lines).replace("**Max**", "<strong>Max</strong>")
            html_parts.append(f"<p style='margin: 10px 0; line-height: 1.6; color: #1e293b;'>{formatted}</p>")
    
    wrapper = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; max-width: 600px; color: #1e293b; line-height: 1.6;">
        {''.join(html_parts)}
    </div>
    """
    return wrapper.strip()

def send_email(lead):
    body_text = parse_pitch_file(lead["pitch_file"])
    body_html = markdown_to_html(body_text)

    cmd = [
        "npx", "--yes", "agentmail-cli", "inboxes", "messages", "send",
        "--inbox-id", INBOX_ID,
        "--to", lead["to"],
        "--subject", lead["subject"],
        "--text", body_text,
        "--html", body_html,
        "--labels", "outreach",
        "--format", "json"
    ]

    env = os.environ.copy()
    env["AGENTMAIL_API_KEY"] = API_KEY

    print(f"[*] Sending cold email to {lead['name']} ({lead['to']}) for {lead['company']}...")
    res = subprocess.run(cmd, env=env, capture_output=True, text=True)
    
    if res.returncode != 0:
        print(f"[!] Error sending to {lead['to']}: {res.stderr}")
        return False, res.stderr
    
    try:
        data = json.loads(res.stdout)
        print(f"[+] Success! Message ID: {data.get('message_id') or data.get('id')}")
        return True, data
    except Exception as e:
        print(f"[+] Output: {res.stdout}")
        return True, res.stdout

def main():
    with open(LEADS_FILE, "r", encoding="utf-8") as f:
        leads_data = json.load(f)

    results = []
    for item in leads_to_send:
        success, info = send_email(item)
        results.append({
            "id": item["id"],
            "to": item["to"],
            "company": item["company"],
            "success": success,
            "info": info
        })

        if success:
            for l in leads_data.get("leads", []):
                if l["id"] == item["id"]:
                    l["status"] = "OUTREACH_SENT"
                    l["sent_at"] = datetime.now(timezone.utc).isoformat()
                    msg_id = info.get("message_id") if isinstance(info, dict) else None
                    if msg_id:
                        l["message_id"] = msg_id

    # Update summary counts
    sent_count = sum(1 for l in leads_data["leads"] if l["status"] == "OUTREACH_SENT")
    leads_data["summary"]["outreach_sent"] = sent_count
    leads_data["summary"]["outreach_pending"] = len(leads_data["leads"]) - sent_count
    leads_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    with open(LEADS_FILE, "w", encoding="utf-8") as f:
        json.dump(leads_data, f, indent=2)

    print("\n=== DISPATCH COMPLETE ===")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
