/* eslint-disable indent */
'use strict';
const ArticlesService = {
    getAllArticles(knex){
        return knex.select('*').from('blogful_articles');
    },

    insertArticle(knex, newArticle){
        return knex 
            .insert(newArticle)
            .into('blogful_articles')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(knex, articleId){
        return knex 
            .from('blogful_articles')
            .select('*')
            .where('id', articleId)
            .first();
    },

    deleteArticle(knex, articleId){
        return knex('blogful_articles') 
            .where('id', articleId)
            .delete();
    }
};

module.exports = ArticlesService;