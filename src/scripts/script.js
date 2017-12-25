$(document).ready(function() {
    $.ajax({
        url:'../mockapi/articles.json',
        success: function(data) {
            this.articles = $('.js-article');
            var self = this;
            if (data.articles && data.articles.length) {
                data.articles.forEach(function(article) {
                    self.articles.append(
                        blocks.templates['article'](article)
                        );
                });
            }
        }
    });
});