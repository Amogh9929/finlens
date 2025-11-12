from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route
from .routes.analytics import fuzzy_summary
from .routes.agent import agent_respond
from .routes.user import get_profile, save_profile
from starlette.requests import Request
from starlette.responses import JSONResponse
from .behavior_fuzzy import BehaviorFuzzy, BehaviorMetrics
from .services.transactions import get_behavior_raw_for_user, normalize_behavior
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


# --- Behavior summary endpoint (define before routing) ---
_behavior_fuzzy = BehaviorFuzzy()


async def behavior_summary(request: Request) -> JSONResponse:
	month = request.query_params.get("month")
	raw = await get_behavior_raw_for_user(month=month)
	ln, sc, dw, ib = normalize_behavior(raw)
	metrics = BehaviorMetrics(
		late_night_ratio=ln,
		subscription_cost_mom_change=sc,
		dining_weekly_increase=dw,
		repeat_small_purchases_norm=ib,
	)
	return JSONResponse(_behavior_fuzzy.summarize(metrics))


def create_app() -> Starlette:
	routes = [
		Route("/api/analytics/fuzzy-summary", endpoint=fuzzy_summary, methods=["GET"]),
		Route("/api/analytics/behavior-summary", endpoint=behavior_summary, methods=["GET"]),
		Route("/api/agent/respond", endpoint=agent_respond, methods=["GET"]),
		Route("/api/user/profile", endpoint=get_profile, methods=["GET"]),
		Route("/api/user/profile", endpoint=save_profile, methods=["POST"]),
	]

	middleware = [
		Middleware(
			CORSMiddleware,
			allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
			allow_credentials=True,
			allow_methods=["*"],
			allow_headers=["*"],
		)
	]

	return Starlette(debug=True, routes=routes, middleware=middleware)


app = create_app()


