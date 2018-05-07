(function () {
  function addStamps() {
    var sidebar = document.getElementById('partial-discussion-sidebar');
    var statuses = sidebar.querySelectorAll('.sidebar-assignee.position-relative .reviewers-status-icon');

    statuses.forEach(function (item) {
      var label = item.getAttribute('aria-label');

      var [reviewer, response] = label.split(' ', 2);

      var stamp = document.createElement('div');

      switch (response) {
        case 'approved':
          stamp.setAttribute('class', 'lgtm-stamp lgtm-approved');
          stamp.appendChild(document.createTextNode('approved'));
          break;
        case 'requested':
          stamp.setAttribute('class', 'lgtm-stamp lgtm-rejected');
          stamp.appendChild(document.createTextNode('rejected'));
          break;
        default:
          stamp.setAttribute('class', 'lgtm-stamp lgtm-default');
          stamp.appendChild(document.createTextNode('¯\_(ツ)_/¯'));
      };

      var header = document.getElementById('partial-discussion-header');
      header.insertBefore(stamp, header.firstChild);
    });
  };

  function init() {
    var allowedPath = /\/[\w\-]+\/[\w\-]+\/pull\/\d+$/;

    if (allowedPath.test(location.pathname)) { addStamps(); };
  }

  var addHistoryStateProxy = function () {
    var replaceState = history.replaceState;

    history.replaceState = function () {
      window.postMessage('lgtm:pageUpdated', '*');
      return replaceState.apply(this, arguments);
    };
  };

  var script = document.createElement('script');
  var parent = document.documentElement;
  script.textContent = '('+ addHistoryStateProxy +')();';
  parent.appendChild(script);

  window.addEventListener('message', function (event) {
    if (event.data !== 'lgtm:pageUpdated') { return; }

    init();
  });
  // window.addEventListener('popstate', function (event) {
  //   console.log('popstate');
  // });

  init();
})();
