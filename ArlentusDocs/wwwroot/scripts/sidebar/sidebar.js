// #region Dynamic Tree View

$("#getPosts").click(function () {
    $.ajax({
        type: "GET",
        url: "/Post/GetPostsByParentId",
        data: { parentId: 0 },
        success: function (response) {
            var postList = jQuery.parseJSON(response); // Parent list
            if (postList != null) {
                var li = `<li></li>`;
                postList.forEach(function (post) {
                    var span = `<span id="post_${post.Id}" clas="caret" onclick="getPostDetail(${post.Id})">${post.Header}</span>`;
                    li.append(span);
                });
            }
        },
        error: function (error) {
            alert("Error!");
            console.log(error);
        }
    });
});

// #endregion



/*
if (childPostList != null) {
    var li_1 = `<li></li>`;
    var span_1 = `<span clas="caret">${post.Header}</span>`;
    var ul_1 = `<ul class="nested"></ul>`;
}
else {
    var li = `<li></li>`;
    var span = `<span>${post.Header}</span>`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

$("#getPosts").click(function () {
    // Parent
    $.ajax({
        type: "GET",
        url: "/Post/GetPostsByParentId",
        data: { parentId: 0 },
        success: function (response) {
            var postList = jQuery.parseJSON(response); // Parent list
            if (postList != null) {
                postList.foreach(function (post) {
                    // 1. Child
                    $.ajax({
                        type: "GET",
                        url: "/Post/GetPostsByParentId",
                        data: { parentId: post.Id },
                        success: function (response) {
                            var firstChildList = jQuery.parseJSON(response); // 1. Child list
                            if (firstChildList != null) {
                                firstChildList.foreach(function (child) {
                                    // 2. Child
                                    $.ajax({
                                        type: "GET",
                                        url: "/Post/GetPostsByParentId",
                                        data: { parentId: child.Id },
                                        success: function (response) {
                                            var secondChildList = jQuery.parseJSON(response); // 2. Child list
                                            if (secondChildList != null) {
                                                secondChildList.foreach(function (child) {
                                                    // 3. Child
                                                    $.ajax({
                                                        type: "GET",
                                                        url: "/Post/GetPostsByParentId",
                                                        data: { parentId: child.Id },
                                                        success: function (response) {
                                                            var thirdChildList = jQuery.parseJSON(response); // 3. Child list
                                                            if (thirdChildList != null) {
                                                                thirdChildList.foreach(function (child) {
                                                                    // 4. Child
                                                                    $.ajax({
                                                                        type: "GET",
                                                                        url: "/Post/GetPostsByParentId",
                                                                        data: { parentId: child.Id },
                                                                        success: function (response) {
                                                                            var fourthChildList = jQuery.parseJSON(response); // 4. Child list
                                                                            if (fourthChildList != null) {

                                                                            }
                                                                        },
                                                                        error: function (error) {
                                                                            alert("Error!");
                                                                            console.log(error);
                                                                        }
                                                                    });
                                                                });
                                                            }
                                                        },
                                                        error: function (error) {
                                                            alert("Error!");
                                                            console.log(error);
                                                        }
                                                    });
                                                });
                                            }
                                        },
                                        error: function (error) {
                                            alert("Error!");
                                            console.log(error);
                                        }
                                    });
                                });
                            }
                        },
                        error: function (error) {
                            alert("Error!");
                            console.log(error);
                        }
                    });
                });
            }
        },
        error: function (error) {
            alert("Error!");
            console.log(error);
        }
    });
});
*/