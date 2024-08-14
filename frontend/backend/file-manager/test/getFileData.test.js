import request from 'supertest';
import { expect } from 'chai';
import app from '../server.js';

describe('File Operations', () => {
  let token;
  let fileId;

  // Create a user, get a token, and create a file before running the tests
  before(async () => {
    try {
      // Create a new user
      const userData = { email: 'unique115@example.com', password: 'securepassword456' };
      await request(app)
        .post('/users')
        .send(userData)
        .set('Content-Type', 'application/json');

      // Get token
      const res = await request(app)
        .get('/connect')
        .set('Authorization', `Basic ${Buffer.from(`${userData.email}:${userData.password}`).toString('base64')}`);

      token = res.body.token;
      if (!token) {
        throw new Error('Token is undefined');
      }
      console.log('Retrieved Token:', token);

      // Create a new file
      const fileData = {
        name: 'myText.txt',
        type: 'file',
        data: 'SGVsbG8gV2Vic3RhY2shCg=='
      };

      const createResponse = await request(app)
        .post('/files')
        .set('X-Token', token)
        .set('Content-Type', 'application/json')
        .send(fileData);

      fileId = createResponse.body.id;
      if (!fileId) {
        throw new Error('File ID is undefined');
      }
      console.log('Created File ID:', fileId);
    } catch (error) {
      console.error('Error in before hook:', error);
      throw error; // Rethrow error to fail the test
    }
  });

  describe('File Operations', () => {
    it('should unpublish the file and return file details', async () => {
      const unpublishResponse = await request(app)
        .put(`/files/${fileId}/unpublish`)
        .set('X-Token', token);
      
      expect(unpublishResponse.status).to.equal(200);
      expect(unpublishResponse.body).to.be.an('object');
      expect(unpublishResponse.body).to.have.all.keys('id', 'userId', 'name', 'type', 'isPublic', 'parentId');
      expect(unpublishResponse.body.isPublic).to.equal(false);
    });



    it('should publish the file and return file details', async () => {
      const publishResponse = await request(app)
        .put(`/files/${fileId}/publish`)
        .set('X-Token', token);
      
      expect(publishResponse.status).to.equal(200);
      expect(publishResponse.body).to.be.an('object');
      expect(publishResponse.body).to.have.all.keys('id', 'userId', 'name', 'type', 'isPublic', 'parentId');
      expect(publishResponse.body.isPublic).to.equal(true);
    });

    it('should return file data after publishing', async () => {
      const dataResponse = await request(app)
        .get(`/files/${fileId}/data`)
        .set('X-Token', token);
      
      expect(dataResponse.status).to.equal(200);
      expect(dataResponse.text).to.equal('Hello Webstack!\n');
    });
  });
});
