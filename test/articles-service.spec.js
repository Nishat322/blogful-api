'use strict';

/* eslint-disable indent */
require('dotenv').config();
const { expect } = require('chai');
const knex = require('knex');
const ArticlesService = require('../src/articles/articles-service');
const {makeArticlesArray} = require('./articles.fixtures');
const { makeUsersArray } = require('./users.fixtures');

describe('Articles service object', function(){
    let db;
    let testArticles = makeArticlesArray();
    let testUsers = makeUsersArray();

    before(() => {
        db = knex({
            'client': 'pg',
            'connection': process.env.TEST_DB_URL,
        });
    });

    before(() => db.raw('TRUNCATE blogful_articles, blogful_users, blogful_comments RESTART IDENTITY CASCADE'));

    afterEach(() => db.raw('TRUNCATE blogful_articles, blogful_users, blogful_comments RESTART IDENTITY CASCADE'));

    after(() => db.destroy());

    context('Given \'blogful_articles\' has data', () => {
        beforeEach(() => {
            return db   
                .into('blogful_users')
                .insert(testUsers)
                .then(() => {
                    return db
                    .into('blogful_articles')
                    .insert(testArticles);
            });
        });


        it('getAllArticles() resolves all articles from \'blogful_articles\' table', () => {
            return ArticlesService.getAllArticles(db)
                .then(actual => {
                    expect(actual).to.eql(testArticles.map(article => ({
                        id: article.id,
                        title: article.title,
                        content: article.content,
                        date_published: new Date(article.date_published),
                        author: article.author,
                        style: article.style,
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
                        date_published: new Date(secondTestArticle.date_published),
                        author: secondTestArticle.author,
                        style: secondTestArticle.style,
                    });
                });
        });

        it('deleteArticle() removes an article by id from \'blogful_articles\' table', () => {
            const articleId = 2;

            return ArticlesService.deleteArticle(db, articleId)
                .then(() => ArticlesService.getAllArticles(db))
                .then(allArticles => {
                    const expected = testArticles.filter(article => article.id !== articleId);
                    expect(allArticles).to.eql(expected);
            });
        });

        it('updateArticle() updates an article by id from \'blogful_articles\' table', () => {
            const idOfArticleToUpdate = 1;
            const newArticleData = {
                author: 1,
                title: 'updated title',
                content: 'updated content',
                date_published: new Date(),
                style: 'How-to'
            };

            return ArticlesService.updateArticle(db, idOfArticleToUpdate, newArticleData)
                .then(() => ArticlesService.getById(db, idOfArticleToUpdate))
                .then(article => {
                    expect(article).to.eql({
                        id: idOfArticleToUpdate,
                        title: newArticleData.title,
                        content: newArticleData.content,
                        date_published: newArticleData.date_published,
                        author: newArticleData.author,
                        style: newArticleData.style,
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
                date_published: new Date('2020-01-01T00:00:00.000Z'),
                style:'Listicle',
            };
            return ArticlesService.insertArticle(db, newArticle)
                .then (actual => {
                    expect(actual).to.eql({
                        id: 1,
                        title: newArticle.title,
                        content: newArticle.content,
                        date_published: newArticle.date_published,
                        author: newArticle.author,
                        style: newArticle.style,
                    });
                });
        });
    });
});