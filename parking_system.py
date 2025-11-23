from collections import deque

class ParkingSystem:
    def __init__(self, rows=10, cols=10):
        self.rows = rows
        self.cols = cols
        self.slots = {}  # {slot_id: slot_data}
        
        # Initialize slots
        for row in range(rows):
            for col in range(cols):
                slot_id = f"{row}-{col}"
                self.slots[slot_id] = {
                    'id': slot_id,
                    'row': row,
                    'col': col,
                    'type': self._random_slot_type(),
                    'status': 'available',
                    'user_name': '',
                    'license_plate': ''
                }
    
    def _random_slot_type(self):
        types = ['regular', 'compact', 'handicap']
        return types[hash(f"{self.rows}-{self.cols}") % len(types)]
    
    def get_all_slots(self):
        return list(self.slots.values())
    
    def get_slot(self, slot_id):
        return self.slots.get(slot_id)
    
    def reserve_slot(self, slot_id, name, license_plate):
        if slot_id not in self.slots:
            return False
        
        slot = self.slots[slot_id]
        if slot['status'] != 'available':
            return False
        
        slot['status'] = 'reserved'
        slot['user_name'] = name
        slot['license_plate'] = license_plate
        return True
    
    def occupy_slot(self, slot_id, name, license_plate):
        if slot_id not in self.slots:
            return False
        
        slot = self.slots[slot_id]
        if slot['status'] == 'occupied':
            return False
        
        slot['status'] = 'occupied'
        slot['user_name'] = name
        slot['license_plate'] = license_plate
        return True
    
    def free_slot(self, slot_id):
        if slot_id not in self.slots:
            return False
        
        slot = self.slots[slot_id]
        if slot['status'] == 'available':
            return False
        
        slot['status'] = 'available'
        slot['user_name'] = ''
        slot['license_plate'] = ''
        return True
    
    def find_nearest_available(self, start_slot_id):
        if start_slot_id not in self.slots:
            return None
        
        visited = set()
        queue = deque()
        queue.append((start_slot_id, [start_slot_id]))
        visited.add(start_slot_id)
        
        while queue:
            current_id, path = queue.popleft()
            
            # If current spot is available (and not the starting slot), return it
            if current_id != start_slot_id and self.slots[current_id]['status'] == 'available':
                return (current_id, path, len(path)-1)
            
            # Explore neighbors
            for neighbor_id in self._get_neighbors(current_id):
                if neighbor_id not in visited:
                    visited.add(neighbor_id)
                    queue.append((neighbor_id, path + [neighbor_id]))
        
        return None
    
    def _get_neighbors(self, slot_id):
        if slot_id not in self.slots:
            return []
        
        row, col = map(int, slot_id.split('-'))
        neighbors = []
        
        if row > 0:
            neighbors.append(f"{row-1}-{col}")
        if row < self.rows - 1:
            neighbors.append(f"{row+1}-{col}")
        if col > 0:
            neighbors.append(f"{row}-{col-1}")
        if col < self.cols - 1:
            neighbors.append(f"{row}-{col+1}")
        
        return neighbors