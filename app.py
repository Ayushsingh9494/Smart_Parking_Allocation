from flask import Flask, render_template, request, jsonify
from parking_system import ParkingSystem
import json

app = Flask(__name__)
parking_system = ParkingSystem(rows=10, cols=10)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/slots', methods=['GET'])
def get_slots():
    slots = parking_system.get_all_slots()
    return jsonify(slots)

@app.route('/api/slots/<slot_id>', methods=['GET'])
def get_slot(slot_id):
    slot = parking_system.get_slot(slot_id)
    if slot:
        return jsonify(slot)
    return jsonify({'error': 'Slot not found'}), 404

@app.route('/api/slots/<slot_id>/reserve', methods=['POST'])
def reserve_slot(slot_id):
    data = request.get_json()
    name = data.get('name', '')
    license_plate = data.get('license_plate', '')
    
    if not name or not license_plate:
        return jsonify({'error': 'Name and license plate are required'}), 400
    
    success = parking_system.reserve_slot(slot_id, name, license_plate)
    if success:
        return jsonify({'success': True})
    return jsonify({'error': 'Slot cannot be reserved'}), 400

@app.route('/api/slots/<slot_id>/occupy', methods=['POST'])
def occupy_slot(slot_id):
    data = request.get_json()
    name = data.get('name', '')
    license_plate = data.get('license_plate', '')
    
    if not name or not license_plate:
        return jsonify({'error': 'Name and license plate are required'}), 400
    
    success = parking_system.occupy_slot(slot_id, name, license_plate)
    if success:
        return jsonify({'success': True})
    return jsonify({'error': 'Slot cannot be occupied'}), 400

@app.route('/api/slots/<slot_id>/free', methods=['POST'])
def free_slot(slot_id):
    success = parking_system.free_slot(slot_id)
    if success:
        return jsonify({'success': True})
    return jsonify({'error': 'Slot not found or already free'}), 404

@app.route('/api/slots/find-nearest', methods=['POST'])
def find_nearest():
    data = request.get_json()
    start_slot = data.get('start_slot')
    if not start_slot:
        return jsonify({'error': 'Starting slot is required'}), 400
    
    result = parking_system.find_nearest_available(start_slot)
    if not result:
        return jsonify({'error': 'No available parking spots'}), 404
    
    nearest_spot, path, distance = result
    return jsonify({
        'nearest_spot': nearest_spot,
        'path': path,
        'distance': distance
    })

if __name__ == '__main__':
    app.run(debug=True)