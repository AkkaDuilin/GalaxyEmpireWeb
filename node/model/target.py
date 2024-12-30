from typing import Optional
from dataclasses import dataclass
from dataclasses_json import dataclass_json


@dataclass_json
@dataclass
class Target:
    """
    Target class to represent a target in the universe.
    """
    galaxy: int
    system: int
    planet: int
    is_moon: Optional[bool] = False

    def to_dict(self):
        """
        Convert the target to a dictionary.
            :return: The dictionary representation of the target.
        """
        return {
            "galaxy": self.galaxy,
            "system": self.system,
            "planet": self.planet,
        }

    def to_position(self):
        is_moon_int = int(self.is_moon if self.is_moon is not None else False)
        return f"{self.galaxy}:{self.system}:{self.planet}:{int(is_moon_int)}"
