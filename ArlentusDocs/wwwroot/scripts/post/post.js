var post;
var treeListArea = $("#treeListArea");
var buttonArea = $("#buttonArea");
var postArea = $("#postArea");

$(function () {
    refreshTreeList();

    // #region Default Post Configurations
    $.ajax({
        type: "GET",
        url: "/Post/GetPostById",
        data: { id: 18 }, // [Not Completed]
        success: function (response) {
            post = jQuery.parseJSON(response);

            var editButton = `<button type="button" onclick="editPost()">Edit</button>`;
            buttonArea.append(editButton);

            var header = `<h4 id="postHeader">${post.Header}</h4>`;
            $("#header").append(header);
            $("#summernote").append(post.Context);
        }
    });
    // #endregion

    // #region Summernote Configurations
    var styleEle = $("style#fixed");
    if (styleEle.length == 0)
        $("<style id=\"fixed\">.note-editor .dropdown-toggle::after { all: unset; } .note-editor .note-dropdown-menu { box-sizing: content-box; } .note-editor .note-modal-footer { box-sizing: content-box; }</style>")
            .prependTo("body");
    else
        styleEle.remove();
    // #endregion
});

// #region Functions

// #region Refresh Event Listeners
function refreshEventListener() {
    $(".title").click(function () {
        var postId = this.id.split('post')[1];
        $.ajax({
            type: "GET",
            url: "/Post/GetAllPostsByParentId",
            data: { parentId: postId },
            success: function (response) {
                var childList = $.parseJSON(response);
                $.each(childList, function (index, child) {

                });
            }
        });
    });
}
// #endregion

// #region Refresh Tree List
// [Not Completed -> Fonksiyon haline getirilmesi gerekebilir!]
function refreshTreeList() {
    treeListArea.children().remove();
    $.ajax({
        type: "GET",
        url: "/Post/GetAllPostsByParentId",
        data: { parentId: 0 },
        success: function (response) {
            var postList = $.parseJSON(response);
            treeListArea.append(`<br/><span class="py-1" style="color: white; background-color: green; cursor: pointer; border-radius: 5px; border: 2px solid white;" onclick="newPost(0)">&nbsp; Add New Title (+) &nbsp;</span>`);
            if (postList != null) {
                treeListArea.prepend(`<ul id="treeList"></ul>`);
                $.each(postList, function (index, post) {
                    $.ajax({
                        async: false,
                        type: "GET",
                        url: "/Post/HaveAChild",
                        data: { postId: post.Id },
                        success: function (haveAChild) {
                            var title =
                                `<li>
                                    <span id="post${post.Id}" class="title">${post.Header} </span>
                                    <i style="color: white; background-color: green; cursor: pointer; border-radius: 5px;" onclick="newPost(${post.Id})">&nbsp; + &nbsp;</i>
                                </li>`;
                            $("#treeList").append(title);

                            if (haveAChild)
                                $(`#post${post.Id}`).addClass('caret');
                        }
                    });
                });

                refreshEventListener();
            }
            else {

            }
        }
    });
}
// #endregion

// #region New Post
function newPost(parentId) {

    // Button Area
    buttonArea.children().remove();
    var saveButton = `<button type="button" onclick="savePost('add', ${parentId})">Save</button>`;
    buttonArea.append(saveButton);

    // Post Area
    postArea.children().remove();
    var header = `<input id="postHeader" type="text" placeholder="Header" style="width: 100%;" />`;
    var context = `<div id="summernote"></div>`;
    postArea.append(header, context);
    $('#summernote').summernote();
}
// #endregion

// #region Edit Post
function editPost(postId) {
    // Button Area
    buttonArea.children().remove();
    var saveButton = `<button type="button" onclick="savePost('update', ${postId})">Save</button>`;
    buttonArea.append(saveButton);

    // Post Area
    postArea.children().remove();
    var header = `<input id="postHeader" type="text" placeholder="Header" style="width: 100%;" value="${post.Header}" />`;
    var context = `<div id="summernote">${post.Context}</div>`;
    postArea.append(header, context);
    $('#summernote').summernote();
}
// #endregion

// #region Save Post
function savePost(type, parentOrPostId) {
    // if type = update -> parentOrPostId = postId
    // if type = add    -> parentOrPostId = parentId
    switch (type) {
        case 'update':
            post.Header = $("#postHeader").val();
            post.Context = $('#summernote').summernote('code');

            $.ajax({
                type: "PUT",
                url: "/Post/UpdatePost",
                data: { model: post },
                success: function (response) {
                    var updatedPostModel = jQuery.parseJSON(response);

                    // Button Area
                    buttonArea.children().remove();
                    var editButton = `<button type="button" onclick="editPost()">Edit</button>`;
                    buttonArea.append(editButton);

                    // Post Area
                    postArea.children().remove();
                    var header = `<h4 id="postHeader">${updatedPostModel.Header}</h4>`;
                    var context = `<div id="summernote">${updatedPostModel.Context}</div>`;
                    postArea.append(header, context);
                },
                error: function (error) {
                    alert("Error!");
                    console.log(error);
                }
            });
            break;

        case 'add':
            var postModel = {
                ParentId: parentOrPostId,
                CreatedBy: "Görkem", // [Not Completed]
                Header: $("#postHeader").val(),
                Context: $('#summernote').summernote('code')
            }

            $.ajax({
                type: "POST",
                url: "/Post/AddPost",
                data: { model: postModel },
                success: function (postId) {
                    // Update Tree List
                    // code snippet...

                    // Button Area
                    buttonArea.children().remove();
                    var editButton = `<button type="button" onclick="editPost(${postId})">Edit</button>`;
                    buttonArea.append(editButton);

                    // Post Area
                    postArea.children().remove();
                    var header = `<h4 id="postHeader">${postModel.Header}</h4>`;
                    var context = `<div id="summernote">${postModel.Context}</div>`;
                    postArea.append(header, context);

                    refreshTreeList();
                },
                error: function (error) {
                    alert("Error!");
                    console.log(error);
                }
            });
            break;

        default:
    }
}
// #endregion

// #endregion