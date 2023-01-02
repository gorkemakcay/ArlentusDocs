var post;
var treeListArea = $("#treeListArea");
var buttonArea = $("#buttonArea");
var postArea = $("#postArea");
var treeListClicked = false;

$(function () {


    //$("#treeListArea").fancytree({
    //    extensions: ["edit", "filter"],
    //    source:
    //    {
    //        //url:
    //        //    "https://cdn.rawgit.com/mar10/fancytree/72e03685/demo/ajax-tree-products.json"

    //        type: "GET",
    //        url: "/Post/GetAllPostsByParentId",
    //        data: { parentId: 0 },
    //        success: function (response) {
    //            console.log(response);



    //            //var responseArray = [];

    //            //$.each(response, function (index, value) {
    //            //    var responseList = {
    //            //        title: "",
    //            //        key: ""
    //            //    }
    //            //    responseList.title = value.header;
    //            //    responseList.key = index;
    //            //    responseArray.push(responseList);
    //            //    //console.log(responseArray);
    //            //});
    //            //var responseArrayJSON = JSON.stringify(responseArray);
    //            //response = responseArrayJSON;
    //            //console.log(response);

    //            //var stringRA = $.parseJSON(responseArrayJSON);
    //            //console.log(stringRA);
    //        },
    //        cache: false
    //    }
    //    //source: [
    //    //    {
    //    //        title: "Node 1",
    //    //        key: "1"
    //    //    },
    //    //    {
    //    //        title: "Folder 2",
    //    //        key: "2",
    //    //        folder: true,
    //    //        children:
    //    //            [
    //    //                {
    //    //                    title: "Node 2.1",
    //    //                    key: "3",
    //    //                    myOwnAttr: "abc"
    //    //                },
    //    //                {
    //    //                    title: "Node 2.2",
    //    //                    key: "4"
    //    //                }
    //    //            ]
    //    //    },
    //    //    {
    //    //        title: "Folder 3",
    //    //        key: "5",
    //    //        folder: true,
    //    //        children:
    //    //            [
    //    //                {
    //    //                    title: "Node 3.1",
    //    //                    key: "6"
    //    //                },
    //    //                {
    //    //                    title: "Node 3.2",
    //    //                    key: "7"
    //    //                }
    //    //            ]
    //    //    }
    //    //]
    //});

    var arrayCollection = [
        { "id": "device", "parent": "#", "text": "Devices", "icon": "" },
        { "id": "mobile", "parent": "device", "text": "Mobile Phones", "icon": "" },
        { "id": "apple", "parent": "mobile", "text": "Apple IPhone 6", "icon": "/" },
        { "id": "samsung", "parent": "mobile", "text": "Samsung Note II", "icon": "/" },
    ];

    $.ajax({
        type: "GET",
        url: "/Post/GetAllPosts",
        success: function (response) {
            var model = $.parseJSON(response);


            var postCollection = [];
            $.each(model, function (index, value) {
                var parent = "";
                var icon = "";
                if (value.ParentId == 0) {
                    parent = "#";
                }
                else {
                    parent = `post${value.ParentId}`;
                }

                var post = {
                    "id": `post${value.Id}`,
                    "parent": parent,
                    "text": `${value.Header}`,
                    "icon": icon
                }

                postCollection.push(post);
            });
            console.table(postCollection);


            $('#treeListArea').jstree({
                "core": {
                    "animation": 0,
                    "check_callback": true,
                    "themes": { "stripes": true },
                    'data': postCollection
                },
                "types": {
                    "#": {
                        "max_children": 1,
                        "max_depth": 4,
                        "valid_children": ["root"]
                    },
                    "root": {
                        "icon": "/static/3.3.12/assets/images/tree_icon.png",
                        "valid_children": ["default"]
                    },
                    "default": {
                        "valid_children": ["default", "file"]
                    },
                    "file": {
                        "icon": "glyphicon glyphicon-file",
                        "valid_children": []
                    }
                },
                "plugins": [
                    "contextmenu", "dnd", "search",
                    "state", "types", "wholerow"
                ]
            });

            $('#treeListArea').on("select_node.jstree", function (e, data) {
                var postId = data.node.id.split('post')[1];
                $.ajax({
                    type: "GET",
                    url: "post/GetPostById",
                    data: { id: postId },
                    success: function (response) {
                        var postDetail = $.parseJSON(response);

                        buttonArea.children().remove();
                        var editButton = `<button type="button" onclick="editPost(${postDetail.Id})">Edit</button>`;
                        buttonArea.append(editButton);

                        $("#header").children().remove();
                        var header = `<h4 id="postHeader">${postDetail.Header}</h4>`;
                        $("#header").append(header);

                        $("#summernote").children().remove();
                        $("#summernote").append(postDetail.Context);
                    }
                });
            });
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

// #region Refresh Event Listeners
function refreshEventListener() {
    $(".title").click(function () {
        if (treeListClicked) {
            treeListClicked = true;
        }
        else {
            treeListClicked = false;
        }
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