(function($, undefined) {
    var template = '<div class="upload modal1"><input type="hidden" class="uploadFileAddress"><div class="pic-area"><div class="fileView preview"><img src="" alt="" /></div><div class="origin preview"><img src="" alt="" /></div><div class="tip preview"><img class="jiahao" src="../../../public/img/Oval 7.png" alt=""></div><input type="file" accept="image/*" name="uploadFile"></div><div class="remove"></div></div>',
        template2 = '<div class="upload modal2"><hr><input type="hidden" class="uploadFileAddress"><div class="pic-area"><div class="fileView preview"><img src="" alt="" /></div><div class="origin preview"><img src="" alt="" /></div><div class="tip preview"><img class="jiahao" src="../../../public/img/Oval 7.png" alt=""></div><input type="file" accept="image/*" name="uploadFile"></div><div class="remove"></div></div>';
    var uploadImage = function(selector, options) {
        var self = this;
        self.url = options.url;
        self.options = options;

        if (self.options && self.options.autoAppend) {
            !self.options.autoMax && (function() {
                throw new Error("您启动了自增自减功能，那么 autoMax 属性必须传入！")
            })();
        }
        self.isShowLoading = false;
        self.auto = false;

        self.init(selector, "init");
    }
    uploadImage.prototype = {
        init: function(selector, type) {
            // $('.weui_loading_toast').show();
            // $('.weui_loading_toast .weui_toast_content').html("图片上传中");
            var self = this,
                $tpl;
            if (!!type) {
                selector.html("");
                if (self.options) {
                    if (!!self.options.fileImage && self.options.fileImage.length > 0) {
                        // if ("[object Array]" === Object.prototype.toString.call(self.options.fileImage)) {
                        var list = [];
                        $.each(self.options.fileImage, function(i, value) {
                            if (!value) {
                                return;
                            }
                            var picTemplate = $(template);
                            if (!!self.options.readonly) {
                                picTemplate.find("input[type='file']").remove();
                                picTemplate.find(".remove").remove();
                            }
                            picTemplate.find(".fileView img").attr("src", self.options.preAddress + value);
                            picTemplate.find(".uploadFileAddress").val(value);
                            picTemplate.find(".pic-area").addClass('success');
                            picTemplate.find(".origin img").attr("src", self.options.defaultImage);
                            picTemplate.find(".remove").show();
                            picTemplate = $("<span></span>").append(picTemplate).html();
                            list.push(picTemplate);
                        })
                        $tpl = list.join("");
                        self.$el = selector.append($tpl);
                        self.$el.off("click", ".remove");
                        self.$el.on("click", ".remove", function() {
                            self.options.fileImage.pop();
                            var then = $(this).parents(".upload");
                            var ul = self.$el.find(".upload").length;
                            if (ul >= 2) {
                                then.remove();
                                self.autoAppend();
                            } else {
                                then.find(".remove").hide();
                                then.find(".uploadFileAddress").val("");
                                then.find(".pic-area .fileView img").attr("src", "");
                                then.find(".pic-area").removeClass('success');
                                then.find("input[type='file']").val("");
                            }
                            self.options.onchange && self.options.onchange(then);
                        });
                        self.autoAppend();
                        // }
                    } else if (self.options.defaultImage) {
                        $tpl = $(template)
                        $tpl.find(".origin img").attr("src", self.options.defaultImage);
                        self.$el = selector.append($tpl);
                    }
                }
            } else {
                if (selector.find(".upload").length > 0) {
                    $tpl = $(template2);
                    self.auto = true;
                } else {
                    self.auto = false;
                }
                self.$el = selector.append($tpl);
            }
            self.$el.off("change", "input[type='file']");
            self.$el.on('change', "input[type='file']", function() {
                $('.weui_loading_toast').show();
                $('.weui_loading_toast .weui_toast_content').html("图片上传中");
                var oFReader = new FileReader();
                var that = this,
                    parent;
                parent = $(that).parents("div.upload");
                self.corsUpload(this.files[0], (function($el) {
                    var dom = $el
                    return function(file, data, resp) {
                        if (data && data.res && data.res.data) {
                            self.uploadSuccessDone(dom, file, data, resp);
                        }
                    }
                })(parent));
            });
        },
        corsUpload: function(file, callback) {
            var $formData = new FormData();

            var fileExt = "jpg";
            if ("image/png" == file.type) {
                fileExt = "png";
            }
            var filename = this.uuid() + '.' + fileExt;

            $formData.append("fileName", filename);
            $formData.append("idCard", this.options.idCard);
            $formData.append("uploadFile", file);

            $.ajax(this.url, {
                url: this.url,
                type: 'POST',
                dataType: 'json',
                data: $formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function(data, status, res) {
                    return callback(file, data, res);
                },
                error: function() {
                    console.log("error....")
                        // debugger
                }
            })

        },
        upload: function(file, callback) {
            var formData, handleError, input, inputElement, inputName, progressObj, xhr, _i, _len, _ref, _ref1,
                _this = this;

            /*
                file.size 获取到的数值单位是 字节(B)；
                这里把转换为 兆(M);
                大于 1M 的图片显示 loading...
             */
            var fileSize = file.size / 1024 / 1024;

            _this.isShowLoading = true;
            // if (fileSize >= 1) {
            //     _this.isShowLoading = true;
            // } else {
            //     _this.isShowLoading = false;
            // }
            xhr = new XMLHttpRequest();
            formData = new FormData();

            var fileExt = "jpg";
            if ("image/png" == file.type) {
                fileExt = "png";
            }
            var filename = this.uuid() + '.' + fileExt;

            formData.append("fileName", filename);
            formData.append("idCard", this.options.idCard);
            formData.append("uploadFile", file);

            $.ajax({
                type: "POST",
                url: this.url,
                data: formData,
                success: function (result) {
                    console.log(result);

                    // return callback(file, response, e);
                },
                error: function () {
                    console.log('error!');
                }

            });

            // xhr.open("POST", this.url, true);
            // handleError = function() {
            //     _this.isShowLoading && $.hideLoading();
            //     throw new Error(file, xhr.responseText || ("Server responded with " + xhr.status + " code."));
            // };
            // xhr.onload = function(e) {
            //     var response;
            //     _this.isShowLoading && $.hideLoading();
            //     if (xhr.status !== 200) {
            //         return handleError();
            //     } else {
            //         response = xhr.responseText;
            //         if (~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            //             response = JSON.parse(response);
            //         }
            //         return callback(file, response, e);
            //     }
            // };
            // xhr.onerror = function() {
            //     return handleError();
            // };
            // progressObj = (_ref1 = xhr.upload) != null ? _ref1 : xhr;
            // progressObj.onprogress = function(e) {
            //     // return _this.emit("uploadprogress", file, Math.max(0, Math.min(100, (e.loaded / e.total) * 100)));
            // };
            // xhr.setRequestHeader("Accept", "application/json");
            // xhr.setRequestHeader("Cache-Control", "no-cache");
            // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            // xhr.setRequestHeader("X-File-Name", file.name);
            // _this.isShowLoading && $.showLoading("图片正在上传...");
            // return xhr.send(formData);
        },
        uuid4: function() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        uuid: function() {
            return this.uuid4() + this.uuid4() + '-' + this.uuid4() + '-' + this.uuid4() + '-' +
                this.uuid4() + '-' + this.uuid4() + this.uuid4() + this.uuid4();
        },
        uuid8: function() {
            return this.uuid4() + this.uuid4();
        },
        uuid16: function() {
            return this.uuid8() + this.uuid8();
        },
        uuid32: function() {
            return this.uuid16() + this.uuid16();
        },
        uploadSuccessDone: function($el, file, data, resp) {
            var filePath = data.res.data.fileAccessPath,
                self = this;

            $el.find(".pic-area .fileView img").attr('src', self.options.preAddress + filePath);
            $el.find(".uploadFileAddress").val(filePath);
            $el.find(".pic-area").addClass('success');
            $el.find(".remove").show();
            $el.off("click", ".remove");
            $el.on("click", ".remove", function() {
                self.options.fileImage.pop();
                var ul = self.$el.find(".upload").length;
                if (ul >= 2) {
                    $el.remove();
                    self.autoAppend();
                } else {
                    $el.find(".remove").hide();
                    $el.find(".uploadFileAddress").val("");
                    $el.find(".pic-area .fileView img").attr("src", "");
                    $el.find(".pic-area").removeClass('success');
                    $el.find("input[type='file']").val("");
                }
                self.options.onchange && self.options.onchange($el);
            });

            self.options.fileImage = [];

            self.$el.find(".upload .uploadFileAddress").each(function(i, k) {
                if (k.value !== "") {
                    self.options.fileImage.push(k.value);
                }
            });
            $el.removeClass("modal2").addClass("modal1");
            self.options.callback && self.options.callback($el, file, data, resp);
            self.options.onchange && self.options.onchange($el);
            self.autoAppend();
        },
        autoAppend: function() {
            var self = this,
                uploaderLength = self.$el.find(".upload").length;
            if (self.options.autoAppend && self.options.autoMax > uploaderLength) {
                if (self.$el.find(".modal2").length <= 0) {
                    self.init(self.$el);
                } else if (uploaderLength == 1) {
                    self.init(self.$el, "init");
                }
            }
        }
    }
    $.fn.uploadImage = function(options) {
        var opts = $.extend(true, {}, options);
        if (!opts.url) {
            throw new Error("url为必填参数！");
            return false;
        }
        new uploadImage(this, opts);
    }
})(jQuery);
