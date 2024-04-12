from fleet_manager import FleetManager

class ExplorationFleet(FleetManager):
    def explore(self):
        # ¾ßÌåµÄÌ½Ë÷Âß¼­?
        print("Exploring with fleet of size:", self.size)