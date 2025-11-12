from dataclasses import dataclass
from datetime import datetime


@dataclass
class MonthStats:
	spending_ratio: float
	vol_index: float
	budget_utilization: float


async def get_month_stats_for_user(month: str | None = None) -> MonthStats:
	"""
	Placeholder aggregator.
	In real code: compute from Mongo transactions and budgets.
	"""
	_ = month or datetime.utcnow().strftime("%Y-%m")
	# Neutral-ish defaults for first run
	return MonthStats(
		spending_ratio=1.15,
		vol_index=0.42,
		budget_utilization=0.78,
	)


