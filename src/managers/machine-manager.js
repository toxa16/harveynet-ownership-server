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
}

module.exports = MachineManager;