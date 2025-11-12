from starlette.requests import Request
from starlette.responses import JSONResponse
from dataclasses import dataclass, asdict
from typing import Optional

# In-memory user profile store (replace with MongoDB in production)
_user_profiles = {}


@dataclass
class UserProfile:
	user_id: str
	monthly_income: float
	spending_goal: float
	current_spend: float
	onboarded: bool = True


async def get_profile(request: Request) -> JSONResponse:
	"""GET /api/user/profile?user_id=<id>"""
	user_id = request.query_params.get("user_id") or "demo"
	profile = _user_profiles.get(user_id)
	if not profile:
		# Return empty profile for first-time users
		return JSONResponse({"onboarded": False, "user_id": user_id})
	return JSONResponse(asdict(profile))


async def save_profile(request: Request) -> JSONResponse:
	"""POST /api/user/profile with JSON body"""
	body = await request.json()
	user_id = body.get("user_id") or "demo"
	profile = UserProfile(
		user_id=user_id,
		monthly_income=float(body.get("monthly_income", 0)),
		spending_goal=float(body.get("spending_goal", 0)),
		current_spend=float(body.get("current_spend", 0)),
		onboarded=True
	)
	_user_profiles[user_id] = profile
	return JSONResponse(asdict(profile))
