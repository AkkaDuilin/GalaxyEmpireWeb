from enum import Enum
from typing import Optional
from dataclasses import dataclass
from dataclasses_json import dataclass_json
from model.user import Account
from model.fleet import Fleet
from model.target import Target


class TaskType(Enum):
    ATTACK = 1
    EXPLORE = 4
    ESCAPE = "escape"
    LOGIN = 99
    QUERY_PLANET = 100


class MissionType(Enum):
    ATTACK = 1
    EXPLORE = 15
    ESCAPE = "escape"  # TODO: check this later


class TaskStatus(Enum):
    RUNNING = 0
    SUCCESS = 1
    FAILED = 2


@dataclass_json
@dataclass
class Task:
    task_id: int
    uuid: str
    task_type: TaskType
    account: Account
    fleet: Fleet
    repeat: int  # only works for explore and attack tasks
    start_planet_id: int
    start_planet: Target
    target: Target


@dataclass_json
@dataclass
class TaskResult:
    task_id: int
    status: TaskStatus
    task_type: TaskType
    uuid: str
    back_ts: int = 0
    msg: Optional[str] = ""  # json string
    err_msg: Optional[str] = ""


if __name__ == "__main__":
    pass
