const machines0 = [
  {
    machineId: 'machine1',
  },
  {
    machineId: 'machine2',
  },
  {
    machineId: 'machine3',
  },
];


class MachineManager {
  constructor(machinesCollection) {}
  
  getUserMachines = async userId => {
    return machines0;
  }
}

module.exports = MachineManager;
