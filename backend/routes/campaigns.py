from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..dependencies import get_db
from ..models import Campaign, TeamMember, User
from ..schemas import CampaignCreate, CampaignListResponse, CampaignResponse

router = APIRouter(prefix="/v1.0", tags=["campaigns"])


def _resolve_account_id(db: Session, user: User) -> str:
    membership = (
        db.query(TeamMember)
        .join(User, TeamMember.user_id == User.id)
        .filter(User.id == user.id)
        .first()
    )
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not a member of any account",
        )
    return membership.account_id


@router.get("/campaigns", response_model=CampaignListResponse)
def list_campaigns(
    *, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
) -> CampaignListResponse:
    account_id = _resolve_account_id(db, current_user)
    campaigns: List[Campaign] = db.query(Campaign).filter(Campaign.account_id == account_id).all()
    return CampaignListResponse(campaigns=campaigns)


@router.post("/campaigns", response_model=CampaignResponse, status_code=status.HTTP_201_CREATED)
def create_campaign(
    payload: CampaignCreate,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CampaignResponse:
    account_id = _resolve_account_id(db, current_user)
    campaign = Campaign(
        account_id=account_id,
        name=payload.name,
        objective=payload.objective,
        status=payload.status,
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return CampaignResponse.from_orm(campaign)
