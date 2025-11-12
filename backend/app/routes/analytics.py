from starlette.requests import Request
from starlette.responses import JSONResponse
from ..fuzzy_engine import FinlensFuzzy, FuzzyContext
from ..services.analytics import get_month_stats_for_user


_fuzzy = FinlensFuzzy()


async def fuzzy_summary(request: Request) -> JSONResponse:
	month = request.query_params.get("month")
	stats = await get_month_stats_for_user(month=month)
	ctx = FuzzyContext(
		spending_ratio=stats.spending_ratio,
		vol_index=stats.vol_index,
		budget_util=stats.budget_utilization,
	)
	return JSONResponse(_fuzzy.summarize(ctx))


