const { ObjectId } = require('mongodb');

const BadRequest = require('../errors/bad-request');


class MachineManager {
  constructor(machinesCollection) {
    this.machinesCollection = machinesCollection;
  }
  
  getUserMachines = userId => {
    if (!userId) {
      throw new Error('getUserMachines(): `userId` is required.')
    }
    return this.machinesCollection.find({ userId }).toArray();
  }

  getAllMachines() {
    return this.machinesCollection.find().toArray();
  }

  addMachine({ userId, machineId }) {
    if (!userId) {
      throw new BadRequest('`userId` is required.');
    }
    if (!machineId) {
      throw new BadRequest('`machineId` is required.');
    }
    return this.machinesCollection
      .insertOne({ userId, machineId })
      .then(writeRes => writeRes.insertedId);
  }

  deleteMachineByObjectId(_id) {
    if (!_id) {
      throw new BadRequest('`_id` is required.');
    }
    return this.machinesCollection.deleteOne({
      _id: new ObjectId(_id),
    });
  }
}

module.exports = MachineManager;
