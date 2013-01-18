// Generated by CoffeeScript 1.4.0
(function() {
  var callBuyvmApi, createNewMark, displayNotice, exports, initBackground;

  exports = this;

  exports.markid = localStorage["marknoticeid"];

  exports.onUrl = 'http://buyvmnotice.sinaapp.com/on.html';

  exports.offUrl = 'http://buyvmnotice.sinaapp.com/off.html';

  exports.apiUrl = 'http://buyvmnotice.sinaapp.com/buyvmapi.php';

  displayNotice = function(data) {
    var updateTitle;
    if (data.stock) {
      updateTitle = "IN STOCK: " + data.total;
      return chrome.bookmarks.update(exports.markid, {
        title: updateTitle,
        url: exports.onUrl
      });
    } else {
      updateTitle = "Out of Stock";
      return chrome.bookmarks.update(exports.markid, {
        title: updateTitle,
        url: exports.offUrl
      });
    }
  };

  callBuyvmApi = function() {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("GET", exports.apiUrl, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        return displayNotice(JSON.parse(xhr.responseText));
      }
    };
    return xhr.send();
  };

  createNewMark = function() {
    var newMark;
    newMark = {
      title: 'Buyvm Marknotice',
      url: exports.offUrl
    };
    return chrome.bookmarks.create(newMark, function(r) {
      localStorage["marknoticeid"] = exports.markid = r.id;
      callBuyvmApi();
      return chrome.tabs.create({
        url: chrome.extension.getURL('/assets/intro.html')
      });
    });
  };

  initBackground = function() {
    if (exports.markid) {
      chrome.bookmarks.get(exports.markid, function(bookmark) {
        if (!bookmark) {
          localStorage.removeItem(exports.markid);
          return createNewMark();
        }
      });
    } else {
      createNewMark();
    }
    return setInterval(callBuyvmApi, 60000);
  };

  addEventListener("load", initBackground, false);

}).call(this);
