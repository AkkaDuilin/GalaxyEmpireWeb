from fleet_manager import FleetManager

class AttackFleet(FleetManager):
    def attack(self):
        # 具体的攻击逻辑
        print("Attacking with fleet of size:", self.size)