document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const parkingGrid = document.getElementById('parkingGrid');
    const availableCount = document.getElementById('availableCount');
    const occupiedCount = document.getElementById('occupiedCount');
    const reservedCount = document.getElementById('reservedCount');
    const findParkingBtn = document.getElementById('findParkingBtn');
    const reserveBtn = document.getElementById('reserveBtn');
    const reserveLicenseInput = document.getElementById('reserveLicensePlate');
    const selectedSlotDisplay = document.getElementById('selectedSlotId');
    const slotDetails = document.getElementById('slotDetails');
    const fromEntranceRadio = document.getElementById('fromEntrance');
    const fromSlotRadio = document.getElementById('fromSlot');
    const fromPlateRadio = document.getElementById('fromPlate');
    const fromSlotInput = document.getElementById('fromSlotId');
    const fromPlateInput = document.getElementById('fromLicensePlate');

    let parkingSlots = [];
    let selectedSlot = null;

    // Initialize parking grid
    function initializeParkingGrid() {
        parkingGrid.innerHTML = '';
        parkingSlots = [];
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                const slotId = `${row}-${col}`;
                const slot = createParkingSlot(slotId, row, col);
                parkingGrid.appendChild(slot.element);
                parkingSlots.push(slot);
            }
        }
        
        updateCounts();
    }

    function createParkingSlot(slotId, row, col) {
        const slotElement = document.createElement('div');
        slotElement.className = 'parking-slot';
        slotElement.dataset.slotId = slotId;
        
        // Initialize with random status for demo
        const statusRoll = Math.random();
        let status = 'available';
        let licensePlate = '';
        
        if (statusRoll < 0.3) {
            status = 'occupied';
            licensePlate = `ABC${Math.floor(1000 + Math.random() * 9000)}`;
        } else if (statusRoll < 0.5) {
            status = 'reserved';
            licensePlate = `XYZ${Math.floor(1000 + Math.random() * 9000)}`;
        }
        
        slotElement.dataset.status = status;
        slotElement.dataset.licensePlate = licensePlate;
        
        if (status === 'occupied') slotElement.classList.add('occupied');
        if (status === 'reserved') slotElement.classList.add('reserved');
        
        slotElement.textContent = slotId;
        
        slotElement.addEventListener('click', function() {
            selectSlot(this);
        });
        
        return {
            element: slotElement,
            id: slotId,
            row,
            col,
            status,
            licensePlate
        };
    }

    function selectSlot(slotElement) {
        // Deselect previous selection
        if (selectedSlot) {
            selectedSlot.element.classList.remove('selected');
        }
        
        // Find the slot data
        const slot = parkingSlots.find(s => s.element === slotElement);
        if (!slot) return;
        
        selectedSlot = slot;
        slotElement.classList.add('selected');
        selectedSlotDisplay.textContent = slot.id;
        updateSlotDetails(slot);
        reserveBtn.disabled = slot.status !== 'available';
    }

    function updateSlotDetails(slot) {
    let detailsHTML = `
        <p><strong>Slot ID:</strong> ${slot.id}</p>
        <p><strong>Status:</strong> <span class="status-${slot.status}">${slot.status.toUpperCase()}</span></p>
    `;
    
    if (slot.licensePlate) {
        detailsHTML += `<p><strong>License Plate:</strong> ${slot.licensePlate}</p>`;
    }
    
    slotDetails.innerHTML = detailsHTML;
    
    // Update action buttons based on slot status
    const actionsDiv = document.getElementById('slotActions');
    actionsDiv.innerHTML = '';
    
    if (slot.status === 'available') {
        // Show reserve and occupy buttons for available slots
        actionsDiv.innerHTML = `
            <button class="action-btn reserve-btn" id="reserveSlotBtn">Reserve</button>
            <button class="action-btn occupy-btn" id="occupySlotBtn">Occupy</button>
        `;
        
        document.getElementById('reserveSlotBtn').addEventListener('click', () => reserveSelectedSlot());
        document.getElementById('occupySlotBtn').addEventListener('click', () => occupySelectedSlot());
    } 
    else {
        // Show make available button for reserved/occupied slots
        actionsDiv.innerHTML = `
            <button class="action-btn make-available-btn" id="freeSlotBtn">Make Available</button>
        `;
        
        document.getElementById('freeSlotBtn').addEventListener('click', () => freeSelectedSlot());
    }
}
// New functions for slot actions
function reserveSelectedSlot() {
    const licensePlate = prompt("Enter license plate to reserve:");
    if (licensePlate && licensePlate.trim() && selectedSlot) {
        updateSlotStatus(selectedSlot, 'reserved', licensePlate.trim());
    }
}

function occupySelectedSlot() {
    const licensePlate = prompt("Enter license plate to occupy:");
    if (licensePlate && licensePlate.trim() && selectedSlot) {
        updateSlotStatus(selectedSlot, 'occupied', licensePlate.trim());
    }
}

function freeSelectedSlot() {
    if (selectedSlot && confirm(`Make slot ${selectedSlot.id} available?`)) {
        updateSlotStatus(selectedSlot, 'available', '');
    }
}

function updateSlotStatus(slot, newStatus, licensePlate = '') {
    slot.status = newStatus;
    slot.licensePlate = licensePlate;
    slot.element.dataset.status = newStatus;
    slot.element.dataset.licensePlate = licensePlate;
    
    // Update visual appearance
    slot.element.className = 'parking-slot';
    if (newStatus === 'occupied') slot.element.classList.add('occupied');
    if (newStatus === 'reserved') slot.element.classList.add('reserved');
    if (slot.element.classList.contains('selected')) slot.element.classList.add('selected');
    
    updateCounts();
    updateSlotDetails(slot);
    
    // Clear reservation input if we made a slot available
    if (newStatus === 'available') {
        reserveLicenseInput.value = '';
    }
}

    function updateCounts() {
        const available = parkingSlots.filter(s => s.status === 'available').length;
        const occupied = parkingSlots.filter(s => s.status === 'occupied').length;
        const reserved = parkingSlots.filter(s => s.status === 'reserved').length;
        
        availableCount.textContent = available;
        occupiedCount.textContent = occupied;
        reservedCount.textContent = reserved;
    }

    // Enable/disable search inputs based on radio selection
    fromSlotRadio.addEventListener('change', function() {
        fromSlotInput.disabled = !this.checked;
        fromPlateInput.disabled = true;
    });
    
    fromPlateRadio.addEventListener('change', function() {
        fromPlateInput.disabled = !this.checked;
        fromSlotInput.disabled = true;
    });
    
    fromEntranceRadio.addEventListener('change', function() {
        fromSlotInput.disabled = true;
        fromPlateInput.disabled = true;
    });

    // Find nearest parking
    findParkingBtn.addEventListener('click', function() {
        // Clear previous path highlights
        parkingSlots.forEach(slot => {
            slot.element.classList.remove('path');
        });
        
        let startSlot = null;
        
        // Determine starting point based on search method
        if (fromSlotRadio.checked) {
            const slotId = fromSlotInput.value.trim();
            if (!slotId) {
                alert('Please enter a slot ID');
                return;
            }
            startSlot = parkingSlots.find(s => s.id === slotId);
            if (!startSlot) {
                alert(`Slot ${slotId} not found`);
                return;
            }
        } else if (fromPlateRadio.checked) {
            const licensePlate = fromPlateInput.value.trim();
            if (!licensePlate) {
                alert('Please enter a license plate');
                return;
            }
            startSlot = parkingSlots.find(s => s.licensePlate === licensePlate);
            if (!startSlot) {
                alert(`No vehicle found with plate ${licensePlate}`);
                return;
            }
        } else {
            // From entrance (0-0)
            startSlot = parkingSlots.find(s => s.id === '0-0');
        }
        
        // Find nearest available spot using BFS
        const queue = [{ slot: startSlot, path: [] }];
        const visited = new Set();
        visited.add(startSlot.id);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // If we found an available spot (and it's not the starting slot)
            if (current.slot !== startSlot && current.slot.status === 'available') {
                // Highlight the path
                current.path.forEach(slotId => {
                    const slot = parkingSlots.find(s => s.id === slotId);
                    if (slot) slot.element.classList.add('path');
                });
                
                // Select the found spot
                selectSlot(current.slot.element);
                
                // Show path information
                const pathText = [startSlot.id, ...current.path, current.slot.id].join(' → ');
                alert(`Nearest available spot: ${current.slot.id}\nPath: ${pathText}\nDistance: ${current.path.length + 1} slots`);
                return;
            }
            
            // Get neighbors (up, down, left, right)
            const neighbors = getNeighbors(current.slot);
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.id)) {
                    visited.add(neighbor.id);
                    queue.push({
                        slot: neighbor,
                        path: [...current.path, current.slot.id]
                    });
                }
            }
        }
        
        alert('No available parking spots found');
    });

    function getNeighbors(slot) {
        const [row, col] = slot.id.split('-').map(Number);
        const neighbors = [];
        
        if (row > 0) neighbors.push(parkingSlots.find(s => s.id === `${row-1}-${col}`));
        if (row < 9) neighbors.push(parkingSlots.find(s => s.id === `${row+1}-${col}`));
        if (col > 0) neighbors.push(parkingSlots.find(s => s.id === `${row}-${col-1}`));
        if (col < 9) neighbors.push(parkingSlots.find(s => s.id === `${row}-${col+1}`));
        
        return neighbors.filter(Boolean);
    }

    // Reserve selected parking spot
reserveLicenseInput.addEventListener('input', function() {
    reserveBtn.disabled = !this.value.trim() || !selectedSlot || selectedSlot.status !== 'available';
});

reserveBtn.addEventListener('click', function() {
    if (selectedSlot && selectedSlot.status === 'available') {
        reserveSelectedSlot();
    }
});

    // Initialize the parking grid
    initializeParkingGrid();
});