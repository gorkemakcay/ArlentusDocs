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
            // #region jsTree
            // #region Datas from DB
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
            // #endregion

            // #region Configurations
            treeListArea.jstree({
                "core": {
                    "check_callback": true,
                    'data': postCollection
                },
                "plugins": [
                    "search",
                    "state",
                    "unique",
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
            // #endregion

            // #region Triggers
            // #region Select
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
                        var editButton = `<button id="editButton" type="button" onclick="editPost()">Edit</button>`;
                        buttonArea.append(editButton);

                        // Post Area
                        postArea.children().remove();
                        var header = `<h4 id="postHeader">${currentPost.Header}</h4>`;
                        var context = `<div id="summernote">${currentPost.Context}</div>`;
                        postArea.append(header, context);
                    }
                });
            });
            // #endregion

            // #region Create
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
                        treeListArea.jstree(true).set_id(data.node, `post${postId}`);
                        treeListArea.jstree(true).deselect_all();
                        treeListArea.jstree(true).select_node(data.node);
                        console.log("-----(create)-----");
                        console.log(data);

                        $.ajax({
                            type: "GET",
                            url: "Post/GetPostById",
                            data: { id: postId },
                            success: function (response) {
                                currentPost = $.parseJSON(response);

                                // Button Area
                                buttonArea.children().remove();
                                var editButton = `<button id="editButton" type="button" onclick="editPost()">Edit</button>`;
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
            // #endregion

            // #region Change
            treeListArea.on("changed.jstree", function (e, data) {
                //console.log("-----(change)-----");
                //console.log(data);
            });
            // #endregion

            treeListArea.on('hover_node.jstree', function (e, data) {
                //console.log(data);
            });

            // #endregion
            // #endregion
        }
    });

    // #region Summernote Configurations
    var styleEle = $("style#fixed");
    if (styleEle.length == 0)
        $("<style id=\"fixed\">.note-editor .dropdown-toggle::after { all: unset; } .note-editor .note-dropdown-menu { box-sizing: content-box; } .note-editor .note-modal-footer { box-sizing: content-box; }</style>")
            .prependTo("body");
    else
        styleEle.remove();
    // #endregion

    // #region Splitter Configuration
    Split(['.leftSide', '.rightSide'], {
        gutter: function () {
            var gutter = document.createElement('div');
            gutter.className = 'gutter gutter-horizontal';
            gutter.style.height = 'auto';
            return gutter
        },
        gutterSize: 20,
        sizes: [20, 80],
        minSize: [300, 300],
        snapOffset: 0
    });
    // #endregion
});

// #region Functions

// #region HTML Button onClick
// #region Edit Post Button
function editPost() {
    // Button Area
    buttonArea.children().remove();
    var saveButton = `<button id="saveButton" type="button" onclick="savePost()">Save</button>`;
    buttonArea.append(saveButton);

    // Post Area
    postArea.children().remove();
    var header = `<input id="postHeaderInput" type="text" placeholder="Header" style="width: 100%;" value="${currentPost.Header}" />`;
    var context = `<div id="summernote">${currentPost.Context}</div>`;
    postArea.append(header, context);
    $('#summernote').summernote();
}
// #endregion

// #region Save Post Button
function savePost() {
    // Rename Selected Node If Header's Value Changed
    if (currentPost.Header != $("#postHeaderInput").val()) {
        var obj = treeListArea.jstree(true).get_selected(true)[0];
        treeListArea.jstree(true).rename_node(obj, $("#postHeaderInput").val());
    }

    // Assign Header & Context To currentPost Model
    currentPost.Header = $("#postHeaderInput").val();
    currentPost.Context = $('#summernote').summernote('code');

    $.ajax({
        type: "PUT",
        url: "/Post/UpdatePost",
        data: { model: currentPost },
        success: function (response) {
            var updatedPostModel = jQuery.parseJSON(response);

            // Button Area
            buttonArea.children().remove();
            var editButton = `<button id="editButton" type="button" onclick="editPost()">Edit</button>`;
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
}
// #endregion
// #endregion

// #endregion


function demo_create() {
    var ref = treeListArea.jstree(true),
        sel = ref.get_selected();
    //console.log("-----(ref)-----");
    //console.log(ref);
    //console.log("-----(sel)-----");
    //console.log(sel);
    if (!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel);
    //if (sel) {
    //    ref.edit(sel);
    //}
};

function demo_refresh() {
    treeListArea.jstree('refresh');
}

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
