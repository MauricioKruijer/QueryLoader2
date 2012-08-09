/*
 * QueryLoader v2 - A simple script to create a preloader for images
 *
 * For instructions read the original post:
 * http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
 *
 * Copyright (c) 2011 - Gaya Kessler
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  2.2
 * Last update: 03-04-2012
 *
 */
(function($) {


    if (!Array.prototype.indexOf)
	   {
	   Array.prototype.indexOf = function(elt /*, from*/)
             {
             var len  = this.length >>> 0;
             var from = Number(arguments[1]) || 0;
                 from = (from < 0)
                      ? Math.ceil(from)
                      : Math.floor(from);
             if (from < 0)
                 from += len;
 
                 for (; from < len; from++)
                     {
                     if (from in this &&
                     this[from] === elt)
                     return from;
                     }
             return -1;
             };
       }


    var qLimages = new Array;
    var qLdone = 0;
    var qLdestroyed = false;

    var qLimageContainer = "";
    var qLoverlay = "";
    var qLbar = "";
    var qLpercentage = "";
    var qLimageCounter = 0;
    var qLstart = 0;

    var qLoptions = {
        onComplete: function () {},
        backgroundColor: "#000",
        bg: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAAXNSR0IArs4c6QAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NkFDMzU3NDM2MTA2MTFFMDgwMDdFNTlDNTQ3RDhBQUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NkFDMzU3NDQ2MTA2MTFFMDgwMDdFNTlDNTQ3RDhBQUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2QUMzNTc0MTYxMDYxMUUwODAwN0U1OUM1NDdEOEFBRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2QUMzNTc0MjYxMDYxMUUwODAwN0U1OUM1NDdEOEFBRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk7/MwMAAAAhUExURf///29/g2Z2emp6fmx8gG5+gmt7f2l5fW19gWh4fGd3e5ce2NYAAALhSURBVHicjJUJbhRBDEXL+3L/A/McQJHQgFAWZbqr7L/ZeeEyPh0zOeEeK2VSXp7jYTqS665mrzY3xjy0Q9a2fL1GakPHV3hbmZ31Yj13e0tdWkwjUka7jTpZEpM+0qmvwpteVT0Up21Qe0ZkptRidLazI54LFbrolzZWE+PpulySLrFwTrVpPrN2HzM+Q4onoxkCvfXd4khYSc5hbIp22eim7zQVs6WgSM8UUG1N5Qt+87oml3IwLdGZKCorIlhPVk3L+6nSlBsAD07pRyEeIoYFN8Fj0yBF5QUmzCMNjuKi7u8/4C2Cxvs26d/tH+3P4gJ1jyI/l8QNkTsUEIET3hIPr9bqy+KkauI2B3DXVxc4uWKt62/xjd7mRit+ArFq5pp4RDRQU+H5PmelJ9ITjfEHmvxBRSuaGRmTo1sdewr5ZKC39QKAn5c1zlFHOp8gDQ15bMWosjhfGlnV3iSh4jodMjGhw0Scsl6BYp1k/nL2cBpmVO3WNFJa0KHsxbMO5KJp5Ly/kBTURipqkVYklPcXfWHABFzxi7Javt/0ETg3LxobR7dCmtBunsU0ff+elDVBzVPi5Ulh6GV45YVRPDhTCXF699FS9H1kkb4VrY7m2MFpPoNZT0EQ0lOIGRFUsOrJuTQLQoR6wObeJINNFHDyMW7QCrLp6L2gEF4zpH7ZBzgY80vHOsAkFuQ8Ykp5gFQ3ZERue247WLMp9hzRK5TKWHDWrh9gla2CvVexkIceduXwm0pEnDKAxRIbvi+4xriCDG+GQOHf3CBmacrxwS+0Rx+vr/T8ytH5gbCI4Swh5UZgQ5HM7BvXzyvJ8ZXM3hdtVb3ft1JWzTNefYT9oi8oVgBFfx5ylLWFhhcothzXuAAZ8KE2wCFCYabdIvXUnsPPtkLd8ccywJlWtgMr4OaovuLJkJ0AYL0hXwRnPIk+TINDbGn87B7787/FIzT0GyLZjK0zeZ9R/wAAAP//AwCzgiWv4VU/RAAAAABJRU5ErkJggg==)',
        barColor: "#fff",
        barHeight: 1,
        percentage: false,
        deepSearch: true,
        completeAnimation: "fade",
        minimumTime: 500,
        onLoadComplete: function () {
            if (qLoptions.completeAnimation == "grow") {
                var animationTime = 500;
                var currentTime = new Date();
                if ((currentTime.getTime() - qLstart) < qLoptions.minimumTime) {
                    animationTime = (qLoptions.minimumTime - (currentTime.getTime() - qLstart));
                }

                $(qLbar).stop().animate({
                    "width": "100%"
                }, animationTime, function () {
                    $(this).animate({
                        top: "0%",
                        width: "100%",
                        height: "100%"
                    }, 500, function () {
                        $(qLoverlay).fadeOut(500, function () {
                            $(this).remove();
                            qLoptions.onComplete();
                        })
                    });
                });
            } else {
                $(qLoverlay).fadeOut(500, function () {
                    $(qLoverlay).remove();
                    qLoptions.onComplete();
                });
            }
        }
    };

    var afterEach = function () {
        //start timer
        var currentTime = new Date();
        qLstart = currentTime.getTime();

        createPreloadContainer();
        createOverlayLoader();
    };

    var createPreloadContainer = function() {
        qLimageContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });
        for (var i = 0; qLimages.length > i; i++) {
            $.ajax({
                url: qLimages[i],
                type: 'HEAD',
                success: function(data) {
                    if(!qLdestroyed){
                        qLimageCounter++;
                        addImageForPreload(this['url']);
                    }
                }
            });
        }
    };

    var addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load", function () {
            completeImageLoading();
        }).appendTo(qLimageContainer);
    };

    var completeImageLoading = function () {
        qLdone++;

        var percentage = (qLdone / qLimageCounter) * 100;
        $(qLbar).stop().animate({
            width: percentage + "%",
            minWidth: percentage + "%"
        }, 200);

        if (qLoptions.percentage == true) {
            $(qLpercentage).text(Math.ceil(percentage) + "%");
        }

        if (qLdone == qLimageCounter) {
            destroyQueryLoader();
        }
    };

    var destroyQueryLoader = function () {
        $(qLimageContainer).remove();
        qLoptions.onLoadComplete();
        qLdestroyed = true;
    };

    var createOverlayLoader = function () {
        qLoverlay = $("<div id='qLoverlay'></div>").css({
            width: "100%",
            height: "100%",
            background: qLoptions.bg,
            backgroundColor: qLoptions.backgroundColor,
            backgroundPosition: "fixed",
            position: "fixed",
            zIndex: 666999,
            top: 0,
            left: 0
        }).appendTo("body");
        qLbar = $("<div id='qLbar'></div>").css({
            height: qLoptions.barHeight + "px",
            marginTop: "-" + (qLoptions.barHeight / 2) + "px",
            background: qLoptions.bg,
            backgroundColor: qLoptions.barColor,
            width: "0%",
            position: "absolute",
            top: "50%"
        }).appendTo(qLoverlay);
        if (qLoptions.percentage == true) {
            qLpercentage = $("<div id='qLpercentage'></div>").text("0%").css({
                height: "40px",
                width: "100px",
                position: "absolute",
                fontSize: "3em",
                top: "50%",
                left: "50%",
                marginTop: "-" + (59 + qLoptions.barHeight) + "px",
                textAlign: "center",
                marginLeft: "-50px",
                color: qLoptions.barColor
            }).appendTo(qLoverlay);
        }
    };

    var findImageInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            var url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            var url = $(element).attr("src");
        }

        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0 && qLimages.indexOf(urls[i]) == -1) {
                    var extra = "";
                    if ($.browser.msie && $.browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    qLimages.push(urls[i] + extra);
                }
            }
        }
    }

    $.fn.queryLoader2 = function(options) {
        if(options) {
            $.extend(qLoptions, options );
        }

        this.each(function() {
            findImageInElement(this);
            if (qLoptions.deepSearch == true) {
                $(this).find("*:not(script)").each(function() {
                    findImageInElement(this);
                });
            }
        });

        afterEach();

        return this;
    };

})(jQuery);