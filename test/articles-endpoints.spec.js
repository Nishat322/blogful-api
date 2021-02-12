/* eslint-disable indent */
'use strict';

const {expect} = require('chai');
const knex = require('knex');
const app = require('../src/app');

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
       
    });
        
});