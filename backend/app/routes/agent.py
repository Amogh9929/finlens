from starlette.requests import Request
from starlette.responses import JSONResponse
from ..fuzzy_engine import FinlensFuzzy, FuzzyContext
from ..services.analytics import get_month_stats_for_user
from ..behavior_fuzzy import BehaviorFuzzy, BehaviorMetrics
from ..services.transactions import get_behavior_raw_for_user, normalize_behavior
import google.generativeai as genai
import os

_fuzzy = FinlensFuzzy()
_behavior = BehaviorFuzzy()

def _get_gemini_model():
	"""Lazy load Gemini model to ensure env vars are loaded."""
	api_key = os.environ.get("GEMINI_API_KEY")
	if not api_key:
		print("WARNING: GEMINI_API_KEY not found in environment")
		return None
	try:
		genai.configure(api_key=api_key)
		return genai.GenerativeModel('gemini-2.5-flash')
	except Exception as e:
		print(f"Failed to initialize Gemini: {e}")
		return None


def _suggestions(fz: dict, beh: dict, prompt: str) -> list[str]:
	"""Generate AI-powered suggestions using Gemini or fallback to rule-based."""
	
	# Try Gemini AI first
	model = _get_gemini_model()
	if model and prompt:
		try:
			# Build context for Gemini
			context = f"""You are Finlens AI, a friendly financial advisor for students.

User's Current Financial Status:
- Overspending likelihood: {fz['overspending']['percent']}% ({fz['overspending']['phrase']})
- Monthly spending: {fz['month_highish']['percent']}% ({fz['month_highish']['phrase']})
- Budget risk: {fz['budget_risk']['percent']}% ({fz['budget_risk']['phrase']})

Behavioral Patterns:
- Late-night orders: {beh['late_night_orders']['percent']}% ({beh['late_night_orders']['phrase']})
- Subscription creep: {beh['subscription_creep']['percent']}% ({beh['subscription_creep']['phrase']})
- Dining spike: {beh['dining_spike']['percent']}% ({beh['dining_spike']['phrase']})
- Impulse buying: {beh['impulse_buying_tendency']['percent']}% ({beh['impulse_buying_tendency']['phrase']})

User Question: {prompt}

Provide 3-5 specific, actionable financial tips in bullet points. Keep each tip under 100 characters. Be friendly and student-focused."""

			response = model.generate_content(context)
			ai_text = response.text.strip()
			
			# Parse bullet points
			suggestions = []
			for line in ai_text.split('\n'):
				line = line.strip()
				# Remove bullet characters
				if line.startswith('•') or line.startswith('-') or line.startswith('*'):
					line = line[1:].strip()
				if line and len(line) > 10:  # Skip empty or too short lines
					suggestions.append(line)
			
			if len(suggestions) >= 2:  # At least 2 good suggestions
				return suggestions[:6]  # Return up to 6
		except Exception as e:
			print(f"Gemini AI error: {e}")
			# Fall through to rule-based suggestions
	
	# Fallback: Rule-based suggestions (original logic)
	sugs: list[str] = []
	overspend = fz["overspending"]["percent"]
	budget_risk = fz["budget_risk"]["percent"]
	late_night = beh["late_night_orders"]["percent"]
	dining_spike = beh["dining_spike"]["percent"]
	impulse = beh["impulse_buying_tendency"]["percent"]

	if overspend > 65:
		sugs.append("Set a 48-hour cooldown on non-essential buys; review cart items tomorrow before checkout.")
	if budget_risk > 60:
		sugs.append("Trim variable categories by 8-10% for the next two weeks to bring budget risk down.")
	if late_night > 40:
		sugs.append("Schedule meals earlier and mute food app notifications after 10pm to reduce late-night orders.")
	if dining_spike > 70:
		sugs.append("Batch cook 2 dinners this week; target a 15% drop in dining spend next week.")
	if impulse > 50:
		sugs.append("Use a 24-hour 'park list' for small discretionary purchases before buying.")

	q = prompt.lower()
	if "food" in q or "dining" in q:
		sugs.append("Swap 2 dining occasions with home‑prepped meals; expected monthly savings ₹500–₹800.")
	if "subscription" in q:
		sugs.append("Audit subscriptions: identify one low‑usage service to pause for 60 days.")
	if "save" in q or "savings" in q:
		sugs.append("Automate a weekly round-up transfer of Rs 150-200 into your savings goal.")

	# Deduplicate while preserving order
	seen = set()
	uniq = []
	for s in sugs:
		if s not in seen:
			seen.add(s)
			uniq.append(s)
	return uniq[:6]


async def agent_respond(request: Request) -> JSONResponse:
	prompt = request.query_params.get("q") or ""
	month = request.query_params.get("month")
	stats = await get_month_stats_for_user(month=month)
	fuzzy_ctx = FuzzyContext(
		spending_ratio=stats.spending_ratio,
		vol_index=stats.vol_index,
		budget_util=stats.budget_utilization,
	)
	fuzzy_summary = _fuzzy.summarize(fuzzy_ctx)
	raw_beh = await get_behavior_raw_for_user(month=month)
	ln, sc, dw, ib = normalize_behavior(raw_beh)
	beh_summary = _behavior.summarize(
		BehaviorMetrics(
			late_night_ratio=ln,
			subscription_cost_mom_change=sc,
			dining_weekly_increase=dw,
			repeat_small_purchases_norm=ib,
		)
	)
	recommendations = _suggestions(fuzzy_summary, beh_summary, prompt)
	return JSONResponse({
		"prompt": prompt,
		"suggestions": recommendations,
		"fuzzy": fuzzy_summary,
		"behavior": beh_summary,
	})
