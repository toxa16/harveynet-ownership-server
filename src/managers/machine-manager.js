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
}

module.exports = MachineManager;
