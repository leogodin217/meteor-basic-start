import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import StubCollections from 'meteor/hwillson:stub-collections';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Tasks } from './tasks.js';

if (Meteor.isServer) {
	describe('Tasks', () => {
		describe('methods', () => {
			const userId = Random.id();
			let taskId;
			let fakerTaskId;
			let factoryTaskId;

			beforeEach(() => {

				resetDatabase();

				// Manually created task
				taskId = Tasks.insert({
					text: 'test task',
					createdAt: new Date(),
					owner: userId,
					username: 'tmeasday'
				});

				// Using Faker
				fakerTaskId = Tasks.insert({
					text: faker.lorem.sentences(2),
					createdAt: faker.date.recent(),
					owner: faker.random.uuid(),
					username: faker.lorem.word(), 
				})

				// Using Factory
				Factory.define('task', Tasks, {
					text: faker.lorem.sentences(2),
					createdAt: faker.date.recent(),
					owner: faker.random.uuid(),
					username: faker.lorem.word()
				});
				
				factoryTaskId = Factory.create('task')._id;
			});

			it('can delete owned task', () => {
				const deleteTask = Meteor.server.method_handlers['tasks.remove'];
				const invocation = { userId };
				deleteTask.apply(invocation, [taskId]);
				assert.equal(Tasks.find().count(), 2);
			});
		});
	});
}

if (Meteor.isClient) {

	Meteor.methods({
		'test.resetDatabase': () => resetDatabase(),
	});

	describe('Tasks', (done)  => {
		// describe('CRUD operations', (done) => {
			beforeEach((done) => {
				StubCollections.stub(Tasks);
				resetDatabase();
				//Using Factory
				Factory.define('task', Tasks, {
					text: faker.lorem.sentences(2),
					createdAt: faker.date.recent(),
					owner: faker.random.uuid(),
					username: faker.lorem.word()
				});
				
				// Tasks.insert(Factory.create('task'));
				// Meteor.call('test.resetDatabase', done);
				done();
			// })

			// afterEach(() => {
				StubCollections.restore();
			})

			describe('Insertions', () => {
				it('should insert', () => {
					// Tasks.find().count().should.equal(1);
					assert.equal(Tasks.find().count(), 4);
				});
			});
		// });
	});
}