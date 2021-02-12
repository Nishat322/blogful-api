'use strict';

/* eslint-disable indent */
require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const ArticlesService = require('../src/articles/articles-service');

describe('Articles service object', function(){
    let db;
    let testArticles = [
        {
            title: 'First test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?'
        },
        {
            title: 'Second test post!',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.'
        },
        {
            title: 'Third test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.'
        }
    ];

    before(() => {
        db = knex({
            'client': 'pg',
            'connection': process.env.TEST1_DB_URL,
        });
    });

    before(() => {
        return db   
            .into('blogful_articles')
            .insert(testArticles);
    });

    after(() => db.destroy());

    describe('getAllArticles()', () => {
        it('resolves all articles from \'blogful_articles\' table', () => {
        });
    });
});