/* eslint-disable indent */
'use strict';

const {expect} = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const {makeArticlesArray2} = require('./articles.fixtures');

describe.only('Articles Endpoints', function(){
    let db; 
    
    before('make knex connection', () => {
        db = knex({
            'client': 'pg',
            'connection': process.env.TEST_DB_URL,
        });
    });

    after('disconnect from db', () => db.destroy());

    before('clean the table', () => db('blogful_articles').truncate());

    context('Given there are articles in the database', () => {
        const testArticles = makeArticlesArray2();

        beforeEach('insert articles', () => {
            return db   
                .into('blogful_articles')
                .insert(testArticles);
        });

        app.set('db', db);

        it('GET /articles responds with 200 and all the articles', () => {
            return supertest(app)
                .get('/articles')
                .expect(200, testArticles);

        });
    });
        
});