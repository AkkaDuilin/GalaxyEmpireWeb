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
    is_moon = False

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
