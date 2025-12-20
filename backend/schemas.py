from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CampaignBase(BaseModel):
    name: str
    objective: Optional[str] = None
    status: Optional[str] = "draft"


class CampaignCreate(CampaignBase):
    pass


class CampaignResponse(CampaignBase):
    id: str
    account_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class CampaignListResponse(BaseModel):
    campaigns: List[CampaignResponse]
