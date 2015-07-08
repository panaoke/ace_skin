/**
 * Created by richard on 14-7-18.
 */

//去user_controller,再去user/changePassword.html.erb返回form
jQuery(function ($) {
    function changePassword_form() {
        var result = "";
        $.ajax({
            async: false,
            url: '/users/change_password_form',
            type: 'POST',
            data: {
            },
            error: function (req, err_info, e) {
                showInfo(err_info);
            },
            success: function (data) {
                result = data;
            }
        });
        return $(result);
    }

//页面调用
    function changePasswordlEvent() {
        form = changePassword_form();
        var div = bootbox.dialog({
            message: form,
            className: 'small',
            title: i18n.view('user', 'password_change'),
            buttons: {
                "close": {
                    "label": "<i class='icon-reply'></i>" + i18n.view('back'),
                    "className": "btn-sm btn-primary"
                },
                "save": {
                    "label": "<i class='icon-ok'></i>" + i18n.view('submit'),
                    "className": "btn btn-sm btn-success",
                    "callback": function (e) {
                        return submitForm(form)
                    }
                }
            }
        });

    }

    function submitForm(form) {
        var flag = false;
        var calEvent = {};
        $.each(form.find("input"), function (i, ele) {
            var $ele = $(ele);
            calEvent[$ele.attr('name')] = $ele.val();
        });
        saveEvent(calEvent,
            function (data) {
                if (data["result"] == true) {
                    flag = true;
                    changeEvent(calEvent, data["event"]);
                    if (action == "new") {
                    } else {
                    }
                }

            }, function (req, err_info, e) {
                console.log(err_info);
            });
        return flag;
    }

    function saveEvent(calEvent, sucCallback, errCallback) {
        $.ajax({
            url: '/users/change_password',
            async: false,
            type: 'POST',
            data: {
                event: calEvent
            },
            dataType: 'json',
            error: function (req, err_info, e) {
                bootbox.dialog({
                    title: i18n.view('systemMsg'),
                    message: "<span class='bigger-110'>" + i18n.view('user', 'password_cannot_be_null')  + "</span>",
                    buttons: {
                        "danger": {
                            "label": i18n.view('back'),
                            "className": "btn-sm btn-danger",
                            "callback": function () {
                            }
                        }
                    }
                });
                if (typeof errCallback == "function") {
                    errCallback(req, err_info, e);
                }
            },
            success: function (data) {
                if (data.result == false) {
                    bootbox.dialog({
                        title: i18n.view('systemMsg'),
                        message: "<span class='bigger-110'>" + i18n.view('user', 'old_password_is_not_true') + "</span>",
                        buttons: {
                            "danger": {
                                "label": i18n.view('back'),
                                "className": "btn-sm btn-danger",
                                "callback": function () {
                                    //Example.show("uh oh, look out!");
                                }
                            }
                        }
                    });
                } else {
                    bootbox.dialog({
                        title: i18n.view('systemMsg'),
                        message: "<span class='bigger-110'></span>" + i18n.view('user', 'password_change_success'),
                        buttons: {
                            "success": {
                                "label": "<i class='icon-ok'></i>" + i18n.action('back'),
                                "className": "btn-sm btn-success",
                                "callback": function () {
                                    //Example.show("great success");
                                }
                            }
                        }
                    });
                }
                if (typeof sucCallback == "function") {
                    sucCallback(data);
                }
            }
        });
    }

    function changeEvent(event, value) {
        $.each(value, function (k, v) {
            event[k] = v;
        });
    }

    function showInfo(err_info) {
        bootbox.dialog({
            message: $("<h4>" + err_info + "</h4>"),
            buttons: {
                success: {
                    label: i18n.view('back'),
                    className: "btn-sm btn-primary"
                }
            }
        });
    }

    window.userpassword = {
        changePasswordlEvent: changePasswordlEvent
    }
});
