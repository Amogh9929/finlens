from dataclasses import dataclass
from datetime import datetime


@dataclass
class BehaviorRaw:
	"""Represents raw-ish computed signals before normalization."""
	late_night_ratio: float
	subscription_cost_mom_change: float
	dining_weekly_increase: float
	repeat_small_purchases_count: int


async def get_behavior_raw_for_user(month: str | None = None) -> BehaviorRaw:
	"""
	Placeholder: In real code, aggregate from Mongo transactions and subscription ledger.
	- late_night_ratio: fraction of orders in 22:00–03:00 window (0..1)
	- subscription_cost_mom_change: MoM cost increase mapped to 0..1 (negative set to 0)
	- dining_weekly_increase: last 7 days vs baseline increase ratio (0..1)
	- repeat_small_purchases_count: count of <₹300 discretionary repeats in 2 weeks
	"""
	_ = month or datetime.utcnow().strftime("%Y-%m")
	# Neutral-ish but interesting defaults for demo
	return BehaviorRaw(
		late_night_ratio=0.32,
		subscription_cost_mom_change=0.28,
		dining_weekly_increase=0.47,
		repeat_small_purchases_count=6,
	)


def normalize_behavior(raw: BehaviorRaw) -> tuple[float, float, float, float]:
	"""Normalize raw metrics to 0..1 expected by the fuzzy engine."""
	ln = max(0.0, min(1.0, raw.late_night_ratio))
	sc = max(0.0, min(1.0, raw.subscription_cost_mom_change))  # negative mapped to 0 upstream
	dw = max(0.0, min(1.0, raw.dining_weekly_increase))
	# Cap count at 10 for normalization
	rib = max(0.0, min(1.0, raw.repeat_small_purchases_count / 10.0))
	return ln, sc, dw, rib
