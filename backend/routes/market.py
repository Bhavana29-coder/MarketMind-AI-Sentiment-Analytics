from fastapi import APIRouter

router = APIRouter()


@router.post("/analyze")
def analyze_market(data: dict):

    idea = data.get("idea")

    return {
        "idea": idea,
        "market_analysis": f"{idea} has strong market potential.",
        "competitor_analysis": "Competitor analysis coming soon.",
        "opportunities": "Growing demand in technology sector.",
        "risks": "High competition.",
        "recommendation": "Proceed with validation."
    }