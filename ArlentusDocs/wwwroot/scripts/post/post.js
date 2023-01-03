var currentPost;
var treeListArea = $("#treeListArea");
var buttonArea = $("#buttonArea");
var postArea = $("#postArea");

$(function () {
    // #region jsTree Data Example
    //var arrayCollection = [
    //    { "id": "device", "parent": "#", "text": "Devices", "icon": "" },
    //    { "id": "mobile", "parent": "device", "text": "Mobile Phones", "icon": "" },
    //    { "id": "apple", "parent": "mobile", "text": "Apple IPhone 6", "icon": "/" },
    //    { "id": "samsung", "parent": "mobile", "text": "Samsung Note II", "icon": "/" },
    //];
    // #endregion

    $.ajax({
        type: "GET",
        url: "/Post/GetAllPosts",
        success: function (response) {
            var postList = $.parseJSON(response);
            var postCollection = [];

            $.each(postList, function (index, post) {
                switch (post.ParentId) {
                    case 0:
                        var postModel = {
                            "id": `post${post.Id}`,
                            "parent": "#",
                            "text": `${post.Header}`
                        };
                        break;

                    default:
                        var postModel = {
                            "id": `post${post.Id}`,
                            "parent": `post${post.ParentId}`,
                            "text": `${post.Header}`
                        };
                }
                postCollection.push(postModel);
            });

            treeListArea.jstree({
                "core": {
                    "check_callback": true,
                    'data': postCollection
                },
                "plugins": [
                    "search",
                    "state",
                    "unique",
                    "wholerow",
                    "changed"
                ]
            });

            // #region Search Tree List
            var to = false;
            $('#searchTreeList').keyup(function () {
                if (to) clearTimeout(to);
                to = setTimeout(function () {
                    var v = $('#searchTreeList').val();
                    treeListArea.jstree(true).search(v);
                }, 250);
            });
            // #endregion

            treeListArea.on("select_node.jstree", function (e, data) {
                var postId = data.node.id.split('post')[1];

                $.ajax({
                    type: "GET",
                    url: "Post/GetPostById",
                    data: { id: postId },
                    success: function (response) {
                        currentPost = $.parseJSON(response);

                        // Button Area
                        buttonArea.children().remove();
                        var editButton = `<button type="button" onclick="editPost(${currentPost.Id})">Edit</button>`;
                        buttonArea.append(editButton);

                        // Post Area
                        postArea.children().remove();
                        var header = `<h4 id="postHeader">${currentPost.Header}</h4>`;
                        var context = `<div id="summernote">${currentPost.Context}</div>`;
                        postArea.append(header, context);
                    }
                });
            });

            treeListArea.on("create_node.jstree", function (e, data) {
                var parentId = data.node.parent.split('post')[1];
                var header = data.node.text;

                var postModel = {
                    ParentId: parentId,
                    CreatedBy: "Görkem", // [Not Completed]
                    Header: header
                }

                $.ajax({
                    type: "POST",
                    url: "/Post/AddPost",
                    data: { model: postModel },
                    success: function (postId) {
                        treeListArea.jstree('refresh');

                        $.ajax({
                            type: "GET",
                            url: "Post/GetPostById",
                            data: { id: postId },
                            success: function (response) {
                                currentPost = $.parseJSON(response);

                                // Button Area
                                buttonArea.children().remove();
                                var editButton = `<button type="button" onclick="editPost(${currentPost.Id})">Edit</button>`;
                                buttonArea.append(editButton);

                                // Post Area
                                postArea.children().remove();
                                var header = `<h4 id="postHeader">${currentPost.Header}</h4>`;
                                var context = `<div id="summernote">${currentPost.Context}</div>`;
                                postArea.append(header, context);
                            }
                        });
                    }
                });
            });

            treeListArea.on("changed.jstree", function (e, data) {
                console.log("-----(change)-----");
                console.table(data);
            })
        }
    });


    //refreshTreeList();

    // #region Default Post Configurations
    //$.ajax({
    //    type: "GET",
    //    url: "/Post/GetPostById",
    //    data: { id: 18 }, // [Not Completed]
    //    success: function (response) {
    //        post = jQuery.parseJSON(response);

    //        var editButton = `<button type="button" onclick="editPost()">Edit</button>`;
    //        buttonArea.append(editButton);

    //        var header = `<h4 id="postHeader">${post.Header}</h4>`;
    //        $("#header").append(header);
    //        $("#summernote").append(post.Context);
    //    }
    //});
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

function demo_create() {
    var ref = treeListArea.jstree(true),
        sel = ref.get_selected();
    console.log("-----(ref)-----");
    console.log(ref);
    console.log("-----(sel)-----");
    console.log(sel);
    if (!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel);
    if (sel) {
        ref.edit(sel);
    }
};

function demo_refresh() {
    treeListArea.jstree('refresh');
}

// #region Refresh Event Listeners
function refreshEventListener() {
    $(".title").click(function () {
        var liId = this.id;
        var postId = liId.split('post')[1];
        $.ajax({
            type: "GET",
            url: "/Post/GetAllPostsByParentId",
            data: { parentId: postId },
            success: function (response) {
                var childList = $.parseJSON(response);
                if (childList != null) {
                    console.log($(`#${liId}`).html());
                    $(`#${liId}`).append(`<ul class="nested"></ul>`);
                    console.log($(`#${liId}`).html());

                    var toggler = $(".caret");

                    for (var i = 0; i < toggler.length; i++) {
                        toggler[i].addEventListener("click", function () {
                            this.parentElement.querySelector(".nested").classList.toggle("active");
                            this.classList.toggle("caret-down");
                        });
                    }

                    $.each(childList, function (index, child) {
                        $.ajax({
                            async: false,
                            type: "GET",
                            url: "/Post/HaveAChild",
                            data: { postId: post.Id },
                            success: function (haveAChild) {
                                if (haveAChild) {
                                    var title =
                                        `
                                            
                                        `;
                                }
                                else {

                                }
                            }
                        });
                    });
                }

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
                            if (haveAChild) {
                                var title =
                                    `<li id="post${post.Id}" class="title caret">
                                        <span>${post.Header}</span>
                                        <i style="color: white; background-color: green; cursor: pointer; border-radius: 5px;" onclick="newPost (${post.Id})">&nbsp; + &nbsp;</i>
                                    </li>`;
                            }
                            else {
                                var title =
                                    `<li id="post${post.Id}" class="title">${post.Header}
                                        <i style="color: white; background-color: green; cursor: pointer; border-radius: 5px;" onclick="newPost (${post.Id})">&nbsp; + &nbsp;</i>
                                    </li>`;
                            }
                            $("#treeList").append(title);
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
    var header = `<input id="postHeader" type="text" placeholder="Header" style="width: 100%;" value="${currentPost.Header}" />`;
    var context = `<div id="summernote">${currentPost.Context}</div>`;
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
            currentPost.Header = $("#postHeader").val();
            currentPost.Context = $('#summernote').summernote('code');

            $.ajax({
                type: "PUT",
                url: "/Post/UpdatePost",
                data: { model: currentPost },
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




function demo_rename() {
    var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) { return false; }
    sel = sel[0];
    ref.edit(sel);
};

function demo_delete() {
    var ref = $('#jstree_demo').jstree(true),
        sel = ref.get_selected();
    if (!sel.length) { return false; }
    ref.delete_node(sel);
};






