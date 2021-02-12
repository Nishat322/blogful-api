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
            id: 1,
            title: 'First test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            date_published: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            title: 'Second test post!',
            content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.',
            date_published: new Date('2100-05-22T16:28:32.615Z')
        },
        {
            id: 3,
            title: 'Third test post!',
            content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.',
            date_published: new Date('1919-12-22T16:28:32.615Z')
        }
    ];

    before(() => {
        db = knex({
            'client': 'pg',
            'connection': process.env.TEST1_DB_URL,
        });
    });

    before(() => db('blogful_articles').truncate());

    before(() => {
        return db   
            .into('blogful_articles')
            .insert(testArticles);
    });

    after(() => db.destroy());

    describe('getAllArticles()', () => {
        it('resolves all articles from \'blogful_articles\' table', () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles.map(article => ({
                        id: article.id,
                        title: article.title,
                        content: article.content,
                        date_published: new Date(article.date_published)
                    })));
                });
        });
    });
});