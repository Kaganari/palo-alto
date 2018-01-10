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
    $(".menu__burger").click(function(){
        $("body").css("position","fixed");
        $("body").css("top","0");
        $("body").css("left","0");
        $(".sidebar").animate({right:"0"},400);
        $("body").animate({left:"-220px"},400);
        $(".cover").animate({right:"240"},400);        
    });
    $(".cover").click(function(){
        $(".sidebar").animate({right:"-240px"},400);
        $("body").animate({left:"0"},400);
        $(".cover").animate({right:"-240px"},400);
        $("body").css("position","relative");
    });
});