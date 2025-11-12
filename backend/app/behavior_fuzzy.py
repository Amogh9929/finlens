from dataclasses import dataclass
from typing import Dict, Tuple

# Reuse helpers from the existing fuzzy engine
from .fuzzy_engine import clamp01, tri, trap, hedge_somewhat, hedge_very


@dataclass
class BehaviorMetrics:
	"""
	Inputs are normalized to ~0..1 where possible. Upstream services are free
	to compute raw values and normalize here if needed.
	"""
	# Fraction of orders that occurred late-night (e.g., 22:00–03:00) in the last 30 days
	late_night_ratio: float		# 0..1
	# Month-over-month change in subscription cost, mapped to 0..1 creep (0 = down/flat)
	subscription_cost_mom_change: float	# 0..1 (0.0 means no creep, 1.0 means strong creep)
	# Last 7 days dining spend increase vs baseline (0..1)
	dining_weekly_increase: float	# 0..1
	# Count of small discretionary repeat purchases in a recent window, normalized 0..1
	repeat_small_purchases_norm: float	# 0..1


class BehaviorFuzzy:
	"""Fuzzy rules to express degrees of behavior patterns.

	Patterns covered:
	- late_night_orders
	- subscription_creep
	- dining_spike
	- impulse_buying_tendency
	"""

	def terms_ratio_generic(self, x: float) -> Dict[str, float]:
		x = clamp01(x)
		return {
			"low": trap(x, 0.0, 0.0, 0.20, 0.35),
			"medium": tri(x, 0.25, 0.45, 0.65),
			"high": trap(x, 0.55, 0.70, 1.0, 1.0),
		}

	def to_percent_and_phrase(self, degree: float, base: str) -> Tuple[int, str]:
		d = clamp01(degree)
		pct = int(round(d * 100))
		if d < 0.25:
			qualifier = "low"
			phrase = f"{base} is {qualifier}."
		elif d < 0.45:
			phrase = f"{base} is slightly elevated."
		elif d < 0.65:
			phrase = f"{base} is moderately elevated."
		elif d < 0.85:
			phrase = f"{base} is high."
		else:
			phrase = f"{base} is very high."
		return pct, phrase

	def infer(self, m: BehaviorMetrics) -> Dict[str, Dict[str, float]]:
		# Late-night orders
		ln = self.terms_ratio_generic(m.late_night_ratio)
		late_night_rules = [
			ln["high"],
			hedge_somewhat(ln["medium"]),
		]
		late_night = max(late_night_rules)

		# Subscription creep (month-over-month increase)
		sc = self.terms_ratio_generic(m.subscription_cost_mom_change)
		subscription_rules = [
			sc["high"],
			min(hedge_somewhat(sc["medium"]), hedge_somewhat(sc["high"]))
		]
		subscription_creep = max(subscription_rules)

		# Dining spike (weekly increase)
		dw = self.terms_ratio_generic(m.dining_weekly_increase)
		dining_rules = [
			dw["high"],
			min(hedge_somewhat(dw["medium"]), hedge_very(dw["medium"]))
		]
		dining_spike = max(dining_rules)

		# Impulse buying tendency (repeat small purchases)
		ib = self.terms_ratio_generic(m.repeat_small_purchases_norm)
		impulse_rules = [
			ib["high"],
			hedge_somewhat(ib["medium"])
		]
		impulse_buying = max(impulse_rules)

		return {
			"late_night_orders": {"degree": clamp01(late_night)},
			"subscription_creep": {"degree": clamp01(subscription_creep)},
			"dining_spike": {"degree": clamp01(dining_spike)},
			"impulse_buying_tendency": {"degree": clamp01(impulse_buying)},
		}

	def summarize(self, m: BehaviorMetrics) -> Dict[str, Dict[str, object]]:
		res = self.infer(m)
		l_pct, l_phrase = self.to_percent_and_phrase(res["late_night_orders"]["degree"], "Late-night orders pattern")
		s_pct, s_phrase = self.to_percent_and_phrase(res["subscription_creep"]["degree"], "Subscription creep")
		d_pct, d_phrase = self.to_percent_and_phrase(res["dining_spike"]["degree"], "Dining spend spike")
		i_pct, i_phrase = self.to_percent_and_phrase(res["impulse_buying_tendency"]["degree"], "Impulse buying tendency")
		return {
			"late_night_orders": {"percent": l_pct, "phrase": l_phrase},
			"subscription_creep": {"percent": s_pct, "phrase": s_phrase},
			"dining_spike": {"percent": d_pct, "phrase": d_phrase},
			"impulse_buying_tendency": {"percent": i_pct, "phrase": i_phrase},
		}
