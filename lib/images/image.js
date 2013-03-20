var _ = require('underscore'),
    images = require('images');
    Class = require('../classes').Class,

module.exports = new Class({
    
    // Interface ===============================================================
    
    init: function (filename) {
        var self = this;
        self.filename = filename || self.filename;
        if (self.filename) {
            self.open();
        }
    },
    
    open: function (filename) {
        var self = this;
        self.filename = filename || self.filename;
        self.img = images(self.filename);
    },
    
    save: function (filename) {
        var self = this;
        self.filename = filename || self.filename;
        self.img.save(self.filename);
    },
    
    resize: function (width, height) {
        var self = this;
        width = width || self.getWidth();
        height = height || self.getHeight();
        self.img.size(width, height);
    },
    
    scale: function (width, height) {
        var self = this,
            width = width || parseInt(self.getWidth() * height / self.getHeight(), 10),
            height = height || parseInt(self.getHeight() * width / self.getWidth(), 10);
        self.resize(width, height);
    },
    
    adjust: function (size) {
        var self = this,
            width = self.getWidth(),
            height = self.getHeight();
        if (width > height) {
            self.scale(size);
        } else {
            self.scale(null, size);
        }
    },
    
    crop: function (width, height, x, y) {
        var self = this;
        width = width || self.getWidth();
        height = height || self.getHeight();
        self.img = images(self.img, x, y, width, height);
    },
    
    cropCenter: function (width, height) {
        var self = this,
            x = (self.getWidth() - width) / 2,
            y = (self.getHeight() - height) / 2;
        self.crop(width, height, x, y);
    },
    
    getSize: function () {
        var self = this;
        return self.img.size();
    },
    
    getWidth: function () {
        var self = this;
        return self.getSize().width;
    },
    
    getHeight: function () {
        var self = this;
        return self.getSize().height;
    },
    
    // Realization =============================================================
    
    className: 'Image',
    filename: null,
    img: null,
    
});