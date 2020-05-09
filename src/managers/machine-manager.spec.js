const MachineManager = require('./machine-manager');
const BadRequest = require('../errors/bad-request');


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
    // THIS TEST MAY BE INCORRECT (the `find()` query parameter is not checked)
    it('should resolve with user machines from `machineCollection`', async () => {
      const machineManager = new MachineManager(machinesCollection);
      const actualMachines = await machineManager.getUserMachines(testUserId);
      expect(actualMachines).toEqual(testMachines);
    });

    it('should throw an error if `userId` is absent', () => {
      const machineManager = new MachineManager(machinesCollection);
      expect(machineManager.getUserMachines).toThrow();
    });
  });

  describe('getAllMachines()', () => {
    it('should resolve with all machines from `machineCollection`', async () => {
      const machineManager = new MachineManager(machinesCollection);
      const actualMachines = await machineManager.getAllMachines();
      expect(actualMachines).toEqual(testMachines);
    });
  });

  describe('addMachine()', () => {
    // fixture
    const userId = 'test-user';
    const machineId = 'test-machine';
    const insertedId = { _id: 'test-object-id' };

    it('should call the collection `insertOne()` with doc', async () => {
      const spy = jest.fn(async () => ({ insertedId }));
      const machinesCollection = {
        insertOne: spy,
      };
      const machineManager = new MachineManager(machinesCollection);
      await machineManager.addMachine({ userId, machineId });
      expect(spy).toHaveBeenCalledWith({ userId, machineId });
    });

    it('should resolve with the `insertedId` object', async () => {
      const machinesCollection = {
        insertOne: async () => ({ insertedId }),
      };
      const machineManager = new MachineManager(machinesCollection);
      const actual = await machineManager.addMachine({ userId, machineId });
      expect(actual).toEqual(insertedId);
    });

    it('should throw `BadRequest` if `userId` is falsy', () => {
      const machineManager = new MachineManager(machinesCollection);
      expect(() => {
        machineManager.addMachine({ machineId });
      }).toThrow(BadRequest);
    });

    it('should throw `BadRequest` if `machineId` is falsy', () => {
      const machineManager = new MachineManager(machinesCollection);
      expect(() => {
        machineManager.addMachine({ userId });
      }).toThrow(BadRequest);
    });

    it.todo('should throw `Conflict` on duplicate `machineId`');
  });
});
