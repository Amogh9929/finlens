from dataclasses import dataclass
from typing import Dict, Tuple


def clamp01(x: float) -> float:
	return max(0.0, min(1.0, x))


def tri(x: float, a: float, b: float, c: float) -> float:
	if x <= a or x >= c:
		return 0.0
	if x == b:
		return 1.0
	return (x - a) / (b - a) if x < b else (c - x) / (c - b)


def trap(x: float, a: float, b: float, c: float, d: float) -> float:
	if x <= a or x >= d:
		return 0.0
	if b <= x <= c:
		return 1.0
	return (x - a) / (b - a) if x < b else (d - x) / (d - c)


def hedge_somewhat(m: float) -> float:
	return m ** 0.8


def hedge_very(m: float) -> float:
	return m ** 2


@dataclass
class FuzzyContext:
	# spending_ratio: current month spend / typical month (median/mean), e.g., 0.0–3.0
	spending_ratio: float
	# vol_index: recent volatility 0–1 (normalized std/mean, capped to 1)
	vol_index: float
	# budget_util: current spend / budget 0–1.8 (capped)
	budget_util: float


class FinlensFuzzy:
	def terms_spending_ratio(self, r: float) -> Dict[str, float]:
		r = max(0.0, min(3.0, r))
		return {
			"low": trap(r, 0.0, 0.0, 0.7, 0.95),
			"normal": tri(r, 0.8, 1.0, 1.2),
			"high": trap(r, 1.05, 1.2, 3.0, 3.0),
		}

	def terms_volatility(self, v: float) -> Dict[str, float]:
		v = clamp01(v)
		return {
			"stable": trap(v, 0.0, 0.0, 0.2, 0.35),
			"variable": tri(v, 0.2, 0.45, 0.7),
			"high": trap(v, 0.55, 0.7, 1.0, 1.0),
		}

	def terms_budget_util(self, b: float) -> Dict[str, float]:
		b = max(0.0, min(1.8, b))
		return {
			"low": trap(b, 0.0, 0.0, 0.45, 0.65),
			"medium": tri(b, 0.55, 0.75, 0.95),
			"high": trap(b, 0.85, 1.0, 1.8, 1.8),
		}

	def infer(self, ctx: FuzzyContext) -> Dict[str, Dict[str, float]]:
		r = self.terms_spending_ratio(ctx.spending_ratio)
		v = self.terms_volatility(ctx.vol_index)
		b = self.terms_budget_util(ctx.budget_util)

		# Overspending likelihood
		overspend_rules = [
			min(r["high"], hedge_somewhat(v["stable"])),
			min(hedge_somewhat(r["high"]), v["variable"]),
			min(b["high"], hedge_somewhat(r["normal"])),
		]
		overspend = max(overspend_rules)

		# "This month is high-ish"
		highish_rules = [
			hedge_somewhat(r["normal"]),
			min(r["high"], hedge_somewhat(v["stable"])),
			min(hedge_somewhat(r["high"]), hedge_somewhat(v["variable"])),
		]
		highish = max(highish_rules)

		# Budget risk (projected overshoot)
		budget_risk_rules = [
			b["high"],
			min(b["medium"], r["high"]),
			min(b["medium"], hedge_very(v["high"])),
		]
		budget_risk = max(budget_risk_rules)

		return {
			"overspending_likelihood": {"degree": clamp01(overspend)},
			"month_highish": {"degree": clamp01(highish)},
			"budget_risk": {"degree": clamp01(budget_risk)},
		}

	def to_percent_and_phrase(self, degree: float, base: str) -> Tuple[int, str]:
		d = clamp01(degree)
		pct = int(round(d * 100))
		if d < 0.25:
			qualifier = "low"
		elif d < 0.45:
			qualifier = "slightly"
		elif d < 0.65:
			qualifier = "moderately"
		elif d < 0.85:
			qualifier = "high"
		else:
			qualifier = "very high"
		phrase = f"{base} is {qualifier}."
		return pct, phrase

	def summarize(self, ctx: FuzzyContext) -> Dict[str, Dict[str, object]]:
		result = self.infer(ctx)
		overspend_pct, overspend_phrase = self.to_percent_and_phrase(
			result["overspending_likelihood"]["degree"], "Overspending likelihood"
		)
		highish_pct, highish_phrase = self.to_percent_and_phrase(
			result["month_highish"]["degree"], "This month's spending"
		)
		risk_pct, risk_phrase = self.to_percent_and_phrase(
			result["budget_risk"]["degree"], "Budget risk"
		)
		return {
			"overspending": {"percent": overspend_pct, "phrase": overspend_phrase},
			"month_highish": {"percent": highish_pct, "phrase": highish_phrase},
			"budget_risk": {"percent": risk_pct, "phrase": risk_phrase},
		}


