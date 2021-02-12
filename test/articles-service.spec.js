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

    afterEach(() => db('blogful_articles').truncate());

    after(() => db.destroy());

    context('Given \'blogful_articles\' has data', () => {
        beforeEach(() => {
            return db   
                .into('blogful_articles')
                .insert(testArticles);
        });

        it('getAllArticles() resolves all articles from \'blogful_articles\' table', () => {
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

        it('getById() resolves an article by id from \'blogful_articles\' table', () => {
            const secondId = 2;
            const secondTestArticle = testArticles[secondId - 1];

            return ArticlesService.getById(db, secondId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: secondId,
                        title: secondTestArticle.title,
                        content: secondTestArticle.content,
                        date_published: secondTestArticle.date_published
                    });
                });
        });
    });

    context('Given \'blogful_articles\' has no data', () => {
        it('getAllArticles() resolves an empty array', () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql([]);
                });
        });

        it('insertArticle() inserts a new article and resolves the new article with an \'id\'', () => {
            const newArticle = {
                title: 'Test new title',
                content: 'Test new content',
                date_published: new Date('2020-01-01T00:00:00.000Z')
            };
            return ArticlesService.insertArticle(db, newArticle)
                .then (actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        content: newArticle.content,
                        date_published: newArticle.date_published
                    });
                });
        });
    });
});