const MachineManager = require('./machine-manager');

// fixture
const testUserId = 'test-user';
const testMachines = [
  {
    userId: testUserId,
    machineId: 'test-machine-1',
  },
  {
    userId: testUserId,
    machineId: 'test-machine-2',
  },
];

// stub
const machinesCollection = {
  find: query => ({
    toArray: async () => testMachines,
  }),
};

describe('MachineManager', () => {
  describe('getUserMachines()', () => {
    it('should resolve with machines from `machineCollection`', async () => {
      const machineManager = new MachineManager(machinesCollection);
      const actualMachines = await machineManager.getUserMachines(testUserId);
      expect(actualMachines).toEqual(testMachines);
    });

    it('should throw an error if `userId` is absent', () => {
      const machineManager = new MachineManager(machinesCollection);
      expect(machineManager.getUserMachines).toThrow();
    });
  });
});