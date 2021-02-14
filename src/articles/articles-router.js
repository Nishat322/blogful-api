/* eslint-disable eqeqeq */
/* eslint-disable indent */
'use strict';

const express = require('express');
const ArticlesService = require('./articles-service');

const articlesRouter = express.Router();
const jsonParser = express.json();

articlesRouter
    .route('/articles')
    .get((req,res,next) => {
        const knexInstance = req.app.get('db');
        ArticlesService.getAllArticles(knexInstance)
            .then(articles => {
                res.json(articles);
            })
            .catch(next);
    })
    .post(jsonParser, (req,res,next) => {
        const {title, content, style} = req.body;
        const newArticle = {title, content, style};
        const knexInstance = req.app.get('db');

        for (const [key,value] of Object.entries(newArticle)){
            if(value == null){
                return res 
                        .status(400)
                        .json({error: {message: `Missing '${key}' in the request body` }});

            }
        }
        ArticlesService.insertArticle(knexInstance,newArticle)
            .then(article => {
                res
                    .status(201)
                    .location(`/articles/${article.id}`)
                    .json(article);
            })
            .catch(next);
    });

articlesRouter
    .route('/articles/:article_id')
    .get((req,res,next) => {
        const knexInstance = req.app.get('db');
        const {article_id} = req.params;
        ArticlesService.getById(knexInstance, article_id)
            .then(article => {
                if(!article){
                    return res
                        .status(404)
                        .json({error: {message: 'Article doesn\'t exist'}});
                }
                res.json(article);
            })
            .catch(next);
    });

    module.exports = articlesRouter;